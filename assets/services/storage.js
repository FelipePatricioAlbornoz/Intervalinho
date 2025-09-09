import AsyncStorage from '@react-native-async-storage/async-storage';

const read = async (key) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    // procurar erros e depois chorar
    console.error('storage.read error', e);
    return null;
  }
};

const write = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('storage.write error', e);
  }
};

const remove = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('storage.remove error', e);
  }
};

// se um dia virar produção, deus me livre
const initFromSeed = async (force = false) => {
  const meta = (await read('meta')) || {};
  if (!force && meta.seedApplied) return;

  let seed = null;
  try {
    seed = require('../../data/seed.json');
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

  if (seed && seed.users) {
    await write('users', seed.users);
  } else {
    await write('users', [
      { id: 1, name: 'Admin', role: 'admin', matricula: null, password: 'admin123' }
    ]);
  }

  // tickets vazios, porque ninguém comeu ainda
  await write('tickets', {});
  await write('meta', { seedApplied: true, ts: Date.now() });
};

const getStudents = async () => (await read('students')) || [];
const getUsers = async () => (await read('users')) || [];
const getAuth = async () => (await read('auth')) || { user: null };
const setAuth = async (obj) => await write('auth', obj);
const getTickets = async () => (await read('tickets')) || {};
const setTickets = async (obj) => await write('tickets', obj);
const addStudent = async (student) => {
  const students = (await getStudents()) || [];
  //gera um id novo
  const maxId = students.reduce((m, s) => (s && s.id && s.id > m ? s.id : m), 0);
  const newId = maxId + 1;
  const newStudent = { id: newId, ...student };
  students.push(newStudent);
  await write('students', students);
  return newStudent;
};

export default {
  read,
  write,
  remove,
  initFromSeed,
  getStudents,
  addStudent,
  getUsers,
  getAuth,
  setAuth,
  getTickets,
  setTickets,
};
