import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import storage from '../services/storage';

export default function DisponibilidadeScreen({ onBack, onNavigateHistorico }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const todayTickets = await storage.listTodayTickets();
      const usersList = await storage.getUsers();
      
      const usersMap = {};
      usersList.forEach(user => {
        usersMap[user.id] = user;
      });
      
      setUsers(usersMap);
      setTickets(todayTickets);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return '#0A7A3B';
      case 'used':
        return '#D32F2F'; 
      default:
        return '#666666'; 
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'used':
        return 'Usado';
      default:
        return 'Não retirou';
    }
  };

  const renderItem = ({ item }) => {
    const user = users[item.userId];
    if (!user) return null;

    return (
      <View style={styles.ticketRow}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.matricula}>{user.matricula}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {getStatusText(item.status)}
        </Text>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={styles.headerText}>ALUNO</Text>
      <Text style={styles.headerText}>MATRÍCULA</Text>
      <Text style={styles.headerText}>TICKET</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ADM</Text>
        <View style={{ width: 50 }} />
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={loadData}>
        <Text style={styles.refreshText}>🔄 Atualizar</Text>
      </TouchableOpacity>

      <View style={styles.historicHeader}>
        <Text style={styles.historicTitle}>Ver Histórico</Text>
        <TouchableOpacity onPress={onNavigateHistorico}>
          <Text style={styles.historicButton}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tickets}
        renderItem={renderItem}
        keyExtractor={(item) => item.userId}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Carregando...' : 'Nenhum ticket registrado hoje'}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    alignSelf: 'flex-end',
    padding: 8,
    margin: 16,
  },
  refreshText: {
    fontSize: 14,
    color: '#666',
  },
  historicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historicTitle: {
    fontSize: 16,
    color: '#333',
  },
  historicButton: {
    fontSize: 18,
    color: '#666',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: {
    flex: 2,
    fontSize: 14,
    color: '#333',
  },
  matricula: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  status: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
  },
});