import { CanonicalFeatures } from "./features";

/**
 * Standard Flurit API Error response structure from FastAPI backend.
 */
export interface ApiErrorPayload {
  detail?: string | Array<{ loc: (string | number)[]; msg: string; type: string }>;
  error_code?: string;
  message?: string;
}

// ---------------------------------------------------------------------------
// 1. Prediction Scoring Contracts (Phase 8)
// ---------------------------------------------------------------------------

export interface ScorePredictionRequest {
  account_id?: string | null;
  snapshot_date?: string | null;
  features: CanonicalFeatures;
}

export type RiskTier = "High Risk" | "Moderate Risk" | "Low Risk";

export interface ScorePredictionResponse {
  account_id?: string | null;
  snapshot_date?: string | null;
  model_name: string;
  model_version: string;
  model_score: number;
  predicted_risk_label: 0 | 1;
  decision_threshold: number;
  risk_tier: RiskTier;
  score_interpretation: string;
}

// ---------------------------------------------------------------------------
// 2. Customer Risk & SHAP Explanation Contracts (Phase 8 & 7)
// ---------------------------------------------------------------------------

export interface CustomerRiskRequest {
  snapshot_date?: string | null;
  features: CanonicalFeatures;
}

export interface ShapFactorAttribution {
  feature_name: string;
  feature_value: number | string;
  attribution: number;
  direction: "increases_risk" | "decreases_risk";
  feature_description: string;
}

export interface CustomerRiskResponse {
  account_id: string;
  snapshot_date: string;
  model_version: string;
  model_score: number;
  predicted_risk_label: 0 | 1;
  decision_threshold: number;
  risk_tier: RiskTier;
  segment_id: number;
  segment_name: string;
  segment_summary: string;
  top_risk_increasing_factors: ShapFactorAttribution[];
  top_risk_decreasing_factors: ShapFactorAttribution[];
  plain_language_summary: string;
  association_disclaimer: string;
  score_interpretation: string;
}

// ---------------------------------------------------------------------------
// 3. Value x Risk Prioritization Contracts (Phase 8 & 7)
// ---------------------------------------------------------------------------

export interface PrioritizationRecord {
  account_id: string;
  sub_current_mrr: number;
  model_score: number;
}

export interface PrioritizationRequest {
  records: PrioritizationRecord[];
  mrr_high_threshold?: number;
  mrr_mid_threshold?: number;
  score_high_threshold?: number;
  score_mid_threshold?: number;
}

export interface QuadrantItem {
  quadrant_name: string;
  priority_level: number;
  account_count: number;
  account_percentage: number;
  total_mrr: number;
  estimated_revenue_at_risk_mrr: number;
  action_recommendation: string;
}

export interface PrioritizationResponse {
  total_accounts: number;
  total_mrr: number;
  total_estimated_revenue_at_risk_mrr: number;
  quadrants: QuadrantItem[];
  risk_metric_interpretation: string;
}

// ---------------------------------------------------------------------------
// 4. Dataset Onboarding & Schema Mapping Contracts (FastAPI openapi.json Verified)
// ---------------------------------------------------------------------------

export type ReadinessStatus = "READY" | "PARTIALLY_READY" | "UNSUPPORTED";

export interface ColumnProfile {
  column_name: string;
  inferred_type: string;
  null_count: number;
  null_percentage: number;
  unique_count: number;
  unique_ratio?: number;
  min_value?: string | number | null;
  max_value?: string | number | null;
  sample_values: Array<string | number>;
  date_range?: {
    earliest?: string;
    latest?: string;
    days_span?: number;
  } | null;
}

export interface DatasetProfile {
  file_name: string;
  file_size_bytes: number;
  row_count: number;
  column_count: number;
  duplicate_row_count: number;
  candidate_id_columns: string[];
  candidate_target_columns: string[];
  columns: ColumnProfile[];
  date_range?: {
    start_date?: string;
    end_date?: string;
    span_days?: number;
  } | null;
}

/** Legacy table profile structure for mock compatibility */
export interface TableProfile {
  table_name: string;
  row_count: number;
  column_count: number;
  file_size_bytes: number;
  duplicate_rows: number;
  columns: Record<string, ColumnProfile>;
  candidate_id_columns: string[];
  candidate_target_columns: string[];
}

export interface DatasetProfileResponse {
  success?: boolean;
  message?: string;
  datasets: DatasetProfile[] | Record<string, TableProfile>;
  total_files?: number;
  total_rows?: number;
  profiling_duration_seconds?: number;
}

export interface AccountConceptMapping {
  account_id: string; // Required
  signup_date: string; // Required
  industry?: string | null;
  country?: string | null;
  referral_source?: string | null;
  initial_seats?: string | null;
  is_trial?: string | null;
}

export interface SubscriptionConceptMapping {
  subscription_id: string; // Required
  account_id: string; // Required
  start_date: string; // Required
  end_date?: string | null;
  mrr?: string | null;
  arr?: string | null;
  seats?: string | null;
  billing_frequency?: string | null;
  auto_renew?: string | null;
  is_trial?: string | null;
  status?: string | null;
}

export interface FeatureUsageConceptMapping {
  event_time: string; // Required
  account_id?: string | null;
  subscription_id?: string | null;
  usage_id?: string | null;
  usage_count?: string | null;
  feature_name?: string | null;
  duration_secs?: string | null;
  is_error?: string | null;
  is_beta?: string | null;
}

