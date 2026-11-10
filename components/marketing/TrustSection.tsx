import React from "react";
import { ShieldCheck, Info, Scale, AlertTriangle, UserCheck, FileText } from "lucide-react";

export function TrustSection() {
  const principles = [
    {
      icon: FileText,
      title: "Synthetic Benchmark Transparency",
      description:
        "All demonstration metrics, sample rosters, and benchmark performance figures in Flurit are evaluated against RavenStack, an open synthetic SaaS dataset. We never present synthetic simulations as real customer metrics.",
    },
    {
      icon: Scale,
      title: "Operational Rankings vs. Calibrated Probabilities",
      description:
        "The current model produces uncalibrated operational risk rankings rather than calibrated Bayesian probabilities. They serve as reliable relative priority orderings to focus team attention, not absolute financial guarantees.",
    },
    {
      icon: Info,
      title: "Directional Association vs. Causal Proof",
      description:
        "SHAP values reflect mathematical feature contributions within the surrogate linear model space. They highlight associative indicators that correlate with churn risk, providing talking points rather than claiming proven causal mechanisms.",
    },
    {
      icon: UserCheck,
      title: "Human-in-the-Loop Decision Support",
      description:
        "Retention requires human context—executive sponsor shifts, economic budget freezes, and team restructurings that no telemetry pipeline can capture alone. Flurit informs human specialists; it never replaces them.",
    },
  ];

  return (
    <section id="methodology" className="py-16 md:py-24 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs text-muted-foreground mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Analytical Integrity & Ethics</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Responsible analytics, transparent methodology
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            We believe enterprise software teams deserve rigorous mathematical honesty rather than inflated AI marketing promises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-foreground shrink-0">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Methodology Callout Box */}
        <div className="mt-10 rounded-xl border border-border bg-muted/30 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">
                Looking for technical specifications?
              </h4>
              <p className="text-xs text-muted-foreground max-w-2xl">
                Read our technical blueprints covering feature engineering, temporal snapshot schemas, K=3 clustering parameters, and model validation protocols.
              </p>
            </div>
            <a
              href="#product"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline whitespace-nowrap"
            >
              <span>Inspect Sample Dataset</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
