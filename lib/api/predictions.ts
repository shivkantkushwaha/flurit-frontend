import { apiClient } from "./client";
import {
  ScorePredictionRequest,
  ScorePredictionResponse,
  CustomerRiskRequest,
  CustomerRiskResponse,
  PrioritizationRequest,
  PrioritizationResponse,
  PersistedCustomerDetail,
  PersistedCustomerHistoryResponse,
  PersistedCustomerListResponse,
} from "@/lib/types/api";

/**
 * Service for Flurit Phase 8 Inference and Prioritization Endpoints.
 * Strictly adheres to documented /api/v1 contracts.
 */
export const predictionsApi = {
  /**
   * Scores a single canonical customer feature vector (45 features) and assigns a model risk tier.
   * Calls: POST /api/v1/predictions/score
   */
  async score(payload: ScorePredictionRequest): Promise<ScorePredictionResponse> {
    return apiClient.post<ScorePredictionResponse>("/predictions/score", payload);
  },

  /**
   * Computes the model score, extracts top SHAP factor attributions, and assigns K-Means cluster (K=3).
   * Calls: POST /api/v1/customers/{account_id}/risk
   */
  async getCustomerRisk(accountId: string, payload: CustomerRiskRequest): Promise<CustomerRiskResponse> {
    const encodedId = encodeURIComponent(accountId);
    return apiClient.post<CustomerRiskResponse>(`/customers/${encodedId}/risk`, payload);
  },

  /**
   * Groups a customer portfolio into 5 Value x Risk priority quadrants and calculates total Estimated Revenue at Risk.
   * Calls: POST /api/v1/prioritization/quadrants
   */
  async getPrioritizationQuadrants(payload: PrioritizationRequest): Promise<PrioritizationResponse> {
    return apiClient.post<PrioritizationResponse>("/prioritization/quadrants", payload);
  },
  async listCustomers(params: { page?: number; page_size?: number; search?: string; risk_tier?: string; segment?: string } = {}): Promise<PersistedCustomerListResponse> {
    return apiClient.get<PersistedCustomerListResponse>("/customers", { params });
  },
  async getCustomer(accountId: string): Promise<PersistedCustomerDetail> {
    return apiClient.get<PersistedCustomerDetail>(`/customers/${encodeURIComponent(accountId)}`);
  },
  async getCustomerHistory(accountId: string): Promise<PersistedCustomerHistoryResponse> {
    return apiClient.get<PersistedCustomerHistoryResponse>(`/customers/${encodeURIComponent(accountId)}/history`);
  },
};
