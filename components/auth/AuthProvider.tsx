"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthSession, AuthUser } from "@/lib/auth/types";
import { getAuthAdapter, initializeAuthForApiClient } from "@/lib/auth/session";
import { getAuthMode } from "@/lib/auth/config";

interface AuthContextValue {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authMode: "supabase" | "development-mock" | "unconfigured";
  isDevMock: boolean;
  error: string | null;
  signIn: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  signInAsDemo: () => Promise<{ success: boolean }>;
  signUp: (credentials: {
    email: string;
    password: string;
    fullName?: string;
  }) => Promise<{ success: boolean; requiresConfirmation?: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const DEMO_USER: AuthUser = {
  id: "demo-analyst-flurit-001",
  email: "demo@flurit.com",
  created_at: "2026-01-01T00:00:00.000Z",
  user_metadata: {
    full_name: "Demo Analyst",
  },
};

const DEMO_SESSION: AuthSession = {
  access_token: "mock-development-bearer-token-hs256",
  token_type: "Bearer",
  expires_in: 86400 * 7,
  user: DEMO_USER,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authMode = getAuthMode();
  const isDevMock = authMode === "development-mock";

  const [session, setSession] = useState<AuthSession | null>(() => {
    if (isDevMock) {
      return {
        access_token: "mock-development-bearer-token-hs256",
        token_type: "Bearer",
        expires_in: 3600,
        user: {
          id: "dev-test-user-uuid-0001",
          email: "dev@flurit.local",
          created_at: new Date().toISOString(),
          user_metadata: {
            full_name: "Development Engineer",
          },
        },
      };
    }
    return null;
  });
  const [user, setUser] = useState<AuthUser | null>(() => (isDevMock ? session?.user ?? null : null));
  const [isLoading, setIsLoading] = useState(!isDevMock);
  const [error, setError] = useState<string | null>(null);

  // Initialize and listen to auth changes
  useEffect(() => {
    let isMounted = true;
    initializeAuthForApiClient();

    // In dev mock mode, initial state is already set synchronously
    if (isDevMock) {
      return;
    }

    const adapter = getAuthAdapter();

    adapter
      .getSession()
      .then((initialSession) => {
        if (!isMounted) return;
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user ?? null);
          setIsLoading(false);
          return;
        }

        // Check if demo session is stored in localStorage
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("flurit-demo-session");
            if (raw) {
              const demo = JSON.parse(raw);
              setSession(demo);
              setUser(demo.user ?? null);
              setIsLoading(false);
              return;
            }
          } catch {
            // ignore
          }
        }

        setSession(null);
        setUser(null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("Error restoring session:", err);
        setIsLoading(false);
      });

    let unsubscribe: (() => void) | undefined;
    if (adapter.onAuthStateChange) {
      unsubscribe = adapter.onAuthStateChange((newSession) => {
        if (!isMounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);
      });
    }

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [isDevMock]);

  const signInAsDemo = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("flurit-demo-session", JSON.stringify(DEMO_SESSION));
      }
      setSession(DEMO_SESSION);
      setUser(DEMO_SESSION.user);
      setIsLoading(false);
      return { success: true };
    } catch {
      setIsLoading(false);
      return { success: false, error: "Failed to initialize demo session" };
    }
  }, []);

  const signIn = useCallback(
    async (credentials: { email: string; password: string }) => {
      setError(null);
      setIsLoading(true);

      // Support seamless demo sign-in via the email form
      if (credentials.email.trim().toLowerCase() === "demo@flurit.com") {
        if (typeof window !== "undefined") {
          localStorage.setItem("flurit-demo-session", JSON.stringify(DEMO_SESSION));
        }
        setSession(DEMO_SESSION);
        setUser(DEMO_SESSION.user);
        setIsLoading(false);
        return { success: true };
      }

      try {
        const adapter = getAuthAdapter();
        if (!adapter.signIn) {
          throw new Error("Sign in not supported by the active auth adapter");
        }
        const result = await adapter.signIn(credentials);
        if (result.error) {
          setError(result.error.message);
          setIsLoading(false);
          return { success: false, error: result.error.message };
        }
        setSession(result.session);
        setUser(result.session?.user ?? null);
        setIsLoading(false);
        return { success: true };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Authentication failed";
        setError(msg);
        setIsLoading(false);
        return { success: false, error: msg };
      }
    },
    []
  );

  const signUp = useCallback(
    async (credentials: { email: string; password: string; fullName?: string }) => {
      setError(null);
      setIsLoading(true);
      try {
        const adapter = getAuthAdapter();
        if (!adapter.signUp) {
          throw new Error("Sign up not supported by the active auth adapter");
        }
        const result = await adapter.signUp(credentials);
        if (result.error) {
          setError(result.error.message);
          setIsLoading(false);
          return { success: false, error: result.error.message };
        }
        setIsLoading(false);
        return {
          success: true,
          requiresConfirmation: result.requiresConfirmation,
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Registration failed";
        setError(msg);
        setIsLoading(false);
        return { success: false, error: msg };
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("flurit-demo-session");
      }
      const adapter = getAuthAdapter();
      await adapter.signOut();
      setSession(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value: AuthContextValue = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session?.access_token,
    authMode,
    isDevMock,
    error,
    signIn,
    signInAsDemo,
    signUp,
    signOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
