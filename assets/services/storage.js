import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const read = async (key) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
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

const getStudents = async () => (await read('students')) || [];
const getUsers = async () => (await read('users')) || [];
const setUsers = async (arr) => await write('users', arr || []);
const getAuth = async () => (await read('auth')) || { user: null };
const setAuth = async (obj) => await write('auth', obj);
const getTickets = async () => (await read('tickets')) || {};
const setTickets = async (obj) => await write('tickets', obj);

// --- Helpers de tickets por dia ---
const dateKey = (d = new Date()) => d.toISOString().slice(0, 10); // YYYY-MM-DD

const getDayTickets = async (key = dateKey()) => {
  const all = await getTickets();
  return all[key] || {};
};

const setDayTickets = async (ticketsForDay, key = dateKey()) => {
  const all = await getTickets();
  all[key] = ticketsForDay || {};
  await setTickets(all);
};

const getTicketForToday = async (userId) => {
  const day = await getDayTickets();
  return day && userId != null ? day[String(userId)] || null : null;
};

const grantTicketForToday = async (userId) => {
  if (userId == null) throw new Error('userId inválido');
  const day = await getDayTickets();
  if (day[String(userId)]) {
    return day[String(userId)];
  }
  const entry = { status: 'available', ts: Date.now() };
  day[String(userId)] = entry;
  await setDayTickets(day);
  return entry;
};

const markTicketUsed = async (userId) => {
  if (userId == null) throw new Error('userId inválido');
  const day = await getDayTickets();
  const entry = day[String(userId)];
  if (!entry) throw new Error('Nenhum ticket disponível para este usuário hoje.');
  if (entry.status === 'used') throw new Error('Ticket já foi usado.');
  day[String(userId)] = { ...entry, status: 'used', usedAt: Date.now() };
  await setDayTickets(day);
  return day[String(userId)];
};

const listTodayTickets = async () => {
  const day = await getDayTickets();
  return Object.entries(day).map(([userId, data]) => ({ userId, ...data }));
};

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
  if (!users.length) {
    const adminSaltBytes = await Crypto.getRandomBytesAsync(16);
    const adminSalt = toHex(adminSaltBytes);
    const adminHash = await hashPassword('admin123', adminSalt);
    newUsers.push({ id: 'admin', name: 'Administrador', role: 'admin', matricula: null, passwordHash: adminHash, salt: adminSalt });
  }

  for (const s of students) {
    const saltBytes = await Crypto.getRandomBytesAsync(16);
    const salt = toHex(saltBytes);
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

const registerStudent = async ({ name, matricula, password, role = 'student' }) => {
  if (!name || !matricula || !password) {
    throw new Error('Nome, matrícula e senha são obrigatórios');
  }

  const students = (await getStudents()) || [];
  const users = (await getUsers()) || [];

  const exists = users.find(u => u.matricula && String(u.matricula) === String(matricula));
  if (exists) {
    throw new Error(`Já existe um usuário com essa matrícula`);
  }

  let newId;
  if (role === 'admin') {
    const adminCount = users.filter(u => u.role === 'admin').length;
    if (adminCount >= 10) {
      throw new Error('Número máximo de administradores (10) atingido');
    }
    newId = String(matricula);
  } else {
    const numericIds = students.map(s => (typeof s.id === 'number' ? s.id : Number(s.id) || 0));
    const maxId = numericIds.reduce((m, n) => (n > m ? n : m), 0);
    newId = maxId + 1;
    const newStudent = { id: newId, name, matricula };
    students.push(newStudent);
    await write('students', students);
  }

  const saltBytes = await Crypto.getRandomBytesAsync(16);
  const saltHex = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const passwordHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${saltHex}:${password}`);
  users.push({ id: newId, name, role, matricula, passwordHash, salt: saltHex });
  await setUsers(users);

  return { id: newId, name, matricula, role };
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

const resetTodayTickets = async () => {
  try {
    const all = await getTickets();
    const today = dateKey();
    if (all[today]) {
      delete all[today];
      await setTickets(all);
    }
    return true;
  } catch (error) {
    console.error('Error reseteando tickets do dia:', error);
    return false;
  }
};

const resetAllData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    if (keys.length > 0) {
      await AsyncStorage.multiRemove(keys);
    }
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error borrando datos:', error);
    return false;
  }
};

const initFromSeed = async () => {
  try {
    const users = await getUsers();
    const students = await getStudents();
    if ((users && users.length) || (students && students.length)) return false; // ya inicializado
    let seed = null;
    try {
      seed = require('../data/seed.json');
    } catch (e) {
      seed = null;
    }
    if (!seed) return false;

    const seedStudents = seed.students || [];
    await write('students', seedStudents);

    const newUsers = [];
    for (const s of seedStudents) {
      const saltBytes = await Crypto.getRandomBytesAsync(16);
      const salt = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      const passwordHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:1234`);
      newUsers.push({ id: s.id, name: s.name, role: 'student', matricula: s.matricula, passwordHash, salt });
    }
    if (!newUsers.some(u => u.role === 'admin')) {
      const adminSaltBytes = await Crypto.getRandomBytesAsync(16);
      const adminSalt = Array.from(adminSaltBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      const adminHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${adminSalt}:admin123`);
      newUsers.push({ id: 'admin', name: 'Administrador', role: 'admin', matricula: null, passwordHash: adminHash, salt: adminSalt });
    }
    await setUsers(newUsers);
    return true;
  } catch (error) {
    console.error('initFromSeed error', error);
    return false;
  }
};

const getTicketsHistory = async () => {
  const all = await getTickets();
  return all;
};

export default {
  read,
  write,
  remove,
  getStudents,
  addStudent,
  getUsers,
  setUsers,
  getAuth,
  setAuth,
  getTickets,
  setTickets,
  getTicketForToday,
  grantTicketForToday,
  markTicketUsed,
  listTodayTickets,
  registerStudent,
  findUserByMatricula,
  verifyPassword,
  resetAllData,
  initFromSeed,
  resetTodayTickets,
  getTicketsHistory,
};
