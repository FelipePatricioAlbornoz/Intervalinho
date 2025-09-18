import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { AuthContext } from '../context/AuthContext';

export default function ReceberTicketScreen({ onBack }) {
  const { user } = useContext(AuthContext);
  const [showButton, setShowButton] = useState(false);

  // Horário do intervalo (pode ser ajustado conforme necessário)
  const intervaloInicio = '12:30';
  const intervaloDate = new Date();
  intervaloDate.setHours(Number(intervaloInicio.split(':')[0]), Number(intervaloInicio.split(':')[1]), 0, 0);

  useEffect(() => {
    const checkTime = () => {
      const agora = new Date();
      const diff = (intervaloDate - agora) / 60000; // minutos até o intervalo
      setShowButton(diff <= 5 && diff >= 0);
    };
    checkTime();
    const timer = setInterval(checkTime, 10000); // checa a cada 10s
    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Receber Ticket</Text>

        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            O botão só aparece nos 5 minutos antes do intervalo.
          </Text>
        </View>

        {showButton && (
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Receber Ticket</Text>
          </TouchableOpacity>
        )}
        {!showButton && (
          <Text style={{ color: '#888', marginTop: 20 }}>Fora do horário para receber ticket.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitleContainer: {
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
