import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { HeroSection } from "@/components/marketing/HeroSection";
import { ProductPreview } from "@/components/marketing/ProductPreview";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { CapabilitiesSection } from "@/components/marketing/CapabilitiesSection";
import { UseCasesSection } from "@/components/marketing/UseCasesSection";
import { TrustSection } from "@/components/marketing/TrustSection";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import MarketingLandingPage from "@/app/(marketing)/page";

describe("Phase F2: Public Marketing Website Components", () => {
  describe("MarketingHeader", () => {
    it("renders the Flurit brand wordmark and main navigation anchors", () => {
      render(<MarketingHeader />);
      expect(screen.getByText("Flurit")).toBeInTheDocument();
      expect(screen.getByText("Product Preview")).toBeInTheDocument();
      expect(screen.getByText("How It Works")).toBeInTheDocument();
      expect(screen.getByText("Capabilities")).toBeInTheDocument();
      expect(screen.getByText("Use Cases")).toBeInTheDocument();
      expect(screen.getByText("Methodology")).toBeInTheDocument();
    });

    it("toggles the mobile navigation drawer when menu button is clicked", () => {
      render(<MarketingHeader />);
      const menuButton = screen.getByRole("button", { name: /open main menu/i });
      fireEvent.click(menuButton);
      expect(screen.getByRole("button", { name: /close main menu/i })).toBeInTheDocument();
    });
  });

  describe("HeroSection", () => {
    it("renders the primary headline, value proposition, and CTA anchors", () => {
      render(<HeroSection />);
      expect(
        screen.getByRole("heading", { level: 1, name: /understand churn risk before customers leave/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/explore sample analysis/i)).toBeInTheDocument();
      expect(screen.getByText(/how flurit works/i)).toBeInTheDocument();
    });

    it("discloses the synthetic RavenStack SaaS benchmark telemetry origin", () => {
      render(<HeroSection />);
      expect(
        screen.getByText(/built on synthetic ravenstack saas benchmark telemetry/i)
      ).toBeInTheDocument();
    });
  });

  describe("ProductPreview", () => {
    it("prominently displays the synthetic dataset notice", () => {
      render(<ProductPreview />);
      expect(
        screen.getByText(/illustrative sample data modeled from the synthetic ravenstack benchmark dataset/i)
      ).toBeInTheDocument();
    });

    it("renders the sample customer risk table and allows switching tabs", () => {
      render(<ProductPreview />);
      // Initially on Risk Table
      expect(screen.getByText("cust_rvn_0481")).toBeInTheDocument();
      expect(screen.getByText("Weekly active seats dropped -62% MoM")).toBeInTheDocument();

      // Switch to SHAP Factor Attribution tab
      const shapTab = screen.getByRole("button", { name: /shap factor attribution/i });
      fireEvent.click(shapTab);
      expect(screen.getByText(/inspecting attribution for/i)).toBeInTheDocument();
      expect(screen.getByText(/directional feature weight attribution/i)).toBeInTheDocument();

      // Switch to Value x Risk Matrix tab
      const matrixTab = screen.getByRole("button", { name: /value × risk matrix/i });
      fireEvent.click(matrixTab);
      expect(screen.getByText(/operational prioritization matrix/i)).toBeInTheDocument();
      expect(screen.getByText(/immediate retention outreach/i)).toBeInTheDocument();
    });
  });

  describe("TrustSection", () => {
    it("explicitly clarifies operational risk rankings and non-causal SHAP attributions", () => {
      render(<TrustSection />);
      expect(screen.getByText("Synthetic Benchmark Transparency")).toBeInTheDocument();
      expect(
        screen.getByText("Operational Rankings vs. Calibrated Probabilities")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Directional Association vs. Causal Proof")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Human-in-the-Loop Decision Support")
      ).toBeInTheDocument();
    });
  });

  describe("MarketingFooter", () => {
    it("renders comprehensive disclaimer regarding RavenStack and uncalibrated rankings", () => {
      render(<MarketingFooter />);
      expect(screen.getByText(/flurit demonstrates retention intelligence using the open ravenstack synthetic saas dataset/i)).toBeInTheDocument();
      expect(screen.getByText(/operational decision heuristic/i)).toBeInTheDocument();
    });
  });

  describe("Full Landing Page Integration", () => {
    it("renders complete landing page flow without errors", () => {
      const { container } = render(<MarketingLandingPage />);
      expect(container).toBeInTheDocument();
      expect(screen.getByText(/why traditional saas churn prevention breaks down/i)).toBeInTheDocument();
      expect(screen.getByText(/how flurit transforms raw data into retention actions/i)).toBeInTheDocument();
      expect(screen.getByText(/engineered for analytical precision and operational clarity/i)).toBeInTheDocument();
      expect(screen.getByText(/built for teams accountable for recurring revenue retention/i)).toBeInTheDocument();
    });
  });
});
