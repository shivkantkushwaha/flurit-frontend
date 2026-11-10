"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";

export default function SettingsPage() {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setError(null);
    try {
      await signOut();
      router.replace("/login");
    } catch {
      setError("We could not end your session. Please try again.");
    }
  }

  return <div className="space-y-6">
    <PageHeader title="Account settings" description="Manage your profile and account session." />
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><UserRound className="h-4 w-4" aria-hidden="true" />Profile</CardTitle><CardDescription>Information associated with your signed-in account.</CardDescription></CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div><p className="text-xs text-muted-foreground">Name</p><p className="mt-1 text-sm font-medium">{String(user?.user_metadata?.full_name || "Not provided")}</p></div>
        <div><p className="text-xs text-muted-foreground">Email</p><p className="mt-1 text-sm font-medium">{user?.email || "Unavailable"}</p></div>
        <div><p className="text-xs text-muted-foreground">Account created</p><p className="mt-1 text-sm font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unavailable"}</p></div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Session</CardTitle><CardDescription>End access to this account on this device.</CardDescription></CardHeader>
      <CardContent className="space-y-3">
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button variant="outline" size="sm" onClick={handleSignOut} disabled={isLoading}><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</Button>
      </CardContent>
    </Card>
  </div>;
}