export interface SupportTicketsConceptMapping {
  ticket_id: string; // Required
  account_id: string; // Required
  created_at: string; // Required
  closed_at?: string | null;
  status?: string | null;
  priority?: string | null;
  satisfaction_score?: string | null;
}

export interface ChurnEventsConceptMapping {
  account_id: string; // Required
  churn_date: string; // Required
  churn_event_id?: string | null;
  churn_type?: string | null;
  churn_reason?: string | null;
}

export interface SchemaMappingRequest {
  accounts?: AccountConceptMapping | null;
  subscriptions?: SubscriptionConceptMapping | null;
  feature_usage?: FeatureUsageConceptMapping | null;
  support_tickets?: SupportTicketsConceptMapping | null;
  churn_events?: ChurnEventsConceptMapping | null;
  dataset_profiles?: DatasetProfile[] | null;
  prediction_window_days?: number;
  // Legacy support for dict mappings
  mappings?: Record<string, Record<string, string>>;
}

export interface FeatureCoverageSummary {
  total_features: number;
  covered_count: number;
  missing_count: number;
  defaulted_count: number;
  coverage_pct: number;
  covered_features: string[];
  missing_features: string[];
  defaulted_features: string[];
}

export interface ReadinessAssessmentResponse {
  overall_status: ReadinessStatus;
  target_readiness: ReadinessStatus;
  target_readiness_reason: string;
  scoring_readiness: ReadinessStatus;
  scoring_readiness_reason: string;
  feature_coverage: FeatureCoverageSummary;
  validation_issues: Array<{ severity: "error" | "warning"; message: string; entity?: string }>;
  recommendations: string[];
  next_steps: string[];
}

export interface ProcessingPreviewResponse {
  analysis_ready: boolean;
  label_construction_ready: boolean;
  existing_model_scoring_ready: boolean;
  total_input_rows: number;
  rejection_summary: {
    total_rejected: number;
    rejected_by_table: Record<string, number>;
    reasons: string[];
  };
  scoring_blockers: string[];
  estimated_eligible_accounts: number;
  potential_observation_dates: string[];
  warnings: string[];
  next_steps: string[];
}

export interface EndToEndAnalysisResponse {
  processing_status: "SUCCESS" | "PARTIAL_SUCCESS" | "NOT_READY" | "INFERENCE_FAILED" | "FAILED" | "BLOCKED";
  analysis_ready: boolean;
  label_construction_ready: boolean;
  existing_model_scoring_ready: boolean;
  feature_coverage?: { total_features: number; covered_count: number; missing_count: number; defaulted_count: number; coverage_pct: number; covered_features: string[]; missing_features: string[]; defaulted_features: string[] } | null;
  sentinel_scoring_used?: boolean;
  persisted_summary?: Record<string, number | string | null> | null;
  scoring_blockers: string[];
  rejection_summary: {
    total_rejected: number;
    rejected_by_table: Record<string, number>;
    reasons: string[];
  };
  snapshot_summary?: {
    total_snapshots: number;
    observation_dates_count: number;
    observation_dates: string[];
    eligible_accounts_count: number;
    positive_targets_count: number;
    negative_targets_count: number;
    censored_targets_count: number;
    churn_rate_pct: number;
  };
  scoring_summary?: {
    scored_snapshots_count: number;
    model_name: string;
    model_version: string;
    average_model_score: number;
    high_risk_count: number;
    moderate_risk_count: number;
    low_risk_count: number;
    segments_distribution: Record<string, number>;
    prioritization_quadrants: QuadrantItem[];
    top_global_risk_increasing_factors: Array<{ feature_name: string; mean_absolute_shap: number }>;
    score_interpretation_notice: string;
  };
  warnings: string[];
  next_steps: string[];
}

export interface ProcessingJobSubmission { job_id: string; status: string; workspace_id: string; created_at: string; message: string; }
export interface ProcessingJobStatus { job_id: string; workspace_id: string; status: string; progress_pct: number; stage_message: string | null; error_message: string | null; result_summary: EndToEndAnalysisResponse | null; }

export interface PersistedCustomerSummary {
  account_id: string; account_name: string | null; industry: string; country: string;
  current_mrr: number | null; risk_score: number | null; risk_tier: RiskTier | null;
  segment_name: string | null; assessed_at: string | null; snapshot_date: string | null;
  score_interpretation: string | null;
}
export interface PersistedCustomerListResponse { items: PersistedCustomerSummary[]; total: number; page: number; page_size: number; }
export interface PersistedCustomerDetail extends PersistedCustomerSummary {
  signup_date: string; plan_tier: string | null; explanation_summary: string | null;
  top_risk_factors: Array<Record<string, unknown>>;
  subscriptions: Array<{ subscription_id: string; start_date: string; end_date: string | null; mrr_amount: number; arr_amount: number; billing_frequency: string }>;
}
export interface PersistedCustomerHistoryItem { prediction_id: number; snapshot_date: string | null; assessed_at: string; model_name: string; model_version: string; risk_score: number; risk_tier: RiskTier; segment_name: string | null; score_interpretation: string; }
export interface PersistedCustomerHistoryResponse { account_id: string; items: PersistedCustomerHistoryItem[]; }
