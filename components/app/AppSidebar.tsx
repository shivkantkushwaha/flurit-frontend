"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Users,
  LineChart,
  Settings,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { BrandWordmark } from "@/components/brand/BrandWordmark";

interface AppSidebarProps {
  onCloseMobile?: () => void;
}

export function AppSidebar({ onCloseMobile }: AppSidebarProps) {
  const pathname = usePathname();
  const { user, isDevMock } = useAuth();

  const navigation = [
    {
      name: "Overview",
      href: "/app",
      icon: LayoutDashboard,
      current: pathname === "/app",
      badge: null,
    },
    {
      name: "Datasets",
      href: "/app/datasets",
      icon: Database,
      current: pathname.startsWith("/app/datasets"),
      badge: null,
    },
    {
      name: "Customers",
      href: "/app/customers",
      icon: Users,
      current: pathname.startsWith("/app/customers"),
      badge: null,
    },
    {
      name: "Analytics",
      href: "/app/analytics",
      icon: LineChart,
      current: pathname.startsWith("/app/analytics"),
      badge: null,
    },
    {
      name: "Settings",
      href: "/app/settings",
      icon: Settings,
      current: pathname.startsWith("/app/settings"),
      badge: null,
    },
  ];

  const userEmail = user?.email || (isDevMock ? "dev@flurit.local" : "workspace-user");

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link
          href="/app"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          onClick={onCloseMobile}
        >
          <div className="flex flex-col">
            <BrandWordmark className="text-2xl text-foreground" />
            <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase mt-0.5">
              Intelligence
            </span>
          </div>
        </Link>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close navigation sidebar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Workspace Context Selector */}
      <div className="border-b border-border px-4 py-3 bg-muted/20">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Active Workspace
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground truncate">
            {isDevMock ? "RavenStack Sandbox" : "Production Workspace"}
          </span>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-mono font-medium text-muted-foreground">
            {isDevMock ? "Dev" : "Live"}
          </span>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto" aria-label="Application Sidebar Navigation">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={`group flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                item.current
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              aria-current={item.current ? "page" : undefined}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    item.current ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  }`}
                  aria-hidden="true"
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`rounded px-1.5 py-0.2 font-mono text-[9px] uppercase ${
                    item.current
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Context: User Identity & Public Links */}
      <div className="border-t border-border p-3 space-y-3 bg-muted/10">
        {/* Auth Indicator */}
        {isDevMock ? (
          <div className="rounded-md border border-amber-500/20 bg-amber-500/10 p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Dev Mock Auth
              </span>
            </div>
            <div className="text-[11px] font-mono text-foreground truncate">
              {userEmail}
            </div>
            <div className="text-[9px] text-muted-foreground mt-0.5">
              Local Preview Mode
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Supabase Auth (Live)
              </span>
            </div>
            <div className="text-[11px] font-mono text-foreground truncate font-medium">
              {userEmail}
            </div>
          </div>
        )}

        {/* Public Marketing Link */}
        <Link
          href="/"
          className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <span className="text-[11px]">Public Website</span>
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
