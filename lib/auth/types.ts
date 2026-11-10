export interface AuthUser {
  id: string;
  email?: string;
  created_at?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}

export interface AuthSession {
  access_token: string;
  token_type: string;
  expires_at?: number;
  expires_in?: number;
  user: AuthUser;
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error?: string | null;
}

export interface AuthAdapter {
  getAccessToken(): Promise<string | null>;
  getSession(): Promise<AuthSession | null>;
  getUser(): Promise<AuthUser | null>;
  signIn?(credentials: { email: string; password: string }): Promise<{ error: Error | null; session: AuthSession | null }>;
  signUp?(credentials: { email: string; password: string; fullName?: string }): Promise<{ error: Error | null; user: AuthUser | null; requiresConfirmation?: boolean }>;
  signOut(): Promise<void>;
  onAuthStateChange?(callback: (session: AuthSession | null) => void): () => void;
}
