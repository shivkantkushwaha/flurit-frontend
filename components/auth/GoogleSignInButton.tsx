"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/auth/supabase";

export function GoogleSignInButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function signIn() {
    setPending(true);
    setError(false);
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error("Supabase is unavailable");
      const result = await client.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: new URL("/login", window.location.origin).href },
      });
      if (result.error) throw result.error;
    } catch {
      setError(true);
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" className="w-full justify-center" onClick={signIn} disabled={pending}>
        {pending ? "Opening Google…" : "Continue with Google"}
      </Button>
      {error && <p role="alert" className="text-sm text-destructive">Google sign-in is unavailable. Try again or use your email.</p>}
    </div>
  );
}
