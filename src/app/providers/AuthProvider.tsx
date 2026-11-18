import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@shared/types';
import { api, getToken, setToken } from '@/services/api';

interface AuthApi {
  user: User | null;
  ready: boolean;
  login: (body: { phone?: string; email?: string; password: string }) => Promise<User>;
  register: (body: { phone: string; email: string; fullName: string; password: string; confirmPassword: string }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthApi | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) { setReady(true); return; }
    api.me()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setReady(true));
  }, []);

  const login = useCallback<AuthApi['login']>(async (body) => {
    const r = await api.login(body);
    setToken(r.token);
    setUser(r.user);
    return r.user;
  }, []);

  const register = useCallback<AuthApi['register']>(async (body) => {
    const r = await api.register(body);
    setToken(r.token);
    setUser(r.user);
    return r.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, ready, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthApi {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
