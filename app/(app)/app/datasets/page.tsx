"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/app/PageHeader";
import { DatasetUploadStep } from "@/components/datasets/DatasetUploadStep";
import { DatasetProfileStep } from "@/components/datasets/DatasetProfileStep";
import { SchemaMappingStep } from "@/components/datasets/SchemaMappingStep";
import { ReadinessAssessmentStep } from "@/components/datasets/ReadinessAssessmentStep";
import { ProcessingPreviewStep } from "@/components/datasets/ProcessingPreviewStep";
import { ProcessingExecutionStep } from "@/components/datasets/ProcessingExecutionStep";
import { onboardingApi } from "@/lib/api/onboarding";
import {
  DatasetProfile,
  DatasetProfileResponse,
  SchemaMappingRequest,
  ReadinessAssessmentResponse,
  ProcessingPreviewResponse,
  EndToEndAnalysisResponse,
} from "@/lib/types/api";
import { useWorkspace } from "@/components/workspace/WorkspaceContext";
import { CheckCircle2, ChevronRight } from "lucide-react";

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

export default function DatasetsOnboardingPage() {
  const { setAnalysisResult } = useWorkspace();

  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [profileResponse, setProfileResponse] = useState<DatasetProfileResponse | null>(null);
  const [datasetProfiles, setDatasetProfiles] = useState<DatasetProfile[]>([]);
  const [activeMapping, setActiveMapping] = useState<SchemaMappingRequest | null>(null);
  const [readinessResponse, setReadinessResponse] = useState<ReadinessAssessmentResponse | null>(null);
  const [previewResponse, setPreviewResponse] = useState<ProcessingPreviewResponse | null>(null);
  const [analysisResponse, setAnalysisResponse] = useState<EndToEndAnalysisResponse | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 -> 2: Upload and Profile
  const handleFilesSelected = async (files: File[]) => {
    setError(null);
    setIsLoading(true);
    setUploadedFiles(files);

    try {
      const response = await onboardingApi.profile(files);
      setProfileResponse(response);

      const normalized: DatasetProfile[] = Array.isArray(response.datasets)
        ? response.datasets
        : Object.entries(response.datasets || {}).map(([name, table]) => ({
            file_name: name,
            file_size_bytes: table.file_size_bytes,
            row_count: table.row_count,
            column_count: table.column_count,
            duplicate_row_count: table.duplicate_rows,
            candidate_id_columns: table.candidate_id_columns || [],
            candidate_target_columns: table.candidate_target_columns || [],
            columns: Object.values(table.columns || {}),
            date_range: null,
          }));

      setDatasetProfiles(normalized);
      setCurrentStep(2);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to profile uploaded dataset files.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 -> 3: Proceed to Schema Mapping
  const handleProceedToMapping = (profiles: DatasetProfile[]) => {
    setDatasetProfiles(profiles);
    setError(null);
    setCurrentStep(3);
  };

  // Step 3 -> 4: Submit Schema Mapping & Assess Readiness
  const handleSubmitMapping = async (mapping: SchemaMappingRequest) => {
    setError(null);
    setIsLoading(true);
    setActiveMapping(mapping);

    try {
      const response = await onboardingApi.mapSchema(mapping);
      setReadinessResponse(response);
      setCurrentStep(4);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Schema mapping validation failed.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4 -> 5: Run Processing Preview
  const handleProceedToPreview = async () => {
    if (!activeMapping) return;
    setError(null);
    setIsLoading(true);

    try {
      const response = await onboardingApi.preview(uploadedFiles, activeMapping);
      setPreviewResponse(response);
      setCurrentStep(5);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Dry-run processing preview failed.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 5 -> 6: Execute Full Synchronous Processing
  const handleExecuteProcessing = async () => {
    if (!activeMapping) return;
    setError(null);
    setIsLoading(true);

    try {
      const job = await onboardingApi.submitProcessingJob(uploadedFiles, activeMapping);
      let result: EndToEndAnalysisResponse | null = null;
      for (let attempt = 0; attempt < 360; attempt += 1) {
        const jobStatus = await onboardingApi.getProcessingJob(job.job_id);
        if (jobStatus.status === "succeeded") {
          result = jobStatus.result_summary;
          break;
        }
        if (jobStatus.status === "failed" || jobStatus.status === "cancelled") {
          throw new Error(jobStatus.error_message || jobStatus.stage_message || `Processing ${jobStatus.status}.`);
        }
        await new Promise((resolve) => window.setTimeout(resolve, 2000));
      }
      if (!result) throw new Error("Processing is taking longer than expected. Your job continues in the background; refresh the workspace shortly to check its status.");
      setAnalysisResponse(result);
      setAnalysisResult(result, uploadedFiles);
      setCurrentStep(6);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Dataset processing failed.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setUploadedFiles([]);
    setProfileResponse(null);
    setDatasetProfiles([]);
    setActiveMapping(null);
    setReadinessResponse(null);
    setPreviewResponse(null);
    setAnalysisResponse(null);
    setError(null);
  };

  const stepsList = [
    { num: 1, label: "Upload CSVs" },
    { num: 2, label: "Profiling" },
    { num: 3, label: "Schema Mapping" },
    { num: 4, label: "Readiness" },
    { num: 5, label: "Dry-Run Preview" },
    { num: 6, label: "Analysis Outcome" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dataset Onboarding & Processing"
        description="Ingest customer subscription histories, map telemetry fields to canonical entities, and execute point-in-time retention analysis."
        badge={{
          text: `Step ${currentStep} of 6`,
          variant: "outline",
        }}
      />

      {/* Wizard Progress Ribbon */}
      <div className="rounded-xl border border-border bg-card p-3 overflow-x-auto shadow-xs">
        <div className="flex items-center justify-between min-w-[620px]">
          {stepsList.map((s, idx) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : s.num}
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap ${
                      isCurrent ? "text-foreground font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < stepsList.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-border shrink-0" aria-hidden="true" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Views */}
      {currentStep === 1 && (
        <DatasetUploadStep
          onFilesSelected={handleFilesSelected}
          isLoading={isLoading}
          error={error}
        />
      )}

      {currentStep === 2 && profileResponse && (
        <DatasetProfileStep
          profileResponse={profileResponse}
          onProceed={handleProceedToMapping}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <SchemaMappingStep
          profiles={datasetProfiles}
          onSubmitMapping={handleSubmitMapping}
          onBack={() => setCurrentStep(2)}
          isLoading={isLoading}
          error={error}
        />
      )}

      {currentStep === 4 && readinessResponse && (
        <ReadinessAssessmentStep
          assessment={readinessResponse}
          onProceedToPreview={handleProceedToPreview}
          onBack={() => setCurrentStep(3)}
          isLoading={isLoading}
          error={error}
        />
      )}

      {currentStep === 5 && previewResponse && (
        <ProcessingPreviewStep
          preview={previewResponse}
          onExecuteProcess={handleExecuteProcessing}
          onBack={() => setCurrentStep(4)}
          isLoading={isLoading}
          error={error}
        />
      )}

      {currentStep === 6 && analysisResponse && (
        <ProcessingExecutionStep
          result={analysisResponse}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
