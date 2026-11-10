import React from "react";
import Link from "next/link";
import { BrandWordmark } from "@/components/brand/BrandWordmark";

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card text-xs text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" aria-label="Flurit home" className="flex items-center text-foreground">
              <BrandWordmark className="text-2xl" />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Customer churn analysis and retention intelligence platform for B2B SaaS teams.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 font-mono">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#product" className="hover:text-foreground transition-colors">
                  Sample Analysis
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-foreground transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-foreground transition-colors">
                  Core Capabilities
                </a>
              </li>
              <li>
                <a href="#use-cases" className="hover:text-foreground transition-colors">
                  Targeted Use Cases
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 font-mono">
              Methodology & Docs
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#methodology" className="hover:text-foreground transition-colors">
                  Responsible Analytics
                </a>
              </li>
              <li>
                <a href="#methodology" className="hover:text-foreground transition-colors">
                  SHAP Linear Explainability
                </a>
              </li>
              <li>
                <a href="#methodology" className="hover:text-foreground transition-colors">
                  RavenStack Synthetic Benchmark
                </a>
              </li>
              <li>
                <a href="#methodology" className="hover:text-foreground transition-colors">
                  Snapshot Engine Architecture
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 font-mono">
              Platform Access
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground/80">
                  API Status: Operational (v1)
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/80">
                  Version: 0.1.0-beta
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Scientific Transparency Disclaimer */}
        <div className="pt-8 border-t border-border/80 space-y-4">
          <p className="text-[11px] leading-relaxed text-muted-foreground/90">
            <strong>Disclosure:</strong> Flurit demonstrates retention intelligence using the open RavenStack synthetic SaaS dataset. Flurit does not claim or simulate proprietary customer data from live production companies. Risk scores are uncalibrated operational rankings optimized to prioritize accounts by relative retention urgency, not absolute calibrated probabilities. Factor attributions derived from SHAP linear surrogates denote associative statistical patterns, not confirmed causal proofs. Revenue at Risk represents an operational decision heuristic to steer customer success capacity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground pt-4 border-t border-border/40">
            <div>&copy; {currentYear} Flurit. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>Pure Next.js App Router Architecture</span>
              <span>&bull;</span>
              <span>Accessibility WCAG AA Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
