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
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
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

const USER_KEY = "user";
const TOKEN_KEY = "token";
const EXPIRY_KEY = "auth_expires_at";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_BASE = import.meta.env.VITE_API_URL || "";

function clearStoredAuth() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

function saveAuthState(user: User, token: string, rememberMe: boolean) {
  clearStoredAuth();

  if (rememberMe) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRY_KEY, String(Date.now() + THIRTY_DAYS_MS));
    return;
  }

  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  sessionStorage.setItem(TOKEN_KEY, token);
}

function getInitialAuthState(): AuthState {
  try {
    const sessionUser = sessionStorage.getItem(USER_KEY);
    const sessionToken = sessionStorage.getItem(TOKEN_KEY);
    if (sessionUser && sessionToken) {
      return {
        user: JSON.parse(sessionUser),
        token: sessionToken,
        isHydrating: true,
      };
    }

    const localUser = localStorage.getItem(USER_KEY);
    const localToken = localStorage.getItem(TOKEN_KEY);
    const expiresAtRaw = localStorage.getItem(EXPIRY_KEY);

    if (localUser && localToken) {
      const expiresAt = expiresAtRaw ? Number(expiresAtRaw) : Date.now() + ONE_DAY_MS;

      if (Number.isFinite(expiresAt) && Date.now() < expiresAt) {
        if (!expiresAtRaw) {
          localStorage.setItem(EXPIRY_KEY, String(expiresAt));
        }

        return {
          user: JSON.parse(localUser),
          token: localToken,
          isHydrating: true,
        };
      }

      clearStoredAuth();
    }
  } catch {
    clearStoredAuth();
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
    await login(email, password, false);
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    const res = await fetch(`${API_BASE}/api/login`, requestOpts({ email, password, rememberMe }));
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    const userData: User = { ...data.user, avatar: "" };
    setAuthState({ user: userData, token: data.token, isHydrating: false });
    saveAuthState(userData, data.token, rememberMe);
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
    const rememberMe = !!localStorage.getItem(TOKEN_KEY);
    setAuthState({ user: updatedUser, token: data.token, isHydrating: false });
    saveAuthState(updatedUser, data.token, rememberMe);
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
    clearStoredAuth();
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
