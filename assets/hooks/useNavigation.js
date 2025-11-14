import { useState, useCallback } from 'react';
import { ROUTES } from '../navigation/routes';

/**
 * Hook para manejar la lógica de navegación
 * Centraliza toda la lógica de cambios de pantalla
 */
export function useNavigation(initialRoute = ROUTES.HOME) {
	const [currentScreen, setCurrentScreen] = useState(initialRoute);

	const navigate = useCallback((screenName) => {
		setCurrentScreen(screenName);
	}, []);

	const goBack = useCallback(() => {
		setCurrentScreen(ROUTES.HOME);
	}, []);

	const goTo = useCallback((screenName) => {
		navigate(screenName);
	}, [navigate]);

	const reset = useCallback(() => {
		setCurrentScreen(ROUTES.HOME);
	}, []);

	return {
		currentScreen,
		navigate,
		goBack,
		goTo,
		reset,
		isHome: currentScreen === ROUTES.HOME,
	};
}

export default useNavigation;
