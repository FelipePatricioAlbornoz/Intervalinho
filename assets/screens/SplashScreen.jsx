import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../constants/theme';

export default function SplashScreen() {
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text style={styles.title}>Intervalinho</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text
  }
});
