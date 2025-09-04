import React from 'react';
import { View, StyleSheet } from 'react-native';
import theme from '../constants/theme';

export default function CenteredCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    width: '90%',
    backgroundColor: theme.colors.surface,
    padding: 16,
  borderRadius: theme.radius.md,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  }
});
