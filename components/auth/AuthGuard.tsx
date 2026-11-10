"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { BarChart3, Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isDevMock } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isDevMock) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, isDevMock, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm animate-pulse">
            <BarChart3 className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground font-medium">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
            <span>Verifying workspace session...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isDevMock) {
    return null;
  }

  return <>{children}</>;
}
