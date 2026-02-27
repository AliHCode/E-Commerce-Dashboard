import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  email: string;
  name: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for persisted session
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
    const res = await fetch('/api/register', requestOpts({ name, email, password }));
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    // Once registered, immediately log them in
    await login(email, password);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/login', requestOpts({ email, password }));
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Login failed');

    // Use a deterministic UI avatar service based on the retrieved name
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name)}&background=random&color=fff&size=100`;

    const newUser = {
      ...data.user,
      avatar: avatarUrl,
    };

    setUser(newUser);
    setToken(data.token);

    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
