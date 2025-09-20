import React, { createContext, useState, useEffect } from 'react';
import storage from '../services/storage';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [restoring, setRestoring] = useState(true);

	useEffect(() => {
			(async () => {
				try {
					const auth = await storage.getAuth();
					if (auth && auth.user) setUser(auth.user);
				} catch (e) {
					// ignore
				} finally {
					setRestoring(false);
				}
			})();
	}, []);

	const signIn = async (matricula, password) => {
		let userToLogin = null;

		if (matricula.toLowerCase() === 'admin' && password === 'admin123') {
			userToLogin = {
				id: 'admin',
				name: 'Administrador',
				role: 'admin'
			};
		}
		else if (matricula && !password) {
			userToLogin = {
				id: matricula,
				name: `Aluno ${matricula}`,
				matricula: matricula,
				role: 'student'
			};
		}

		if (userToLogin) {
			setUser(userToLogin);
			await storage.setAuth({ user: userToLogin });
			return userToLogin;
		}

		throw new Error('Usuário não encontrado');
	};

	const signOut = async () => {
		setUser(null);
		await storage.setAuth({ user: null });
	};

	return (
		<AuthContext.Provider value={{ user, restoring, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

export default AuthContext;
