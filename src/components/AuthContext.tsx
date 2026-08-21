"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  apiLogin,
  apiLogout,
  apiRegister,
  type AuthUser,
} from "@/lib/authApi";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;

  authHydrated: boolean;
  authLoading: boolean;
  authError: string;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    firstName: string,
    lastName: string,
    email: string,
    mobileNumber: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  clearAuthError: () => void;
};

const AuthContext =
  createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "ps_auth_token";
const USER_KEY = "ps_auth_user";

// ============================================================
// JWT PAYLOAD
// ============================================================

function getJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    // JWT uses base64url, not normal base64.
    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    return JSON.parse(atob(padded));
  } catch (error) {
    console.error("Unable to decode JWT:", error);
    return null;
  }
}

// ============================================================
// JWT EXPIRATION
// ============================================================

function isTokenExpired(token: string): boolean {
  const payload = getJwtPayload(token);

  if (!payload?.exp) {
    console.error("JWT does not contain exp.");
    return true;
  }

  return payload.exp * 1000 <= Date.now();
}

// ============================================================
// TOKEN REMAINING TIME
// ============================================================

function getTokenRemainingTime(token: string): number {
  const payload = getJwtPayload(token);

  if (!payload?.exp) {
    return 0;
  }

  return Math.max(
    0,
    payload.exp * 1000 - Date.now()
  );
}

