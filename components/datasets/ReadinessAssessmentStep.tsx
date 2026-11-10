"use client";

import React from "react";
import { ReadinessAssessmentResponse } from "@/lib/types/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusIndicator } from "@/components/ui/status-indicator";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Sparkles,
  Layers,
  HelpCircle,
  Loader2,
} from "lucide-react";

interface ReadinessAssessmentStepProps {
  assessment: ReadinessAssessmentResponse;
  onProceedToPreview: () => void;
  onBack: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function ReadinessAssessmentStep({
  assessment,
  onProceedToPreview,
  onBack,
  isLoading,
  error,
}: ReadinessAssessmentStepProps) {
  const isReady = assessment.overall_status === "READY";
  const isPartial = assessment.overall_status === "PARTIALLY_READY";
  const isUnsupported = assessment.overall_status === "UNSUPPORTED";

  const coverage = assessment.feature_coverage;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xl">Step 4: Dataset Readiness Assessment</CardTitle>
              <CardDescription>
                Verification of historical temporal span, 60-day target feasibility, and 45-feature model coverage.
              </CardDescription>
            </div>
            <StatusIndicator
              status={assessment.overall_status}
              label={
                isReady
                  ? "Dataset Fully Ready"
                  : isPartial
                  ? "Partially Ready (Sentinel Defaults Active)"
                  : "Dataset Unsupported"
              }
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2"
            >
              <AlertOctagon className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Dual-Horizon Assessment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Label Construction Readiness */}
            <div
              className={`rounded-xl border p-4.5 space-y-2.5 ${
                assessment.target_readiness === "READY"
                  ? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-950 dark:bg-emerald-950/10"
                  : "border-amber-200 bg-amber-50/20 dark:border-amber-950 dark:bg-amber-950/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span>Target Horizon Readiness</span>
                </span>
                <StatusIndicator status={assessment.target_readiness} />
              </div>
              <h4 className="text-sm font-semibold text-foreground">
                60-Day Forward Observation Feasibility
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {assessment.target_readiness_reason ||
                  "Verifies historical date range spans at least 150 days to construct point-in-time snapshots without target leakage."}
              </p>
            </div>

            {/* Model Feature Coverage Readiness */}
            <div
              className={`rounded-xl border p-4.5 space-y-2.5 ${
                assessment.scoring_readiness === "READY"
                  ? "border-emerald-200 bg-emerald-50/20 dark:border-emerald-950 dark:bg-emerald-950/10"
                  : "border-amber-200 bg-amber-50/20 dark:border-amber-950 dark:bg-amber-950/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span>Scoring Readiness</span>
                </span>
                <StatusIndicator status={assessment.scoring_readiness} />
              </div>
              <h4 className="text-sm font-semibold text-foreground">
                Feature Coverage: {coverage.covered_percentage}% ({coverage.covered_features}/{coverage.total_features} Canonical Features)
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {assessment.scoring_readiness_reason ||
                  "Verifies that required subscription and usage signals are mapped or provided with robust sentinel defaults."}
              </p>
            </div>
          </div>

          {/* Feature Coverage Details */}
          <div className="rounded-xl border border-border p-4.5 bg-card space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Model Input Feature Coverage</span>
              <span className="font-mono text-muted-foreground">
                {coverage.covered_features} covered &bull; {coverage.missing_features} unmapped &bull;{" "}
                {coverage.defaulted_with_sentinels?.length || 0} defaulted
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  coverage.covered_percentage >= 90
                    ? "bg-emerald-500"
                    : coverage.covered_percentage >= 60
                    ? "bg-amber-500"
                    : "bg-destructive"
                }`}
                style={{ width: `${coverage.covered_percentage}%` }}
              />
            </div>

            {/* Defaulted Sentinel Features Callout */}
            {coverage.defaulted_with_sentinels?.length > 0 && (
              <div className="pt-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Features using sentinel defaults: </span>
                <span className="font-mono text-[11px]">
                  {coverage.defaulted_with_sentinels.slice(0, 8).join(", ")}
                  {coverage.defaulted_with_sentinels.length > 8 && ` (+${coverage.defaulted_with_sentinels.length - 8} more)`}
                </span>
              </div>
            )}
          </div>

          {/* Validation Issues & Recommendations */}
          {(assessment.validation_issues?.length > 0 || assessment.recommendations?.length > 0) && (
            <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-3 text-xs">
              {assessment.validation_issues?.map((issue, idx) => (
                <div key={idx} className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>{issue.severity.toUpperCase()}:</strong> {issue.message}
                  </span>
                </div>
              ))}

              {assessment.recommendations?.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <Button type="button" variant="outline" onClick={onBack} disabled={isLoading} className="gap-2">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Modify Mappings</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={onProceedToPreview}
              disabled={isUnsupported || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Running Dry-Run Preview...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Processing Preview</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
