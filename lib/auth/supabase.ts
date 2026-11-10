import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { AUTH_CONFIG } from "./config";

let supabaseInstance: SupabaseClient | null = null;

/**
 * Returns a singleton instance of the official browser Supabase client.
 * Returns null if Supabase environment variables are missing.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const url = AUTH_CONFIG.supabaseUrl;
  const anonKey = AUTH_CONFIG.supabaseKey;

  if (!url || !anonKey) {
    return null;
  }

  try {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        storageKey: "flurit-supabase-auth-token",
      },
    });
    return supabaseInstance;
  } catch (err) {
    console.error("Failed to initialize Supabase client", err);
    return null;
  }
}
