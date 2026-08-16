"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("sh_token") : null;
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user } = await api.me();
      setUser(user);
    } catch {
      localStorage.removeItem("sh_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = (token, userObj) => {
    localStorage.setItem("sh_token", token);
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem("sh_token");
    setUser(null);
  };

  const roles = user?.roles || [];
  const isWorker =
    roles.includes("WORKER") && user?.workerProfile?.verification?.status === "VERIFIED";
  const isWorkerPending =
    roles.includes("WORKER") && user?.workerProfile?.verification?.status !== "VERIFIED";
  const isAdmin = roles.includes("ADMIN");

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, logout, refresh, isWorker, isWorkerPending, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
