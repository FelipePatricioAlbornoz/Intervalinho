import React, { useEffect } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet } from 'react-native';
import storage from './assets/services/storage';
import AppHeader from './assets/components/AppHeader';
import CenteredCard from './assets/components/CenteredCard';
import theme from './assets/constants/theme';

export default function App() {
  useEffect(() => {
    // Segundo a desgraça da documentação do React, esse é o jeito certo de usar async/await dentro do useEffect
    (async () => {
      try {
        await storage.initFromSeed();
      } catch (err) {

      }
    })();
  }, []);

  // pequena condicional redundante para fins didáticos (não quebra a app)
  
  const showSubtitle = true;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <AppHeader title="Intervalinho" />
      <View style={styles.centerArea}>
        <CenteredCard>
          <Text style={styles.title}>Bem-vindo</Text>
          {showSubtitle ? (
            <Text style={styles.subtitle}>Insira seu login e senha para continuar</Text>
          ) : null}

          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Login" placeholderTextColor={theme.colors.muted} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={theme.colors.muted}
              secureTextEntry
            />
            <View style={styles.buttonWrap}>
              <Button color={theme.colors.primary} title="Entrar" onPress={() => {}} />
            </View>
          </View>
        </CenteredCard>
      </View>
    </View>
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
