import { AuthAdapter, AuthSession, AuthUser } from "./types";
import { AUTH_CONFIG } from "./config";

/**
 * Development & Test Mock Auth Adapter.
 * STABLE INVARIANT: This adapter strictly fails closed in production.
 */
export class MockAuthAdapter implements AuthAdapter {
  private isProductionOverride?: boolean;

  constructor(options?: { isProduction?: boolean }) {
    this.isProductionOverride = options?.isProduction;
  }

  private mockUser: AuthUser = {
    id: "dev-test-user-uuid-0001",
    email: "dev@flurit.local",
    created_at: new Date().toISOString(),
    user_metadata: {
      full_name: "Development Engineer",
    },
  };

  private mockSession: AuthSession = {
    access_token: "mock-development-bearer-token-hs256",
    token_type: "Bearer",
    expires_in: 3600,
    user: this.mockUser,
  };

  private assertNotProduction(): void {
    const isProd = this.isProductionOverride !== undefined ? this.isProductionOverride : AUTH_CONFIG.isProduction;
    if (isProd) {
      throw new Error(
        "Security Violation: MockAuthAdapter is strictly prohibited in production mode. " +
        "Flurit authentication system fails closed when live Supabase credentials are not configured."
      );
    }
  }

  public async getAccessToken(): Promise<string | null> {
    this.assertNotProduction();
    return this.mockSession.access_token;
  }

  public async getSession(): Promise<AuthSession | null> {
    this.assertNotProduction();
    return this.mockSession;
  }

  public async getUser(): Promise<AuthUser | null> {
    this.assertNotProduction();
    return this.mockUser;
  }

  public async signIn(credentials: {
    email: string;
    password: string;
  }): Promise<{ error: Error | null; session: AuthSession | null }> {
    this.assertNotProduction();
    if (!credentials.email || !credentials.password) {
      return { error: new Error("Email and password are required"), session: null };
    }
    return { error: null, session: this.mockSession };
  }

  public async signUp(credentials: {
    email: string;
    password: string;
    fullName?: string;
  }): Promise<{ error: Error | null; user: AuthUser | null; requiresConfirmation?: boolean }> {
    this.assertNotProduction();
    if (!credentials.email || !credentials.password) {
      return { error: new Error("Email and password are required"), user: null };
    }
    return { error: null, user: this.mockUser, requiresConfirmation: false };
  }

  public async signOut(): Promise<void> {
    this.assertNotProduction();
    // No-op in dev mock
  }

  public onAuthStateChange(_callback: (session: AuthSession | null) => void): () => void {
    this.assertNotProduction();
    return () => {};
  }
}
