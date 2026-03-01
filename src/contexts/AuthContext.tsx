import { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../lib/api';

export interface AppUser {
  id: string;
  email: string;
  username?: string;
  created_at?: string;
  last_sign_in_at?: string;
}

interface AuthContextType {
  user: AppUser | null;
  session: { token: string } | null;
  loading: boolean;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<{ token: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMe().then((data) => {
      if (data?.user) {
        const token = api.getToken();
        if (token) {
          setUser(data.user);
          setSession({ token });
        }
      }
      setLoading(false);
    });
  }, []);

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      await api.register(email, password, username);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Registration failed') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.login(email, password);
      api.setToken(data.token);
      setUser(data.user);
      setSession({ token: data.token });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Login failed') };
    }
  };

  const signOut = async () => {
    api.clearToken();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
