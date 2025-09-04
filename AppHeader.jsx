import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../constants/theme';

export default function AppHeader({ title }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#0b1220',
    alignItems: 'center'
  },
  title: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: '700'
  }
});
