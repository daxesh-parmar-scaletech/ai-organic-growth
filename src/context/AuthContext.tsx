import { createContext, useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { checkLogin, getAuthData, removeAuthData, setAuthData } from '@/services/auth.service';

interface AuthUser {
  name: string;
  email: string;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  signIn: () => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const MOCK_USER: AuthUser = { name: 'Admin', email: 'admin@gmail.com' };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(checkLogin);
  const [user, setUser] = useState<AuthUser | null>(() => getAuthData()?.user ?? null);

  const signIn = useCallback(() => {
    setAuthData({ accessToken: 'mock-access-token', user: MOCK_USER });
    setUser(MOCK_USER);
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(() => {
    removeAuthData();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, user, signIn, signOut }),
    [isAuthenticated, user, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
