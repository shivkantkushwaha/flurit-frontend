/**
 * Flurit Canonical 45 Point-in-Time Features Specification
 * Derived strictly from Backend Phase 5 & Phase 8 specifications.
 */

export interface CanonicalFeatures {
  // A. Account Profile Features (6)
  account_age_days: number;
  account_industry: string;
  account_country: string;
  account_referral_source: string;
  account_initial_seats: number;
  account_is_trial: number;

  // B. Subscription & Commercial Contract Features (10)
  sub_active_count: number;
  sub_current_mrr: number;
  sub_current_arr: number;
  sub_total_active_seats: number;
  sub_tenure_days: number;
  sub_billing_frequency: "monthly" | "annual" | "mixed" | "none" | string;
  sub_has_auto_renew: number;
  sub_has_active_trial: number;
  sub_historical_upgrade_count: number;
  sub_historical_downgrade_count: number;

  // C. Product Feature Usage Telemetry (14)
  usage_count_30d: number;
  usage_count_60d: number;
  usage_count_90d: number;
  usage_duration_secs_30d: number;
  usage_duration_secs_90d: number;
  usage_error_count_30d: number;
  usage_error_rate_30d: number;
  usage_active_days_30d: number;
  usage_active_days_90d: number;
  usage_distinct_features_30d: number;
  usage_beta_feature_count_30d: number;
  usage_days_since_last: number;
  usage_has_history: number;
  usage_trend_pct_30d: number;

  // D. Support Tickets & SLAs (11)
  tickets_count_30d: number;
  tickets_count_90d: number;
  tickets_count_lifetime: number;
  tickets_unresolved_count: number;
  tickets_has_unresolved: number;
  tickets_urgent_count_90d: number;
  tickets_high_or_urgent_count_90d: number;
  tickets_escalated_count_90d: number;
  tickets_avg_satisfaction_90d: number;
  tickets_has_unrated_90d: number;
  tickets_avg_first_response_minutes_90d: number;

  // E. Churn History (4)
  churn_prior_count: number;
  churn_has_prior: number;
  churn_days_since_last: number;
  churn_prior_refund_total: number;
}
