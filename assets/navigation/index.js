import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AdminScreen from '../screens/AdminScreen';

export default function AppNavigation() {
	const { user, restoring } = useContext(AuthContext);
	const [showSplash, setShowSplash] = useState(true);
	const [showRegister, setShowRegister] = useState(false);

	useEffect(() => {
		const t = setTimeout(() => setShowSplash(false), 800);
		return () => clearTimeout(t);
	}, []);

	if (restoring || showSplash) return <SplashScreen />;
	if (!user) {
		if (showRegister) return <RegisterScreen onBack={() => setShowRegister(false)} />;
		return <LoginScreen onRegister={() => setShowRegister(true)} />;
	}
	return <AdminScreen />;
}
