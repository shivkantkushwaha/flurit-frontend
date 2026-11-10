/** Authentication configuration and mode detection for Flurit frontend. */
export const AUTH_CONFIG = {
  /** Supabase project URL. */
  get supabaseUrl(): string {
    return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  },

  /** Legacy anon key (deprecated). Kept for backward compatibility. */
  get supabaseAnonKey(): string {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  },

  /** Preferred publishable key (new Supabase format). Falls back to the legacy anon key for backward compatibility. */
  get supabaseKey(): string {
    return (
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      ""
    );
  },

  get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  },
};

export type AuthMode = "supabase" | "development-mock" | "unconfigured";

export function getAuthMode(overrides?: {
  supabaseUrl?: string;
  supabaseKey?: string;
  isProduction?: boolean;
}): AuthMode {
  const supabaseUrl =
    overrides?.supabaseUrl !== undefined ? overrides.supabaseUrl : AUTH_CONFIG.supabaseUrl;
  const supabaseKey =
    overrides?.supabaseKey !== undefined ? overrides.supabaseKey : AUTH_CONFIG.supabaseKey;
  const isProduction =
    overrides?.isProduction !== undefined ? overrides.isProduction : AUTH_CONFIG.isProduction;

  // If Supabase public credentials are provided, use Supabase mode
  if (supabaseUrl && supabaseKey) {
    return "supabase";
  }

  // If in production and credentials are missing, fail closed (unconfigured)
  if (isProduction) {
    return "unconfigured";
  }

  // In development and test environments with missing credentials, allow development mock
  return "development-mock";
}
