import * as Location from 'expo-location';
import { locationConfig } from '../constants/config';

function toRad(value) {
	return (value * Math.PI) / 180;
}

export function distanceInMeters(a, b) {
	const R = 6371000;
	const dLat = toRad(b.latitude - a.latitude);
	const dLon = toRad(b.longitude - a.longitude);
	const lat1 = toRad(a.latitude);
	const lat2 = toRad(b.latitude);
	const sinDLat = Math.sin(dLat / 2);
	const sinDLon = Math.sin(dLon / 2);
	const c = 2 * Math.asin(
		Math.sqrt(
			sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon
		)
	);
	return R * c;
}

export async function requestLocationAsync() {
	const { status } = await Location.requestForegroundPermissionsAsync();
	if (status !== 'granted') {
		throw new Error('Permiso de ubicación denegado');
	}
	const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
	return {
		latitude: position.coords.latitude,
		longitude: position.coords.longitude,
		accuracy: position.coords.accuracy ?? 0,
	};
}

export async function isInsideSchoolAsync() {
	try {
		const current = await requestLocationAsync();
		const dist = distanceInMeters(current, locationConfig.SCHOOL_COORDS);
		return { inside: dist <= locationConfig.SCHOOL_RADIUS_METERS, distance: dist, current };
	} catch (err) {
		return { inside: false, error: String(err) };
	}
}

export function simulateLocationInsideSchool() {
	return {
		latitude: locationConfig.SCHOOL_COORDS.latitude,
		longitude: locationConfig.SCHOOL_COORDS.longitude,
		accuracy: 5,
	};
}
