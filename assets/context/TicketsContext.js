import React, { createContext, useState, useEffect, useContext } from 'react';
import storage from '../services/storage';
import { AuthContext } from './AuthContext';

export const TicketsContext = createContext({});

export function TicketsProvider({ children }) {
  const [todayTickets, setTodayTickets] = useState([]);
  const { user } = useContext(AuthContext);

  const refresh = async () => {
    const list = await storage.listTodayTickets();
    setTodayTickets(list || []);
  };

  useEffect(() => {
    refresh();
  }, []);

  const getTicket = async (userId) => {
    return await storage.getTicketForToday(userId);
  };

  const createTicket = async (userId) => {
    const entry = await storage.grantTicketForToday(userId);
    await refresh();
    return entry;
  };

  const useTicket = async (userId) => {
    const entry = await storage.markTicketUsed(userId);
    await refresh();
    return entry;
  };

  return (
    <TicketsContext.Provider value={{ todayTickets, refresh, getTicket, createTicket, useTicket }}>
      {children}
    </TicketsContext.Provider>
  );
}
