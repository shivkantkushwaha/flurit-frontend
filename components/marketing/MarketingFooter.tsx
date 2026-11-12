
import React from "react";
import Link from "next/link";
import { BrandWordmark } from "@/components/brand/BrandWordmark";

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card text-xs text-muted-foreground overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-3 md:col-span-1">
            <Link href="/" aria-label="Flurit home" className="flex items-center text-foreground">
              <BrandWordmark className="text-2xl" />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Customer churn analysis and retention intelligence platform for B2B SaaS teams.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 font-mono">
              Product
            </h4>
            <ul className="space-y-2">
              <li><a href="#product" className="hover:text-foreground transition-colors">Sample Analysis</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
              <li><a href="#capabilities" className="hover:text-foreground transition-colors">Core Capabilities</a></li>
              <li><a href="#use-cases" className="hover:text-foreground transition-colors">Targeted Use Cases</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 font-mono">
              Methodology & Docs
            </h4>
            <ul className="space-y-2">
              <li><a href="#methodology" className="hover:text-foreground transition-colors">Responsible Analytics</a></li>
              <li><a href="#methodology" className="hover:text-foreground transition-colors">SHAP Linear Explainability</a></li>
              <li><a href="#methodology" className="hover:text-foreground transition-colors">RavenStack Synthetic Benchmark</a></li>
              <li><a href="#methodology" className="hover:text-foreground transition-colors">Snapshot Engine Architecture</a></li>
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
                <a
                  href="https://stats.uptimerobot.com/hMxy7wl3MD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Live System Status
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <span className="text-muted-foreground/80">API: v1</span>
              </li>
              <li>
                <span className="text-muted-foreground/80">Version: 0.1.0-beta</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Liquid Glass Brand Showcase */}
        <Link
          href="/"
          aria-label="Flurit home"
          className="group relative isolate block w-full overflow-hidden rounded-2xl border border-white/40 bg-[#09090f] shadow-[0_20px_80px_-30px_rgba(91,33,182,0.35)]"
        >
          {/* Ambient liquid light */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -left-20 -top-32 h-72 w-72 rounded-full bg-violet-600/40 blur-[100px] transition-transform duration-1000 group-hover:translate-x-16 group-hover:translate-y-8" />
            <div className="absolute -right-16 -top-20 h-80 w-80 rounded-full bg-indigo-500/35 blur-[110px] transition-transform duration-1000 group-hover:-translate-x-12 group-hover:translate-y-8" />
            <div className="absolute bottom-[-150px] left-[38%] h-72 w-96 rounded-full bg-fuchsia-500/20 blur-[110px]" />

            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.015] to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/30 via-white/5 to-transparent" />
            <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(255,255,255,0.8)_0.6px,transparent_0.6px)] [background-size:5px_5px]" />
          </div>

          <div className="relative flex min-h-[230px] items-center justify-center px-4 py-12 sm:min-h-[300px] sm:py-16">
            <span
              aria-hidden="true"
              className="select-none whitespace-nowrap text-[clamp(5rem,19vw,17rem)] font-semibold leading-[0.8] tracking-[-0.095em] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/35 drop-shadow-[0_8px_35px_rgba(139,92,246,0.22)] transition-all duration-700 group-hover:scale-[1.025] group-hover:drop-shadow-[0_8px_55px_rgba(139,92,246,0.4)]"
            >
              Flurit
            </span>

            {/* Liquid glass highlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[12%] top-5 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent blur-[1px]"
            />
          </div>

          <div className="absolute bottom-4 right-5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-white/40 transition-colors group-hover:text-white/70 sm:bottom-5 sm:right-7">
            <span>Retention intelligence</span>
            <span className="h-1 w-1 rounded-full bg-violet-400" />
            <span>Est. 2026</span>
          </div>
        </Link>

        {/* Scientific Transparency Disclosure */}
        <div className="pt-8 mt-10 border-t border-border/80 space-y-4">
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
