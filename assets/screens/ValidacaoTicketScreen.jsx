import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import storage from '../services/storage';

export default function ValidacaoTicketScreen({ onBack }) {
  const [matricula, setMatricula] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!matricula.trim()) {
      Alert.alert('Erro', 'Digite uma matrícula para buscar');
      return;
    }

    setLoading(true);
    try {
      const user = await storage.findUserByMatricula(matricula);
      if (!user) {
        Alert.alert('Não encontrado', 'Nenhum aluno encontrado com esta matrícula');
        setStudentData(null);
        return;
      }

      const ticket = await storage.getTicketForToday(user.id);
      setStudentData({
        user,
        ticket
      });
    } catch (error) {
      console.error('Erro ao buscar aluno:', error);
      Alert.alert('Erro', 'Erro ao buscar informações do aluno');
    } finally {
      setLoading(false);
    }
  };

  const handleUseTicket = async () => {
    if (!studentData?.user?.id) return;

    try {
      setLoading(true);
      await storage.markTicketUsed(studentData.user.id);
      const updatedTicket = await storage.getTicketForToday(studentData.user.id);
      setStudentData(prev => ({
        ...prev,
        ticket: updatedTicket
      }));
      Alert.alert('Sucesso', 'Ticket marcado como usado');
    } catch (error) {
      console.error('Erro ao usar ticket:', error);
      Alert.alert('Erro', 'Não foi possível usar o ticket');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (ticket) => {
    if (!ticket) return 'Não possui ticket';
    if (ticket.status === 'used') return 'Ticket já usado';
    return 'Ticket Disponível';
  };

  const getStatusColor = (ticket) => {
    if (!ticket) return '#666666';
    if (ticket.status === 'used') return '#D32F2F';
    return '#0A7A3B';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Validação de Ticket</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.searchSection}>
          <Text style={styles.label}>MATRÍCULA</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              placeholder="Buscar matrícula"
              value={matricula}
              onChangeText={setMatricula}
              keyboardType="numeric"
              editable={!loading}
            />
            <TouchableOpacity 
              style={[styles.searchButton, loading && styles.buttonDisabled]}
              onPress={handleSearch}
              disabled={loading}
            >
              <Text style={styles.searchButtonText}>{'>'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {studentData && (
          <View style={styles.resultSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>{studentData.user.name}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={[styles.infoValue, { color: getStatusColor(studentData.ticket) }]}>
                {getStatusText(studentData.ticket)}
              </Text>
            </View>

            {studentData.ticket && studentData.ticket.status === 'available' && (
              <TouchableOpacity
                style={[styles.useButton, loading && styles.buttonDisabled]}
                onPress={handleUseTicket}
                disabled={loading}
              >
                <Text style={styles.useButtonText}>
                  {loading ? 'Processando...' : 'Usar ticket'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
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
  content: {
    padding: 16,
  },
  searchSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  searchButton: {
    width: 44,
    height: 44,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
  },
  useButton: {
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  useButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});