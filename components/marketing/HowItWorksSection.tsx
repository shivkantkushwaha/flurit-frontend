import React from "react";
import { UploadCloud, CheckCircle2, Cpu, Crosshair } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: UploadCloud,
      title: "Ingest Telemetry & Subscriptions",
      description:
        "Provide customer subscription histories, billing intervals, and behavioral usage events via structured CSV upload or direct REST API ingestion.",
      detail: "Supports customer profiles, subscription tiers, and activity snapshots.",
    },
    {
      step: "02",
      icon: CheckCircle2,
      title: "Verify Schema & Horizon Readiness",
      description:
        "Flurit inspects column mappings, flags missing telemetry fields, and enforces point-in-time snapshot boundaries to prevent lookahead target leakage.",
      detail: "Guarantees 60-day historical observation runway for valid inference.",
    },
    {
      step: "03",
      icon: Cpu,
      title: "Score Risk & Attribute SHAP Factors",
      description:
        "The trained model evaluates telemetry to produce operational risk rankings, while SHAP explainers isolate the top directional drivers for each account.",
      detail: "Identifies whether risk is driven by seat drop, support issues, or billing errors.",
    },
    {
      step: "04",
      icon: Crosshair,
      title: "Prioritize Action on Value × Risk Matrix",
      description:
        "Accounts are organized into revenue-weighted priority quadrants and clustered into K=3 behavioral archetypes, steering CS outreach where impact is highest.",
      detail: "Immediate human touch for high-MRR accounts; automated flows for low-touch.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 border-b border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
            The Retention Pipeline
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            How Flurit transforms raw data into retention actions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            A transparent, audit-ready 4-stage pipeline built specifically around B2B SaaS renewal cycles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-xl border border-border bg-card p-6 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-muted-foreground/40">
                      {item.step}
                    </span>
                    <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center text-foreground">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/60">
                  <span className="text-[11px] font-medium text-foreground block">
                    {item.detail}
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
