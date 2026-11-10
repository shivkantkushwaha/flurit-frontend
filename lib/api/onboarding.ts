import { apiClient } from "./client";
import {
  DatasetProfileResponse,
  SchemaMappingRequest,
  ReadinessAssessmentResponse,
  ProcessingPreviewResponse,
  EndToEndAnalysisResponse,
  ProcessingJobSubmission,
  ProcessingJobStatus,
} from "@/lib/types/api";

/**
 * Service for Flurit Dataset Onboarding & Custom Processing Endpoints.
 * Strictly adheres to verified FastAPI openapi.json contracts.
 */
export const onboardingApi = {
  async submitProcessingJob(files: File[], mapping: SchemaMappingRequest, options?: Record<string, unknown>): Promise<ProcessingJobSubmission> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("mapping", JSON.stringify(mapping));
    if (options) formData.append("options", JSON.stringify(options));
    return apiClient.postFormData<ProcessingJobSubmission>("/onboarding/process/async", formData, { timeoutMs: 120000 });
  },
  async getProcessingJob(jobId: string): Promise<ProcessingJobStatus> {
    return apiClient.get<ProcessingJobStatus>(`/onboarding/jobs/${encodeURIComponent(jobId)}`, { timeoutMs: 30000 });
  },
  /**
   * Uploads one or more CSV files for memory-bounded profiling and PII redaction.
   * Calls: POST /api/v1/onboarding/profile (multipart/form-data)
   */
  async profile(files: File[]): Promise<DatasetProfileResponse> {
    // Wake the API with a small request before sending the entire upload.
    try {
      const health = await apiClient.get<{ status: string }>("/health", { skipAuth: true, timeoutMs: 75000 });
      if (health.status !== "ok") throw new Error("Unexpected health response");
    } catch {
      throw new Error("Flurit’s server did not become reachable. Your CSVs are still selected. Try again once the server is responding.");
    }
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    return apiClient.postFormData<DatasetProfileResponse>("/onboarding/profile", formData);
  },

  /**
   * Validates concept-to-column mappings and produces a dual-horizon readiness assessment.
   * Calls: POST /api/v1/onboarding/map (application/json)
   */
  async mapSchema(payload: SchemaMappingRequest): Promise<ReadinessAssessmentResponse> {
    return apiClient.post<ReadinessAssessmentResponse>("/onboarding/map", payload);
  },

  /**
   * Executes a lightweight dry-run check of snapshot eligibility and target readiness without scoring.
   * Calls: POST /api/v1/onboarding/preview (multipart/form-data)
   */
  async preview(
    files: File[],
    mapping: SchemaMappingRequest,
    options?: Record<string, unknown>
  ): Promise<ProcessingPreviewResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("mapping", JSON.stringify(mapping));
    if (options) {
      formData.append("options", JSON.stringify(options));
    }

    return apiClient.postFormData<ProcessingPreviewResponse>("/onboarding/preview", formData);
  },

  /**
   * Triggers full end-to-end dataset processing, snapshot generation, feature extraction, and batch scoring.
   * Calls: POST /api/v1/onboarding/process (multipart/form-data, synchronous)
   */
  async process(
    files: File[],
    mapping: SchemaMappingRequest,
    options?: Record<string, unknown>
  ): Promise<EndToEndAnalysisResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("mapping", JSON.stringify(mapping));
    if (options) {
      formData.append("options", JSON.stringify(options));
    }

    // Increased timeout for synchronous processing
    return apiClient.postFormData<EndToEndAnalysisResponse>("/onboarding/process", formData, {
      timeoutMs: 600000,
    });
  },
};
