import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrentUser, UserRole } from '@/lib/types';
import { getCurrentUser, setCurrentUser, getUsers, getTheme, setTheme } from '@/lib/storage';
import { seedData } from '@/lib/seed';

interface AuthContextType {
  user: CurrentUser | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  impersonate: (tenantId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    seedData();
    const t = getTheme();
    setThemeState(t);
    document.documentElement.classList.toggle('dark', t === 'dark');
    const u = getCurrentUser();
    if (u) setUser(u);
  }, []);

  const login = (email: string, password: string) => {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'E-mail ou senha inválidos' };
    const cu: CurrentUser = { id: found.id, role: found.role, email: found.email, name: found.name, tenantId: found.tenantId };
    setUser(cu);
    setCurrentUser(cu);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setThemeState(next);
    setTheme(next);
  };

  const impersonate = (tenantId: string) => {
    const cu: CurrentUser = { id: user?.id || '1', role: 'tenant_admin', email: user?.email || '', name: user?.name || '', tenantId };
    setUser(cu);
    setCurrentUser(cu);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, theme, toggleTheme, impersonate }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
