import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function LocationScreen({ onBack }) {
  const [status, setStatus] = useState('Sem verificação');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onBack && onBack()}>
          <Text style={styles.link}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Localização</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.info}>Aqui mostra algo sobre a localização.</Text>

        <TouchableOpacity style={styles.button} onPress={() => setStatus('Verificado')}>
          <Text style={styles.buttonText}>Verificar</Text>
        </TouchableOpacity>

        <Text style={styles.status}>Status: {status}</Text>
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
  content: { padding: 16, gap: 12, alignItems: 'center' },
  info: { color: '#333' },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  status: { marginTop: 8, color: '#111' },
});
