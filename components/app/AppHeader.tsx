"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Database, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { BrandWordmark } from "@/components/brand/BrandWordmark";

interface AppHeaderProps {
  onOpenMobile: () => void;
}

export function AppHeader({ onOpenMobile }: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, isDevMock } = useAuth();

  // Determine breadcrumb segment
  const getBreadcrumb = () => {
    if (pathname === "/app") return "Overview";
    if (pathname.startsWith("/app/datasets")) return "Datasets";
    if (pathname.startsWith("/app/customers")) return "Customers";
    if (pathname.startsWith("/app/analytics")) return "Analytics";
    if (pathname.startsWith("/app/settings")) return "Settings";
    return "App";
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  const userEmail = user?.email || (isDevMock ? "dev@flurit.local" : "workspace-user");
  const userInitial = (userEmail[0] || "U").toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="md:hidden -ml-1 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Open sidebar navigation"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/app" className="font-medium text-muted-foreground hover:text-foreground">
            <BrandWordmark className="text-lg" />
          </Link>
          <span className="text-border" aria-hidden="true">/</span>
          <span className="font-semibold text-foreground">{getBreadcrumb()}</span>
        </nav>
      </div>

      {/* Right: Data Source Tag & User Avatar */}
      <div className="flex items-center gap-3">
        {/* Synthetic Benchmark Tag */}
        <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] text-muted-foreground">
          <Database className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
          <span>RavenStack Benchmark</span>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-mono font-bold">
            {userInitial}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-foreground leading-none truncate max-w-[150px]">
              {userEmail}
            </span>
            <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
              {isDevMock ? "Development Mock" : "Authenticated Session"}
            </span>
          </div>
        </div>

        {/* Real Sign Out Button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          title="Sign out of workspace"
          aria-label="Sign out of workspace"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
