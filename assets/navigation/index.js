import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ROUTES } from './routes';
import useNavigation from '../hooks/useNavigation';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AdminScreen from '../screens/AdminScreen';
import HomeScreen from '../screens/HomeScreen';
import ReceberTicketScreen from '../screens/ReceberTicketScreen';
import CadastroAlunoScreen from '../screens/CadastroAlunoScreen';
import LocationScreen from '../screens/LocationScreen';
import IntervalScreen from '../screens/IntervalScreen';
import DisponibilidadeScreen from '../screens/DisponibilidadeScreen';
import HistoricoTicketsScreen from '../screens/HistoricoTicketsScreen';
import ValidacaoTicketScreen from '../screens/ValidacaoTicketScreen';

export default function AppNavigation() {
	const { user, restoring } = useContext(AuthContext);
	const [showSplash, setShowSplash] = useState(true);
	const [showRegister, setShowRegister] = useState(false);
	const { currentScreen, navigate, goBack } = useNavigation(ROUTES.HOME);

	useEffect(() => {
		const t = setTimeout(() => setShowSplash(false), 800);
		return () => clearTimeout(t);
	}, []);

	const toggleRegister = (show) => setShowRegister(show);

	// Renderizar pantalla de estudiante
	const renderStudentScreen = () => {
		const studentScreens = {
			[ROUTES.RECEBER_TICKET]: <ReceberTicketScreen onBack={goBack} />,
			[ROUTES.LOCATION]: <LocationScreen onBack={() => navigate(ROUTES.RECEBER_TICKET)} />,
			[ROUTES.VALIDACAO]: <ValidacaoTicketScreen onBack={goBack} />,
			[ROUTES.INTERVALO]: <IntervalScreen onBack={goBack} />,
			[ROUTES.DISPONIBILIDADE]: <DisponibilidadeScreen onBack={goBack} />,
		};

		return studentScreens[currentScreen] || <HomeScreen onNavigate={navigate} />;
	};

	// Renderizar pantalla de administrador
	const renderAdminScreen = () => {
		const adminScreens = {
			[ROUTES.CADASTRO_ALUNO]: <CadastroAlunoScreen onBack={goBack} />,
			[ROUTES.LOCATION]: <LocationScreen onBack={goBack} />,
			[ROUTES.DISPONIBILIDADE]: (
				<DisponibilidadeScreen 
					onBack={goBack} 
					onNavigateHistorico={() => navigate(ROUTES.HISTORICO_TICKETS)} 
				/>
			),
			[ROUTES.HISTORICO_TICKETS]: <HistoricoTicketsScreen onBack={() => navigate(ROUTES.DISPONIBILIDADE)} />,
			[ROUTES.VALIDACAO]: <ValidacaoTicketScreen onBack={goBack} />,
		};

		return adminScreens[currentScreen] || <AdminScreen onNavigate={navigate} />;
	};

	// Lógica principal de pantallas
	if (restoring || showSplash) return <SplashScreen />;
	
	if (!user) {
		return showRegister 
			? <RegisterScreen onBack={() => toggleRegister(false)} />
			: <LoginScreen onRegister={() => toggleRegister(true)} />;
	}

	return user.role === 'admin' ? renderAdminScreen() : renderStudentScreen();
}
