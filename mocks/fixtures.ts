import {
  ScorePredictionResponse,
  CustomerRiskResponse,
  PrioritizationResponse,
  DatasetProfile,
  DatasetProfileResponse,
  ReadinessAssessmentResponse,
  ProcessingPreviewResponse,
  EndToEndAnalysisResponse,
} from "@/lib/types/api";

/**
 * Deterministic Mock Fixtures based strictly on backend specifications
 * (Phases 8, 10, and 11 docs).
 * Used ONLY for MSW development mocks and unit testing.
 */

export const MOCK_SCORE_RESPONSE: ScorePredictionResponse = {
  account_id: "A-00cac8",
  snapshot_date: "2024-11-01",
  model_name: "flurit_churn_predictor",
  model_version: "1.0.0",
  model_score: 0.5628,
  predicted_risk_label: 1,
  decision_threshold: 0.5,
  risk_tier: "High Risk",
  score_interpretation:
    "Model Score Interpretation: Flurit model churn scores represent uncalibrated risk rankings learned by balanced Logistic Regression. Because Phase 6.1 demonstrated negative Brier skill scores (-0.2554) due to class_weight='balanced' probability shifts, the score is an operational prioritization index in [0.0, 1.0], NOT an actuarially calibrated probability of customer churn.",
};

export const MOCK_CUSTOMER_RISK_RESPONSE: CustomerRiskResponse = {
  account_id: "A-00cac8",
  snapshot_date: "2024-11-01",
  model_version: "1.0.0",
  model_score: 0.5628,
  predicted_risk_label: 1,
  decision_threshold: 0.5,
  risk_tier: "High Risk",
  segment_id: 1,
  segment_name: "Cluster 1: High-Value Enterprise Accounts",
  segment_summary:
    "High MRR ($9,622.05), high seat volume (125.3 seats), intensive telemetry activity (39.3 30d usage actions), mature tenure (164.2 days), healthcare/tech heavy.",
  top_risk_increasing_factors: [
    {
      feature_name: "sub_active_count",
      feature_value: 7,
      attribution: 0.6192,
      direction: "increases_risk",
      feature_description: "Count of subscriptions actively un-terminated at snapshot date.",
    },
    {
      feature_name: "usage_distinct_features_30d",
      feature_value: 1,
      attribution: 0.2437,
      direction: "increases_risk",
      feature_description: "Count of distinct product module action types executed in past 30 days.",
    },
  ],
  top_risk_decreasing_factors: [
    {
      feature_name: "sub_tenure_days",
      feature_value: 381.0,
      attribution: -0.3919,
      direction: "decreases_risk",
      feature_description: "Commercial contract duration in days from first subscription start date to snapshot date.",
    },
    {
      feature_name: "usage_active_days_90d",
      feature_value: 4,
      attribution: -0.2826,
      direction: "decreases_risk",
      feature_description: "Distinct calendar days with recorded usage activity in past 90 days.",
    },
  ],
  plain_language_summary:
    "Estimated model churn score is 0.56. Main factors associated with higher score: sub active count (7), usage distinct features 30d (1). Mitigating factors associated with lower score: sub tenure days (381.0), usage active days 90d (4).",
  association_disclaimer:
    "Statistical Association Note: Feature attributions reflect correlational relationships learned by the Logistic Regression model from historical observations. They quantify how much each feature shifts the predicted log-odds relative to the background baseline, and do NOT imply a direct causal relationship or guaranteed real-world outcome.",
  score_interpretation:
    "Model Score Interpretation: Flurit model churn scores represent uncalibrated risk rankings learned by balanced Logistic Regression...",
};

