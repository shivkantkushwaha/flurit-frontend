import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppHeader } from "@/components/app/AppHeader";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader } from "@/components/app/PageHeader";
import OverviewDashboardPage from "@/app/(app)/app/page";
import LoginPage from "@/app/(auth)/login/page";
import SignupPage from "@/app/(auth)/signup/page";
import CustomersPage from "@/app/(app)/app/customers/page";
import AnalyticsPage from "@/app/(app)/app/analytics/page";
import SettingsPage from "@/app/(app)/app/settings/page";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { WorkspaceProvider } from "@/components/workspace/WorkspaceContext";

// Keep shell tests independent from developer-specific Supabase values in .env.
process.env.NEXT_PUBLIC_SUPABASE_URL = "";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "";
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/app"),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => null),
  })),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthProvider>
      <WorkspaceProvider>{ui}</WorkspaceProvider>
    </AuthProvider>
  );
};

describe("Authenticated App Shell & Overview Dashboard", () => {
  describe("AppSidebar Component", () => {
    it("renders brand wordmark, active workspace, and all 5 navigation destinations", () => {
      renderWithProviders(<AppSidebar />);
      expect(screen.getByText("Flurit")).toBeInTheDocument();
      expect(screen.getByText("RavenStack Sandbox")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /overview/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /datasets/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /customers/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /analytics/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /settings/i })).toBeInTheDocument();
    });

    it("displays the dev mock auth badge and user email in development mode", () => {
      renderWithProviders(<AppSidebar />);
      expect(screen.getByText("Dev Mock Auth")).toBeInTheDocument();
      expect(screen.getByText("dev@flurit.local")).toBeInTheDocument();
    });
  });

  describe("AppHeader Component", () => {
    it("renders breadcrumb, data source tag, and user profile badge", () => {
      const onOpenMobile = jest.fn();
      renderWithProviders(<AppHeader onOpenMobile={onOpenMobile} />);
      expect(screen.getByText("Overview")).toBeInTheDocument();
      expect(screen.queryByText("RavenStack Benchmark")).not.toBeInTheDocument();
      expect(screen.getByText("dev@flurit.local")).toBeInTheDocument();
    });

    it("triggers mobile menu toggle when hamburger button is clicked", () => {
      const onOpenMobile = jest.fn();
      renderWithProviders(<AppHeader onOpenMobile={onOpenMobile} />);
      const button = screen.getByRole("button", { name: /open sidebar navigation/i });
      fireEvent.click(button);
      expect(onOpenMobile).toHaveBeenCalledTimes(1);
    });
  });

  describe("AppShell Component", () => {
    it("renders children, dev preview warning banner, and skip link", () => {
      renderWithProviders(
        <AppShell>
          <div data-testid="test-content">Dashboard Content</div>
        </AppShell>
      );
      expect(screen.getByTestId("test-content")).toBeInTheDocument();
      expect(screen.getByText(/local development preview/i)).toBeInTheDocument();
      expect(screen.getByText(/skip to main content/i)).toBeInTheDocument();
    });
  });

  describe("OverviewDashboardPage", () => {
    it("renders page header and honest first-run empty state when no dataset uploaded", () => {
      renderWithProviders(<OverviewDashboardPage />);
      expect(screen.getByRole("heading", { level: 1, name: /overview/i })).toBeInTheDocument();
      expect(screen.getByText("No Dataset Configured")).toBeInTheDocument();
      expect(screen.getByText("No customer risk analysis available")).toBeInTheDocument();
      expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Product Area Views", () => {
    it("renders customer intelligence with a search field for persisted records", () => {
      renderWithProviders(<CustomersPage />);
      expect(screen.getByRole("heading", { name: /customer intelligence/i })).toBeInTheDocument();
      expect(screen.getByRole("searchbox", { name: "Search customers" })).toBeEnabled();
    });

    it("renders Analytics page with an honest no-results state", () => {
      renderWithProviders(<AnalyticsPage />);
      expect(screen.getByRole("heading", { name: /analytics & insights/i })).toBeInTheDocument();
      expect(screen.getByText("No processing results available")).toBeInTheDocument();
    });

    it("renders functional account settings and sign-out control", () => {
      renderWithProviders(<SettingsPage />);
      expect(screen.getByRole("heading", { name: /account settings/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
    });
  });

  describe("Auth Screens", () => {
    it("opens signup in a dialog and switches to sign-in in place", () => {
      renderWithProviders(<AuthDialog label="Sign Up" signup />);
      const dialog = document.querySelector("dialog")!;
      // jsdom has no native modal implementation.
      dialog.showModal = () => { dialog.open = true; };
      fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));
      expect(screen.getByRole("dialog", { name: "Create account" })).toBeVisible();
      fireEvent.click(screen.getByRole("button", { name: /already have an account/i }));
      expect(screen.getByRole("dialog", { name: "Sign in to Flurit" })).toBeVisible();
      expect(screen.getByRole("heading", { name: "Sign In to Flurit" })).toBeVisible();
    });
    it("renders login page with email and password inputs", () => {
      renderWithProviders(<LoginPage />);
      expect(screen.getByText("Sign In to Flurit")).toBeInTheDocument();
      expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /^sign in$/i })).toBeInTheDocument();
    });

    it("renders signup page with full name, email, and password confirmation", () => {
      renderWithProviders(<SignupPage />);
      expect(screen.getAllByText("Create Account").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });
  });
});
