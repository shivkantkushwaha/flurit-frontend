import React from "react";
import type { Metadata } from "next";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Flurit | B2B SaaS Customer Churn & Retention Intelligence",
  description:
    "Understand customer churn risk before renewal dates slip away. Transparent 60-day operational risk rankings, directional SHAP factor attribution, and revenue-weighted prioritization.",
  keywords: [
    "customer churn",
    "retention intelligence",
    "B2B SaaS",
    "SHAP explainability",
    "churn prediction",
    "revenue at risk",
    "RavenStack",
  ],
  openGraph: {
    title: "Flurit | B2B SaaS Customer Churn & Retention Intelligence",
    description:
      "Understand customer churn risk before renewal dates slip away. Transparent 60-day operational risk rankings, directional SHAP factor attribution, and revenue-weighted prioritization.",
    type: "website",
    locale: "en_US",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
