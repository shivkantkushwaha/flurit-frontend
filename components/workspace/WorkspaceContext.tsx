"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  WorkspaceState,
  WorkspaceStatus,
  FIXTURE_NO_DATASET,
} from "@/lib/services/workspace";
import { EndToEndAnalysisResponse } from "@/lib/types/api";

interface WorkspaceContextValue {
  state: WorkspaceState;
  hasCustomAnalysis: boolean;
  setAnalysisResult: (result: EndToEndAnalysisResponse, files: File[]) => void;
  resetWorkspace: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkspaceState>(() => {
    // Check if there is stored analysis in session storage
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("flurit_active_workspace_state");
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

  const [hasCustomAnalysis, setHasCustomAnalysis] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("flurit_active_workspace_state");
      return !!saved && (JSON.parse(saved) as WorkspaceState).dataSource === "live";
    }
    return false;
  });

  const setAnalysisResult = useCallback((result: EndToEndAnalysisResponse, files: File[]) => {
    const isSuccess = result.processing_status === "SUCCESS" || result.processing_status === "PARTIAL_SUCCESS";
    const scoredSummary = result.scoring_summary;
    const snapSummary = result.snapshot_summary;

    const totalAccounts = snapSummary?.eligible_accounts_count ?? scoredSummary?.scored_snapshots_count ?? null;
    const highRisk = scoredSummary?.high_risk_count ?? null;
    const highRiskPct = totalAccounts && highRisk !== null ? Math.round((highRisk / totalAccounts) * 1000) / 10 : null;

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
      datasetName: files.map((f) => f.name).join(", "),
      datasetFileCount: files.length,
      metrics: {
        totalAccounts,
        highRiskCount: highRisk,
        highRiskPercentage: highRiskPct,
        revenueAtRiskMrr: totalRevenueAtRisk,
        datasetStatus: isSuccess ? "Processed & Ready" : "Processing Incomplete",
        lastAnalysisTimestamp: new Date().toISOString(),
        observationDate: snapSummary?.observation_dates?.[0] ?? new Date().toISOString().split("T")[0],
      },
      nextSteps: [
        {
          id: "step-1",
          title: "Upload customer subscription & usage CSVs",
          description: `Uploaded and parsed ${files.length} dataset files.`,
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
    setHasCustomAnalysis(true);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("flurit_active_workspace_state", JSON.stringify(newState));
      } catch {
        // ignore
      }
    }
  }, []);

  const resetWorkspace = useCallback(() => {
    setState(FIXTURE_NO_DATASET);
    setHasCustomAnalysis(false);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("flurit_active_workspace_state");
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <WorkspaceContext.Provider value={{ state, hasCustomAnalysis, setAnalysisResult, resetWorkspace }}>
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
