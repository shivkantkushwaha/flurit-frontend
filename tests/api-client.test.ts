import { apiClient } from "@/lib/api/client";
import { predictionsApi } from "@/lib/api/predictions";
import { onboardingApi } from "@/lib/api/onboarding";
import { FluritApiError } from "@/lib/api/errors";
import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";
import { CanonicalFeatures } from "@/lib/types/features";

const MOCK_CANONICAL_FEATURES: CanonicalFeatures = {
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

describe("ApiClient and Feature API Services", () => {
  beforeEach(() => {
    // Default token provider for test suite
    apiClient.setTokenProvider(async () => "test-bearer-token-12345");
  });

  it("successfully scores a customer feature vector via predictionsApi.score", async () => {
    const result = await predictionsApi.score({
      account_id: "A-00cac8",
      snapshot_date: "2024-11-01",
      features: MOCK_CANONICAL_FEATURES,
    });

    expect(result.account_id).toBe("A-00cac8");
    expect(result.model_score).toBe(0.5628);
    expect(result.risk_tier).toBe("High Risk");
    expect(result.score_interpretation).toContain("uncalibrated risk rankings");
  });

  it("successfully retrieves customer risk and SHAP factor attributions", async () => {
    const result = await predictionsApi.getCustomerRisk("A-00cac8", {
      snapshot_date: "2024-11-01",
      features: MOCK_CANONICAL_FEATURES,
    });

    expect(result.account_id).toBe("A-00cac8");
    expect(result.segment_id).toBe(1);
    expect(result.top_risk_increasing_factors.length).toBeGreaterThan(0);
    expect(result.top_risk_decreasing_factors.length).toBeGreaterThan(0);
    expect(result.association_disclaimer).toContain("Statistical Association Note");
  });

  it("successfully calculates portfolio prioritization quadrants", async () => {
    const result = await predictionsApi.getPrioritizationQuadrants({
      records: [
        { account_id: "A1", sub_current_mrr: 9500.0, model_score: 0.65 },
        { account_id: "A2", sub_current_mrr: 1500.0, model_score: 0.2 },
      ],
    });

    expect(result.total_accounts).toBe(5);
    expect(result.total_mrr).toBe(27700.0);
    expect(result.quadrants.length).toBe(5);
  });

  it("attaches Authorization: Bearer token automatically", async () => {
    let capturedAuthHeader: string | null = null;

    server.use(
      http.post("*/api/v1/predictions/score", ({ request }) => {
        capturedAuthHeader = request.headers.get("authorization");
        return HttpResponse.json({ status: "ok" });
      })
    );

    await apiClient.post("/predictions/score", {});
    expect(capturedAuthHeader).toBe("Bearer test-bearer-token-12345");
  });

  it("handles 401 Unauthorized when Bearer token is omitted or rejected", async () => {
    // Unset token provider
    apiClient.setTokenProvider(null);

    await expect(
      predictionsApi.score({
        account_id: "A-00cac8",
        snapshot_date: "2024-11-01",
        features: MOCK_CANONICAL_FEATURES,
      })
    ).rejects.toThrow(FluritApiError);

    try {
      await predictionsApi.score({
        account_id: "A-00cac8",
        snapshot_date: "2024-11-01",
        features: MOCK_CANONICAL_FEATURES,
      });
    } catch (err) {
      const apiError = err as FluritApiError;
      expect(apiError.status).toBe(401);
      expect(apiError.code).toBe("UNAUTHORIZED");
      expect(apiError.detail).toContain("Bearer token is missing");
    }
  });

  it("handles 413 Payload Too Large errors for oversized file uploads", async () => {
    server.use(
      http.post("*/api/v1/onboarding/profile", () => {
        return HttpResponse.json(
          { detail: "File exceeds maximum permitted size of 50 MB" },
          { status: 413 }
        );
      })
    );

    try {
      await onboardingApi.profile([new File(["dummy content"], "large.csv")]);
      throw new Error("Should have thrown FluritApiError");
    } catch (err) {
      const apiError = err as FluritApiError;
      expect(apiError.status).toBe(413);
      expect(apiError.code).toBe("PAYLOAD_TOO_LARGE");
      expect(apiError.detail).toContain("50 MB");
    }
  });

  it("handles 422 Unprocessable Entity with structured validation errors", async () => {
    server.use(
      http.post("*/api/v1/predictions/score", () => {
        return HttpResponse.json(
          {
            detail: [
              { loc: ["body", "features", "account_age_days"], msg: "field required", type: "value_error.missing" },
            ],
          },
          { status: 422 }
        );
      })
    );

    try {
      await apiClient.post("/predictions/score", {});
      throw new Error("Should have thrown FluritApiError");
    } catch (err) {
      const apiError = err as FluritApiError;
      expect(apiError.status).toBe(422);
      expect(apiError.code).toBe("VALIDATION_ERROR");
      expect(apiError.validationErrors).toBeDefined();
      expect(apiError.validationErrors?.[0].msg).toBe("field required");
    }
  });

  it("handles 500 Server Errors with clean error messages", async () => {
    server.use(
      http.post("*/api/v1/predictions/score", () => {
        return HttpResponse.json(
          { detail: "Authentication system is misconfigured: SUPABASE_JWT_SECRET is required" },
          { status: 500 }
        );
      })
    );

    try {
      await apiClient.post("/predictions/score", {});
      throw new Error("Should have thrown FluritApiError");
    } catch (err) {
      const apiError = err as FluritApiError;
      expect(apiError.status).toBe(500);
      expect(apiError.code).toBe("SERVER_ERROR");
      expect(apiError.detail).toContain("SUPABASE_JWT_SECRET is required");
    }
  });
});
