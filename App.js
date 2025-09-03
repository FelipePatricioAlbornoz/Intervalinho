import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Intervalinho</Text>
      <Text style={styles.subtitle}>
        Insira seu login e senha para continuar
      </Text>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Login" placeholderTextColor="#ccc" />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#ccc"
          secureTextEntry
        />
        <Button title="Entrar" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#383838',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: '#ffffff',
  },
});
