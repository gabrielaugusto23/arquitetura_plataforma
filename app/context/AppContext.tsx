"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
  avatar?: string;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
}

interface AppContextType {
  userInfo: User | null;
  setUserInfo: (info: User | null) => void;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const recuperarSessao = () => {
      const savedUser = localStorage.getItem('engnet_user');
      const token = localStorage.getItem('engnet_token');

      if (savedUser && token) {
        try {
          setUserInfo(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('engnet_user');
          localStorage.removeItem('engnet_token');
        }
      }
      setIsLoading(false);
    };
    recuperarSessao();
  }, []);

  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.message || 'Falha na autenticação');
      }

      const data = await res.json();
      const user = data.user;
      const token = data.access_token;

      setUserInfo(user);
      localStorage.setItem('engnet_token', token);
      localStorage.setItem('engnet_user', JSON.stringify(user));
      
      addNotification({ type: 'success', message: `Bem-vindo, ${user.nome}!` });
      router.push('/');
      
    } catch (error: any) {
      console.error(error);
      addNotification({ type: 'error', message: error.message || 'Erro ao conectar no servidor.' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('engnet_token');
    localStorage.removeItem('engnet_user');
    setUserInfo(null);
    router.push('/login');
    addNotification({ type: 'info', message: 'Você saiu do sistema.' });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => removeNotification(newNotification.id), 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <AppContext.Provider value={{
      userInfo,
      setUserInfo,
      isAuthenticated: !!userInfo,
      login,
      logout,
      notifications,
      addNotification,
      removeNotification,
      isLoading,
      setIsLoading,
      isSidebarOpen,
      setSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};