import { EndToEndAnalysisResponse, ReadinessStatus } from "@/lib/types/api";

export type WorkspaceStatus =
  | "NO_DATASET"
  | "DATASET_AVAILABLE_NOT_READY"
  | "DATASET_READY"
  | "PROCESSING"
  | "ANALYSIS_AVAILABLE"
  | "PROCESSING_FAILED";

export type DataSourceType = "live" | "sample-fixture" | "empty";

export interface WorkspaceMetrics {
  totalAccounts: number | null;
  highRiskCount: number | null;
  highRiskPercentage: number | null;
  revenueAtRiskMrr: number | null;
  datasetStatus: string;
  lastAnalysisTimestamp: string | null;
  observationDate: string | null;
}

export interface WorkspaceNextStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  actionLabel?: string;
  actionHref?: string;
}

export interface SampleCustomerRow {
  id: string;
  plan: string;
  mrr: number;
  tenureMonths: number;
  riskScore: number;
  riskTier: "High Risk" | "Moderate Risk" | "Low Risk";
  topRiskFactor: string;
}

export interface WorkspaceState {
  status: WorkspaceStatus;
  dataSource: DataSourceType;
  datasetName: string | null;
  datasetFileCount: number;
  metrics: WorkspaceMetrics;
  nextSteps: WorkspaceNextStep[];
  sampleCustomers: SampleCustomerRow[];
  warnings: string[];
  errorMessage?: string;
  analysisResult?: EndToEndAnalysisResponse;
}

/**
 * Deterministic Workspace State Fixtures for Development & Verification.
 * Strictly separates sample benchmark fixtures from live production states.
 */

// State 1: Analysis Available (Synthetic RavenStack Benchmark Fixture)
export const FIXTURE_ANALYSIS_AVAILABLE: WorkspaceState = {
  status: "ANALYSIS_AVAILABLE",
  dataSource: "sample-fixture",
  datasetName: "ravenstack-synthetic-benchmark.csv",
  datasetFileCount: 3,
  metrics: {
    totalAccounts: 420,
    highRiskCount: 112,
    highRiskPercentage: 26.6,
    revenueAtRiskMrr: 34200,
    datasetStatus: "Ready (60d Window)",
    lastAnalysisTimestamp: "2024-04-01T12:00:00Z",
    observationDate: "2024-04-01",
  },
  nextSteps: [
    {
      id: "step-1",
      title: "Upload customer subscription & usage CSVs",
      description: "Ingest structured accounts, subscriptions, and telemetry records.",
      completed: true,
      actionLabel: "View Datasets",
      actionHref: "/app/datasets",
    },
    {
      id: "step-2",
      title: "Verify schema readiness & feature coverage",
      description: "Automated pre-flight checks confirmed 45/45 canonical features mapped.",
      completed: true,
      actionLabel: "Readiness Report",
      actionHref: "/app/datasets",
    },
    {
      id: "step-3",
      title: "Execute point-in-time snapshot scoring",
      description: "60-day forward prediction completed with zero lookahead target leakage.",
      completed: true,
      actionLabel: "Re-run Scoring",
      actionHref: "/app/analytics",
    },
    {
      id: "step-4",
      title: "Explore customer risk roster & prioritize retention",
      description: "Cross-classify accounts onto the Value × Risk matrix for CS outreach.",
      completed: false,
      actionLabel: "Explore Customers",
      actionHref: "/app/customers",
    },
  ],
  sampleCustomers: [
    {
      id: "cust_rvn_0481",
      plan: "Enterprise",
      mrr: 3200,
      tenureMonths: 18,
      riskScore: 0.84,
      riskTier: "High Risk",
      topRiskFactor: "Weekly active seats dropped -62% MoM",
    },
    {
      id: "cust_rvn_0219",
      plan: "Growth",
      mrr: 1100,
      tenureMonths: 7,
      riskScore: 0.72,
      riskTier: "High Risk",
      topRiskFactor: "Support ticket volume +400% with open P1",
    },
    {
      id: "cust_rvn_0904",
      plan: "Starter",
      mrr: 250,
      tenureMonths: 14,
      riskScore: 0.46,
      riskTier: "Moderate Risk",
      topRiskFactor: "Zero admin logins for 21 consecutive days",
    },
    {
      id: "cust_rvn_0733",
      plan: "Growth",
      mrr: 850,
      tenureMonths: 4,
      riskScore: 0.41,
      riskTier: "Moderate Risk",
      topRiskFactor: "Secondary payment retry failed",
    },
    {
      id: "cust_rvn_0112",
      plan: "Enterprise",
      mrr: 4500,
      tenureMonths: 28,
      riskScore: 0.18,
      riskTier: "Low Risk",
      topRiskFactor: "Consistent API consumption (+12% MoM)",
    },
  ],
  warnings: [],
};

