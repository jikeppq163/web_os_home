import React, { createContext, useState, useEffect, useContext } from 'react';
import { AppConfig } from '../types';
import { fetchApps, getDefaultApps } from '../constants';

interface AppContextType {
  apps: AppConfig[];
  isLoaded: boolean;
  reloadApps: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<AppConfig[]>(getDefaultApps());
  const [isLoaded, setIsLoaded] = useState(false);

  const loadApps = async () => {
    try {
      const fetchedApps = await fetchApps();
      setApps(fetchedApps);
    } catch (error) {
      console.error('Error loading apps:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const reloadApps = async () => {
    await loadApps();
  };

  return (
    <AppContext.Provider value={{ apps, isLoaded, reloadApps }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
