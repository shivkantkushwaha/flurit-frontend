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
  signUp: (credentials: {
    email: string;
    password: string;
    fullName?: string;
  }) => Promise<{ success: boolean; requiresConfirmation?: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

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
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
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

  const signIn = useCallback(
    async (credentials: { email: string; password: string }) => {
      setError(null);
      setIsLoading(true);
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
