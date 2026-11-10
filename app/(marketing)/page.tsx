import React from "react";
import { HeroSection } from "@/components/marketing/HeroSection";
import { ProductPreview } from "@/components/marketing/ProductPreview";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { CapabilitiesSection } from "@/components/marketing/CapabilitiesSection";
import { UseCasesSection } from "@/components/marketing/UseCasesSection";
import { TrustSection } from "@/components/marketing/TrustSection";
import { FinalCTA } from "@/components/marketing/FinalCTA";

export default function MarketingLandingPage() {
  return (
    <>
      <HeroSection />
      <ProductPreview />
      <ProblemSection />
      <HowItWorksSection />
      <CapabilitiesSection />
      <UseCasesSection />
      <TrustSection />
      <FinalCTA />
    </>
  );
}
