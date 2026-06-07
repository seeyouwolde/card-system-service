import React, { createContext, useContext, useState, useCallback } from 'react';

const HistoryContext = createContext(null);

/**
 * Maintains a client-side log of all travel card operations performed in this session.
 * Persisted to localStorage so it survives page refreshes.
 *
 * Each entry shape:
 * {
 *   id:        string  — uuid-like timestamp key
 *   timestamp: string  — ISO date
 *   type:      'REGISTER' | 'TOP_UP' | 'START_JOURNEY' | 'END_JOURNEY' | 'CARD_LOOKUP'
 *   cardNumber: string
 *   details:   object  — varies by type
 *   status:    'SUCCESS' | 'FAILED'
 *   message:   string  — optional error/success message
 * }
 */
export function HistoryProvider({ children }) {
  const [entries, setEntries] = useState(() => {
    try {
      const raw = localStorage.getItem('uaetc-history');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const addEntry = useCallback((entry) => {
    const newEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    setEntries((prev) => {
      const updated = [newEntry, ...prev].slice(0, 200); // Keep last 200 entries
      localStorage.setItem('uaetc-history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem('uaetc-history');
    setEntries([]);
  }, []);

  return (
    <HistoryContext.Provider value={{ entries, addEntry, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory must be used inside HistoryProvider');
  return ctx;
};
