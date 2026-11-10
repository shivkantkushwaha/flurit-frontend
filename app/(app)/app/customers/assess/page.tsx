"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { predictionsApi } from "@/lib/api/predictions";
import { FluritApiError } from "@/lib/api/errors";
import { CanonicalFeaturesSchema } from "@/lib/schemas/features";
import type { CustomerRiskResponse } from "@/lib/types/api";

const example = `Paste a JSON object with all 45 canonical features, for example:\n{\n  "account_age_days": 120,\n  "account_industry": "...",\n  "account_country": "...",\n  ...\n}`;

function isCompleteAssessment(value: unknown): value is CustomerRiskResponse {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<CustomerRiskResponse>;
  const hasFactors = (factors: unknown): boolean => Array.isArray(factors) && factors.every((factor) =>
    !!factor && typeof factor === "object" &&
    typeof factor.feature_name === "string" && typeof factor.attribution === "number" &&
    (factor.direction === "increases_risk" || factor.direction === "decreases_risk") &&
    typeof factor.feature_description === "string" && "feature_value" in factor
  );
  return typeof result.model_score === "number" && typeof result.risk_tier === "string" &&
    typeof result.account_id === "string" && typeof result.snapshot_date === "string" &&
    typeof result.model_version === "string" && typeof result.predicted_risk_label === "number" &&
    typeof result.decision_threshold === "number" && typeof result.segment_id === "number" &&
    typeof result.segment_name === "string" && typeof result.segment_summary === "string" &&
    hasFactors(result.top_risk_increasing_factors) && hasFactors(result.top_risk_decreasing_factors) &&
    typeof result.plain_language_summary === "string" && typeof result.score_interpretation === "string" &&
    typeof result.association_disclaimer === "string";
}

export default function CustomerAssessmentPage() {
  const [accountId, setAccountId] = useState("");
  const [snapshotDate, setSnapshotDate] = useState("");
  const [featureJson, setFeatureJson] = useState("");
  const [assessment, setAssessment] = useState<CustomerRiskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAssessment(null);
    setError(null);

    let rawFeatures: unknown;
    try {
      rawFeatures = JSON.parse(featureJson);
    } catch {
      setError("Features must be valid JSON.");
      return;
    }
    const parsed = CanonicalFeaturesSchema.safeParse(rawFeatures);
    if (!parsed.success) {
      setError(`Feature snapshot is incomplete or invalid: ${parsed.error.issues.slice(0, 3).map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")}`);
      return;
    }

    setIsLoading(true);
    try {
      const result = await predictionsApi.getCustomerRisk(accountId.trim(), {
        ...(snapshotDate ? { snapshot_date: snapshotDate } : {}),
        features: parsed.data,
      });
      if (!isCompleteAssessment(result)) {
        setError("The backend returned a partial assessment. Risk details are withheld until the response is complete.");
      } else {
        setAssessment(result);
      }
    } catch (requestError) {
      if (requestError instanceof FluritApiError && requestError.status === 401) {
        setError("Your session is no longer authorized. Sign in again, then retry the assessment.");
      } else if (requestError instanceof FluritApiError && requestError.status === 403) {
        setError("This account is not available in the active workspace.");
      } else if (requestError instanceof FluritApiError && requestError.code === "TIMEOUT_ERROR") {
        setError("The assessment took too long. Check the account and retry.");
      } else {
        setError(requestError instanceof Error ? requestError.message : "The assessment could not be completed.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/app/customers" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />Back to customers</Link>
      <PageHeader title="Customer risk assessment" description="Submit a point in time feature snapshot for one account. Requests use the existing authenticated API client." />

      <Card>
        <CardHeader><CardTitle className="text-base">Assessment inputs</CardTitle><CardDescription>All 45 canonical feature values must come from your customer data. Nothing is inferred or defaulted.</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-xs font-medium">Account ID<input required value={accountId} onChange={(event) => setAccountId(event.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm font-normal" autoComplete="off" /></label>
              <label className="space-y-1.5 text-xs font-medium">Snapshot date <span className="font-normal text-muted-foreground">(optional)</span><input type="date" value={snapshotDate} onChange={(event) => setSnapshotDate(event.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm font-normal" /></label>
            </div>
            <label className="block space-y-1.5 text-xs font-medium">Canonical features JSON
              <textarea required value={featureJson} onChange={(event) => setFeatureJson(event.target.value)} rows={12} placeholder={example} spellCheck={false} className="w-full rounded-md border border-input bg-background p-3 font-mono text-xs leading-relaxed" />
            </label>
            {error && <div role="alert" className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
            <Button type="submit" disabled={isLoading || !accountId.trim() || !featureJson.trim()} isLoading={isLoading}>
              {isLoading ? "Assessing…" : "Request risk assessment"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {assessment && <AssessmentResult result={assessment} />}
    </div>
  );
}

function AssessmentResult({ result }: { result: CustomerRiskResponse }) {
  const riskVariant = result.risk_tier === "High Risk" ? "risk-high" : result.risk_tier === "Moderate Risk" ? "risk-moderate" : "risk-low";
  const factors = [...result.top_risk_increasing_factors, ...result.top_risk_decreasing_factors];
  return (
    <section aria-live="polite" className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div><CardTitle className="text-base">Assessment result{result.account_id ? ` · ${result.account_id}` : ""}</CardTitle><CardDescription>Generated for snapshot {result.snapshot_date || "date not returned"}{result.model_version ? ` · Model ${result.model_version}` : ""}</CardDescription></div>
          <Badge variant={riskVariant} showIcon>{result.risk_tier}</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Operational relative-risk score</p><p className="mt-1 text-2xl font-semibold tabular-nums">{result.model_score.toFixed(3)}</p><p className="mt-2 text-xs text-muted-foreground">{result.score_interpretation}</p></div>
          <div className="rounded-md bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Behavioral segment</p><p className="mt-1 text-sm font-semibold">{result.segment_name || "Unavailable"}</p><p className="mt-2 text-xs text-muted-foreground">{result.segment_summary || "No segment summary returned."}</p></div>
          <div className="sm:col-span-2"><p className="text-sm leading-relaxed">{result.plain_language_summary || "No summary returned."}</p></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Returned risk factors</CardTitle><CardDescription>These are statistical associations reported by the model, not causal explanations.</CardDescription></CardHeader>
        <CardContent>
          {factors.length ? <ul className="divide-y divide-border">{factors.map((factor, index) => <li key={`${factor.feature_name}-${index}`} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium">{factor.feature_description || factor.feature_name}</p><p className="text-xs text-muted-foreground">{factor.feature_name}: {String(factor.feature_value)}</p></div><span className={`text-xs font-medium ${factor.direction === "increases_risk" ? "text-risk-high" : "text-risk-low"}`}>{factor.direction === "increases_risk" ? "Risk increasing" : "Risk decreasing"} · {factor.attribution.toFixed(4)}</span></li>)}</ul> : <p className="py-4 text-sm text-muted-foreground">No factor attributions were returned.</p>}
          <div className="mt-3 rounded-md border border-border p-3 text-xs leading-relaxed text-muted-foreground"><CheckCircle2 className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" />{result.association_disclaimer}</div>
        </CardContent>
      </Card>
      <p className="text-[11px] leading-relaxed text-muted-foreground">Risk scores are uncalibrated operational rankings, not calibrated churn probabilities. No retention action is prescribed by this score alone.</p>
    </section>
  );
}
