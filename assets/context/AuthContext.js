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

	const signIn = async (matriculaOrId, password = '') => {
		if (!matriculaOrId) throw new Error('matricula required');

		const students = await storage.getStudents();
		const found = (students || []).find(s => s.matricula === matriculaOrId || String(s.id) === String(matriculaOrId));

		if (matriculaOrId === 'admin' && password === 'admin123') {
			const admin = { id: 'admin', role: 'admin', name: 'Administrador' };
			setUser(admin);
			await storage.setAuth({ user: admin });
			return admin;
		}

		if (!found) throw new Error('Usuário não encontrado');

		const userObj = { id: found.id, name: found.name, matricula: found.matricula, role: 'student' };
		setUser(userObj);
		await storage.setAuth({ user: userObj });
		return userObj;
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
