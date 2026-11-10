"use client";

import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { WorkspaceProvider } from "@/components/workspace/WorkspaceContext";
import { initializeAuthForApiClient } from "@/lib/auth/session";
import { initMswBrowser } from "@/mocks/browser";

function UserWorkspace({ children }: { children: React.ReactNode }) {
  const { user, isDevMock } = useAuth();
  const userId = isDevMock ? undefined : user?.id;
  return <WorkspaceProvider key={userId ?? "anonymous"} userId={userId}>{children}</WorkspaceProvider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    // Initialize token provider with ApiClient on client startup
    initializeAuthForApiClient();

    // Optionally start MSW worker in browser if enabled in environment
    initMswBrowser().catch((err) => {
      console.warn("Failed to initialize browser MSW worker", err);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserWorkspace>{children}</UserWorkspace>
      </AuthProvider>
    </QueryClientProvider>
  );
}
