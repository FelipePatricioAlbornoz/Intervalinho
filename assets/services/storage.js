let memoryStore = {};

const read = async (key) => {
	return memoryStore[key] || null;
};

const write = async (key, value) => {
	memoryStore[key] = value;
};

const initFromSeed = async (force = false) => {
	const meta = (await read('meta')) || {};
	if (!force && meta.seedApplied) return;
	let seed;
	try {
		seed = require('../data/seed.json');
	} catch (e) {
		seed = null;
	}
	if (seed && seed.students) {
		await write('students', seed.students);
	} else {
		await write('students', [
			{ id: 1, name: 'Aluno Demo', matricula: '2025001' },
			{ id: 2, name: 'Maria Silva', matricula: '2025002' },
			{ id: 3, name: 'João Souza', matricula: '2025003' },
		]);
	}
	await write('meta', { seedApplied: true, ts: Date.now() });
};

const getStudents = async () => (await read('students')) || [];
const getAuth = async () => (await read('auth')) || { user: null };
const setAuth = async (obj) => await write('auth', obj);

export default { initFromSeed, getStudents, getAuth, setAuth };

