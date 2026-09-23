"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

const normalizeRole = (value) => {
  const role = Array.isArray(value) ? value : [value];
  const normalized = role
    .filter(Boolean)
    .map((item) => String(item).trim().toLowerCase())
    .flatMap((item) => (item.includes(",") ? item.split(",") : [item]));

  if (normalized.includes("admin") || normalized.includes("administrator")) return "admin";
  if (normalized.includes("customer") || normalized.includes("user") || normalized.includes("client")) return "customer";
  if (normalized.includes("worker")) return "customer";
  return normalized[0] || "";
};

const normalizeWorkerProfile = (source) => {
  if (!source || typeof source !== "object") return null;
  return (
    source.workerProfile ||
    source.worker ||
    source.workerProfileData ||
    source.worker_data ||
    null
  );
};

const normalizeUser = (input) => {
  const raw = input?.user || input?.data?.user || input?.data?.data?.user || input || {};
  const role = normalizeRole(raw.role || raw.userRole || raw.type || raw.roles || raw.roleName);
  const workerProfile = normalizeWorkerProfile(raw);

  const nextUser = { ...raw };
  if (role) nextUser.role = role;
  if (workerProfile) nextUser.workerProfile = workerProfile;
  if (raw?.workerProfile && !nextUser.workerProfile) nextUser.workerProfile = raw.workerProfile;

  return Object.keys(nextUser).length ? nextUser : null;
};

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
      const response = await api.me();
      const nextUser = normalizeUser(response);
      setUser(nextUser || null);
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

  const login = async (token, userObj) => {
    localStorage.setItem("sh_token", token);
    const normalizedFromLogin = normalizeUser(userObj);
    setUser(normalizedFromLogin || null);

    try {
      const fresh = await api.me();
      const normalizedFresh = normalizeUser(fresh);
      if (normalizedFresh) setUser(normalizedFresh);
      return normalizedFresh || normalizedFromLogin;
    } catch {
      return normalizedFromLogin;
    }
  };

  const logout = () => {
    localStorage.removeItem("sh_token");
    setUser(null);
  };

  const workerProfile = normalizeWorkerProfile(user) || null;
  const isAdmin = user?.role === "admin" || user?.role === "ADMIN";
  const isApprovedWorker = user?.role === "customer" && workerProfile?.status === "approved";
  const isWorkerPending =
    user?.role === "customer" &&
    String(workerProfile?.status || "").toLowerCase() === "pending";

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        workerProfile,
        loading,
        login,
        logout,
        refresh,
        isWorker: isApprovedWorker,
        isWorkerPending,
        isAdmin,
        isApprovedWorker,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
