import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LocationToggle({ useMock, onToggle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Simular localização:</Text>
      <TouchableOpacity style={[styles.toggle, useMock ? styles.on : styles.off]} onPress={onToggle}>
        <Text style={styles.toggleText}>{useMock ? 'Ativada (na escola)' : 'Desativada (usar GPS)'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  label: { fontSize: 14, color: '#444' },
  toggle: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  on: { backgroundColor: '#E7F6EC' },
  off: { backgroundColor: '#EEE' },
  toggleText: { color: '#111', fontWeight: '600' },
});


