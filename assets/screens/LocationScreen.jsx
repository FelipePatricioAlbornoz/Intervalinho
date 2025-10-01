import React, { useMemo, useState } from 'react';
import { isInsideSchoolAsync, simulateLocationInsideSchool, distanceInMeters } from '../services/location';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { locationConfig } from '../constants/config';
import LocationToggle from '../components/LocationToggle';

export default function LocationScreen({ onBack }) {
  const [locationInfo, setLocationInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useMock, setUseMock] = useState(false);

  const statusText = useMemo(() => {
    if (!locationInfo) return '—';
    return locationInfo.inside ? 'Você está na escola' : 'Você está fora da área permitida';
  }, [locationInwfo]);

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
        <LocationToggle useMock={useMock} onToggle={() => setUseMock(v => !v)} />
        <TouchableOpacity 
          style={styles.button} 
          onPress={async () => {
            setLoading(true);
            let info;
            if (useMock) {
              const current = simulateLocationInsideSchool();
              const dist = distanceInMeters(current, locationConfig.SCHOOL_COORDS);
              info = { inside: dist <= locationConfig.SCHOOL_RADIUS_METERS, distance: dist, current };
            } else {
              info = await isInsideSchoolAsync();
            }
            setLocationInfo(info);
            setLoading(false);
          }}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Verificando...' : 'Verificar Localização'}</Text>
        </TouchableOpacity>

        {locationInfo && (
          <View style={styles.resultsContainer}>
            <View style={styles.row}>
              <Text style={styles.dim}>---</Text>
              <Text style={styles.sectionTitle}>POSIÇÃO ATUAL</Text>
              <Text style={styles.dim}>---</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Latitude</Text>
              <Text style={styles.value}>{locationInfo.current?.latitude?.toFixed(5)}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Longitude</Text>
              <Text style={styles.value}>{locationInfo.current?.longitude?.toFixed(5)}</Text>
            </View>

            <View style={[styles.rowBetween, { marginTop: 16 }]}>
              <Text style={styles.label}>STATUS</Text>
              <Text style={[styles.statusText, locationInfo.inside ? styles.ok : styles.error]}>{statusText}</Text>
            </View>
            {locationInfo.distance != null && (
              <Text style={styles.info}>
                Distância até a escola: {locationInfo.distance.toFixed(0)} m
              </Text>
            )}
            {locationInfo.error && (
              <Text style={styles.errorText}>Erro: {locationInfo.error}</Text>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[styles.cta, !(locationInfo?.inside) && styles.ctaDisabled]}
          disabled={!locationInfo?.inside}
          onPress={() => alert('Receber ticket')}
        >
          <Text style={[styles.ctaText, !(locationInfo?.inside) && styles.ctaTextDisabled]}>Receber ticket</Text>
        </TouchableOpacity>
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
  info: { color: '#333', marginTop: 8 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignSelf: 'stretch' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resultsContainer: {
    marginTop: 20,
    alignSelf: 'stretch',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  sectionTitle: { fontSize: 12, color: '#555' },
  dim: { color: '#aaa' },
  label: { color: '#666' },
  value: { color: '#000', fontWeight: '500' },
  statusText: { fontWeight: '600' },
  ok: { color: '#0A7A3B' },
  error: { color: '#D32F2F' },
  cta: { marginTop: 'auto', backgroundColor: '#000', borderRadius: 10, alignSelf: 'stretch', paddingVertical: 16, alignItems: 'center', marginBottom: 8 },
  ctaDisabled: { backgroundColor: '#9E9E9E' },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  ctaTextDisabled: { color: '#eee' },
});
