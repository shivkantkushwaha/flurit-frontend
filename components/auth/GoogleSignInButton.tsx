
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/auth/supabase";

function GoogleLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
        transform="translate(0 4)"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 38.06 46.98 31.89 46.98 24.55Z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.94 23.94 0 0 0 0 21.56l7.98-6.19Z"
        transform="translate(0 -4)"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
        transform="translate(0 -4)"
      />
    </svg>
  );
}

export function GoogleSignInButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function signIn() {
    if (pending) return;

    setPending(true);
    setError(false);

    try {
      const client = getSupabaseClient();

      if (!client) throw new Error("Supabase is unavailable");

      const result = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: new URL("/login", window.location.origin).href,
        },
      });

      if (result.error) throw result.error;
    } catch {
      setError(true);
      setPending(false);
    }
  }

  return (
    <>
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          className="relative w-full justify-center gap-3"
          onClick={signIn}
          disabled={pending}
        >
          <GoogleLogo />
          {pending ? "Opening Google…" : "Continue with Google"}
        </Button>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            Google sign-in is unavailable. Try again or use your email.
          </p>
        )}
      </div>

      <AnimatePresence>
        {pending && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/75 p-5 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            aria-live="polite"
            role="status"
          >
            {/* Ambient background glow */}
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(99,102,241,0.13), rgba(139,92,246,0.06) 45%, transparent 70%)",
                filter: "blur(35px)",
              }}
              animate={{
                scale: [0.9, 1.12, 0.9],
                opacity: [0.5, 0.9, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Authentication card */}
            <motion.div
              className="relative w-full max-w-[360px] overflow-hidden rounded-2xl border border-border/70 bg-card/95 p-8 text-center shadow-2xl backdrop-blur-2xl"
              initial={{ opacity: 0, y: 22, scale: 0.94, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background shadow-sm">
                <GoogleLogo className="h-8 w-8" />

                <motion.div
                  className="absolute -inset-2 rounded-[22px] border border-indigo-400/40"
                  animate={{
                    scale: [1, 1.2, 1.2],
                    opacity: [0.7, 0, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                <h2 className="text-lg font-semibold tracking-tight">
                  Connecting to Google
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Securely preparing your authentication. You'll be redirected
                  shortly.
                </p>
              </motion.div>

              {/* Animated progress indicator */}
              <div className="mx-auto mt-7 h-1 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full w-1/3 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"
                  animate={{ x: ["-110%", "310%"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              <p className="mt-5 text-[11px] font-medium tracking-[0.16em] text-muted-foreground/70">
                SECURE AUTHENTICATION
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