// ============================================================
// PROVIDER
// ============================================================

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [authHydrated, setAuthHydrated] =
    useState(false);

  const [authLoading, setAuthLoading] =
    useState(false);

  const [authError, setAuthError] =
    useState("");

  // ==========================================================
  // CLEAR AUTH
  // ==========================================================

  const clear = useCallback(() => {
    console.log("AUTH: clearing authentication");

    setUser(null);
    setToken(null);

    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      // Remove old keys too
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
    } catch (error) {
      console.error(
        "Unable to clear authentication:",
        error
      );
    }
  }, []);

  // ==========================================================
  // PERSIST LOGIN
  // ==========================================================

  const persist = useCallback(
    (authenticatedUser: AuthUser, authenticatedToken: string) => {
      console.log("AUTH: saving login");

      try {
        localStorage.setItem(
          TOKEN_KEY,
          authenticatedToken
        );

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(authenticatedUser)
        );

        console.log(
          "AUTH: token saved:",
          !!localStorage.getItem(TOKEN_KEY)
        );

        console.log(
          "AUTH: user saved:",
          !!localStorage.getItem(USER_KEY)
        );
      } catch (error) {
        console.error(
          "Unable to persist authentication:",
          error
        );
      }

      setUser(authenticatedUser);
      setToken(authenticatedToken);

      // Login is now hydrated
      setAuthHydrated(true);
    },
    []
  );

  // ==========================================================
  // REHYDRATE AUTH FROM LOCAL STORAGE
  // ==========================================================

  useEffect(() => {
    console.log("AUTH: hydration started");

    try {
      const storedToken =
        localStorage.getItem(TOKEN_KEY);

      const storedUser =
        localStorage.getItem(USER_KEY);

      console.log(
        "AUTH: stored token exists:",
        !!storedToken
      );

      console.log(
        "AUTH: stored user exists:",
        !!storedUser
      );

      // ------------------------------------------------------
      // NO SAVED AUTH
      // ------------------------------------------------------

      if (!storedToken || !storedUser) {
        console.log(
          "AUTH: no saved authentication"
        );

        setUser(null);
        setToken(null);

        setAuthHydrated(true);

        return;
      }

      // ------------------------------------------------------
      // CHECK TOKEN
      // ------------------------------------------------------

      if (isTokenExpired(storedToken)) {
        console.log(
          "AUTH: saved token is expired"
        );

        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        setUser(null);
        setToken(null);

        setAuthHydrated(true);

        return;
      }

      // ------------------------------------------------------
      // RESTORE USER
      // ------------------------------------------------------

      const parsedUser =
        JSON.parse(storedUser) as AuthUser;

      console.log(
        "AUTH: restoring saved user:",
        parsedUser
      );

      setToken(storedToken);
      setUser(parsedUser);

      setAuthHydrated(true);

      console.log(
        "AUTH: hydration completed successfully"
      );
    } catch (error) {
      console.error(
        "AUTH: hydration failed:",
        error
      );

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      setUser(null);
      setToken(null);

      // VERY IMPORTANT
      // Even if parsing fails, hydration must finish.
      setAuthHydrated(true);
    }
  }, []);

  // ==========================================================
  // TOKEN EXPIRATION TIMER
  // ==========================================================

  useEffect(() => {
    if (!authHydrated || !token) {
      return;
    }

    console.log(
      "AUTH: starting token expiration timer"
    );

    if (isTokenExpired(token)) {
      console.log(
        "AUTH: token already expired"
      );

      clear();

      router.replace("/");

      return;
    }

    const remainingTime =
      getTokenRemainingTime(token);

    if (remainingTime <= 0) {
      clear();

      router.replace("/");

      return;
    }

    console.log(
      "AUTH: token remaining:",
      Math.round(remainingTime / 1000),
      "seconds"
    );

    const timer = window.setTimeout(() => {
      console.log(
        "AUTH: token expired"
      );

      clear();

      router.replace("/");
    }, remainingTime);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    authHydrated,
    token,
    clear,
    router,
  ]);

  // ==========================================================
  // LOGIN
  // ==========================================================

  const login = useCallback(
    async (
      email: string,
      password: string
    ) => {
      console.log(
        "AUTH: login started"
      );

      setAuthLoading(true);
      setAuthError("");

      try {
        const result =
          await apiLogin(
            email,
            password
          );

        console.log(
          "AUTH: login API successful"
        );

        console.log(
          "AUTH: received user:",
          result.user
        );

        console.log(
          "AUTH: received token:",
          !!result.token
        );

        persist(
          result.user,
          result.token
        );
      } catch (error) {
        console.error(
          "AUTH: login failed:",
          error
        );

        setAuthError(
          error instanceof Error
            ? error.message
            : "Login failed."
        );

        throw error;
      } finally {
        setAuthLoading(false);
      }
    },
    [persist]
  );

  // ==========================================================
  // REGISTER
  // ==========================================================

  const register = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      mobileNumber: string,
      password: string
    ) => {
      console.log(
        "AUTH: registration started"
      );

      setAuthLoading(true);
      setAuthError("");

      try {
        const result =
          await apiRegister(
            firstName,
            lastName,
            email,
            mobileNumber,
            password
          );

        console.log(
          "AUTH: registration successful"
        );

        persist(
          result.user,
          result.token
        );
      } catch (error) {
        console.error(
          "AUTH: registration failed:",
          error
        );

        setAuthError(
          error instanceof Error
            ? error.message
            : "Registration failed."
        );

        throw error;
      } finally {
        setAuthLoading(false);
      }
    },
    [persist]
  );

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = useCallback(
    async () => {
      console.log(
        "AUTH: logout started"
      );

      const currentToken = token;

      if (currentToken) {
        try {
          await apiLogout(
            currentToken
          );
        } catch (error) {
          console.warn(
            "AUTH: backend logout failed",
            error
          );
        }
      }

      clear();

      setAuthHydrated(true);

      router.replace("/");
    },
    [token, clear, router]
  );

  // ==========================================================
  // CLEAR AUTH ERROR
  // ==========================================================

  const clearAuthError =
    useCallback(() => {
      setAuthError("");
    }, []);

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value =
    useMemo<AuthContextValue>(
      () => ({
        user,
        token,
        authHydrated,
        authLoading,
        authError,
        login,
        register,
        logout,
        clearAuthError,
      }),
      [
        user,
        token,
        authHydrated,
        authLoading,
        authError,
        login,
        register,
        logout,
        clearAuthError,
      ]
    );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// USE AUTH
// ============================================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}