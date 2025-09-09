import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

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
  if (!force && meta.seedApplied) {
    await migrateUsersToHashed();
    return;
  }

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

  const students = (await read('students')) || [];
  const users = [];

  const toHex = (bytes) => Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashPassword = async (password, saltHex) => {
    const data = `${saltHex}:${password}`;
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, data);
  };

  const adminSalt = toHex(Crypto.getRandomValues(new Uint8Array(16)));
  const adminHash = await hashPassword('admin123', adminSalt);
  users.push({ id: 'admin', name: 'Administrador', role: 'admin', matricula: null, passwordHash: adminHash, salt: adminSalt });

  for (const s of students) {
    const salt = toHex(Crypto.getRandomValues(new Uint8Array(16)));
    const passwordHash = await hashPassword('1234', salt);
    users.push({ id: s.id, name: s.name, role: 'student', matricula: s.matricula, passwordHash, salt });
  }
  await write('users', users);

  // tickets vazios, porque ninguém comeu ainda
  await write('tickets', {});
  await write('meta', { seedApplied: true, ts: Date.now() });
};

const getStudents = async () => (await read('students')) || [];
const getUsers = async () => (await read('users')) || [];
const setUsers = async (arr) => await write('users', arr || []);
const getAuth = async () => (await read('auth')) || { user: null };
const setAuth = async (obj) => await write('auth', obj);
const getTickets = async () => (await read('tickets')) || {};
const setTickets = async (obj) => await write('tickets', obj);

const migrateUsersToHashed = async () => {
  const users = (await getUsers()) || [];
  const students = (await getStudents()) || [];
  const needsMigration = !users.length || users.some(u => !u.passwordHash || !u.salt);
  if (!needsMigration) return;

  const toHex = (bytes) => Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashPassword = async (password, saltHex) => {
    const data = `${saltHex}:${password}`;
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, data);
  };

  const newUsers = [];
  // admin
  const adminSalt = toHex(Crypto.getRandomValues(new Uint8Array(16)));
  const adminHash = await hashPassword('admin123', adminSalt);
  newUsers.push({ id: 'admin', name: 'Administrador', role: 'admin', matricula: null, passwordHash: adminHash, salt: adminSalt });

  for (const s of students) {
    const salt = toHex(Crypto.getRandomValues(new Uint8Array(16)));
    const passwordHash = await hashPassword('1234', salt);
    newUsers.push({ id: s.id, name: s.name, role: 'student', matricula: s.matricula, passwordHash, salt });
  }

  await setUsers(newUsers);
};

const findUserByMatricula = async (matricula) => {
  const users = await getUsers();
  return users.find(u => u.matricula && String(u.matricula) === String(matricula));
};

const verifyPassword = async (user, password) => {
  if (!user || !password) return false;
  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${user.salt}:${password}`);
  return hash === user.passwordHash;
};

const registerStudent = async ({ name, matricula, password }) => {
  if (!name || !matricula || !password) {
    throw new Error('Nome, matrícula e senha são obrigatórios');
  }
  const students = (await getStudents()) || [];
  const users = (await getUsers()) || [];
  
  const exists = users.find(u => u.matricula && String(u.matricula) === String(matricula));
  if (exists) throw new Error('Matrícula já cadastrada');

  const numericIds = students.map(s => (typeof s.id === 'number' ? s.id : 0));
  const maxId = numericIds.reduce((m, n) => (n > m ? n : m), 0);
  const newId = maxId + 1;
  const newStudent = { id: newId, name, matricula };
  students.push(newStudent);
  await write('students', students);

  const saltBytes = Crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const passwordHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${saltHex}:${password}`);
  users.push({ id: newId, name, role: 'student', matricula, passwordHash, salt: saltHex });
  await setUsers(users);

  return newStudent;
};

const addStudent = async (student) => {
  const students = (await getStudents()) || [];
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
  setUsers,
  getAuth,
  setAuth,
  getTickets,
  setTickets,
  registerStudent,
  findUserByMatricula,
  verifyPassword,
};