export const MOCK_PRIORITIZATION_RESPONSE: PrioritizationResponse = {
  total_accounts: 5,
  total_mrr: 27700.0,
  total_estimated_revenue_at_risk_mrr: 15105.0,
  quadrants: [
    {
      quadrant_name: "Priority 1: High Value - High Risk",
      priority_level: 1,
      account_count: 1,
      account_percentage: 20.0,
      total_mrr: 9500.0,
      estimated_revenue_at_risk_mrr: 6175.0,
      action_recommendation: "Executive outreach, dedicated customer success intervention, and immediate contract review.",
    },
    {
      quadrant_name: "Priority 2: Mid Value - High Risk",
      priority_level: 2,
      account_count: 1,
      account_percentage: 20.0,
      total_mrr: 5500.0,
      estimated_revenue_at_risk_mrr: 3850.0,
      action_recommendation: "Account manager consultation, technical health audit, and proactive feature adoption check.",
    },
    {
      quadrant_name: "Priority 3: High Value - Moderate Risk",
      priority_level: 3,
      account_count: 1,
      account_percentage: 20.0,
      total_mrr: 9200.0,
      estimated_revenue_at_risk_mrr: 3680.0,
      action_recommendation: "Executive sponsorship check-in, expansion exploration, and satisfaction benchmarking.",
    },
    {
      quadrant_name: "Priority 4: Core Value - High Risk",
      priority_level: 4,
      account_count: 1,
      account_percentage: 20.0,
      total_mrr: 2000.0,
      estimated_revenue_at_risk_mrr: 1100.0,
      action_recommendation: "Automated retention workflows, product education surveys, and self-service re-engagement.",
    },
    {
      quadrant_name: "Priority 5: Standard Monitoring",
      priority_level: 5,
      account_count: 1,
      account_percentage: 20.0,
      total_mrr: 1500.0,
      estimated_revenue_at_risk_mrr: 300.0,
      action_recommendation: "Ongoing lifecycle engagement, standard health check-ins, and roadmap updates.",
    },
  ],
  risk_metric_interpretation:
    "Estimated Revenue at Risk is calculated as MRR * Model Churn Score. Because Phase 6.1 demonstrated negative Brier skill scores for raw model probabilities, this metric serves strictly as an operational prioritization score, NOT an actuarially calibrated financial guarantee or literal probability of monetary loss.",
};

export const MOCK_DATASET_PROFILES: DatasetProfile[] = [
  {
    file_name: "accounts.csv",
    file_size_bytes: 45000,
    row_count: 500,
    column_count: 6,
    duplicate_row_count: 0,
    candidate_id_columns: ["account_id"],
    candidate_target_columns: [],
    columns: [
      {
        column_name: "account_id",
        inferred_type: "text",
        null_count: 0,
        null_percentage: 0,
        unique_count: 500,
        sample_values: ["A-00cac8", "A-00bed1"],
      },
      {
        column_name: "signup_date",
        inferred_type: "datetime",
        null_count: 0,
        null_percentage: 0,
        unique_count: 480,
        sample_values: ["2023-01-15", "2023-02-20"],
      },
      {
        column_name: "industry",
        inferred_type: "text",
        null_count: 12,
        null_percentage: 2.4,
        unique_count: 8,
        sample_values: ["Healthcare", "Software"],
      },
    ],
    date_range: {
      start_date: "2023-01-15",
      end_date: "2024-04-01",
      span_days: 442,
    },
  },
  {
    file_name: "subscriptions.csv",
    file_size_bytes: 65000,
    row_count: 850,
    column_count: 8,
    duplicate_row_count: 0,
    candidate_id_columns: ["subscription_id", "account_id"],
    candidate_target_columns: ["status"],
    columns: [
      {
        column_name: "subscription_id",
        inferred_type: "text",
        null_count: 0,
        null_percentage: 0,
        unique_count: 850,
        sample_values: ["sub-001", "sub-002"],
      },
      {
        column_name: "account_id",
        inferred_type: "text",
        null_count: 0,
        null_percentage: 0,
        unique_count: 500,
        sample_values: ["A-00cac8", "A-00bed1"],
      },
      {
        column_name: "start_date",
        inferred_type: "datetime",
        null_count: 0,
        null_percentage: 0,
        unique_count: 620,
        sample_values: ["2023-01-15", "2023-03-01"],
      },
      {
        column_name: "mrr",
        inferred_type: "float",
        null_count: 0,
        null_percentage: 0,
        unique_count: 45,
        sample_values: [1200.0, 3500.0],
      },
    ],
    date_range: {
      start_date: "2023-01-15",
      end_date: "2024-04-01",
      span_days: 442,
    },
  },
];

