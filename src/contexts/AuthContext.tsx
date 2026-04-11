import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrentUser, UserRole } from '@/lib/types';
import { getSession, setSession, clearSession, getUsers, getTheme, setTheme, getTenants } from '@/lib/storage';
import { seedData } from '@/lib/seed';

interface AuthContextType {
  user: CurrentUser | null;
  login: (email: string, password: string, context?: { type: 'superadmin' | 'tenant' | 'subscriber'; slug?: string }) => { success: boolean; error?: string; redirectTo?: string };
  logout: (context?: { type: 'superadmin' | 'tenant' | 'subscriber'; slug?: string }) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  impersonate: (tenantId: string) => void;
  getSessionForContext: (type: 'superadmin' | 'tenant' | 'subscriber', slug?: string) => CurrentUser | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

function detectContext(): { type: 'superadmin' | 'tenant' | 'subscriber'; slug?: string } {
  const path = window.location.pathname;
  if (path.startsWith('/superadmin')) return { type: 'superadmin' };
  if (path === '/login') return { type: 'superadmin' };

  // Extract slug from /:slug/admin or /:slug/minha-conta or /:slug/login
  const match = path.match(/^\/([^/]+)\/(admin|minha-conta|login|assinar)/);
  if (match) {
    const slug = match[1];
    const section = match[2];
    if (section === 'admin' || section === 'login') return { type: 'tenant', slug };
    if (section === 'minha-conta' || section === 'assinar') return { type: 'subscriber', slug };
  }

  return { type: 'superadmin' };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [themeState, setThemeState] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    seedData();
    const t = getTheme();
    setThemeState(t);
    document.documentElement.classList.toggle('dark', t === 'dark');

    // Load session for current context
    const ctx = detectContext();
    const session = getSession(ctx.type, ctx.slug);
    if (session) setUser(session);
  }, []);

  // Re-detect session on route changes
  useEffect(() => {
    const handlePopState = () => {
      const ctx = detectContext();
      const session = getSession(ctx.type, ctx.slug);
      setUser(session);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const login = (email: string, password: string, context?: { type: 'superadmin' | 'tenant' | 'subscriber'; slug?: string }) => {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'E-mail ou senha inválidos' };

    const ctx = context || detectContext();

    // Enforce login isolation per context
    if (ctx.type === 'superadmin' && found.role !== 'superadmin') {
      return { success: false, error: 'Usuário não autorizado para este painel' };
    }
    if (ctx.type === 'tenant') {
      if (found.role === 'superadmin') {
        // superadmin can impersonate tenant login — allow
      } else if (found.role !== 'tenant_admin' && found.role !== 'subscriber') {
        return { success: false, error: 'Usuário não autorizado para este portal' };
      } else {
        // Check tenant membership
        const tenants = getTenants();
        const tenant = tenants.find(t => t.dominio?.slug === ctx.slug || t.id === ctx.slug);
        if (!tenant || found.tenantId !== tenant.id) {
          return { success: false, error: 'Usuário não pertence a este portal' };
        }
      }
    }
    if (ctx.type === 'subscriber') {
      if (found.role !== 'subscriber') {
        return { success: false, error: 'Usuário não autorizado' };
      }
      const tenants = getTenants();
      const tenant = tenants.find(t => t.dominio?.slug === ctx.slug || t.id === ctx.slug);
      if (!tenant || found.tenantId !== tenant.id) {
        return { success: false, error: 'Usuário não pertence a este portal' };
      }
    }

    const cu: CurrentUser = { id: found.id, role: found.role, email: found.email, name: found.name, tenantId: found.tenantId, profileId: found.profileId };

    // Determine redirect
    let redirectTo = '/superadmin';

    if (found.role === 'superadmin') {
      setSession('superadmin', cu);
      redirectTo = '/superadmin';
    } else if (found.role === 'tenant_admin' && found.tenantId) {
      const tenants = getTenants();
      const tenant = tenants.find(t => t.id === found.tenantId);
      const slug = ctx.slug || tenant?.dominio?.slug || found.tenantId;
      setSession('tenant', cu, slug);
      redirectTo = `/${slug}/admin`;
    } else if (found.role === 'subscriber' && found.tenantId) {
      const tenants = getTenants();
      const tenant = tenants.find(t => t.id === found.tenantId);
      const slug = ctx.slug || tenant?.dominio?.slug || found.tenantId;
      setSession('subscriber', cu, slug);
      redirectTo = `/${slug}/minha-conta`;
    }

    setUser(cu);
    return { success: true, redirectTo };
  };

  const logout = (context?: { type: 'superadmin' | 'tenant' | 'subscriber'; slug?: string }) => {
    const ctx = context || detectContext();
    clearSession(ctx.type, ctx.slug);
    setUser(null);
  };

  const toggleTheme = () => {
    const next = themeState === 'dark' ? 'light' : 'dark';
    setThemeState(next);
    setTheme(next);
  };

  const impersonate = (tenantId: string) => {
    const tenants = getTenants();
    const tenant = tenants.find(t => t.id === tenantId);
    const slug = tenant?.dominio?.slug || tenantId;
    const cu: CurrentUser = { id: user?.id || '1', role: 'tenant_admin', email: user?.email || '', name: user?.name || '', tenantId };
    setSession('tenant', cu, slug);
    setUser(cu);
  };

  const getSessionForContext = (type: 'superadmin' | 'tenant' | 'subscriber', slug?: string) => {
    return getSession(type, slug);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, theme: themeState, toggleTheme, impersonate, getSessionForContext }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
