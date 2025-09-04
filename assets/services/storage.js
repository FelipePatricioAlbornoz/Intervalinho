import { Platform } from 'react-native';
let AsyncStorage;
try {
	// prefer community AsyncStorage if available
	AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
	AsyncStorage = null; // will fallback to in-memory
}

const KEYS = {
	STUDENTS: 'students_v1',
	AUTH: 'auth_v1',
	META: 'meta_v1'
};

const memoryStore = {};

const getRaw = async (key) => {
	if (AsyncStorage) {
		const v = await AsyncStorage.getItem(key);
		return v ? JSON.parse(v) : null;
	}
	return memoryStore[key] || null;
};

const setRaw = async (key, value) => {
	if (AsyncStorage) {
		await AsyncStorage.setItem(key, JSON.stringify(value));
		return;
	}
	memoryStore[key] = value;
};

const initFromSeed = async (force = false) => {
	const meta = (await getRaw(KEYS.META)) || {};
	if (!force && meta.seedApplied) return;

	// load seed
	let seed;
	try {
		seed = require('../data/seed.json');
	} catch (e) {
		seed = null;
	}

	if (seed && seed.students) {
		await setRaw(KEYS.STUDENTS, seed.students);
	} else {
		// create a default demo student
		await setRaw(KEYS.STUDENTS, [
			{ id: 1, name: 'Aluno Demo', matricula: '2025001' }
		]);
	}

	await setRaw(KEYS.META, { seedApplied: true, ts: Date.now() });
};

const getStudents = async () => (await getRaw(KEYS.STUDENTS)) || [];
const getAuth = async () => (await getRaw(KEYS.AUTH)) || { user: null };
const setAuth = async (obj) => await setRaw(KEYS.AUTH, obj);

export default { initFromSeed, getStudents, getAuth, setAuth };

