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
				} finally {
					setRestoring(false);
				}
			})();
	}, []);

	const signIn = async (matricula, password) => {
		try {
			const users = await storage.getUsers();
			const userFound = users.find(u => u.matricula === matricula);

			if (!userFound) {
				throw new Error('Usuário não encontrado');
			}

			const passwordOk = await storage.verifyPassword(userFound, password);
			if (!passwordOk) {
				throw new Error('Senha inválida');
			}

			const userToLogin = {
				id: userFound.id,
				name: userFound.name,
				matricula: userFound.matricula,
				role: userFound.role
			};

			setUser(userToLogin);
			await storage.setAuth({ user: userToLogin });
			return userToLogin;
		} catch (error) {
			console.error('Error en signIn:', error);
			throw error;
		}
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