// State 2: First-Run / No Dataset Configured
export const FIXTURE_NO_DATASET: WorkspaceState = {
  status: "NO_DATASET",
  dataSource: "empty",
  datasetName: null,
  datasetFileCount: 0,
  metrics: {
    totalAccounts: null,
    highRiskCount: null,
    highRiskPercentage: null,
    revenueAtRiskMrr: null,
    datasetStatus: "No dataset configured",
    lastAnalysisTimestamp: null,
    observationDate: null,
  },
  nextSteps: [
    {
      id: "step-1",
      title: "Upload customer subscription & usage CSVs",
      description: "Upload your accounts, subscriptions, and telemetry CSV files to begin.",
      completed: false,
      actionLabel: "Upload Dataset",
      actionHref: "/app/datasets",
    },
    {
      id: "step-2",
      title: "Verify schema readiness & feature coverage",
      description: "Automated pre-flight checks verify historical span meets 60-day requirement.",
      completed: false,
    },
    {
      id: "step-3",
      title: "Execute point-in-time snapshot scoring",
      description: "Generate point-in-time snapshots and compute operational risk rankings.",
      completed: false,
    },
    {
      id: "step-4",
      title: "Explore customer risk roster & prioritize retention",
      description: "Review accounts grouped by Value × Risk priority quadrants.",
      completed: false,
    },
  ],
  sampleCustomers: [],
  warnings: [
    "No customer or subscription datasets have been configured for this workspace.",
  ],
};

// State 3: Dataset Available But Not Ready (Missing Telemetry)
export const FIXTURE_NOT_READY: WorkspaceState = {
  status: "DATASET_AVAILABLE_NOT_READY",
  dataSource: "sample-fixture",
  datasetName: "partial_export_2024.csv",
  datasetFileCount: 1,
  metrics: {
    totalAccounts: 210,
    highRiskCount: null,
    highRiskPercentage: null,
    revenueAtRiskMrr: null,
    datasetStatus: "Partially Ready (Missing Telemetry)",
    lastAnalysisTimestamp: null,
    observationDate: null,
  },
  nextSteps: [
    {
      id: "step-1",
      title: "Upload customer subscription & usage CSVs",
      description: "Initial accounts CSV uploaded. Telemetry usage file is required.",
      completed: true,
      actionLabel: "Add Usage CSV",
      actionHref: "/app/datasets",
    },
    {
      id: "step-2",
      title: "Verify schema readiness & feature coverage",
      description: "Readiness blocked: Missing 12 telemetry features. Default sentinels required.",
      completed: false,
      actionLabel: "Review Schema",
      actionHref: "/app/datasets",
    },
    {
      id: "step-3",
      title: "Execute point-in-time snapshot scoring",
      description: "Blocked until schema requirements are satisfied.",
      completed: false,
    },
    {
      id: "step-4",
      title: "Explore customer risk roster & prioritize retention",
      description: "Pending analysis completion.",
      completed: false,
    },
  ],
  sampleCustomers: [],
  warnings: [
    "Feature coverage is 73.3% (33/45 features mapped). Upload feature_usage.csv to enable full scoring.",
  ],
};

// State 4: Processing Error
export const FIXTURE_PROCESSING_FAILED: WorkspaceState = {
  status: "PROCESSING_FAILED",
  dataSource: "sample-fixture",
  datasetName: "corrupted_snapshots_2024.csv",
  datasetFileCount: 2,
  metrics: {
    totalAccounts: null,
    highRiskCount: null,
    highRiskPercentage: null,
    revenueAtRiskMrr: null,
    datasetStatus: "Processing Failed",
    lastAnalysisTimestamp: null,
    observationDate: null,
  },
  nextSteps: [
    {
      id: "step-1",
      title: "Upload customer subscription & usage CSVs",
      description: "Files uploaded but historical depth check failed.",
      completed: true,
      actionLabel: "Re-upload",
      actionHref: "/app/datasets",
    },
    {
      id: "step-2",
      title: "Verify schema readiness & feature coverage",
      description: "Schema check failed: Historical date range span is only 32 days (< 150d required).",
      completed: false,
      actionLabel: "Inspect Errors",
      actionHref: "/app/datasets",
    },
  ],
  sampleCustomers: [],
  warnings: [
    "Temporal span audit: Dataset only spans 32 days. Minimum required span for 60-day prediction horizon is 150 days.",
  ],
  errorMessage:
    "Dataset span insufficient: Historical data must span at least 150 days to construct valid 60-day observation windows without target leakage.",
};

/**
 * Service to retrieve the current workspace state.
 * Supports deterministic state switching for development and review.
 */
export async function getWorkspaceState(
  stateOverride?: WorkspaceStatus
): Promise<WorkspaceState> {
  // If explicitly overridden for development preview, return specified fixture
  if (stateOverride) {
    switch (stateOverride) {
      case "NO_DATASET":
        return FIXTURE_NO_DATASET;
      case "DATASET_AVAILABLE_NOT_READY":
        return FIXTURE_NOT_READY;
      case "PROCESSING_FAILED":
        return FIXTURE_PROCESSING_FAILED;
      case "ANALYSIS_AVAILABLE":
      default:
        return FIXTURE_ANALYSIS_AVAILABLE;
    }
  }

  // Default to an empty workspace. Benchmark data is available only through
  // explicitly labeled marketing previews, never as workspace analytics.
  return FIXTURE_NO_DATASET;
}
