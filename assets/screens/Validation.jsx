import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Storage from '../services/storage';

export default function Validation({ onBack }) {
  const [matricula, setMatricula] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setResult(null);
      const user = await Storage.findUserByMatricula(matricula.trim());
      if (!user) {
        setResult({ notFound: true });
        setLoading(false);
        return;
      }
      const ticket = await Storage.getTicketForToday(user.id);
      setResult({ user, ticket });
    } finally {
      setLoading(false);
    }
  };

  const handleUse = async () => {
    if (!result?.user) return;
    const updated = await Storage.markTicketUsed(result.user.id);
    setResult({ ...result, ticket: updated });
  };

  const statusText = () => {
    if (!result) return '';
    if (result.notFound) return 'Aluno não encontrado';
    if (!result.ticket) return 'Sem ticket para hoje';
    if (result.ticket.status === 'available') return 'Ticket disponível';
    return 'Ticket já utilizado';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><Text style={styles.back}>← Voltar</Text></TouchableOpacity>
        <Text style={styles.title}>Validação do Ticket</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Matrícula do aluno"
          keyboardType="number-pad"
          value={matricula}
          onChangeText={setMatricula}
        />
        <TouchableOpacity style={styles.button} disabled={loading || !matricula.trim()} onPress={handleSearch}>
          <Text style={styles.buttonText}>{loading ? 'Buscando...' : 'Verificar'}</Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.resultBox}>
            {!result.notFound && (
              <>
                <View style={styles.row}><Text style={styles.label}>Nome</Text><Text style={styles.value}>{result.user.name}</Text></View>
                <View style={styles.row}><Text style={styles.label}>Matrícula</Text><Text style={styles.value}>{result.user.matricula}</Text></View>
              </>
            )}
            <Text style={styles.status}>{statusText()}</Text>
            {result?.ticket?.status === 'available' && (
              <TouchableOpacity style={styles.useButton} onPress={handleUse}>
                <Text style={styles.useButtonText}>Usar ticket</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  back: { color: '#007AFF', fontSize: 16 },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#007AFF', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  resultBox: { marginTop: 16, borderWidth: 1, borderColor: '#eee', borderRadius: 10, padding: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { color: '#666' },
  value: { color: '#111', fontWeight: '500' },
  status: { marginTop: 10, fontWeight: '600' },
  useButton: { marginTop: 12, backgroundColor: '#111', padding: 12, borderRadius: 8, alignItems: 'center' },
  useButtonText: { color: '#fff', fontWeight: '600' },
});


