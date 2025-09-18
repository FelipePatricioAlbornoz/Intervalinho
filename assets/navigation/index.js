import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AdminScreen from '../screens/AdminScreen';
import HomeScreen from '../screens/HomeScreen';
import ReceberTicketScreen from '../screens/ReceberTicketScreen';

export default function AppNavigation() {
	const { user, restoring } = useContext(AuthContext);
	const [showSplash, setShowSplash] = useState(true);
	const [showRegister, setShowRegister] = useState(false);
	const [currentScreen, setCurrentScreen] = useState('home');

	useEffect(() => {
		const t = setTimeout(() => setShowSplash(false), 800);
		return () => clearTimeout(t);
	}, []);

	const navigateToScreen = (screenName) => {
		setCurrentScreen(screenName);
	};

	const goBack = () => {
		setCurrentScreen('home');
	};

	if (restoring || showSplash) return <SplashScreen />;
	if (!user) {
		if (showRegister) return <RegisterScreen onBack={() => setShowRegister(false)} />;
		return <LoginScreen onRegister={() => setShowRegister(true)} />;
	}
	if (user.role === 'admin') return <AdminScreen />;
	
	// Navegación para estudiantes
	if (currentScreen === 'receber-ticket') {
		return <ReceberTicketScreen onBack={goBack} />;
	}
	
	return <HomeScreen onNavigate={navigateToScreen} />;
}
