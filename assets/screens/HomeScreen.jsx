// @ts-nocheck
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const buttons = [
  { key: '1', label: 'Receber Ticket' },
  { key: '2', label: 'Intervalo' },
  { key: '3', label: 'Localização' },
  { key: '4', label: 'Disponibilidade' },
];

export default function HomeScreen() {
  const { user } = useContext(AuthContext);

  const renderButton = ({ item }) => (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>Bem vindo, {user?.name || 'Aluno'}</Text>
      <FlatList
        data={buttons}
        renderItem={renderButton}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.buttonList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  welcome: { fontSize: 18, fontWeight: '500', textAlign: 'center', marginVertical: 20, color: '#111' },
  buttonList: { gap: 14 },
  button: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { fontSize: 16, color: '#111' },
});
