import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import ScreenLayout from '../components/ScreenLayout';

const buttons = [
  { key: '1', label: 'Receber Ticket' },
  { key: '2', label: 'Intervalo' },
  { key: '3', label: 'Localização' },
  { key: '4', label: 'Validação' },
];

export default function HomeScreen({ onNavigate }) {
  const { user, signOut } = useContext(AuthContext);

  const handleButtonPress = (buttonKey) => {
    switch (buttonKey) {
      case '1': // Receber Ticket
        onNavigate('receber-ticket');
        break;
      case '2': // Intervalo
        onNavigate('intervalo');
        break;
      case '3': // Localização
        onNavigate('location');
        break;
      case '4': // Validação
        onNavigate('validacao');
        break;
      default:
        console.log('Botão não implementado:', buttonKey);
    }
  };

  const renderButton = ({ item }) => (
    <TouchableOpacity 
      style={styles.button}
      onPress={() => handleButtonPress(item.key)}
    >
      <Text style={styles.buttonText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout title="Intervalinho">
      <Text style={styles.welcome}>Bem vindo, {user?.name || 'Aluno'}</Text>
      
      <FlatList
        data={buttons}
        renderItem={renderButton}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.buttonList}
      />
      
      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  welcome: { 
    fontSize: 18, 
    fontWeight: '500', 
    textAlign: 'center', 
    marginBottom: 40, 
    color: '#111' 
  },
  buttonList: { 
    gap: 12,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonText: { 
    fontSize: 16, 
    color: '#000',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#e53935',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 18,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});