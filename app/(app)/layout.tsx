import React from "react";
import type { Metadata } from "next";
import { AppShell } from "@/components/app/AppShell";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "Workspace Overview | Flurit",
  description: "Customer churn analysis, risk rankings, and retention intelligence workspace.",
};

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
