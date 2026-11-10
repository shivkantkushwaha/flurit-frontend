"use client";

import React from "react";
import Link from "next/link";
import { Activity, AlertTriangle, ArrowRight, BarChart3, CalendarDays, Database, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/components/workspace/WorkspaceContext";

const riskStyles = {
  "High Risk": "bg-risk-high",
  "Moderate Risk": "bg-risk-moderate",
  "Low Risk": "bg-risk-low",
};

function formatNumber(value: number | undefined | null) {
  return value == null || !Number.isFinite(value) ? "—" : value.toLocaleString();
}

function Kpi({ label, value, note }: { label: string; value: string; note: string }) {
  return <Card><CardHeader className="pb-2"><CardDescription>{label}</CardDescription><CardTitle className="text-2xl tabular-nums">{value}</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">{note}</p></CardContent></Card>;
}

export default function AnalyticsPage() {
  const { state, hasCustomAnalysis, analysisLoad } = useWorkspace();
  const result = hasCustomAnalysis ? state.analysisResult : undefined;
  const snapshot = result?.snapshot_summary;
  const scoring = result?.scoring_summary;
  const dates = snapshot?.observation_dates ?? [];
  const riskCounts = [
    { name: "High Risk", count: scoring?.high_risk_count },
    { name: "Moderate Risk", count: scoring?.moderate_risk_count },
    { name: "Low Risk", count: scoring?.low_risk_count },
  ];
  const hasRiskDistribution = riskCounts.some(({ count }) => typeof count === "number");
  const maxRisk = Math.max(1, ...riskCounts.map(({ count }) => count ?? 0));
  const segments = Object.entries(scoring?.segments_distribution ?? {}).filter(([, count]) => Number.isFinite(count));
  const factors = scoring?.top_global_risk_increasing_factors ?? [];
  const totalMrr = scoring?.prioritization_quadrants?.reduce((sum, item) => sum + (item.total_mrr || 0), 0);
  const revenueExposure = scoring?.prioritization_quadrants?.reduce((sum, item) => sum + (item.estimated_revenue_at_risk_mrr || 0), 0);
  const status = result?.processing_status ?? (hasCustomAnalysis ? "UNAVAILABLE" : "NOT_PROCESSED");
  const dateRange = dates.length ? `${dates[0]}${dates.length > 1 ? ` – ${dates[dates.length - 1]}` : ""}` : "Not returned";

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics & insights" description="Portfolio signals from the latest dataset processing response." badge={{ text: status.replaceAll("_", " "), variant: status === "SUCCESS" ? "default" : "outline" }} />

      {!result ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground"><BarChart3 className="h-6 w-6" aria-hidden="true" /></span>
            <div><h2 className="text-base font-semibold">{analysisLoad === "loading" ? "Loading saved analysis…" : analysisLoad === "error" ? "Saved analysis is unavailable" : "No processing results available"}</h2><p className="mt-1 max-w-lg text-sm text-muted-foreground">{analysisLoad === "error" ? "Refresh this page to retry the workspace API." : "Run dataset onboarding to see portfolio counts, risk tiers, observation dates, and model summaries here."}</p></div>
            <Link href="/app/datasets"><Button size="sm">Configure a dataset <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button></Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground"><Database className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><span>Source: latest dataset processing response for <strong className="font-semibold text-foreground">{state.datasetName || "this workspace"}</strong>. Processing status: <strong className="font-semibold text-foreground">{status.replaceAll("_", " ")}</strong>. {state.datasetFileCount > 0 && `Uploaded files: ${state.datasetFileCount}. `} Values below are aggregates returned by the backend.</span></div>

          {result.processing_status !== "SUCCESS" && <div role="status" className="flex items-start gap-2 rounded-md border border-amber-300/50 bg-amber-50/60 p-3 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-200"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><span>Results are {result.processing_status.toLowerCase().replaceAll("_", " ")}. Some measures may be unavailable; review the processing warnings and scoring blockers below.</span></div>}

          <section aria-label="Portfolio overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Eligible accounts" value={formatNumber(snapshot?.eligible_accounts_count)} note="Snapshot summary · eligible account count" />
            <Kpi label="Processed snapshots" value={formatNumber(scoring?.scored_snapshots_count ?? snapshot?.total_snapshots)} note="Scored records when scoring is available" />
            <Kpi label="Observed churn rate" value={snapshot?.churn_rate_pct == null ? "—" : `${snapshot.churn_rate_pct.toFixed(1)}%`} note="Aggregate label rate returned for processed snapshots" />
            <Kpi label="High-risk snapshots" value={formatNumber(scoring?.high_risk_count)} note="Model risk-tier count across processed observation dates" />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldAlert className="h-4 w-4" aria-hidden="true" />Risk distribution</CardTitle><CardDescription>Snapshot counts by model risk tier.</CardDescription></CardHeader>
              <CardContent>
                {hasRiskDistribution ? <div role="img" aria-label="Risk tier snapshot counts" className="space-y-4">{riskCounts.map(({ name, count }) => <div key={name} className="space-y-1"><div className="flex justify-between gap-3 text-sm"><span>{name}</span><span className="tabular-nums text-muted-foreground">{formatNumber(count)} snapshots</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${riskStyles[name as keyof typeof riskStyles]}`} style={{ width: `${count == null ? 0 : Math.max(count === 0 ? 0 : 2, (count / maxRisk) * 100)}%` }} /></div></div>)}</div> : <Unavailable text="Risk-tier counts were not included in this processing result." />}
                <p className="mt-4 text-xs text-muted-foreground">Model scores are uncalibrated operational relative-risk rankings, not calibrated churn probabilities.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><CalendarDays className="h-4 w-4" aria-hidden="true" />Observation coverage</CardTitle><CardDescription>Dates and target counts returned by snapshot generation.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div><p className="text-xs text-muted-foreground">Observation date range</p><p className="mt-1 text-lg font-semibold tabular-nums">{dateRange}</p><p className="text-xs text-muted-foreground">{formatNumber(snapshot?.observation_dates_count)} observation dates</p></div>
                <div className="grid grid-cols-3 gap-2 border-t border-border pt-3">{[["Positive targets", snapshot?.positive_targets_count], ["Negative targets", snapshot?.negative_targets_count], ["Censored", snapshot?.censored_targets_count]].map(([label, count]) => <div key={String(label)}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold tabular-nums">{formatNumber(count as number | undefined)}</p></div>)}</div>
                {dates.length > 1 && <p className="text-xs text-muted-foreground">Multiple dates are present, but churn rates are not broken down by date in this response. Trend chart unavailable.</p>}
                {dates.length <= 1 && <p className="text-xs text-muted-foreground">A time series requires per-date outcome metrics; no trend is inferred from an aggregate rate.</p>}
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Revenue exposure</CardTitle><CardDescription>Prioritization values returned from the backend summary.</CardDescription></CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div><p className="text-xs text-muted-foreground">Portfolio MRR</p><p className="mt-1 text-xl font-semibold tabular-nums">{totalMrr != null && scoring?.prioritization_quadrants?.length ? `$${totalMrr.toLocaleString()}` : "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Estimated revenue at risk (MRR)</p><p className="mt-1 text-xl font-semibold tabular-nums">{revenueExposure != null && scoring?.prioritization_quadrants?.length ? `$${revenueExposure.toLocaleString()}` : "—"}</p></div>
                <p className="sm:col-span-2 text-xs text-muted-foreground">Estimated revenue at risk is an operational prioritization heuristic, not guaranteed financial loss. {scoring?.prioritization_quadrants?.length ? "Values aggregate the returned priority quadrants." : "No prioritization values were returned."}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4" aria-hidden="true" />Model summary</CardTitle><CardDescription>Model metadata and global attribution summaries returned by processing.</CardDescription></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><span className="text-muted-foreground">Model:</span> {scoring?.model_name || "Unavailable"} {scoring?.model_version ? `· v${scoring.model_version}` : ""}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{scoring?.score_interpretation_notice || "Model interpretation notice was not returned."}</p>
                {factors.length > 0 ? <div className="border-t border-border pt-3"><p className="mb-2 text-xs font-medium">Global risk-associated features</p><ul className="space-y-2">{factors.slice(0, 5).map((factor) => <li key={factor.feature_name} className="flex justify-between gap-3 text-xs"><span className="break-all">{factor.feature_name}</span><span className="shrink-0 tabular-nums text-muted-foreground">Mean |SHAP| {factor.mean_absolute_shap.toFixed(4)}</span></li>)}</ul><p className="mt-2 text-xs text-muted-foreground">SHAP values describe statistical associations, not causal effects.</p></div> : <Unavailable text="Global factor attribution summaries were not returned." />}
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-base">Segments</CardTitle><CardDescription>Cluster counts as returned by model processing.</CardDescription></CardHeader><CardContent>{segments.length ? <ul className="space-y-3">{segments.map(([name, count]) => <li key={name} className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm"><span>{name}</span><span className="tabular-nums text-muted-foreground">{count} snapshots</span></li>)}</ul> : <Unavailable text="No segment distribution was returned." />}</CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Processing quality</CardTitle><CardDescription>Warnings and blockers from dataset processing.</CardDescription></CardHeader><CardContent className="space-y-3">
              <p className="text-sm">{result.analysis_ready ? "Analysis structure ready" : "Analysis structure not ready"} · {result.label_construction_ready ? "Labels ready" : "Labels unavailable"} · {result.existing_model_scoring_ready ? "Model scoring ready" : "Model scoring unavailable"}</p>
              {result.scoring_blockers?.length > 0 && <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">{result.scoring_blockers.map((item, index) => <li key={`blocker-${index}`}>{item}</li>)}</ul>}
              {result.warnings?.length > 0 ? <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">{result.warnings.map((item, index) => <li key={`warning-${index}`}>{item}</li>)}</ul> : <p className="text-xs text-muted-foreground">No processing warnings returned.</p>}
              {result.rejection_summary && <p className="border-t border-border pt-3 text-xs text-muted-foreground">Rejected records: {formatNumber(result.rejection_summary.total_rejected)}</p>}
            </CardContent></Card>
          </section>
        </>
      )}
    </div>
  );
}

function Unavailable({ text }: { text: string }) {
  return <p className="rounded-md border border-dashed border-border px-3 py-5 text-center text-xs text-muted-foreground">{text}</p>;
}
