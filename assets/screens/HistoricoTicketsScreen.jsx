import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, SectionList, ActivityIndicator } from 'react-native';
import storage from '../services/storage';

export default function HistoricoTicketsScreen({ onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const all = await storage.getTicketsHistory();
      const sections = Object.entries(all)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([date, users]) => ({
          title: date,
          data: Object.entries(users).map(([userId, ticket]) => ({ userId, ...ticket }))
        }));
      setHistory(sections);
      setLoading(false);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Histórico de Tickets</Text>
        <View style={{ width: 50 }} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <SectionList
          sections={history}
          keyExtractor={(item) => item.userId + item.ts}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.userId}>{item.userId}</Text>
              <Text style={[styles.status, { color: item.status === 'used' ? '#D32F2F' : '#0A7A3B' }]}>{item.status}</Text>
              <Text style={styles.time}>{item.ts ? new Date(item.ts).toLocaleTimeString() : ''}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum ticket registrado no histórico.</Text>}
        />
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: { fontSize: 16, color: '#007AFF' },
  title: { fontSize: 18, fontWeight: 'bold' },
  sectionHeader: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontWeight: 'bold',
    color: '#333',
    fontSize: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userId: { flex: 2, color: '#333' },
  status: { flex: 1, textAlign: 'center', fontWeight: 'bold' },
  time: { flex: 1, textAlign: 'right', color: '#666' },
  empty: { textAlign: 'center', color: '#888', marginTop: 40 },
});
