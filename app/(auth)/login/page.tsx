"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2, ArrowRight, ArrowLeft, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/AuthProvider";
import { BrandWordmark } from "@/components/brand/BrandWordmark";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get("redirect") || "/app";

  const { signIn, isAuthenticated, isDevMock, authMode } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTarget);
    }
  }, [isAuthenticated, redirectTarget, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    const result = await signIn({ email, password });
    setIsSubmitting(false);

    if (result.success) {
      router.replace(redirectTarget);
    } else {
      setError(result.error || "Authentication failed. Please check your credentials.");
    }
  };

  const handleDevPreviewEntry = () => {
    router.replace(redirectTarget);
  };

  return (
    <Card className="w-full shadow-lg border-border">
      <CardHeader className="text-center pb-4">
        <BrandWordmark className="mx-auto mb-3 block text-4xl text-foreground" />
        <CardTitle className="text-xl sm:text-2xl font-bold">Sign In to Flurit</CardTitle>
        <CardDescription className="text-xs">
          Customer churn analysis and retention intelligence platform
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Supabase Status Banner if unconfigured */}
        {authMode === "unconfigured" && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-semibold block">Authentication Unconfigured</span>
              <span>Sign-in is temporarily unavailable. Please contact your workspace administrator.</span>
            </div>
          </div>
        )}

        {isDevMock && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-semibold block">Development Preview Mode</span>
              <span>
                Preview mode is active. Sign-in here does not use a production account.
              </span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Real Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-foreground">
              Work Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-xs font-semibold text-foreground">
                Password
              </label>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <Button type="submit" variant="primary" className="w-full justify-center gap-2 mt-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </form>

        {/* Dev Mode Shortcut */}
        {isDevMock && (
          <div className="pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleDevPreviewEntry}
              className="w-full justify-center text-xs text-muted-foreground hover:text-foreground"
            >
              Enter Workspace with Dev Mock
            </Button>
          </div>
        )}

        {/* Links */}
        <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <Link href="/signup" className="hover:text-foreground font-medium text-primary">
            Create an account
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            <span>Public Website</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
