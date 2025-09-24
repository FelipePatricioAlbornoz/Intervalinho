import React, { createContext, useState, useContext } from 'react';
import storage from '../services/storage';
import { AuthContext } from './AuthContext';

export const TicketsContext = createContext({});

export function TicketsProvider({ children }) {
  const [tickets, setTickets] = useState({});
  const { user } = useContext(AuthContext);

  const getTicket = async (userId, date) => {
    const allTickets = await storage.getTickets();
    return allTickets[userId]?.[date] || null;
  };

  const createTicket = async (userId, date) => {
    const allTickets = await storage.getTickets() || {};
    if (!allTickets[userId]) {
      allTickets[userId] = {};
    }
    allTickets[userId][date] = {
      received: true,
      used: false,
      timestamp: Date.now(),
    };
    await storage.setTickets(allTickets);
    setTickets(allTickets);
  };

  const useTicket = async (userId, date) => {
    const allTickets = await storage.getTickets();
    if (allTickets[userId] && allTickets[userId][date]) {
      allTickets[userId][date].used = true;
      await storage.setTickets(allTickets);
      setTickets(allTickets);
    }
  };

  return (
    <TicketsContext.Provider value={{ tickets, getTicket, createTicket, useTicket }}>
      {children}
    </TicketsContext.Provider>
  );
}