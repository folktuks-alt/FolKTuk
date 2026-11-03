'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { User } from '../lib/types';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (input: Record<string, string>) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('folktuk_token');
    if (saved) {
      setToken(saved);
      api<User>('/identity/me').then(setUser).catch(() => localStorage.removeItem('folktuk_token'));
    }
  }, []);

  const save = (result: { accessToken: string; user: User }) => {
    localStorage.setItem('folktuk_token', result.accessToken);
    setToken(result.accessToken);
    setUser(result.user);
  };

  const login = async (identifier: string, password: string) => {
    save(await api('/identity/login', { method: 'POST', body: JSON.stringify({ identifier, password }) }));
  };
  const register = async (input: Record<string, string>) => {
    await api('/identity/register', { method: 'POST', body: JSON.stringify(input) });
    await login(input.email, input.password);
  };
  const logout = () => {
    localStorage.removeItem('folktuk_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => setUser(updatedUser);

  return <AuthContext.Provider value={{ user, token, login, register, logout, updateUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
