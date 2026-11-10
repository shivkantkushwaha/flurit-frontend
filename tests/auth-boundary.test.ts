import { MockAuthAdapter } from "@/lib/auth/mock-adapter";
import { getAuthMode } from "@/lib/auth/config";

describe("Authentication Boundary & Fail-Closed Invariants", () => {
  it("MockAuthAdapter succeeds and supplies session in development mode", async () => {
    const adapter = new MockAuthAdapter({ isProduction: false });
    const token = await adapter.getAccessToken();
    const session = await adapter.getSession();
    const user = await adapter.getUser();

    expect(token).toBe("mock-development-bearer-token-hs256");
    expect(session).toBeDefined();
    expect(session?.user.email).toBe("dev@flurit.local");
    expect(user?.id).toBe("dev-test-user-uuid-0001");
  });

  it("MockAuthAdapter strictly fails closed if evaluated in production mode", async () => {
    const adapter = new MockAuthAdapter({ isProduction: true });

    await expect(adapter.getAccessToken()).rejects.toThrow(
      /Security Violation: MockAuthAdapter is strictly prohibited in production mode/
    );
    await expect(adapter.getSession()).rejects.toThrow(
      /Security Violation: MockAuthAdapter is strictly prohibited in production mode/
    );
  });

  it("getAuthMode returns 'development-mock' when credentials are empty in dev/test", () => {
    expect(getAuthMode({ supabaseUrl: "", supabaseKey: "", isProduction: false })).toBe(
      "development-mock"
    );
  });

  it("getAuthMode returns 'supabase' when public credentials are provided", () => {
    expect(
      getAuthMode({
        supabaseUrl: "https://test-ref.supabase.co",
        supabaseKey: "test-anon-key-abc",
        isProduction: true,
      })
    ).toBe("supabase");
  });

  it("getAuthMode returns 'unconfigured' and fails closed when in production without credentials", () => {
    expect(getAuthMode({ supabaseUrl: "", supabaseKey: "", isProduction: true })).toBe(
      "unconfigured"
    );
  });
});