export const MOCK_PROFILE_RESPONSE: DatasetProfileResponse = {
  success: true,
  message: "Successfully profiled 2 dataset files.",
  datasets: MOCK_DATASET_PROFILES,
  total_files: 2,
  total_rows: 1350,
  profiling_duration_seconds: 0.12,
};

export const MOCK_READINESS_RESPONSE: ReadinessAssessmentResponse = {
  overall_status: "READY",
  target_readiness: "READY",
  target_readiness_reason: "Temporal span >= 150 days and churn signals present.",
  scoring_readiness: "READY",
  scoring_readiness_reason: "All 45 canonical features mapped with observed data.",
  feature_coverage: {
    total_features: 45,
    covered_features: 45,
    missing_features: 0,
    covered_percentage: 100.0,
    covered_feature_names: ["account_age_days", "sub_current_mrr"],
    missing_feature_names: [],
    defaulted_with_sentinels: [],
  },
  validation_issues: [],
  recommendations: ["Proceed to snapshot generation and batch scoring."],
  next_steps: ["Execute processing via POST /api/v1/onboarding/process."],
};

export const MOCK_PREVIEW_RESPONSE: ProcessingPreviewResponse = {
  analysis_ready: true,
  label_construction_ready: true,
  existing_model_scoring_ready: true,
  total_input_rows: 24,
  rejection_summary: {
    total_rejected: 0,
    rejected_by_table: { accounts: 0, subscriptions: 0, feature_usage: 0, support_tickets: 0, churn_events: 0 },
    reasons: [],
  },
  scoring_blockers: [],
  estimated_eligible_accounts: 4,
  potential_observation_dates: ["2024-04-01"],
  warnings: [],
  next_steps: ["Review portfolio prioritization quadrants and intervention recommendations."],
};

export const MOCK_PROCESS_RESPONSE: EndToEndAnalysisResponse = {
  processing_status: "SUCCESS",
  analysis_ready: true,
  label_construction_ready: true,
  existing_model_scoring_ready: true,
  scoring_blockers: [],
  rejection_summary: {
    total_rejected: 0,
    rejected_by_table: { accounts: 0, subscriptions: 0, feature_usage: 0, support_tickets: 0, churn_events: 0 },
    reasons: [],
  },
  snapshot_summary: {
    total_snapshots: 4,
    observation_dates_count: 1,
    observation_dates: ["2024-04-01"],
    eligible_accounts_count: 4,
    positive_targets_count: 0,
    negative_targets_count: 4,
    censored_targets_count: 0,
    churn_rate_pct: 0.0,
  },
  scoring_summary: {
    scored_snapshots_count: 4,
    model_name: "flurit_churn_predictor",
    model_version: "1.0.0",
    average_model_score: 0.4852,
    high_risk_count: 1,
    moderate_risk_count: 2,
    low_risk_count: 1,
    segments_distribution: {
      "High-Value Power Users": 2,
      "Low-Engagement Baseline": 2,
    },
    prioritization_quadrants: MOCK_PRIORITIZATION_RESPONSE.quadrants,
    top_global_risk_increasing_factors: [
      { feature_name: "usage_error_rate_30d", mean_absolute_shap: 0.3421 },
    ],
    score_interpretation_notice: "Model Score Interpretation: Flurit model churn scores represent uncalibrated risk rankings...",
  },
  warnings: [],
  next_steps: ["Review portfolio prioritization quadrants and intervention recommendations."],
};
