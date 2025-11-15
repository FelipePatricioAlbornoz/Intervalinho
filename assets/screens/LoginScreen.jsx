import React, {useState, useContext, useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function LoginScreen({ onRegister }){
  const [matricula,setMatricula] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const { signIn } = useContext(AuthContext)

  useEffect(() => {
    console.log('[LoginScreen] Montado');
    return () => console.log('[LoginScreen] Desmontado');
  }, []);

  const entrar = () => {
    setLoading(true);
    console.log("Click en continuar");

    signIn(matricula, password)
      .catch(e => console.error("Error en Login:", e))
      .finally(() => setLoading(false));
  }
  
  return(
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Logo style={styles.logo} />

        <Text style={styles.subtitle}>Insira seu login</Text>

        <TextInput
          placeholder="Digite sua matrícula ou código"
          placeholderTextColor="#9AA0A6"
          value={matricula}
          onChangeText={setMatricula}
          autoCapitalize="none"
          style={styles.input}
          returnKeyType="next"
        />

        <TextInput
          placeholder="Digite sua senha"
          placeholderTextColor="#9AA0A6"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
          style={[styles.input, {marginTop:12}]}
          returnKeyType="go"
          onSubmitEditing={entrar}
        />

        <TouchableOpacity
          onPress={entrar}
          style={[styles.primaryButton, loading && {opacity:0.8}]}
          activeOpacity={0.9}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Continuar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={onRegister}>
            <Text style={styles.registerLink}>(ir para cadastro)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Texto de termos */}
        <View style={{ width: '100%', marginTop: 12 }}>
          <Text style={styles.termsText}>
            Ao clicar em continuar, você concorda com nossos
          </Text>
        </View>

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
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  logo: {
    color: '#111111',
    marginBottom: 28,
  },
  subtitle: {
    marginTop: 28,
    fontSize: 14,
    color: '#5F6368',
  },
  input: {
    width: '100%',
    backgroundColor: '#F5F6F7',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    marginTop: 16,
    color: '#111111',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#000000',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  registerText: {
    color: '#5F6368',
  },
  registerLink: {
    color: '#1a73e8',
    textDecorationLine: 'underline',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E9EAEE',
    marginTop: 20,
  },
  termsText: {
    fontSize: 11,
    color: '#777777',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // centra horizontalmente
    marginTop: 6,
  },
  linkText: {
    fontSize: 11,
    color: '#1a73e8',
    textDecorationLine: 'underline',
  },
  separatorDot: {
    fontSize: 11,
    color: '#777777',
    marginHorizontal: 4,
  },
});
