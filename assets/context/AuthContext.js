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
		let userToLogin = null;

		if (matricula.toLowerCase() === 'admin' && password === 'admin123') {
			userToLogin = {
				id: 'admin',
				name: 'Administrador',
				role: 'admin'
			};
		} else {
			const users = await storage.getUsers();
			const userFound = users.find(u => u.matricula === matricula);

			if (!userFound) {
				throw new Error('Usuário não encontrado');
			}

			const passwordOk = await storage.verifyPassword(userFound, password);
			if (!passwordOk) {
				throw new Error('Senha inválida');
			}

			userToLogin = {
				id: userFound.id,
				name: userFound.name,
				matricula: userFound.matricula,
				role: userFound.role
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