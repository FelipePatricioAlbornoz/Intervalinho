
import React, { useEffect } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet } from 'react-native';
import storage from './assets/services/storage';
import AppHeader from './assets/screens/AppHeader';
import CenteredCard from './assets/screens/CenteredCard';
import theme from './assets/constants/theme';
import { AuthProvider } from './assets/context/AuthContext';
import AppNavigation from './assets/navigation';


export default function App() {
  useEffect(() => {
    (async () => {
      try {
        await storage.initFromSeed();
      } catch (err) {}
    })();
  }, []);

  const showSubtitle = true;

  return (
    <AuthProvider>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
        <AppNavigation />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  color: theme.colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.muted,
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    height: 44,
    borderColor: '#1f2937',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    color: theme.colors.text,
    backgroundColor: '#0b1220'
  },
  centerArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
  buttonWrap: {
    marginTop: 8,
  }
});
