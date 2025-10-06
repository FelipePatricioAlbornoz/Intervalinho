import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { AuthContext } from '../context/AuthContext';
import { intervalConfig } from '../constants/config';
import Storage from '../services/storage';
import { isInsideSchoolAsync } from '../services/location';

export default function ReceberTicketScreen({ onBack }) {
  const { user } = useContext(AuthContext);
  const [showButton, setShowButton] = useState(false);
  const [alreadyHas, setAlreadyHas] = useState(false);
  const [geoAllowed, setGeoAllowed] = useState(null);

  const parseIntervalTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error('Invalid time format');
      }
      return { hours, minutes };
    } catch (error) {
      console.error('Error parsing interval time:', error);
      return { hours: 12, minutes: 30 };
    }
  };

  const checkTime = () => {
    try {
      const agora = new Date();
      const { hours, minutes } = parseIntervalTime(intervalConfig.START_TIME);
      
      const intervaloDate = new Date();
      intervaloDate.setHours(hours, minutes, 0, 0);
      
      if (intervaloDate <= agora) {
      intervaloDate.setDate(intervaloDate.getDate() + 1);
      }
      
      const diff = (intervaloDate - agora) / 60000;
      setShowButton(diff <= intervalConfig.MINUTES_BEFORE_INTERVAL && diff >= 0);
    } catch (error) {
      console.error('Error checking time:', error);
      setShowButton(false);
    }
  };

  useEffect(() => {
    checkTime();
    const timer = setInterval(checkTime, intervalConfig.CHECK_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const t = await Storage.getTicketForToday(user.id);
      setAlreadyHas(!!t);
    })();
  }, [user]);

  const handleReceiveTicket = async () => {
    try {
      if (!showButton) {
        alert('Fora do horário para receber ticket.');
        return;
      }
      const loc = await isInsideSchoolAsync();
      setGeoAllowed(!!loc.inside);
      if (!loc.inside) {
        alert('Você precisa estar na escola para receber.');
        return;
      }
      const current = await Storage.getTicketForToday(user.id);
      if (current) {
        setAlreadyHas(true);
        alert('Você já possui um ticket para hoje.');
        return;
      }
      await Storage.grantTicketForToday(user.id);
      setAlreadyHas(true);
      alert('Ticket recebido com sucesso!');
    } catch (error) {
      console.error('Erro ao receber ticket:', error);
      alert('Erro ao receber ticket. Tente novamente.');
    }
  };

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
            O botão só aparece nos {intervalConfig.MINUTES_BEFORE_INTERVAL} minutos antes do intervalo.
          </Text>
        </View>

        {!alreadyHas ? (
          <>
            {showButton && (
              <TouchableOpacity style={styles.button} onPress={handleReceiveTicket}>
                <Text style={styles.buttonText}>Receber Ticket</Text>
              </TouchableOpacity>
            )}
            {!showButton && (
              <Text style={{ color: '#888', marginTop: 20 }}>Fora do horário para receber ticket.</Text>
            )}
            <TouchableOpacity style={[styles.button, { backgroundColor: '#0A7A3B', marginTop: 16 }]} onPress={async () => {
              try {
                const loc = await isInsideSchoolAsync();
                setGeoAllowed(!!loc.inside);
                if (!loc.inside) {
                  alert('Você precisa estar na escola para receber.');
                  return;
                }
                const current = await Storage.getTicketForToday(user.id);
                if (current) {
                  setAlreadyHas(true);
                  alert('Você já possui um ticket para hoje.');
                  return;
                }
                await Storage.grantTicketForToday(user.id);
                setAlreadyHas(true);
                alert('Ticket recebido com sucesso! (Forçado)');
              } catch (error) {
                console.error('Erro ao receber ticket:', error);
                alert('Erro ao receber ticket. Tente novamente.');
              }
            }}>
              <Text style={styles.buttonText}>Receber Ticket (Forçar)</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={{ color: '#0A7A3B', marginTop: 20 }}>Ticket disponível para hoje.</Text>
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
