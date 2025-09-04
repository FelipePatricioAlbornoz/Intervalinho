import AsyncStorage from '@react-native-async-storage/async-storage';
import seed from '../data/seed.json';

const STORAGE_VERSION = 1;

const KEYS = {
	STUDENTS: 'students',
	TICKETS: 'tickets',
	AUTH: 'auth',
	SETTINGS: 'settings',
	META: 'meta'
};

async function getRaw(key) {
	const v = await AsyncStorage.getItem(key);
	return v ? JSON.parse(v) : null;
}

async function setRaw(key, value) {
	await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function initFromSeed(force = false) {
	const meta = await getRaw(KEYS.META);
	if (!force && meta && meta.version === STORAGE_VERSION) return;

	// seed students and settings
	const studentsById = {};
	for (const s of seed.students || []) {
		studentsById[s.id] = s;
	}

	await setRaw(KEYS.STUDENTS, studentsById);
	await setRaw(KEYS.TICKETS, []);
	await setRaw(KEYS.SETTINGS, seed.settings || {});
	await setRaw(KEYS.AUTH, { currentUser: null });
	await setRaw(KEYS.META, { version: STORAGE_VERSION, initializedAt: new Date().toISOString() });
}

async function getStudents() {
	return (await getRaw(KEYS.STUDENTS)) || {};
}

async function setStudents(obj) {
	await setRaw(KEYS.STUDENTS, obj);
}

async function getTickets() {
	return (await getRaw(KEYS.TICKETS)) || [];
}

async function setTickets(tickets) {
	await setRaw(KEYS.TICKETS, tickets);
}

async function getSettings() {
	return (await getRaw(KEYS.SETTINGS)) || {};
}

async function setSettings(settings) {
	await setRaw(KEYS.SETTINGS, settings);
}

async function getAuth() {
	return (await getRaw(KEYS.AUTH)) || { currentUser: null };
}

async function setAuth(auth) {
	await setRaw(KEYS.AUTH, auth);
}

async function clearAll() {
	await AsyncStorage.clear();
}

export default {
	KEYS,
	initFromSeed,
	getStudents,
	setStudents,
	getTickets,
	setTickets,
	getSettings,
	setSettings,
	getAuth,
	setAuth,
	clearAll
};

