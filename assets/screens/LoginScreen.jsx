import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../constants/theme';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
	const [matricula, setMatricula] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const { signIn } = useContext(AuthContext);

	const onContinue = async () => {
		setLoading(true);
		try {
			await signIn(matricula.trim(), password);
		} catch (e) {
			// Optionally show an error toast; keep minimal for now
			console.warn('login failed', e.message || e);
		} finally {
			setLoading(false);
		}
	};

		return (
			<View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
				<Text style={styles.header}>Intervalinho</Text>
				<Text style={styles.hint}>Insira seu login</Text>

				<View style={styles.form}>
					<TextInput
						placeholder="Digite sua matrícula ou código"
						placeholderTextColor={theme.colors.muted}
						value={matricula}
						onChangeText={setMatricula}
						style={styles.input}
						autoCapitalize="none"
					/>
					<TextInput
						placeholder="Digite sua senha"
						placeholderTextColor={theme.colors.muted}
						value={password}
						secureTextEntry
						onChangeText={setPassword}
						style={styles.input}
					/>

					<TouchableOpacity onPress={onContinue} style={styles.button} disabled={loading}>
						<Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Continuar'}</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', paddingTop: 60 },
	header: { fontSize: 26, fontWeight: '700', color: theme.colors.text, marginBottom: 28 },
	hint: { color: '#444', marginBottom: 16 },
	form: { width: '86%', alignItems: 'center' },
	input: {
		width: '100%',
		height: 48,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e6e6e6',
		paddingHorizontal: 12,
		marginBottom: 12,
		backgroundColor: '#fff'
	},
	button: {
		width: '100%',
		height: 44,
		backgroundColor: '#111',
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 8
	},
	buttonText: { color: '#fff', fontWeight: '700' }
});
