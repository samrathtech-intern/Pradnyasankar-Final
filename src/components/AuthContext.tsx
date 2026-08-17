"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiLogin, apiLogout, apiRegister, type AuthUser } from "@/lib/authApi";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  authLoading: boolean;
  authError: string;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, mobile: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "ps_auth_token";
const USER_KEY = "ps_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Rehydrate session from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {}
  }, []);

  function persist(u: AuthUser, t: string) {
    setUser(u);
    setToken(t);
    try {
      localStorage.setItem(TOKEN_KEY, t);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } catch {}
  }

  function clear() {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
  }

  const login = useCallback(async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const { user: u, token: t } = await apiLogin(email, password);
      persist(u, t);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Login failed.");
      throw err;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, mobile: string, password: string) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const { user: u, token: t } = await apiRegister(name, email, mobile, password);
      persist(u, t);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Registration failed.");
      throw err;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try { await apiLogout(token); } catch {}
    }
    clear();
  }, [token]);

  const clearAuthError = useCallback(() => setAuthError(""), []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, authLoading, authError, login, register, logout, clearAuthError }),
    [user, token, authLoading, authError, login, register, logout, clearAuthError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
