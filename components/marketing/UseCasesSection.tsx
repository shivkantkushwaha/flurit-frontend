import React from "react";
import { Users, Briefcase, Compass, LineChart } from "lucide-react";

export function UseCasesSection() {
  const personas = [
    {
      icon: Users,
      role: "Customer Success Leaders",
      headline: "Replace guesswork with targeted re-engagement playbooks",
      description:
        "Equip account managers with transparent factor drivers before check-in meetings. Instead of asking generic questions, reps can address specific usage drops or open ticket bottlenecks directly.",
      benefit: "Actionable 30-day intervention cadences for at-risk enterprise accounts.",
    },
    {
      icon: Briefcase,
      role: "Founders & Executive Leadership",
      headline: "Monitor portfolio revenue exposure across contract tiers",
      description:
        "Maintain real-time visibility into net revenue retention risks. Understand exactly how much recurring revenue sits in high-risk quadrants before quarterly forecasts are impacted.",
      benefit: "Precise Revenue at Risk metrics to safeguard ARR.",
    },
    {
      icon: Compass,
      role: "Product & Growth Teams",
      headline: "Isolate feature drop-off triggers correlating with churn",
      description:
        "Connect product usage telemetry directly to retention outcomes. Identify early warning thresholds where seat dormancy or feature abandonment signals account degradation.",
      benefit: "Telemetry-backed insights for onboarding and feature adoption.",
    },
    {
      icon: LineChart,
      role: "Revenue Operations & Analysts",
      headline: "Transparent tabular modeling without black-box complexity",
      description:
        "Work with point-in-time snapshots, verifiable SHAP attributions, and schema validation. Ensure every alert can be audited against source billing and activity tables.",
      benefit: "Audit-ready retention metrics with zero lookahead leakage.",
    },
  ];

  return (
    <section id="use-cases" className="py-16 md:py-24 border-b border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
            Targeted Applications
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Built for teams accountable for recurring revenue retention
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Whether leading customer success, analyzing telemetry, or managing executive forecasts, Flurit delivers aligned retention intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personas.map((persona) => {
            const Icon = persona.icon;
            return (
              <div
                key={persona.role}
                className="rounded-xl border border-border bg-card p-6 sm:p-7 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center text-foreground shrink-0">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-medium text-muted-foreground uppercase block">
                        Role Profile
                      </span>
                      <h3 className="text-base font-bold text-foreground">
                        {persona.role}
                      </h3>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    {persona.headline}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {persona.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <span className="text-xs font-medium text-foreground">
                    Key Outcome: {persona.benefit}
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
