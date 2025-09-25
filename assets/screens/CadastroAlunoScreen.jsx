import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import storage from '../services/storage';

export default function CadastroAlunoScreen({ onBack }) {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastrar = async () => {
    if (!nome.trim() || !matricula.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    setLoading(true);
    try {
      const novoAluno = {
        id: Date.now().toString(),
        nome,
        matricula,
        role: 'student',
        tickets: []
      };
      await storage.saveAluno(novoAluno);
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
      setNome('');
      setMatricula('');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível cadastrar o aluno.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onBack && onBack()}>
          <Text style={styles.link}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cadastrar Aluno</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome do Aluno</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do aluno"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Matrícula</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite a matrícula"
          value={matricula}
          onChangeText={setMatricula}
          keyboardType="numeric"
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleCadastrar} 
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastrar Aluno'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  link: { fontSize: 16, color: '#007AFF' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  placeholder: { width: 50 },
  form: { padding: 16 },
  label: { fontSize: 16, marginBottom: 8, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
