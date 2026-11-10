import { MockAuthAdapter } from "@/lib/auth/mock-adapter";
import { SupabaseAuthAdapter } from "@/lib/auth/supabase-adapter";
import { getAuthMode } from "@/lib/auth/config";

describe("Phase F4: Supabase Auth & Security Boundary Verification", () => {
  describe("Auth Mode Detection (getAuthMode)", () => {
    it("returns 'supabase' when both supabaseUrl and supabaseAnonKey are provided", () => {
      const mode = getAuthMode({
        supabaseUrl: "https://mnxliofkpmhpsvoechlk.supabase.co",
        supabaseKey: "test-anon-key-12345",
        isProduction: true,
      });
      expect(mode).toBe("supabase");
    });

    it("fails closed and returns 'unconfigured' in production when Supabase keys are missing", () => {
      const mode = getAuthMode({
        supabaseUrl: "",
        supabaseKey: "",
        isProduction: true,
      });
      expect(mode).toBe("unconfigured");
    });

    it("returns 'development-mock' in development/test when Supabase keys are missing", () => {
      const mode = getAuthMode({
        supabaseUrl: "",
        supabaseKey: "",
        isProduction: false,
      });
      expect(mode).toBe("development-mock");
    });
  });

  describe("MockAuthAdapter Security Boundary", () => {
    it("provides deterministic token and user in development mode", async () => {
      const adapter = new MockAuthAdapter({ isProduction: false });
      const token = await adapter.getAccessToken();
      const session = await adapter.getSession();
      const user = await adapter.getUser();

      expect(token).toBe("mock-development-bearer-token-hs256");
      expect(session?.access_token).toBe(token);
      expect(user?.email).toBe("dev@flurit.local");
    });

    it("strictly fails closed and throws Security Violation error in production mode", async () => {
      const adapter = new MockAuthAdapter({ isProduction: true });
      await expect(adapter.getAccessToken()).rejects.toThrow(/Security Violation/i);
      await expect(adapter.getSession()).rejects.toThrow(/Security Violation/i);
      await expect(adapter.getUser()).rejects.toThrow(/Security Violation/i);
    });

    it("supports signIn and signUp in test environment", async () => {
      const adapter = new MockAuthAdapter({ isProduction: false });
      const signInResult = await adapter.signIn({ email: "test@example.com", password: "password123" });
      expect(signInResult.error).toBeNull();
      expect(signInResult.session?.access_token).toBeDefined();

      const signUpResult = await adapter.signUp({ email: "new@example.com", password: "password123", fullName: "New User" });
      expect(signUpResult.error).toBeNull();
      expect(signUpResult.user?.id).toBeDefined();
    });
  });

  describe("SupabaseAuthAdapter Error Handling", () => {
    it("handles missing client gracefully without crashing", async () => {
      const adapter = new SupabaseAuthAdapter();
      // Without credentials set in test environment, getAccessToken returns null
      const token = await adapter.getAccessToken();
      expect(token).toBeNull();

      const session = await adapter.getSession();
      expect(session).toBeNull();
    });
  });
});
