"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  elo_rating?: number;
  matches_played?: number;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Check token and fetch user on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/users/profile/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("Invalid token");
        })
        .then(data => {
          const userData = { 
            id: data.id.toString(), 
            name: data.username, 
            email: data.email,
            elo_rating: data.elo_rating,
            matches_played: data.matches_played
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
