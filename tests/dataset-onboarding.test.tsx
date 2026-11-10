import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DatasetUploadStep } from "@/components/datasets/DatasetUploadStep";
import { DatasetProfileStep } from "@/components/datasets/DatasetProfileStep";
import { SchemaMappingStep } from "@/components/datasets/SchemaMappingStep";
import { ReadinessAssessmentStep } from "@/components/datasets/ReadinessAssessmentStep";
import { ProcessingPreviewStep } from "@/components/datasets/ProcessingPreviewStep";
import { ProcessingExecutionStep } from "@/components/datasets/ProcessingExecutionStep";
import DatasetsOnboardingPage from "@/app/(app)/app/datasets/page";
import {
  MOCK_DATASET_PROFILES,
  MOCK_PROFILE_RESPONSE,
  MOCK_READINESS_RESPONSE,
  MOCK_PREVIEW_RESPONSE,
  MOCK_PROCESS_RESPONSE,
} from "@/mocks/fixtures";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { WorkspaceProvider } from "@/components/workspace/WorkspaceContext";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/app/datasets"),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthProvider>
      <WorkspaceProvider>{ui}</WorkspaceProvider>
    </AuthProvider>
  );
};

describe("Phase F4: Dataset Onboarding Workflow Components", () => {
  describe("DatasetUploadStep", () => {
    it("renders upload instructions, drag zone, and recommended tables guide", () => {
      render(
        <DatasetUploadStep onFilesSelected={jest.fn()} isLoading={false} />
      );
      expect(screen.getByText(/Step 1: Upload CSV Datasets/i)).toBeInTheDocument();
      expect(screen.getByText(/Click to select or drag and drop CSV files/i)).toBeInTheDocument();
      expect(screen.getByText(/Recommended B2B SaaS Tables:/i)).toBeInTheDocument();
    });

    it("displays error message when provided", () => {
      render(
        <DatasetUploadStep
          onFilesSelected={jest.fn()}
          isLoading={false}
          error="Failed to connect to backend profiler"
        />
      );
      expect(screen.getByText("Failed to connect to backend profiler")).toBeInTheDocument();
    });
  });

  describe("DatasetProfileStep", () => {
    it("renders global metrics ribbon and column profiling table", () => {
      render(
        <DatasetProfileStep
          profileResponse={MOCK_PROFILE_RESPONSE}
          onProceed={jest.fn()}
          onBack={jest.fn()}
        />
      );

      expect(screen.getByText("Step 2: Dataset Profiling & Schema Summary")).toBeInTheDocument();
      expect(screen.getByText("Total Records")).toBeInTheDocument();
      expect(screen.getByText("Total Columns")).toBeInTheDocument();
      expect(screen.getByText("accounts.csv")).toBeInTheDocument();
      expect(screen.getAllByText("account_id").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("signup_date").length).toBeGreaterThanOrEqual(1);
    });

    it("triggers onProceed callback when proceeding to mapping", () => {
      const onProceed = jest.fn();
      render(
        <DatasetProfileStep
          profileResponse={MOCK_PROFILE_RESPONSE}
          onProceed={onProceed}
          onBack={jest.fn()}
        />
      );

      const proceedButton = screen.getByRole("button", { name: /proceed to schema mapping/i });
      fireEvent.click(proceedButton);
      expect(onProceed).toHaveBeenCalledTimes(1);
    });
  });

  describe("SchemaMappingStep", () => {
    it("renders concept sections for accounts, subscriptions, and telemetry", () => {
      render(
        <SchemaMappingStep
          profiles={MOCK_DATASET_PROFILES}
          onSubmitMapping={jest.fn()}
          onBack={jest.fn()}
          isLoading={false}
        />
      );

      expect(screen.getByText("Step 3: Concept & Schema Mapping")).toBeInTheDocument();
      expect(screen.getByText("1. Account Concept (Required Core)")).toBeInTheDocument();
      expect(screen.getByText("2. Subscription Concept (Required Core)")).toBeInTheDocument();
      expect(screen.getByText("3. Feature Usage Telemetry (Recommended)")).toBeInTheDocument();
      expect(screen.getByText("Smart Column Auto-Match Active")).toBeInTheDocument();
    });

    it("validates that required core fields must be mapped before submitting", () => {
      const onSubmitMapping = jest.fn();
      render(
        <SchemaMappingStep
          profiles={[]} // Empty profiles with nothing mapped
          onSubmitMapping={onSubmitMapping}
          onBack={jest.fn()}
          isLoading={false}
        />
      );

      const submitButton = screen.getByRole("button", { name: /validate readiness/i });
      fireEvent.click(submitButton);

      expect(screen.getByText(/Account concept requires both account_id and signup_date/i)).toBeInTheDocument();
      expect(onSubmitMapping).not.toHaveBeenCalled();
    });
  });

  describe("ReadinessAssessmentStep", () => {
    it("renders dual-horizon status indicators and 45-feature model coverage percentage", () => {
      render(
        <ReadinessAssessmentStep
          assessment={MOCK_READINESS_RESPONSE}
          onProceedToPreview={jest.fn()}
          onBack={jest.fn()}
          isLoading={false}
        />
      );

      expect(screen.getByText("Step 4: Dataset Readiness Assessment")).toBeInTheDocument();
      expect(screen.getByText("Target Horizon Readiness")).toBeInTheDocument();
      expect(screen.getByText("Scoring Readiness")).toBeInTheDocument();
      expect(screen.getByText(/Feature Coverage: 100%/i)).toBeInTheDocument();
      expect(screen.getByText("Proceed to Processing Preview")).toBeInTheDocument();
    });
  });

  describe("ProcessingPreviewStep", () => {
    it("renders pre-flight input rows, eligible accounts, and observation dates", () => {
      render(
        <ProcessingPreviewStep
          preview={MOCK_PREVIEW_RESPONSE}
          onExecuteProcess={jest.fn()}
          onBack={jest.fn()}
          isLoading={false}
        />
      );

      expect(screen.getByText("Step 5: Pre-Flight Processing Preview")).toBeInTheDocument();
      expect(screen.getByText("Total Input Records")).toBeInTheDocument();
      expect(screen.getByText("Estimated Eligible Accounts")).toBeInTheDocument();
      expect(screen.getByText("2024-04-01")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /execute full ml processing/i })).toBeInTheDocument();
    });
  });

  describe("ProcessingExecutionStep", () => {
    it("renders processing outcome summary with snapshots count and scored tiers", () => {
      render(
        <ProcessingExecutionStep
          result={MOCK_PROCESS_RESPONSE}
          onReset={jest.fn()}
        />
      );

      expect(screen.getByText("Step 6: Analysis Outcome & Summary")).toBeInTheDocument();
      expect(screen.getByText("Processing Completed: SUCCESS")).toBeInTheDocument();
      expect(screen.getByText("Snapshots Created")).toBeInTheDocument();
      expect(screen.getByText("View Overview Dashboard")).toBeInTheDocument();
    });
  });

  describe("DatasetsOnboardingPage Integration", () => {
    it("starts on Step 1 (Upload CSVs) with wizard progress bar", () => {
      renderWithProviders(<DatasetsOnboardingPage />);
      expect(screen.getByText("Dataset Onboarding & Processing")).toBeInTheDocument();
      expect(screen.getByText("Step 1 of 6")).toBeInTheDocument();
      expect(screen.getByText("Step 1: Upload CSV Datasets")).toBeInTheDocument();
    });
  });
});
