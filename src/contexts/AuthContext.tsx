import React, { createContext, useContext, useEffect, useState } from "react";

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
  isHydrating: boolean;
  token: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isHydrating: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_BASE = import.meta.env.VITE_API_URL || "";

function getInitialAuthState(): AuthState {
  try {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      return {
        user: JSON.parse(storedUser),
        token: storedToken,
        isHydrating: true,
      };
    }
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return {
    user: null,
    token: null,
    isHydrating: true,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(getInitialAuthState);
  const { user, token, isHydrating } = authState;

  useEffect(() => {
    setAuthState((prev) => ({ ...prev, isHydrating: false }));
  }, []);

  const requestOpts = (body: unknown) => ({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/register`, requestOpts({ name, email, password }));
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    await login(email, password);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/login`, requestOpts({ email, password }));
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    const userData: User = { ...data.user, avatar: "" };
    setAuthState({ user: userData, token: data.token, isHydrating: false });
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);
  };

  const updateProfile = async (name: string, email: string) => {
    const res = await fetch(`${API_BASE}/api/users/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Profile update failed");

    const updatedUser: User = { ...data.user, avatar: "" };
    setAuthState({ user: updatedUser, token: data.token, isHydrating: false });
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("token", data.token);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const res = await fetch(`${API_BASE}/api/users/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Password change failed");
  };

  const logout = () => {
    setAuthState({ user: null, token: null, isHydrating: false });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        updateProfile,
        changePassword,
        logout,
        isAuthenticated: !!token,
        isHydrating,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
