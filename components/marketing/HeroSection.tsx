import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Database, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border bg-gradient-to-b from-muted/30 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Transparent Dataset Origin Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs text-muted-foreground shadow-xs mb-6">
            <Database className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Built on synthetic RavenStack SaaS benchmark telemetry</span>
            <span className="inline-block h-1 w-1 rounded-full bg-border" aria-hidden="true" />
            <a
              href="#methodology"
              className="font-medium text-foreground hover:underline inline-flex items-center gap-1"
            >
              Learn more
            </a>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
            Understand churn risk before customers leave.
          </h1>

          {/* Value Proposition Description */}
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed text-balance">
            Flurit equips B2B SaaS customer success and growth teams with transparent 60-day operational risk rankings, directional SHAP factor attribution, and revenue-weighted retention prioritization.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#product" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base font-medium px-6">
                <span>Explore Sample Analysis</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </a>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-medium px-6">
                How Flurit Works
              </Button>
            </a>
          </div>

          {/* Core Methodological Highlights */}
          <div className="mt-10 grid grid-cols-2 gap-3 text-left sm:grid-cols-4 sm:gap-4 pt-8 border-t border-border/60">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs">
                <span className="font-semibold text-foreground block">60-Day Horizon</span>
                <span className="text-muted-foreground">Actionable runway</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs">
                <span className="font-semibold text-foreground block">SHAP Explainability</span>
                <span className="text-muted-foreground">Factor attribution</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs">
                <span className="font-semibold text-foreground block">Revenue Weighted</span>
                <span className="text-muted-foreground">Value × Risk matrix</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs">
                <span className="font-semibold text-foreground block">Zero Data Leakage</span>
                <span className="text-muted-foreground">Strict snapshot dates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
