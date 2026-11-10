"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import {
  WorkspaceState,
  FIXTURE_NO_DATASET,
} from "@/lib/services/workspace";
import { EndToEndAnalysisResponse } from "@/lib/types/api";
import { onboardingApi } from "@/lib/api/onboarding";

interface WorkspaceContextValue {
  state: WorkspaceState;
  hasCustomAnalysis: boolean;
  analysisLoad: "loading" | "ready" | "error";
  setAnalysisResult: (result: EndToEndAnalysisResponse, files: File[]) => void;
  resetWorkspace: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

export function WorkspaceProvider({ children, userId }: { children: React.ReactNode; userId?: string }) {
  const storageKey = userId ? `flurit_workspace_analysis:${userId}` : null;
  const [state, setState] = useState<WorkspaceState>(() => {
    // Check if there is stored analysis in session storage
    if (typeof window !== "undefined" && storageKey) {
      try {
        const saved = sessionStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as WorkspaceState;
          if (parsed.dataSource === "live") return parsed;
        }
      } catch {
        // ignore
      }
    }
    return FIXTURE_NO_DATASET;
  });

  const hasCustomAnalysis = state.dataSource === "live" && !!state.analysisResult;

  const [analysisLoad, setAnalysisLoad] = useState<WorkspaceContextValue["analysisLoad"]>(userId ? "loading" : "ready");
  const revision = useRef(0);
  const applyAnalysis = useCallback((result: EndToEndAnalysisResponse, datasetName: string | null, fileCount: number, completedAt: string | null) => {
    const isSuccess = result.processing_status === "SUCCESS" || result.processing_status === "PARTIAL_SUCCESS";
    const scoredSummary = result.scoring_summary;
    const snapSummary = result.snapshot_summary;

    const persistedAccounts = result.persisted_summary?.persisted_accounts;
    const totalAccounts = snapSummary?.eligible_accounts_count ?? (typeof persistedAccounts === "number" ? persistedAccounts : null);
    const highRisk = scoredSummary?.high_risk_count ?? null;
    const scoredCount = scoredSummary?.scored_snapshots_count;
    const highRiskPct = scoredCount && highRisk !== null ? Math.round((highRisk / scoredCount) * 1000) / 10 : null;

    let totalRevenueAtRisk: number | null = null;
    if (scoredSummary?.prioritization_quadrants) {
      totalRevenueAtRisk = scoredSummary.prioritization_quadrants.reduce(
        (acc, q) => acc + (q.estimated_revenue_at_risk_mrr || 0),
        0
      );
    }

    const newState: WorkspaceState = {
      status: isSuccess ? "ANALYSIS_AVAILABLE" : "PROCESSING_FAILED",
      dataSource: "live",
      datasetName,
      datasetFileCount: fileCount,
      metrics: {
        totalAccounts,
        highRiskCount: highRisk,
        highRiskPercentage: highRiskPct,
        revenueAtRiskMrr: totalRevenueAtRisk,
        datasetStatus: isSuccess ? "Processed & Ready" : "Processing Incomplete",
        lastAnalysisTimestamp: completedAt,
        observationDate: snapSummary?.observation_dates?.at(-1) ?? null,
      },
      nextSteps: [
        {
          id: "step-1",
          title: "Upload customer subscription & usage CSVs",
          description: "Dataset files were parsed by the server.",
          completed: true,
          actionLabel: "View Datasets",
          actionHref: "/app/datasets",
        },
        {
          id: "step-2",
          title: "Verify schema readiness & feature coverage",
          description: "Concept schema mapping validated by backend.",
          completed: true,
          actionLabel: "Readiness Report",
          actionHref: "/app/datasets",
        },
        {
          id: "step-3",
          title: "Execute point-in-time snapshot scoring",
          description: `Completed analysis with status: ${result.processing_status}.`,
          completed: isSuccess,
          actionLabel: "Re-run Processing",
          actionHref: "/app/datasets",
        },
        {
          id: "step-4",
          title: "Explore customer risk roster & prioritize retention",
          description: "Review scored accounts and high-priority retention interventions.",
          completed: false,
          actionLabel: "Explore Customers",
          actionHref: "/app/customers",
        },
      ],
      sampleCustomers: [],
      warnings: result.warnings || [],
      analysisResult: result,
    };

    setState(newState);
    if (typeof window !== "undefined" && storageKey) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(newState));
      } catch {
        // ignore
      }
    }
  }, [storageKey]);

  const setAnalysisResult = useCallback((result: EndToEndAnalysisResponse, files: File[]) => {
    revision.current += 1;
    applyAnalysis(result, files.map((file) => file.name).join(", "), files.length, new Date().toISOString());
    setAnalysisLoad("ready");
  }, [applyAnalysis]);

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    const currentRevision = revision.current;
    const isCurrent = () => !controller.signal.aborted && currentRevision === revision.current;
    onboardingApi.latestAnalysis(controller.signal).then((saved) => {
      if (!isCurrent()) return;
      if (saved) {
        applyAnalysis(saved.result_summary, saved.dataset_name, 0, saved.completed_at);
      }
      setAnalysisLoad("ready");
    }).catch(() => {
      if (isCurrent()) setAnalysisLoad("error");
    });
    return () => controller.abort();
  }, [applyAnalysis, userId]);

  const resetWorkspace = useCallback(() => {
    revision.current += 1;
    setAnalysisLoad("ready");
    setState(FIXTURE_NO_DATASET);
    if (typeof window !== "undefined" && storageKey) {
      try {
        sessionStorage.removeItem(storageKey);
      } catch {
        // ignore
      }
    }
  }, [storageKey]);

  return (
    <WorkspaceContext.Provider value={{ state, hasCustomAnalysis, analysisLoad, setAnalysisResult, resetWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
