import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import storage from '../services/storage';

const adminButtons = [
  { key: '1', label: 'Validar Ticket' },
  { key: '2', label: 'Intervalo' },
  { key: '3', label: 'Localização' },
  { key: '4', label: 'Cadastrar Aluno' },
  { key: '5', label: 'Disponibilidade' },
];

export default function AdminScreen({ onNavigate }) {
  const { user, signOut } = useContext(AuthContext);
  const [todayTickets, setTodayTickets] = useState([]);
  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const tickets = await storage.listTodayTickets();
        setTodayTickets(tickets || []);
        const users = await storage.getUsers();
        const map = {};
        (users || []).forEach(u => { map[String(u.id)] = u; });
        setUsersMap(map);
      } catch (e) {
        console.warn('Erro ao listar tickets hoje', e);
      }
    })();
  }, []);

  const resetAllData = async () => {
    Alert.alert(
      'RESET COMPLETO',
      'Você tem certeza que deseja apagar TODOS os dados do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'BORRAR TODO',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.resetAllData();
              Alert.alert('Sucesso', 'Todos os dados foram apagados.');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível apagar os dados.');
            }
          }
        }
      ]
    );
  };

  const renderButton = ({ item }) => (
    <TouchableOpacity 
      style={styles.button}
      onPress={() => {
        if (item.key === '1') {
          // Navegar para a tela de Validação de Ticket
          onNavigate('validacao');
        } else if (item.key === '4') {
          // Navegar para a tela de Cadastro de Aluno
          onNavigate('cadastro-aluno');
        } else if (item.key === '5') {
          // Navegar para a tela de Disponibilidade
          onNavigate('disponibilidade');
        }
      }}
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
      <Text style={styles.welcome}>Bem vindo, {user?.name || 'Admin'}</Text>
      
      <FlatList
        data={adminButtons}
        renderItem={renderButton}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.buttonList}
      />

      {/* Lista de tickets do dia */}
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Tickets hoje</Text>
        {todayTickets.length === 0 && <Text style={{ color: '#666' }}>Ninguém pegou ticket ainda.</Text>}
        {todayTickets.map(t => {
          const u = usersMap[String(t.userId)];
          return (
            <View key={String(t.userId)} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
              <Text>{u ? `${u.name} (${u.matricula || u.id})` : String(t.userId)}</Text>
              <Text style={{ color: t.status === 'used' ? '#D32F2F' : '#0A7A3B' }}>{t.status}</Text>
            </View>
          );
        })}
      </View>
      
      <TouchableOpacity 
        style={styles.resetButton} 
        onPress={resetAllData}
      >
        <Text style={styles.resetButtonText}>🗑️ RESET COMPLETO</Text>
      </TouchableOpacity>
      
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
  resetButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
