import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import theme from '../constants/theme';

export default function AdminScreen() {
	const { signOut } = useContext(AuthContext);
	return (
		<View style={[styles.container, { backgroundColor: theme.colors.background }]}>
			<Text style={styles.title}>Área do Admin</Text>
			<TouchableOpacity onPress={signOut} style={styles.button}>
				<Text style={styles.buttonText}>Sair</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	title: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
	button: { backgroundColor: '#111', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8 },
	buttonText: { color: '#fff' }
});
