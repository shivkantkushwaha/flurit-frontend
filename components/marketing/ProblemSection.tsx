import React from "react";
import { Database, AlertOctagon, HelpCircle, Layers, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProblemSection() {
  const problems = [
    {
      icon: Database,
      title: "Scattered Signals & Disconnected Data",
      description:
        "Subscription statuses sit in billing platforms, feature drop-offs remain buried in product telemetry, and frustration hides in support desks. By the time these signals are manually reconciled, the renewal window has closed.",
      impact: "Late intervention when churn is already inevitable.",
    },
    {
      icon: AlertOctagon,
      title: "Prioritization Paralysis",
      description:
        "When accounts are evaluated solely by count rather than business exposure, CS teams spend equal effort on $50/mo self-serve accounts and $5,000/mo enterprise renewals, leading to severe resource misallocation.",
      impact: "High-value accounts slip through the cracks.",
    },
    {
      icon: HelpCircle,
      title: "The 'Black-Box' Score Trap",
      description:
        "Generic ML tools spit out an opaque risk percentage without context. A Customer Success Manager cannot hold a constructive re-engagement call if they do not know whether the risk stems from price, adoption drop, or unresolved bugs.",
      impact: "CS teams distrust and abandon predictive alerts.",
    },
  ];

  return (
    <section className="py-16 md:py-24 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
            The Retention Challenge
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Why traditional SaaS churn prevention breaks down
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Most B2B software companies only discover churn after a cancellation request hits support. Effective retention requires proactive detection, transparent attribution, and revenue weighting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem) => {
            const Icon = problem.icon;
            return (
              <div
                key={problem.title}
                className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between shadow-xs hover:border-border/80 transition-colors"
              >
                <div>
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-foreground mb-4">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/60">
                  <span className="text-xs font-medium text-risk-high">
                    Consequence: {problem.impact}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
