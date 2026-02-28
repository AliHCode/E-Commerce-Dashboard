import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id?: number;
  email: string;
  name: string;
  role?: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_URL || '';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const requestOpts = (body: any) => ({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/register`, requestOpts({ name, email, password }));
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    // Auto-login after register
    await login(email, password);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/login`, requestOpts({ email, password }));
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    const userData: User = { ...data.user, avatar: '' };
    setUser(userData);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);
  };

  const updateProfile = async (name: string, email: string) => {
    const res = await fetch(`${API_BASE}/api/users/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name, email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Profile update failed');
    const updatedUser: User = { ...data.user, avatar: '' };
    setUser(updatedUser);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("token", data.token);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const res = await fetch(`${API_BASE}/api/users/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Password change failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{
      user, login, register, updateProfile, changePassword, logout,
      isAuthenticated: !!token, token
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
