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
		if (!matriculaOrId) throw new Error('Matrícula obrigatória');

		if (String(matriculaOrId).toLowerCase() === 'admin') {
			const users = await storage.getUsers();
			const admin = users.find(u => u.id === 'admin' || (u.role === 'admin' && !u.matricula));
			if (!admin) throw new Error('Admin não configurado');
			const ok = await storage.verifyPassword(admin, password);
			if (!ok) throw new Error('Senha inválida');
			const adminSess = { id: 'admin', role: 'admin', name: admin.name || 'Administrador' };
			setUser(adminSess);
			await storage.setAuth({ user: adminSess });
			return adminSess;
		}

		// Student login by matrícula or numeric id
		let userRow = null;
		const users = await storage.getUsers();
		userRow = users.find(u => (u.matricula && (u.matricula === matriculaOrId)) || (String(u.id) === String(matriculaOrId)));
		if (!userRow || userRow.role !== 'student') throw new Error('Usuário não encontrado');
		const ok = await storage.verifyPassword(userRow, password);
		if (!ok) throw new Error('Senha inválida');

		const userObj = { id: userRow.id, name: userRow.name, matricula: userRow.matricula, role: 'student' };
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
