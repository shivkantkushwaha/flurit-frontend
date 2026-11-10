import { CanonicalFeaturesSchema } from "@/lib/schemas/features";
import { ScorePredictionRequestSchema, PrioritizationRequestSchema } from "@/lib/schemas/api";

const VALID_45_FEATURES = {
  account_age_days: 150,
  account_industry: "Tech",
  account_country: "US",
  account_referral_source: "organic",
  account_initial_seats: 20,
  account_is_trial: 0,
  sub_active_count: 2,
  sub_current_mrr: 6500.0,
  sub_current_arr: 78000.0,
  sub_total_active_seats: 35,
  sub_tenure_days: 210.0,
  sub_billing_frequency: "monthly",
  sub_has_auto_renew: 1,
  sub_has_active_trial: 0,
  sub_historical_upgrade_count: 1,
  sub_historical_downgrade_count: 0,
  usage_count_30d: 120,
  usage_count_60d: 240,
  usage_count_90d: 350,
  usage_duration_secs_30d: 15000.0,
  usage_duration_secs_90d: 42000.0,
  usage_error_count_30d: 1,
  usage_error_rate_30d: 0.008,
  usage_active_days_30d: 22,
  usage_active_days_90d: 65,
  usage_distinct_features_30d: 7,
  usage_beta_feature_count_30d: 1,
  usage_days_since_last: 1.2,
  usage_has_history: 1,
  usage_trend_pct_30d: 5.4,
  tickets_count_30d: 1,
  tickets_count_90d: 2,
  tickets_count_lifetime: 4,
  tickets_unresolved_count: 0,
  tickets_has_unresolved: 0,
  tickets_urgent_count_90d: 0,
  tickets_high_or_urgent_count_90d: 1,
  tickets_escalated_count_90d: 0,
  tickets_avg_satisfaction_90d: 4.8,
  tickets_has_unrated_90d: 0,
  tickets_avg_first_response_minutes_90d: 35.0,
  churn_prior_count: 0,
  churn_has_prior: 0,
  churn_days_since_last: -1.0,
  churn_prior_refund_total: 0.0,
};

describe("CanonicalFeaturesSchema and API Request Validation", () => {
  it("successfully parses valid 45 canonical features", () => {
    const parsed = CanonicalFeaturesSchema.safeParse(VALID_45_FEATURES);
    expect(parsed.success).toBe(true);
  });

  it("strictly rejects payloads with missing canonical features", () => {
    const invalidFeatures = { ...VALID_45_FEATURES };
    // @ts-expect-error test omission
    delete invalidFeatures.sub_current_mrr;

    const parsed = CanonicalFeaturesSchema.safeParse(invalidFeatures);
    expect(parsed.success).toBe(false);
  });

  it("strictly rejects forbidden retrospective target fields (target leakage)", () => {
    const leakedPayload = {
      ...VALID_45_FEATURES,
      target_churn_60d: 1, // Forbidden retrospective label
      churn_flag: true,    // Forbidden static label
    };

    const parsed = CanonicalFeaturesSchema.safeParse(leakedPayload);
    // .strict() rejects unrecognized keys
    expect(parsed.success).toBe(false);
  });

  it("validates ScorePredictionRequest with regex date validation", () => {
    const validRequest = {
      account_id: "A-00cac8",
      snapshot_date: "2024-11-01",
      features: VALID_45_FEATURES,
    };

    const parsed = ScorePredictionRequestSchema.safeParse(validRequest);
    expect(parsed.success).toBe(true);

    const invalidDateRequest = {
      ...validRequest,
      snapshot_date: "11/01/2024", // Invalid format
    };
    const invalidParsed = ScorePredictionRequestSchema.safeParse(invalidDateRequest);
    expect(invalidParsed.success).toBe(false);
  });

  it("validates PrioritizationRequestSchema minimum records requirement", () => {
    const emptyRecords = {
      records: [],
    };
    const parsed = PrioritizationRequestSchema.safeParse(emptyRecords);
    expect(parsed.success).toBe(false);

    const validRecords = {
      records: [{ account_id: "A1", sub_current_mrr: 5000, model_score: 0.7 }],
    };
    const validParsed = PrioritizationRequestSchema.safeParse(validRecords);
    expect(validParsed.success).toBe(true);
  });
});
