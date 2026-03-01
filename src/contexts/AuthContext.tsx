import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'teacher' | 'developer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subscription: 'free' | 'pro';
  avatar?: string;
  firstLogin: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS_KEY = 'flowductive_users';
const CURRENT_USER_KEY = 'flowductive_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user]);

  const getUsers = (): User[] => {
    const stored = localStorage.getItem(MOCK_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  };

  const register = async (name: string, email: string, _password: string, role: UserRole) => {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      role,
      subscription: 'free',
      firstLogin: true,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    setUser(newUser);
    return { success: true, message: `Welcome, ${name}!` };
  };

  const login = async (email: string, _password: string) => {
    const users = getUsers();
    const found = users.find(u => u.email === email);
    if (!found) return { success: false, message: 'Invalid credentials' };
    const isFirst = found.firstLogin;
    const updated = { ...found, firstLogin: false };
    const newUsers = users.map(u => u.id === found.id ? updated : u);
    saveUsers(newUsers);
    setUser(updated);
    return { success: true, message: isFirst ? `Welcome, ${found.name}!` : `Welcome back, ${found.name}!` };
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    const users = getUsers();
    const newUsers = users.map(u => u.id === user.id ? updated : u);
    saveUsers(newUsers);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
