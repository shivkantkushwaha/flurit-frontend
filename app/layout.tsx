import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Flurit | Customer Churn & Retention Intelligence",
  description: "B2B SaaS customer churn prediction, SHAP risk explainability, and revenue prioritization platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
