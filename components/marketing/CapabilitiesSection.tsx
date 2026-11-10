import React from "react";
import { 
  Clock, 
  Sparkles, 
  Layers, 
  DollarSign, 
  ShieldAlert, 
  FileCheck2 
} from "lucide-react";

export function CapabilitiesSection() {
  const capabilities = [
    {
      icon: Clock,
      title: "60-Day Forward Prediction Window",
      description:
        "Specifically calibrated for B2B SaaS contract cycles. Gives Customer Success teams a realistic 30 to 60-day operational runway to schedule reviews and resolve concerns before cancellation.",
      tag: "Operational Runway",
    },
    {
      icon: Sparkles,
      title: "SHAP Factor Attribution",
      description:
        "Decomposes every risk score into transparent, directional feature weights. Team members immediately see which metrics are driving risk up or protecting the account.",
      tag: "Transparent AI",
    },
    {
      icon: Layers,
      title: "K=3 Behavioral Archetype Clustering",
      description:
        "Groups at-risk customers into 3 actionable segments—such as Disengaged Usage, Support Escalations, and Contract Renewal Bottlenecks—enabling tailored playbooks.",
      tag: "Cohort Segmentation",
    },
    {
      icon: DollarSign,
      title: "Value × Risk Matrix Prioritization",
      description:
        "Combines account MRR with operational risk ranking to quantify Revenue at Risk. Focuses high-touch customer success resources on the accounts representing the highest exposure.",
      tag: "Revenue Prioritization",
    },
    {
      icon: ShieldAlert,
      title: "Zero-Leakage Snapshot Engine",
      description:
        "Features and prediction targets are strictly isolated using point-in-time temporal snapshots, eliminating lookahead bias and guaranteeing verifiable backtest integrity.",
      tag: "Leakage Prevention",
    },
    {
      icon: FileCheck2,
      title: "Automated Data Profiling & Readiness",
      description:
        "Ingests raw subscription CSV exports, maps required columns, audits missing telemetry, and assigns an automated readiness grade before any modeling occurs.",
      tag: "Pre-Flight Validation",
    },
  ];

  return (
    <section id="capabilities" className="py-16 md:py-24 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
            Platform Capabilities
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Engineered for analytical precision and operational clarity
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Every capability is grounded strictly in documented, verifiable machine learning and SaaS analytics specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between shadow-xs hover:border-border/80 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center text-foreground">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground uppercase">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
