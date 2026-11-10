import { AuthAdapter, AuthSession, AuthUser } from "./types";
import { getSupabaseClient } from "./supabase";

export class SupabaseAuthAdapter implements AuthAdapter {
  private getClient() {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error(
        "Supabase credentials missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
      );
    }
    return client;
  }

  public async getAccessToken(): Promise<string | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { data, error } = await client.auth.getSession();
      if (error || !data.session) return null;
      return data.session.access_token;
    } catch {
      return null;
    }
  }

  public async getSession(): Promise<AuthSession | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { data, error } = await client.auth.getSession();
      if (error || !data.session) return null;

      const s = data.session;
      return {
        access_token: s.access_token,
        token_type: s.token_type,
        expires_at: s.expires_at,
        expires_in: s.expires_in,
        user: {
          id: s.user.id,
          email: s.user.email,
          created_at: s.user.created_at,
          app_metadata: s.user.app_metadata,
          user_metadata: s.user.user_metadata,
        },
      };
    } catch {
      return null;
    }
  }

  public async getUser(): Promise<AuthUser | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { data, error } = await client.auth.getUser();
      if (error || !data.user) return null;

      const u = data.user;
      return {
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        app_metadata: u.app_metadata,
        user_metadata: u.user_metadata,
      };
    } catch {
      return null;
    }
  }

  public async signIn(credentials: {
    email: string;
    password: string;
  }): Promise<{ error: Error | null; session: AuthSession | null }> {
    const client = this.getClient();
    const { data, error } = await client.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return { error: new Error(error.message), session: null };
    }

    if (!data.session) {
      return { error: new Error("No session returned after sign in"), session: null };
    }

    const s = data.session;
    return {
      error: null,
      session: {
        access_token: s.access_token,
        token_type: s.token_type,
        expires_at: s.expires_at,
        expires_in: s.expires_in,
        user: {
          id: s.user.id,
          email: s.user.email,
          created_at: s.user.created_at,
          app_metadata: s.user.app_metadata,
          user_metadata: s.user.user_metadata,
        },
      },
    };
  }

  public async signUp(credentials: {
    email: string;
    password: string;
    fullName?: string;
  }): Promise<{ error: Error | null; user: AuthUser | null; requiresConfirmation?: boolean }> {
    const client = this.getClient();
    const { data, error } = await client.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName || "",
        },
      },
    });

    if (error) {
      return { error: new Error(error.message), user: null };
    }

    if (!data.user) {
      return { error: new Error("No user returned after sign up"), user: null };
    }

    const requiresConfirmation = !data.session;

    return {
      error: null,
      user: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
        app_metadata: data.user.app_metadata,
        user_metadata: data.user.user_metadata,
      },
      requiresConfirmation,
    };
  }

  public async signOut(): Promise<void> {
    const client = getSupabaseClient();
    if (!client) return;
    await client.auth.signOut();
  }

  public onAuthStateChange(callback: (session: AuthSession | null) => void): () => void {
    const client = getSupabaseClient();
    if (!client) {
      return () => {};
    }

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        callback(null);
        return;
      }

      callback({
        access_token: session.access_token,
        token_type: session.token_type,
        expires_at: session.expires_at,
        expires_in: session.expires_in,
        user: {
          id: session.user.id,
          email: session.user.email,
          created_at: session.user.created_at,
          app_metadata: session.user.app_metadata,
          user_metadata: session.user.user_metadata,
        },
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }
}
