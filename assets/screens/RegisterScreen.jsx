import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, Linking } from 'react-native';
import storage from '../services/storage';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen({ onBack }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Caso precisemos mais tarde
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [roleAluno, setRoleAluno] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signIn } = useContext(AuthContext);

  useEffect(() => {
    console.log('[RegisterScreen] Montado');
    return () => console.log('[RegisterScreen] Desmontado');
  }, []);

  const cadastrar = async () => {
    console.log('--- Click en cadastrar ---');
    console.log('Nombre:', name);
    console.log('Matrícula:', matricula);
    console.log('Contraseña:', password);
    console.log('Rol:', roleAluno ? 'Aluno' : 'Admin');
    if (!name || !matricula || !password) {
      alert('Nome, matrícula e senha são obrigatórios');
      return;
    }
    setLoading(true);
    try {
      const role = roleAluno ? 'student' : 'admin';
      await storage.registerStudent({ name, matricula, password, role });
      await signIn(matricula, password);
      console.log('Registro y login exitosos');
    } catch (e) {
      console.log('erro cadastro', e);
      const msg = e?.message || 'Falha ao cadastrar. Tente novamente.';
      alert(msg);
    } finally {
      setLoading(false);
      console.log('--- Fin de cadastro ---');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.appName}>Intervalinho</Text>
        <Text style={styles.subtitle}>Cadastre seu usuário</Text>

        <TextInput
          placeholder="Digite seu nome"
          placeholderTextColor="#9AA0A6"
          value={name}
          onChangeText={t => {
            setName(t);
            console.log('[RegisterScreen] Cambio nombre:', t);
          }}
          style={styles.input}
        />

        <TextInput
          placeholder="Digite sua matrícula ou e-mail"
          placeholderTextColor="#9AA0A6"
          value={matricula}
          onChangeText={t => {
            setMatricula(t);
            console.log('[RegisterScreen] Cambio matrícula:', t);
          }}
          style={[styles.input, { marginTop: 12 }]}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Digite sua senha"
          placeholderTextColor="#9AA0A6"
          value={password}
          onChangeText={t => {
            setPassword(t);
            console.log('[RegisterScreen] Cambio contraseña:', t);
          }}
          secureTextEntry={true}
          style={[styles.input, { marginTop: 12 }]}
        />

        <View style={styles.rolesRow}>
          <TouchableOpacity onPress={() => setRoleAluno(true)} style={styles.roleItem} activeOpacity={0.8}>
            <View style={[styles.checkbox, roleAluno && styles.checkboxChecked]} />
            <Text style={styles.roleLabel}>Aluno</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRoleAluno(false)} style={[styles.roleItem, { marginLeft: 24 }]} activeOpacity={0.8}>
            <View style={[styles.checkbox, !roleAluno && styles.checkboxChecked]} />
            <Text style={styles.roleLabel}>Admin</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={cadastrar} style={styles.primaryButton} activeOpacity={0.9}>
          <Text style={styles.primaryButtonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => {
            console.log('[RegisterScreen] Click en ir para login');
            onBack && onBack();
          }}>
            <Text style={styles.loginLink}>(ir para login)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <Text style={styles.termsText}>
          Ao clicar em continuar, você concorda com nossos
        </Text>
        <View style={styles.linksRow}>
          <TouchableOpacity onPress={() => Linking.openURL('https://example.com/termos')}>
            <Text style={styles.linkText}>Termos de Serviço</Text>
          </TouchableOpacity>
          <Text style={styles.separatorDot}> e </Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://example.com/privacidade')}>
            <Text style={styles.linkText}>Política de Privacidade</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  appName: { fontSize: 24, fontWeight: '700', color: '#111', marginTop: 32 },
  subtitle: { marginTop: 28, fontSize: 14, color: '#5F6368' },
  input: {
    width: '100%',
    backgroundColor: '#F5F6F7',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    marginTop: 16,
    color: '#111111',
  },
  rolesRow: { flexDirection: 'row', width: '100%', marginTop: 14, alignItems: 'center' },
  roleItem: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
  },
  checkboxChecked: { backgroundColor: '#111' },
  roleLabel: { color: '#111' },
  primaryButton: {
    width: '100%',
    backgroundColor: '#000',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  loginRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  loginText: { color: '#5F6368' },
  loginLink: { color: '#1a73e8', textDecorationLine: 'underline' },
  divider: { width: '100%', height: 1, backgroundColor: '#E9EAEE', marginTop: 20 },
  termsText: { fontSize: 11, color: '#777', textAlign: 'center', marginTop: 24 },
  linksRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  linkText: { fontSize: 11, color: '#1a73e8', textDecorationLine: 'underline' },
  separatorDot: { fontSize: 11, color: '#777', marginHorizontal: 4 },
});