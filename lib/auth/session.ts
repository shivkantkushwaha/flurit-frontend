import { AuthAdapter } from "./types";
import { getAuthMode } from "./config";
import { MockAuthAdapter } from "./mock-adapter";
import { SupabaseAuthAdapter } from "./supabase-adapter";
import { apiClient } from "@/lib/api/client";

let activeAuthAdapter: AuthAdapter | null = null;

/**
 * Returns the configured auth adapter based on environment configuration.
 * Fails closed in production if Supabase credentials are not provided.
 */
export function getAuthAdapter(): AuthAdapter {
  if (activeAuthAdapter) {
    return activeAuthAdapter;
  }

  const mode = getAuthMode();

  switch (mode) {
    case "supabase":
      activeAuthAdapter = new SupabaseAuthAdapter();
      return activeAuthAdapter;

    case "development-mock":
      activeAuthAdapter = new MockAuthAdapter();
      return activeAuthAdapter;

    case "unconfigured":
    default:
      // Fail closed: return a no-op adapter that never provides tokens in production
      return {
        async getAccessToken() {
          return null;
        },
        async getSession() {
          return null;
        },
        async getUser() {
          return null;
        },
        async signOut() {
          /* no-op */
        },
      };
  }
}

/**
 * Resets the cached adapter (useful for testing mode switches).
 */
export function resetAuthAdapter(): void {
  activeAuthAdapter = null;
}

/**
 * Connects the active auth adapter's getAccessToken method to the ApiClient.
 */
export function initializeAuthForApiClient(): void {
  const adapter = getAuthAdapter();
  apiClient.setTokenProvider(async () => {
    return adapter.getAccessToken();
  });
}
