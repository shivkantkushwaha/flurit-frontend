"use client";

import React from "react";
import Link from "next/link";
import { EndToEndAnalysisResponse } from "@/lib/types/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  RotateCcw,
  BarChart3,
  Users,
  ShieldCheck,
  TrendingDown,
  Layers,
} from "lucide-react";

interface ProcessingExecutionStepProps {
  result: EndToEndAnalysisResponse;
  onReset: () => void;
}

export function ProcessingExecutionStep({ result, onReset }: ProcessingExecutionStepProps) {
  const isSuccess = result.processing_status === "SUCCESS";
  const isPartial = result.processing_status === "PARTIAL_SUCCESS";
  const isBlocked = result.processing_status === "BLOCKED";
  const isFailed = result.processing_status === "FAILED";

  const snap = result.snapshot_summary;
  const score = result.scoring_summary;

  const getStatusBadge = () => {
    if (isSuccess) {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 gap-1.5 text-xs py-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Processing Completed: SUCCESS</span>
        </Badge>
      );
    }
    if (isPartial) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300 gap-1.5 text-xs py-1">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Completed: PARTIAL_SUCCESS</span>
        </Badge>
      );
    }
    if (isBlocked) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-300 gap-1.5 text-xs py-1">
          <AlertOctagon className="h-3.5 w-3.5" />
          <span>Processing Blocked: Missing Features</span>
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 gap-1.5 text-xs py-1">
        <AlertOctagon className="h-3.5 w-3.5" />
        <span>Processing Failed</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xl">Step 6: Analysis Outcome & Summary</CardTitle>
              <CardDescription>
                Synchronous backend processing, snapshot extraction, and customer churn scoring completed.
              </CardDescription>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Outcome Highlights */}
          {snap && (
            <div>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Point-in-Time Snapshot Generation
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg border border-border p-3.5 bg-muted/20">
                  <span className="text-[11px] font-medium text-muted-foreground block">Snapshots Created</span>
                  <span className="text-xl font-bold text-foreground mt-0.5 block">
                    {snap.total_snapshots.toLocaleString()}
                  </span>
                </div>

                <div className="rounded-lg border border-border p-3.5 bg-muted/20">
                  <span className="text-[11px] font-medium text-muted-foreground block">Eligible Accounts</span>
                  <span className="text-xl font-bold text-foreground mt-0.5 block">
                    {snap.eligible_accounts_count.toLocaleString()}
                  </span>
                </div>

                <div className="rounded-lg border border-border p-3.5 bg-muted/20">
                  <span className="text-[11px] font-medium text-muted-foreground block">Observation Dates</span>
                  <span className="text-xl font-bold text-foreground mt-0.5 block">
                    {snap.observation_dates_count}
                  </span>
                </div>

                <div className="rounded-lg border border-border p-3.5 bg-muted/20">
                  <span className="text-[11px] font-medium text-muted-foreground block">Observed Churn Rate</span>
                  <span className="text-xl font-bold text-foreground mt-0.5 block">
                    {snap.churn_rate_pct !== undefined ? `${snap.churn_rate_pct.toFixed(1)}%` : "0.0%"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Model Scoring & Prioritization Summary */}
          {score && (
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                Model Scoring & Operational Risk Distribution
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-border p-3.5 bg-card">
                  <span className="text-[11px] font-medium text-muted-foreground block">High Risk (&ge; 0.50)</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-bold text-risk-high">{score.high_risk_count}</span>
                    <span className="text-xs text-muted-foreground">accounts</span>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-3.5 bg-card">
                  <span className="text-[11px] font-medium text-muted-foreground block">Moderate Risk (0.35 &ndash; 0.49)</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-bold text-amber-600">{score.moderate_risk_count}</span>
                    <span className="text-xs text-muted-foreground">accounts</span>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-3.5 bg-card">
                  <span className="text-[11px] font-medium text-muted-foreground block">Low Risk (&lt; 0.35)</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-bold text-emerald-600">{score.low_risk_count}</span>
                    <span className="text-xs text-muted-foreground">accounts</span>
                  </div>
                </div>
              </div>

              {/* Model Attribution Interpretation Notice */}
              <div className="rounded-lg border border-border bg-muted/30 p-3.5 text-xs text-muted-foreground leading-relaxed">
                <strong>Model Interpretation Notice:</strong> {score.score_interpretation_notice || "Flurit model churn scores represent uncalibrated operational risk rankings. Feature attributions denote correlational associations, not proven causal loss."}
              </div>
            </div>
          )}

          {/* Warnings & Next Steps */}
          {result.warnings?.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/20 dark:border-amber-950 dark:bg-amber-950/10 p-3.5 space-y-1.5 text-xs text-amber-800 dark:text-amber-300">
              <span className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <span>Processing Warnings:</span>
              </span>
              <ul className="list-disc list-inside space-y-0.5">
                {result.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation & Operational CTAs */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Button type="button" variant="outline" onClick={onReset} className="gap-2">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Upload Another Dataset</span>
            </Button>

            <div className="flex items-center gap-2">
              <Link href="/app">
                <Button variant="primary" className="gap-2">
                  <span>View Overview Dashboard</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
