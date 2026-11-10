"use client";

import React, { useState } from "react";
import { 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Sliders, 
  HelpCircle, 
  Info,
  DollarSign,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CustomerPreviewItem {
  id: string;
  plan: string;
  mrr: number;
  tenureMonths: number;
  riskScore: number;
  riskTier: "risk-high" | "risk-moderate" | "risk-low";
  riskTierLabel: string;
  topFactor: string;
  recommendedAction: string;
}

const SAMPLE_CUSTOMERS: CustomerPreviewItem[] = [
  {
    id: "cust_rvn_0481",
    plan: "Enterprise",
    mrr: 3200,
    tenureMonths: 18,
    riskScore: 0.84,
    riskTier: "risk-high",
    riskTierLabel: "High Risk",
    topFactor: "Weekly active seats dropped -62% MoM",
    recommendedAction: "Executive Sponsor Outreach",
  },
  {
    id: "cust_rvn_0219",
    plan: "Growth",
    mrr: 1100,
    tenureMonths: 7,
    riskScore: 0.72,
    riskTier: "risk-high",
    riskTierLabel: "High Risk",
    topFactor: "Support ticket volume +400% with open P1",
    recommendedAction: "CS Technical Escalation",
  },
  {
    id: "cust_rvn_0904",
    plan: "Starter",
    mrr: 250,
    tenureMonths: 14,
    riskScore: 0.46,
    riskTier: "risk-moderate",
    riskTierLabel: "Moderate Risk",
    topFactor: "Zero admin logins for 21 consecutive days",
    recommendedAction: "In-App Feature Adoption Nudge",
  },
  {
    id: "cust_rvn_0733",
    plan: "Growth",
    mrr: 850,
    tenureMonths: 4,
    riskScore: 0.41,
    riskTier: "risk-moderate",
    riskTierLabel: "Moderate Risk",
    topFactor: "Secondary payment retry failed",
    recommendedAction: "Billing Admin Verification",
  },
  {
    id: "cust_rvn_0112",
    plan: "Enterprise",
    mrr: 4500,
    tenureMonths: 28,
    riskScore: 0.18,
    riskTier: "risk-low",
    riskTierLabel: "Low Risk",
    topFactor: "Consistent API consumption (+12% MoM)",
    recommendedAction: "Account Stable / Expansion Review",
  },
];

const SHAP_FACTORS = [
  { feature: "Usage Drop: Weekly Active Seats (MoM)", impact: 0.34, direction: "increases", label: "+0.34" },
  { feature: "Support Escalations: Open Critical Tickets", impact: 0.21, direction: "increases", label: "+0.21" },
  { feature: "License Seat Utilization Ratio (< 35%)", impact: 0.16, direction: "increases", label: "+0.16" },
  { feature: "Account Age: Tenure > 12 Months", impact: -0.18, direction: "decreases", label: "-0.18" },
  { feature: "Billing Structure: Annual Upfront Plan", impact: -0.11, direction: "decreases", label: "-0.11" },
];

export function ProductPreview() {
  const [activeTab, setActiveTab] = useState<"table" | "shap" | "matrix">("table");

  return (
    <section id="product" className="py-16 md:py-24 border-b border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-10">
          <Badge variant="outline" className="mb-3 uppercase font-mono text-[10px] tracking-wider">
            Illustrative Product Interface
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Retention intelligence built for clarity, not black boxes.
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Explore how Flurit surfaces operational risk rankings, inspects underlying factor signals, and organizes accounts into retention priority quadrants.
          </p>

          {/* Mandatory Synthetic Data Notice */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-muted/80 px-3 py-1.5 text-xs text-muted-foreground border border-border">
            <Info className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
            <span>
              <strong>Note:</strong> Illustrative sample data modeled from the synthetic RavenStack benchmark dataset.
            </span>
          </div>
        </div>

        {/* Product UI Simulation Wrapper */}
        <div className="rounded-xl border border-border bg-background shadow-lg overflow-hidden">
          {/* Top Application Bar */}
          <div className="border-b border-border bg-muted/40 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-red-400 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-400 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-400 inline-block" />
              <span className="text-xs font-mono font-medium text-foreground ml-2">
                flurit-app / portfolio-overview / snapshot-2024-03
              </span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border/80">
              <button
                type="button"
                onClick={() => setActiveTab("table")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "table"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Risk Priority Table
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("shap")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "shap"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                SHAP Factor Attribution
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("matrix")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "matrix"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Value × Risk Matrix
              </button>
            </div>
          </div>

          {/* Metric KPI Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border divide-y md:divide-y-0 md:divide-x divide-border bg-card">
            <div className="p-4 sm:p-5">
              <span className="text-xs font-medium text-muted-foreground block">Active Evaluated MRR</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground">$128,400</span>
                <span className="text-xs text-muted-foreground">420 accounts</span>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <span className="text-xs font-medium text-muted-foreground block">Revenue at Risk (High Tier)</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-risk-high">$34,200</span>
                <span className="text-xs font-medium text-risk-high bg-risk-high-muted px-1.5 py-0.5 rounded">
                  26.6% MRR
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <span className="text-xs font-medium text-muted-foreground block">Top Attribution Signal</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-sm font-semibold text-foreground truncate">Usage Drop (&gt;45% MoM)</span>
              </div>
              <span className="text-[11px] text-muted-foreground">Present in 68% of High Risk</span>
            </div>

            <div className="p-4 sm:p-5">
              <span className="text-xs font-medium text-muted-foreground block">Prediction Horizon</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground">60 Days</span>
                <span className="text-xs text-emerald-600 font-medium">Valid Snapshot</span>
              </div>
            </div>
          </div>

          {/* Tab 1: Account Risk Priority Table */}
          {activeTab === "table" && (
            <div className="p-4 sm:p-6 overflow-x-auto">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Prioritized Customer Roster</h3>
                  <p className="text-xs text-muted-foreground">
                    Sorted by operational risk ranking. Scores represent relative ranking order, not calibrated probabilities.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Showing 5 of 420 Records
                </Badge>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground">
                    <th scope="col" className="py-2.5 px-3 font-medium">Account ID</th>
                    <th scope="col" className="py-2.5 px-3 font-medium">Plan</th>
                    <th scope="col" className="py-2.5 px-3 font-medium text-right">MRR</th>
                    <th scope="col" className="py-2.5 px-3 font-medium">Tenure</th>
                    <th scope="col" className="py-2.5 px-3 font-medium">Risk Ranking</th>
                    <th scope="col" className="py-2.5 px-3 font-medium">Primary Attribution Signal</th>
                    <th scope="col" className="py-2.5 px-3 font-medium">Recommended Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {SAMPLE_CUSTOMERS.map((cust) => (
                    <tr key={cust.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-medium text-foreground">
                        {cust.id}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {cust.plan}
                      </td>
                      <td className="py-3 px-3 font-mono text-foreground text-right font-medium">
                        ${cust.mrr.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {cust.tenureMonths} mo
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={cust.riskTier} showIcon>
                            {cust.riskTierLabel} ({cust.riskScore.toFixed(2)})
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-foreground font-medium">
                        {cust.topFactor}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-primary hover:underline font-medium cursor-pointer">
                          <span>{cust.recommendedAction}</span>
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>Revenue at Risk Heuristic: Evaluates portfolio concentration to steer high-touch retention capacity.</span>
                <span className="font-mono text-[11px]">RavenStack Synthetic Archetype</span>
              </div>
            </div>
          )}

          {/* Tab 2: SHAP Factor Attribution */}
          {activeTab === "shap" && (
            <div className="p-4 sm:p-6 space-y-6">
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-muted-foreground block">Inspecting Attribution For</span>
                    <h3 className="text-base font-bold text-foreground font-mono">
                      cust_rvn_0481 &bull; Enterprise Plan ($3,200 MRR)
                    </h3>
                  </div>
                  <Badge variant="risk-high" showIcon>
                    High Risk Ranking: 0.84
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Directional Feature Weight Attribution (SHAP Linear Surrogate Values)
                </h4>

                <div className="space-y-3">
                  {SHAP_FACTORS.map((item) => (
                    <div key={item.feature} className="rounded-md border border-border p-3 bg-card">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium text-foreground">{item.feature}</span>
                        <span
                          className={`font-mono font-bold ${
                            item.direction === "increases" ? "text-risk-high" : "text-emerald-600"
                          }`}
                        >
                          {item.label} ({item.direction === "increases" ? "Increases Risk" : "Lowers Risk"})
                        </span>
                      </div>
                      {/* Bar indicator */}
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                        {item.direction === "increases" ? (
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{ width: `${Math.abs(item.impact) * 100}%` }}
                          />
                        ) : (
                          <div
                            className="h-full bg-emerald-500 rounded-full ml-auto"
                            style={{ width: `${Math.abs(item.impact) * 100}%` }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md bg-muted/60 p-3.5 border border-border text-xs text-muted-foreground leading-relaxed">
                <strong>Methodology Guardrail:</strong> SHAP factor contributions represent statistical associations within the trained model space. They guide retention managers toward potential investigation points rather than asserting deterministic causality.
              </div>
            </div>
          )}

          {/* Tab 3: Value × Risk Matrix */}
          {activeTab === "matrix" && (
            <div className="p-4 sm:p-6 space-y-6">
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-foreground">Operational Prioritization Matrix</h3>
                <p className="text-xs text-muted-foreground">
                  Cross-classifies account Monthly Recurring Revenue (MRR) against operational risk score to optimize retention team intervention bandwidth.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quadrant 1: High Value x High Risk */}
                <div className="rounded-lg border-2 border-red-300 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-risk-high">
                      Immediate Retention Outreach
                    </span>
                    <Badge variant="risk-high">Priority 1</Badge>
                  </div>
                  <div className="text-xl font-extrabold text-foreground">$34,200 MRR</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    High MRR (&ge; $1,000/mo) &bull; High Risk (&ge; 0.50). Accounts where churn represents acute portfolio revenue loss. Assigned to senior CSMs.
                  </p>
                </div>

                {/* Quadrant 2: High Value x Low Risk */}
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Expansion & Advocacy
                    </span>
                    <Badge variant="risk-low">Healthy</Badge>
                  </div>
                  <div className="text-xl font-extrabold text-foreground">$61,500 MRR</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    High MRR (&ge; $1,000/mo) &bull; Low Risk (&lt; 0.35). High-value accounts with stable product consumption. Primary candidates for upsell.
                  </p>
                </div>

                {/* Quadrant 3: Low Value x High Risk */}
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                      Automated Re-engagement
                    </span>
                    <Badge variant="risk-moderate">Scaled Action</Badge>
                  </div>
                  <div className="text-xl font-extrabold text-foreground">$8,400 MRR</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Low MRR (&lt; $1,000/mo) &bull; High Risk (&ge; 0.50). Addressed via automated educational sequences and in-app satisfaction surveys.
                  </p>
                </div>

                {/* Quadrant 4: Low Value x Low Risk */}
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Self-Serve Baseline
                    </span>
                    <Badge variant="outline">Steady</Badge>
                  </div>
                  <div className="text-xl font-extrabold text-foreground">$24,300 MRR</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Low MRR (&lt; $1,000/mo) &bull; Low Risk (&lt; 0.35). Standard self-serve product experience without requiring manual CS touchpoints.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
