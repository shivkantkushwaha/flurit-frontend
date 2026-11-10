"use client";

import React, { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isDevMock } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      {/* Desktop Static Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <AppSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 shadow-xl">
            <AppSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex flex-1 flex-col md:pl-64 min-w-0">
        {/* Development Mode Notice Banner - ONLY rendered during local dev mock mode */}
        {isDevMock && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-[11px] text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
              <span>
                <strong>Local Development Preview:</strong> Running in local development mode without configured Supabase credentials.
              </span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-amber-800/80 dark:text-amber-300/80 shrink-0 hidden sm:inline">
              Fails Closed in Prod
            </span>
          </div>
        )}

        {/* Header */}
        <AppHeader onOpenMobile={() => setMobileSidebarOpen(true)} />

        {/* Content Body */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
