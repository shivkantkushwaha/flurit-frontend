"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  ArrowRight,
  Info,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  AlertOctagon,
  RotateCcw,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { useWorkspace } from "@/components/workspace/WorkspaceContext";
import { useAuth } from "@/components/auth/AuthProvider";

export default function OverviewDashboardPage() {
  const { state, hasCustomAnalysis, resetWorkspace } = useWorkspace();
  const { user, isDevMock } = useAuth();

  const isAvailable = state.status === "ANALYSIS_AVAILABLE";
  const isEmpty = state.status === "NO_DATASET";
  const isFailed = state.status === "PROCESSING_FAILED";

  const userDisplayName = user?.user_metadata?.full_name || user?.email || (isDevMock ? "dev@flurit.local" : "Workspace");

  return (
    <div className="space-y-8">
      {/* 1. Page Header */}
      <PageHeader
        title="Overview"
        description={`Customer retention intelligence workspace for ${userDisplayName}. Review dataset readiness, track point-in-time snapshot scoring, and prioritize retention interventions.`}
        badge={{
          text: hasCustomAnalysis ? "Active Dataset Analysis" : "Initial Workspace Setup",
          variant: hasCustomAnalysis ? "default" : "outline",
        }}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/app/datasets">
              <Button variant="primary" size="sm" className="gap-1.5">
                <UploadCloud className="h-4 w-4" aria-hidden="true" />
                <span>{hasCustomAnalysis ? "Upload Another Dataset" : "Upload Dataset"}</span>
              </Button>
            </Link>
            {hasCustomAnalysis && (
              <Button variant="outline" size="sm" onClick={resetWorkspace} title="Reset workspace to empty first-run state">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            )}
          </div>
        }
      />

      {/* 2. Dataset Readiness & Workspace Status Banner */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                Workspace Status
              </span>
              {isAvailable && <StatusIndicator status="READY" label="Analysis Ready" />}
              {isEmpty && <StatusIndicator status="UNSUPPORTED" label="No Dataset Configured" />}
              {isFailed && <StatusIndicator status="UNSUPPORTED" label="Processing Failed" />}
            </div>

            <div className="text-sm font-semibold text-foreground flex items-center gap-2">
              {state.datasetName ? (
                <span>Source: <code className="font-mono text-xs">{state.datasetName}</code> ({state.datasetFileCount} files)</span>
              ) : (
                <span>No customer dataset uploaded yet</span>
              )}
            </div>

            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              {isAvailable &&
                `Analysis completed. Point-in-time snapshots and customer churn risk scores generated with observation date ${state.metrics.observationDate}.`}
              {isEmpty &&
                "Upload your customer accounts, subscription history, and feature telemetry CSV files to generate operational risk rankings and directional factor attributions."}
              {isFailed &&
                (state.errorMessage || "The uploaded dataset did not satisfy schema requirements or temporal span constraints.")}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAvailable ? (
              <Link href="/app/customers">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <span>View Customer Roster</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </Link>
            ) : (
              <Link href="/app/datasets">
                <Button variant="primary" size="sm" className="gap-1.5">
                  <UploadCloud className="h-4 w-4" aria-hidden="true" />
                  <span>Configure Datasets</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Warning Callout when present */}
        {state.warnings?.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              {state.warnings.map((w, idx) => (
                <div key={idx}>{w}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Key Metrics Area (Strictly Truthful: "—" when unavailable) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            Portfolio Key Metrics
          </h2>
          <span className="text-[11px] text-muted-foreground">
            {hasCustomAnalysis
              ? "Source: Verified Custom Dataset Analysis"
              : "Status: Awaiting Dataset Upload"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Accounts Evaluated */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium">Accounts Evaluated</CardDescription>
              <CardTitle className="text-2xl font-bold">
                {state.metrics.totalAccounts !== null ? state.metrics.totalAccounts.toLocaleString() : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-muted-foreground">
                {state.metrics.totalAccounts !== null
                  ? "Eligible active accounts in snapshot"
                  : "Upload dataset to evaluate accounts"}
              </p>
            </CardContent>
          </Card>

          {/* Metric 2: High-Risk Accounts */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium">High-Risk Accounts</CardDescription>
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-2xl font-bold text-risk-high">
                  {state.metrics.highRiskCount !== null ? state.metrics.highRiskCount : "—"}
                </CardTitle>
                {state.metrics.highRiskPercentage !== null && (
                  <span className="text-xs font-semibold text-risk-high bg-risk-high-muted px-1.5 py-0.5 rounded">
                    {state.metrics.highRiskPercentage}%
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-muted-foreground">
                {state.metrics.highRiskCount !== null
                  ? "Operational risk ranking ≥ 0.50"
                  : "Unavailable until dataset scored"}
              </p>
            </CardContent>
          </Card>

          {/* Metric 3: Estimated Revenue at Risk */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium">Revenue at Risk (MRR)</CardDescription>
              <CardTitle className="text-2xl font-bold">
                {state.metrics.revenueAtRiskMrr !== null
                  ? `$${state.metrics.revenueAtRiskMrr.toLocaleString()}`
                  : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-muted-foreground">
                {state.metrics.revenueAtRiskMrr !== null
                  ? "MRR × Risk score (Prioritization heuristic)"
                  : "Unavailable until dataset scored"}
              </p>
            </CardContent>
          </Card>

          {/* Metric 4: Prediction Horizon */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium">Prediction Horizon</CardDescription>
              <CardTitle className="text-2xl font-bold">
                {isAvailable ? "60 Days" : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-muted-foreground">
                {isAvailable
                  ? `Snapshot: ${state.metrics.observationDate}`
                  : "Requires 150-day historical span"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4. Risk Insights / Analysis Preview or Honest Empty State */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Customer Risk Insights & Prioritization
            </h2>
            <p className="text-xs text-muted-foreground">
              Operational risk rankings ordering accounts by retention urgency.
            </p>
          </div>
          {isAvailable && (
            <Badge variant="outline" className="font-mono text-xs">
              Scored Roster
            </Badge>
          )}
        </div>

        {isAvailable && state.sampleCustomers?.length > 0 ? (
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-border bg-muted/20 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground">
                Prioritized Customer Accounts for CS Outreach
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Model: flurit_churn_predictor v1.0.0
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                    <th scope="col" className="py-2.5 px-4 font-medium">Account ID</th>
                    <th scope="col" className="py-2.5 px-3 font-medium">Tier</th>
                    <th scope="col" className="py-2.5 px-3 font-medium text-right">MRR</th>
                    <th scope="col" className="py-2.5 px-3 font-medium">Tenure</th>
                    <th scope="col" className="py-2.5 px-4 font-medium">Risk Ranking</th>
                    <th scope="col" className="py-2.5 px-4 font-medium">Primary Attribution Signal (SHAP)</th>
                    <th scope="col" className="py-2.5 px-4 font-medium text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {state.sampleCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-foreground">
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
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            cust.riskTier === "High Risk"
                              ? "risk-high"
                              : cust.riskTier === "Moderate Risk"
                              ? "risk-moderate"
                              : "risk-low"
                          }
                          showIcon
                        >
                          {cust.riskTier} ({cust.riskScore.toFixed(2)})
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-foreground font-medium">
                        {cust.topRiskFactor}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href="/app/customers"
                          className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-muted/30 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>
                <strong>Methodology Disclaimer:</strong> SHAP factor attributions reflect associative correlations learned from tabular features, not guaranteed causal proof.
              </span>
              <Link href="/app/customers" className="font-semibold text-primary hover:underline">
                View Customer Intelligence &rarr;
              </Link>
            </div>
          </div>
        ) : (
          /* Honest Empty State for First-Run or Unanalyzed Workspace */
          <Card className="text-center py-10 px-4">
            <CardHeader className="max-w-md mx-auto space-y-2">
              <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
                <Database className="h-6 w-6" aria-hidden="true" />
              </div>
              <CardTitle className="text-lg">No customer risk analysis available</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                {isEmpty &&
                  "Upload your customer accounts, subscription histories, and feature usage telemetry to calculate 60-day operational risk rankings, directional SHAP attributions, and Revenue at Risk matrices."}
                {isFailed &&
                  "The previous dataset processing attempt encountered validation or temporal span issues. Re-run onboarding with verified records."}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Link href="/app/datasets">
                <Button variant="primary" size="sm" className="gap-2">
                  <UploadCloud className="h-4 w-4" aria-hidden="true" />
                  <span>Configure Datasets & Begin Onboarding</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 5. Onboarding Checklist */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Retention Intelligence Onboarding Checklist</CardTitle>
            <span className="text-xs font-mono text-muted-foreground">
              {state.nextSteps.filter((s) => s.completed).length} of {state.nextSteps.length} Steps Complete
            </span>
          </div>
          <CardDescription className="text-xs">
            Standardized 4-stage pipeline for verifiable B2B SaaS retention predictions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {state.nextSteps.map((step, idx) => (
              <div
                key={step.id}
                className={`rounded-lg border p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  step.completed
                    ? "border-emerald-200 bg-emerald-50/30 dark:border-emerald-950 dark:bg-emerald-950/10"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {step.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40 flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-xs font-semibold block ${
                        step.completed ? "text-foreground line-through opacity-80" : "text-foreground"
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-0.5 block leading-relaxed">
                      {step.description}
                    </span>
                  </div>
                </div>

                {step.actionLabel && step.actionHref && (
                  <div className="shrink-0 self-end sm:self-center">
                    <Link href={step.actionHref}>
                      <Button
                        variant={step.completed ? "outline" : "primary"}
                        size="sm"
                        className="text-xs h-7 px-2.5"
                      >
                        {step.actionLabel}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
