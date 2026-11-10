import { z } from "zod";

/**
 * Runtime Zod validation schema for Canonical 45 Features Payload.
 * Reflects Phase 5 and Phase 8 backend validation invariants.
 */
export const CanonicalFeaturesSchema = z.object({
  // A. Account Profile Features (6)
  account_age_days: z.number().int().min(0, "account_age_days must be non-negative"),
  account_industry: z.string().min(1, "account_industry is required"),
  account_country: z.string().min(1, "account_country is required"),
  account_referral_source: z.string().min(1, "account_referral_source is required"),
  account_initial_seats: z.number().int().min(1, "account_initial_seats must be at least 1"),
  account_is_trial: z.union([z.literal(0), z.literal(1)]),

  // B. Subscription & Commercial Contract Features (10)
  sub_active_count: z.number().int().min(0),
  sub_current_mrr: z.number().min(0),
  sub_current_arr: z.number().min(0),
  sub_total_active_seats: z.number().int().min(0),
  sub_tenure_days: z.number().min(0),
  sub_billing_frequency: z.string().min(1),
  sub_has_auto_renew: z.union([z.literal(0), z.literal(1)]),
  sub_has_active_trial: z.union([z.literal(0), z.literal(1)]),
  sub_historical_upgrade_count: z.number().int().min(0),
  sub_historical_downgrade_count: z.number().int().min(0),

  // C. Product Feature Usage Telemetry (14)
  usage_count_30d: z.number().int().min(0),
  usage_count_60d: z.number().int().min(0),
  usage_count_90d: z.number().int().min(0),
  usage_duration_secs_30d: z.number().min(0),
  usage_duration_secs_90d: z.number().min(0),
  usage_error_count_30d: z.number().int().min(0),
  usage_error_rate_30d: z.number().min(0),
  usage_active_days_30d: z.number().int().min(0).max(30),
  usage_active_days_90d: z.number().int().min(0).max(90),
  usage_distinct_features_30d: z.number().int().min(0),
  usage_beta_feature_count_30d: z.number().int().min(0),
  usage_days_since_last: z.number().min(-1, "usage_days_since_last sentinel is -1.0 or non-negative"),
  usage_has_history: z.union([z.literal(0), z.literal(1)]),
  usage_trend_pct_30d: z.number(),

  // D. Support Tickets & SLAs (11)
  tickets_count_30d: z.number().int().min(0),
  tickets_count_90d: z.number().int().min(0),
  tickets_count_lifetime: z.number().int().min(0),
  tickets_unresolved_count: z.number().int().min(0),
  tickets_has_unresolved: z.union([z.literal(0), z.literal(1)]),
  tickets_urgent_count_90d: z.number().int().min(0),
  tickets_high_or_urgent_count_90d: z.number().int().min(0),
  tickets_escalated_count_90d: z.number().int().min(0),
  tickets_avg_satisfaction_90d: z.number().min(-1).max(5),
  tickets_has_unrated_90d: z.union([z.literal(0), z.literal(1)]),
  tickets_avg_first_response_minutes_90d: z.number().min(-1),

  // E. Churn History (4)
  churn_prior_count: z.number().int().min(0),
  churn_has_prior: z.union([z.literal(0), z.literal(1)]),
  churn_days_since_last: z.number().min(-1),
  churn_prior_refund_total: z.number().min(0),
}).strict(); // strict() ensures extra fields or forbidden labels (target_churn_60d, churn_flag) are rejected

export type CanonicalFeaturesInput = z.infer<typeof CanonicalFeaturesSchema>;
