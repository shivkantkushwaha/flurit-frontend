"use client";

import React from "react";
import { ProcessingPreviewResponse } from "@/lib/types/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Users,
  Calendar,
  Layers,
  ShieldCheck,
  Loader2,
  AlertOctagon,
} from "lucide-react";

interface ProcessingPreviewStepProps {
  preview: ProcessingPreviewResponse;
  onExecuteProcess: () => void;
  onBack: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function ProcessingPreviewStep({
  preview,
  onExecuteProcess,
  onBack,
  isLoading,
  error,
}: ProcessingPreviewStepProps) {
  const hasBlockers = preview.scoring_blockers?.length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xl">Step 5: Pre-Flight Processing Preview</CardTitle>
              <CardDescription>
                Dry-run transformation verifying snapshot eligibility, account eligibility, and target construction prior to ML scoring.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs self-start sm:self-auto">
              Dry-Run Check Passed
            </Badge>
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

          {/* Key Dry-Run Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-border p-3.5 bg-muted/20">
              <span className="text-[11px] font-medium text-muted-foreground block">Total Input Records</span>
              <span className="text-xl font-bold text-foreground mt-0.5 block">
                {preview.total_input_rows.toLocaleString()}
              </span>
            </div>

            <div className="rounded-lg border border-border p-3.5 bg-muted/20">
              <span className="text-[11px] font-medium text-muted-foreground block">Estimated Eligible Accounts</span>
              <span className="text-xl font-bold text-foreground mt-0.5 block">
                {preview.estimated_eligible_accounts.toLocaleString()}
              </span>
            </div>

            <div className="rounded-lg border border-border p-3.5 bg-muted/20">
              <span className="text-[11px] font-medium text-muted-foreground block">Observation Dates</span>
              <span className="text-xl font-bold text-foreground mt-0.5 block">
                {preview.potential_observation_dates?.length || 1}
              </span>
            </div>

            <div className="rounded-lg border border-border p-3.5 bg-muted/20">
              <span className="text-[11px] font-medium text-muted-foreground block">Quarantined Records</span>
              <span className="text-xl font-bold text-foreground mt-0.5 block">
                {preview.rejection_summary?.total_rejected || 0}
              </span>
            </div>
          </div>

          {/* Feasible Observation Dates */}
          {preview.potential_observation_dates?.length > 0 && (
            <div className="rounded-lg border border-border p-4 bg-card space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Feasible Snapshot Observation Dates:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {preview.potential_observation_dates.map((date) => (
                  <Badge key={date} variant="secondary" className="font-mono text-xs">
                    {date}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Scoring Blockers Callout */}
          {hasBlockers && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Scoring Blockers Detected:</span>
              </div>
              <ul className="list-disc list-inside text-xs text-destructive/90 space-y-1">
                {preview.scoring_blockers.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings Callout */}
          {preview.warnings?.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/30 dark:border-amber-950 dark:bg-amber-950/10 p-4 space-y-1.5 text-xs text-amber-800 dark:text-amber-300">
              <div className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>Data Quality Notices:</span>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {preview.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Synchronous Processing Architecture Notice */}
          <div className="rounded-lg border border-border bg-muted/40 p-3.5 text-xs text-muted-foreground flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <span className="font-semibold text-foreground block">Synchronous Server Execution:</span>
              <p className="leading-relaxed">
                Processing runs on the server and may take several minutes for larger datasets. Keep this page open until the result is returned.
              </p>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <Button type="button" variant="outline" onClick={onBack} disabled={isLoading} className="gap-2">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to Readiness</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={onExecuteProcess}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Executing Synchronous Analysis...</span>
                </>
              ) : (
                <>
                  <span>Execute Full ML Processing</span>
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
