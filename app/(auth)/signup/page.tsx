"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/AuthProvider";
import { BrandWordmark } from "@/components/brand/BrandWordmark";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, isAuthenticated, isDevMock, authMode } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationNeeded, setConfirmationNeeded] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/app");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validations
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const result = await signUp({
      email: email.trim(),
      password,
      fullName: fullName.trim(),
    });
    setIsSubmitting(false);

    if (result.success) {
      if (result.requiresConfirmation) {
        setConfirmationNeeded(true);
      } else {
        router.replace("/app");
      }
    } else {
      setError(result.error || "Registration failed. Please check your details and try again.");
    }
  };

  return (
    <Card className="w-full shadow-lg border-border">
      <CardHeader className="text-center pb-4">
        <BrandWordmark className="mx-auto mb-3 block text-4xl text-foreground" />
        <CardTitle className="text-xl sm:text-2xl font-bold">Create Account</CardTitle>
        <CardDescription className="text-xs">
          Get started with Flurit customer retention intelligence
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {confirmationNeeded ? (
          <div className="space-y-4 py-2 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Verify your email address</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                We sent a confirmation link to <strong className="text-foreground">{email}</strong>. Please check your inbox and click the link to activate your workspace.
              </p>
            </div>
            <div className="pt-3">
              <Link href="/login">
                <Button variant="primary" className="w-full justify-center">
                  Proceed to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {authMode === "unconfigured" && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-semibold block">Registration Unconfigured</span>
                  <span>Supabase credentials are missing in production. Account creation is disabled.</span>
                </div>
              </div>
            )}

            {isDevMock && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-semibold block">Development Preview Mode</span>
                  <span>Registration is simulated with local development mock adapter.</span>
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="block text-xs font-semibold text-foreground">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-semibold text-foreground">
                  Work Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-foreground">
                  Password (min 8 characters)
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-foreground">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <Button type="submit" variant="primary" className="w-full justify-center gap-2 mt-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>Creating workspace account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <Link href="/login" className="hover:text-foreground font-medium text-primary">
                Already have an account? Sign In
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                <span>Home</span>
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
