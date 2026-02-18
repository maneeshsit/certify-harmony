import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string, name: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('chs_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, password: string) => {
    if (email === 'admin@chsrate.com' && password === 'admin') {
      const admin = { id: 'admin-1', email, name: 'Administrator', isAdmin: true };
      setUser(admin);
      localStorage.setItem('chs_user', JSON.stringify(admin));
      return true;
    }
    const stored = localStorage.getItem('chs_users');
    const users = stored ? JSON.parse(stored) : [];
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (found) {
      const u = { id: found.id, email: found.email, name: found.name, isAdmin: false };
      setUser(u);
      localStorage.setItem('chs_user', JSON.stringify(u));
      return true;
    }
    return false;
  };

  const signup = (email: string, password: string, name: string) => {
    const stored = localStorage.getItem('chs_users');
    const users = stored ? JSON.parse(stored) : [];
    if (users.find((u: any) => u.email === email)) return false;
    const newUser = { id: crypto.randomUUID(), email, password, name };
    users.push(newUser);
    localStorage.setItem('chs_users', JSON.stringify(users));
    const u = { id: newUser.id, email, name, isAdmin: false };
    setUser(u);
    localStorage.setItem('chs_user', JSON.stringify(u));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chs_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
