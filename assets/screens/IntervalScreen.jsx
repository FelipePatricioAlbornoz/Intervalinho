import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { intervalConfig } from '../constants/config';

export default function IntervalScreen({ onBack }) {
  const [now, setNow] = useState(new Date());

  const start = (() => {
    const [h, m] = intervalConfig.START_TIME.split(':').map(Number);
    const d = new Date(); d.setHours(h, m, 0, 0); return d;
  })();
  const end = (() => { const d = new Date(start); d.setMinutes(d.getMinutes() + (intervalConfig.DURATION_MINUTES || 15)); return d; })();

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const fmt = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const mm = String(Math.floor(s / 60)).padStart(2,'0');
    const ss = String(s % 60).padStart(2,'0');
    return `${mm}:${ss} min`;
  };

  const started = now >= start; const ended = now >= end;
  const status = ended ? 'Intervalo finalizado' : started ? 'Intervalo ativo' : 'Ainda não começou';

  return (
    <SafeAreaView style={styles.c}>
      <View style={styles.h}>
        <TouchableOpacity onPress={onBack}><Text style={styles.b}>← Voltar</Text></TouchableOpacity>
        <Text style={styles.t}>Intervalo</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.row}><Text style={styles.dim}>STATUS</Text><Text style={styles.bold}>{status}</Text></View>

      <View style={styles.sep} />
      <View style={styles.row}><Text>Começa em</Text><Text style={styles.bold}>{fmt(start - now)}</Text></View>
      <View style={styles.row}><Text>Finaliza em</Text><Text style={styles.bold}>{fmt(end - now)}</Text></View>

      <TouchableOpacity style={[styles.cta, (!started || ended) && styles.ctaD]} disabled={!started || ended} onPress={onBack}>
        <Text style={[styles.ctaTxt, (!started || ended) && styles.ctaTxtD]}>Receber ticket</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#fff' },
  h: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  b: { color: '#007AFF', fontSize: 16 },
  t: { fontSize: 18, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  dim: { color: '#666' },
  bold: { fontWeight: '600', color: '#111' },
  sep: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  cta: { marginTop: 'auto', backgroundColor: '#C2185B', borderRadius: 10, alignSelf: 'stretch', margin: 16, paddingVertical: 16, alignItems: 'center' },
  ctaD: { backgroundColor: '#9E9E9E' },
  ctaTxt: { color: '#fff', fontWeight: '600' },
  ctaTxtD: { color: '#eee' },
});


