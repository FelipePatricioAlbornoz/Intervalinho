import React from 'react';
import { View, StyleSheet } from 'react-native';
import theme from '../constants/theme';

export default function CenteredCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
  width: '92%',
  backgroundColor: theme.colors.surface,
  padding: 20,
  borderRadius: theme.radius.md,
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowOffset: { width: 0, height: 6 },
  shadowRadius: 12,
  elevation: 3
  }
});
