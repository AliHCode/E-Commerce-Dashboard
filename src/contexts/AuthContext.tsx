import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  email: string;
  name: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage for persisted session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string) => {
    // Generate a capitalized name from the email prefix (e.g., 'john.doe@...' -> 'John Doe')
    const emailPrefix = email.split('@')[0];
    const generatedName = emailPrefix
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    // Use a deterministic UI avatar service based on the generated name
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(generatedName)}&background=random&color=fff&size=100`;

    // Dynamic login
    const newUser = {
      email,
      name: generatedName || "User",
      avatar: avatarUrl,
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
