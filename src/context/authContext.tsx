"use client";

import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  loggedIn: boolean;
  login: () => void;
  localLogin: () => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  token?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);

  const login = () => {
    setLoggedIn(true);
  };

  const localLogin = () => {
    setLoggedIn(true);
  };

  const logout = () => {
    setLoggedIn(false);
  };

  const hasRole = (role: string) => {
    return true; // Simplified for questionnaire-only app
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        login,
        localLogin,
        logout,
        hasRole,
        token: undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}