import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CustomersPage from "@/app/(app)/app/customers/page";
import CustomerAssessmentPage from "@/app/(app)/app/customers/assess/page";
import { WorkspaceProvider } from "@/components/workspace/WorkspaceContext";
import { predictionsApi } from "@/lib/api/predictions";
import { FluritApiError } from "@/lib/api/errors";
import type { CanonicalFeatures } from "@/lib/types/features";

jest.mock("next/navigation", () => ({ usePathname: () => "/app/customers" }));
jest.mock("@/lib/api/predictions", () => ({ predictionsApi: { getCustomerRisk: jest.fn() } }));

const features: CanonicalFeatures = {
  account_age_days: 150, account_industry: "Technology", account_country: "US", account_referral_source: "organic", account_initial_seats: 20, account_is_trial: 0,
  sub_active_count: 2, sub_current_mrr: 6500, sub_current_arr: 78000, sub_total_active_seats: 35, sub_tenure_days: 210, sub_billing_frequency: "monthly", sub_has_auto_renew: 1, sub_has_active_trial: 0, sub_historical_upgrade_count: 1, sub_historical_downgrade_count: 0,
  usage_count_30d: 120, usage_count_60d: 240, usage_count_90d: 350, usage_duration_secs_30d: 15000, usage_duration_secs_90d: 42000, usage_error_count_30d: 1, usage_error_rate_30d: 0.008, usage_active_days_30d: 22, usage_active_days_90d: 65, usage_distinct_features_30d: 7, usage_beta_feature_count_30d: 1, usage_days_since_last: 1.2, usage_has_history: 1, usage_trend_pct_30d: 5.4,
  tickets_count_30d: 1, tickets_count_90d: 2, tickets_count_lifetime: 4, tickets_unresolved_count: 0, tickets_has_unresolved: 0, tickets_urgent_count_90d: 0, tickets_high_or_urgent_count_90d: 1, tickets_escalated_count_90d: 0, tickets_avg_satisfaction_90d: 4.8, tickets_has_unrated_90d: 0, tickets_avg_first_response_minutes_90d: 35,
  churn_prior_count: 0, churn_has_prior: 0, churn_days_since_last: -1, churn_prior_refund_total: 0,
};

const assessment = {
  account_id: "acct-7", snapshot_date: "2026-10-01", model_version: "1.0", model_score: 0.72, predicted_risk_label: 1 as const, decision_threshold: 0.5, risk_tier: "High Risk" as const,
  segment_id: 1, segment_name: "Segment 1", segment_summary: "Returned segment description", top_risk_increasing_factors: [{ feature_name: "usage_days_since_last", feature_value: 15, attribution: 0.2, direction: "increases_risk" as const, feature_description: "Days since use" }], top_risk_decreasing_factors: [], plain_language_summary: "Returned model summary", association_disclaimer: "Association only.", score_interpretation: "Uncalibrated relative-risk ranking.",
};

describe("Customer intelligence", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows the honest empty roster when there is no customer-list contract", () => {
    render(<WorkspaceProvider><CustomersPage /></WorkspaceProvider>);
    expect(screen.getByText("No customer rows available")).toBeInTheDocument();
    expect(screen.getByText(/no customer roster endpoint/i)).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search customers" })).toBeDisabled();
  });

  it("validates feature JSON without requesting a score", async () => {
    render(<CustomerAssessmentPage />);
    fireEvent.change(screen.getByLabelText("Account ID"), { target: { value: "acct-7" } });
    fireEvent.change(screen.getByLabelText(/Canonical features JSON/i), { target: { value: "{}" } });
    fireEvent.click(screen.getByRole("button", { name: "Request risk assessment" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/incomplete or invalid/i);
    expect(predictionsApi.getCustomerRisk).not.toHaveBeenCalled();
  });

  it("renders a returned customer risk assessment and association disclaimer", async () => {
    (predictionsApi.getCustomerRisk as jest.Mock).mockResolvedValue(assessment);
    render(<CustomerAssessmentPage />);
    fireEvent.change(screen.getByLabelText("Account ID"), { target: { value: "acct-7" } });
    fireEvent.change(screen.getByLabelText(/Canonical features JSON/i), { target: { value: JSON.stringify(features) } });
    fireEvent.click(screen.getByRole("button", { name: "Request risk assessment" }));
    expect(await screen.findByText("High Risk")).toBeInTheDocument();
    expect(screen.getByText("usage_days_since_last: 15")).toBeInTheDocument();
    expect(screen.getByText("Association only.")).toBeInTheDocument();
    await waitFor(() => expect(predictionsApi.getCustomerRisk).toHaveBeenCalledWith("acct-7", expect.objectContaining({ features })));
  });

  it("explains unauthorized assessment responses", async () => {
    (predictionsApi.getCustomerRisk as jest.Mock).mockRejectedValue(new FluritApiError("Unauthorized", { status: 401 }));
    render(<CustomerAssessmentPage />);
    fireEvent.change(screen.getByLabelText("Account ID"), { target: { value: "acct-7" } });
    fireEvent.change(screen.getByLabelText(/Canonical features JSON/i), { target: { value: JSON.stringify(features) } });
    fireEvent.click(screen.getByRole("button", { name: "Request risk assessment" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/session is no longer authorized/i);
  });
});
