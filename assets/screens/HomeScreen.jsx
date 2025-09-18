import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const buttons = [
  { key: '1', label: 'Receber Ticket' },
  { key: '2', label: 'Intervalo' },
  { key: '3', label: 'Localização' },
  { key: '4', label: 'Disponibilidade' },
];

export default function HomeScreen({ onNavigate }) {
  const { user, signOut } = useContext(AuthContext);

  const handleButtonPress = (buttonKey) => {
    switch (buttonKey) {
      case '1': // Receber Ticket
        onNavigate('receber-ticket');
        break;
      case '2': // Intervalo
        // TODO: Implementar tela de intervalo
        console.log('Navegar para tela de intervalo');
        break;
      case '3': // Localização
        // TODO: Implementar tela de localização
        console.log('Navegar para tela de localização');
        break;
      case '4': // Disponibilidade
        // TODO: Implementar tela de disponibilidade
        console.log('Navegar para tela de disponibilidade');
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.menuIcon}>☰</Text>
        <View style={styles.profileIcon} />
      </View>
      
      <Text style={styles.appName}>Intervalinho</Text>
      <Text style={styles.homeIcon}>
</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  menuIcon: {
    fontSize: 20,
    color: '#000',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
  },
  homeIcon: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Courier',
    lineHeight: 18,
  },
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