import React from "react";
import { render, screen } from "@testing-library/react";
import AnalyticsPage from "@/app/(app)/app/analytics/page";
import { useWorkspace } from "@/components/workspace/WorkspaceContext";

jest.mock("@/components/workspace/WorkspaceContext", () => ({ useWorkspace: jest.fn() }));
jest.mock("next/navigation", () => ({ usePathname: () => "/app/analytics" }));

const mockUseWorkspace = useWorkspace as jest.Mock;

describe("Analytics insights", () => {
  it("shows an honest empty state before processing", () => {
    mockUseWorkspace.mockReturnValue({ state: { dataSource: "empty" }, hasCustomAnalysis: false });
    render(<AnalyticsPage />);
    expect(screen.getByText("No processing results available")).toBeInTheDocument();
    expect(screen.getByText(/Run dataset onboarding/i)).toBeInTheDocument();
  });

  it("renders available partial aggregates and interpretation disclosures", () => {
    mockUseWorkspace.mockReturnValue({
      hasCustomAnalysis: true,
      state: {
        datasetName: "accounts.csv", datasetFileCount: 2, warnings: [],
        analysisResult: {
          processing_status: "PARTIAL_SUCCESS", analysis_ready: true, label_construction_ready: true, existing_model_scoring_ready: false,
          scoring_blockers: ["Model unavailable"], warnings: ["Partial response"],
          rejection_summary: { total_rejected: 3, rejected_by_table: {}, reasons: [] },
          snapshot_summary: { total_snapshots: 10, observation_dates_count: 1, observation_dates: ["2026-10-01"], eligible_accounts_count: 8, positive_targets_count: 2, negative_targets_count: 6, censored_targets_count: 0, churn_rate_pct: 25 },
          scoring_summary: { scored_snapshots_count: 8, model_name: "RavenStack", model_version: "1.2", average_model_score: 0.4, high_risk_count: 2, moderate_risk_count: 3, low_risk_count: 3, segments_distribution: { "0": 4, "1": 4 }, prioritization_quadrants: [], top_global_risk_increasing_factors: [{ feature_name: "usage_count_30d", mean_absolute_shap: 0.3 }], score_interpretation_notice: "Uncalibrated operational relative-risk ranking." },
        },
      },
    });
    render(<AnalyticsPage />);
    expect(screen.getByText("25.0%")).toBeInTheDocument();
    expect(screen.getByText("2026-10-01")).toBeInTheDocument();
    expect(screen.getByText(/not calibrated churn probabilities/i)).toBeInTheDocument();
    expect(screen.getByText(/SHAP values describe statistical associations/i)).toBeInTheDocument();
    expect(screen.getByText(/no trend is inferred from an aggregate rate/i)).toBeInTheDocument();
    expect(screen.getByText(/No prioritization values were returned/i)).toBeInTheDocument();
  });
});
