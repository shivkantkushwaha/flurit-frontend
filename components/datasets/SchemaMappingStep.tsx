"use client";

import React, { useState, useEffect } from "react";
import { DatasetProfile, SchemaMappingRequest } from "@/lib/types/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Layers, Loader2, Sparkles } from "lucide-react";

interface SchemaMappingStepProps {
  profiles: DatasetProfile[];
  onSubmitMapping: (mapping: SchemaMappingRequest) => void;
  onBack: () => void;
  isLoading: boolean;
  error?: string | null;
}

interface ColumnOption {
  id: string;
  table: string;
  column: string;
  type: string;
  label: string;
}

export function SchemaMappingStep({
  profiles,
  onSubmitMapping,
  onBack,
  isLoading,
  error,
}: SchemaMappingStepProps) {
  // Extract all available columns across uploaded datasets
  const availableColumns: ColumnOption[] = React.useMemo(
    () =>
      profiles.flatMap((p) =>
        p.columns.map((col) => ({
          id: `${p.file_name}::${col.column_name}`,
          table: p.file_name,
          column: col.column_name,
          type: col.inferred_type,
          label: `${p.file_name} → ${col.column_name} (${col.inferred_type})`,
        }))
      ),
    [profiles]
  );

  // Helper to auto-match column names case-insensitively
  const findMatch = React.useCallback(
    (candidates: string[], source?: string): string => {
      for (const cand of candidates) {
        const match = availableColumns.find(
          (c) => (!source || c.table.toLowerCase().includes(source)) && (c.column.toLowerCase() === cand.toLowerCase() || c.column.toLowerCase().includes(cand.toLowerCase()))
        );
        if (match) return match.id;
      }
      return "";
    },
    [availableColumns]
  );

  // State for each concept mapping
  const [accountMapping, setAccountMapping] = useState({
    account_id: "",
    signup_date: "",
    industry: "",
    country: "",
    referral_source: "",
    initial_seats: "",
    is_trial: "",
  });

  const [subMapping, setSubMapping] = useState({
    subscription_id: "",
    account_id: "",
    start_date: "",
    end_date: "",
    mrr: "",
    arr: "",
    seats: "",
    billing_frequency: "",
    auto_renew: "",
    is_trial: "",
    status: "",
  });

  const [usageMapping, setUsageMapping] = useState({
    event_time: "",
    account_id: "",
    subscription_id: "",
    feature_name: "",
    duration_secs: "",
    is_error: "",
    is_beta: "",
  });

  const [ticketsMapping, setTicketsMapping] = useState({
    ticket_id: "",
    account_id: "",
    created_at: "",
    closed_at: "",
    status: "",
    priority: "",
    satisfaction_score: "",
  });

  const [churnMapping, setChurnMapping] = useState({
    account_id: "",
    churn_date: "",
    churn_type: "",
    churn_reason: "",
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-match on initial load
  useEffect(() => {
    setAccountMapping({
      account_id: findMatch(["account_id", "customer_id", "acc_id", "id"]),
      signup_date: findMatch(["signup_date", "created_at", "joined_at", "onboarding_date"]),
      industry: findMatch(["industry", "vertical", "sector"]),
      country: findMatch(["country", "region", "country_code"]),
      referral_source: findMatch(["referral_source", "source", "channel"]),
      initial_seats: findMatch(["initial_seats", "seats", "starting_seats"]),
      is_trial: findMatch(["is_trial", "trial_account"]),
    });

    setSubMapping({
      subscription_id: findMatch(["subscription_id", "sub_id"], "subscriptions"),
      account_id: findMatch(["account_id", "customer_id", "acc_id"]),
      start_date: findMatch(["start_date", "sub_start", "activated_at"]),
      end_date: findMatch(["end_date", "sub_end", "cancellation_date"]),
      mrr: findMatch(["mrr", "monthly_recurring_revenue", "monthly_mrr"]),
      arr: findMatch(["arr", "annual_recurring_revenue"]),
      seats: findMatch(["seats", "active_seats", "license_count"]),
      billing_frequency: findMatch(["billing_frequency", "plan_interval", "billing_period"]),
      auto_renew: findMatch(["auto_renew", "has_auto_renew"]),
      is_trial: findMatch(["is_trial"]),
      status: findMatch(["status", "subscription_status"]),
    });

    setUsageMapping({
      event_time: findMatch(["event_time", "timestamp", "activity_time"]),
      account_id: findMatch(["account_id", "customer_id"]),
      subscription_id: findMatch(["subscription_id", "sub_id"], "feature_usage"),
      feature_name: findMatch(["feature_name", "action", "module"]),
      duration_secs: findMatch(["duration_secs", "duration", "seconds"]),
      is_error: findMatch(["is_error", "has_error", "error"]),
      is_beta: findMatch(["is_beta", "beta_feature"]),
    });

    setTicketsMapping({
      ticket_id: findMatch(["ticket_id", "case_id", "support_id"]),
      account_id: findMatch(["account_id", "customer_id"]),
      created_at: findMatch(["created_at", "ticket_created", "opened_at"]),
      closed_at: findMatch(["closed_at", "resolved_at"]),
      status: findMatch(["status", "ticket_status"]),
      priority: findMatch(["priority", "severity"]),
      satisfaction_score: findMatch(["satisfaction_score", "csat", "rating"]),
    });

    setChurnMapping({
      account_id: findMatch(["account_id", "customer_id"]),
      churn_date: findMatch(["churn_date", "cancelled_at", "cancellation_date"]),
      churn_type: findMatch(["churn_type", "type"]),
      churn_reason: findMatch(["churn_reason", "reason"]),
    });
  }, [findMatch]);

  const handleSubmit = () => {
    setValidationError(null);

    // Validate required fields for Accounts and Subscriptions
    if (!accountMapping.account_id || !accountMapping.signup_date) {
      setValidationError("Account concept requires both account_id and signup_date to be mapped.");
      return;
    }

    if (!subMapping.subscription_id || !subMapping.account_id || !subMapping.start_date) {
      setValidationError("Subscription concept requires subscription_id, account_id, and start_date to be mapped.");
      return;
    }

    // Internal select values include both source file and column. Strip the
    // source identity only at this API boundary: the existing backend contract
    // accepts column names and resolves each concept against its named table.
    const columnName = (id: string) => availableColumns.find((option) => option.id === id)?.column ?? "";
    const account = Object.fromEntries(Object.entries(accountMapping).map(([key, value]) => [key, columnName(value)])) as typeof accountMapping;
    const subscription = Object.fromEntries(Object.entries(subMapping).map(([key, value]) => [key, columnName(value)])) as typeof subMapping;
    const usage = Object.fromEntries(Object.entries(usageMapping).map(([key, value]) => [key, columnName(value)])) as typeof usageMapping;
    const tickets = Object.fromEntries(Object.entries(ticketsMapping).map(([key, value]) => [key, columnName(value)])) as typeof ticketsMapping;
    const churn = Object.fromEntries(Object.entries(churnMapping).map(([key, value]) => [key, columnName(value)])) as typeof churnMapping;

    // Build the request payload conforming strictly to the existing API contract.
    const payload: SchemaMappingRequest = {
      accounts: {
        account_id: account.account_id,
        signup_date: account.signup_date,
        industry: account.industry || null,
        country: account.country || null,
        referral_source: account.referral_source || null,
        initial_seats: account.initial_seats || null,
        is_trial: account.is_trial || null,
      },
      subscriptions: {
        subscription_id: subscription.subscription_id,
        account_id: subscription.account_id,
        start_date: subscription.start_date,
        end_date: subscription.end_date || null,
        mrr: subscription.mrr || null,
        arr: subscription.arr || null,
        seats: subscription.seats || null,
        billing_frequency: subscription.billing_frequency || null,
        auto_renew: subscription.auto_renew || null,
        is_trial: subscription.is_trial || null,
        status: subscription.status || null,
      },
      feature_usage: usage.event_time
        ? {
            event_time: usage.event_time,
            account_id: usage.account_id || null,
            subscription_id: usage.subscription_id || null,
            feature_name: usage.feature_name || null,
            duration_secs: usage.duration_secs || null,
            is_error: usage.is_error || null,
            is_beta: usage.is_beta || null,
          }
        : null,
      support_tickets: tickets.ticket_id && tickets.created_at
        ? {
            ticket_id: tickets.ticket_id,
            account_id: tickets.account_id || account.account_id,
            created_at: tickets.created_at,
            closed_at: tickets.closed_at || null,
            status: tickets.status || null,
            priority: tickets.priority || null,
            satisfaction_score: tickets.satisfaction_score || null,
          }
        : null,
      churn_events: churn.account_id && churn.churn_date
        ? {
            account_id: churn.account_id,
            churn_date: churn.churn_date,
            churn_type: churn.churn_type || null,
            churn_reason: churn.churn_reason || null,
          }
        : null,
      dataset_profiles: profiles,
      prediction_window_days: 60,
    };

    onSubmitMapping(payload);
  };

  const renderSelect = (
    value: string,
    onChange: (val: string) => void,
    placeholder: string,
    isRequired = false
  ) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-9 w-full rounded border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <option value="">{isRequired ? "— Select Required Column —" : "— Unmapped (Use Sentinel Default) —"}</option>
      {availableColumns.map((col) => (
        <option key={col.id} value={col.id}>
          {col.column} &nbsp;({col.table} &bull; {col.type})
        </option>
      ))}
    </select>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xl">Step 3: Concept & Schema Mapping</CardTitle>
              <CardDescription>
                Map your uploaded dataset columns to Flurit&apos;s canonical B2B SaaS entities and 45-feature model requirements.
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-200">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Smart Column Auto-Match Active</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {(validationError || error) && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{validationError || error}</span>
            </div>
          )}

          {/* Section 1: Account Concept (Mandatory) */}
          <div className="rounded-xl border border-border p-4 space-y-4 bg-card">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-foreground">1. Account Concept (Required Core)</h3>
              </div>
              <Badge variant="outline" className="text-xs">Required for All Analyses</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <span>account_id</span>
                  <span className="text-destructive">*</span>
                </label>
                {renderSelect(accountMapping.account_id, (val) => setAccountMapping({ ...accountMapping, account_id: val }), "account_id", true)}
                <span className="text-[11px] text-muted-foreground block">Unique customer/account identifier</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <span>signup_date</span>
                  <span className="text-destructive">*</span>
                </label>
                {renderSelect(accountMapping.signup_date, (val) => setAccountMapping({ ...accountMapping, signup_date: val }), "signup_date", true)}
                <span className="text-[11px] text-muted-foreground block">Customer onboarding timestamp</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">industry</label>
                {renderSelect(accountMapping.industry, (val) => setAccountMapping({ ...accountMapping, industry: val }), "industry")}
                <span className="text-[11px] text-muted-foreground block">Business vertical/category</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">country</label>
                {renderSelect(accountMapping.country, (val) => setAccountMapping({ ...accountMapping, country: val }), "country")}
                <span className="text-[11px] text-muted-foreground block">Country code (ISO)</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">initial_seats</label>
                {renderSelect(accountMapping.initial_seats, (val) => setAccountMapping({ ...accountMapping, initial_seats: val }), "initial_seats")}
                <span className="text-[11px] text-muted-foreground block">Seats at onboarding</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">referral_source</label>
                {renderSelect(accountMapping.referral_source, (val) => setAccountMapping({ ...accountMapping, referral_source: val }), "referral_source")}
                <span className="text-[11px] text-muted-foreground block">Acquisition channel</span>
              </div>
            </div>
          </div>

          {/* Section 2: Subscription Concept (Mandatory) */}
          <div className="rounded-xl border border-border p-4 space-y-4 bg-card">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-foreground">2. Subscription Concept (Required Core)</h3>
              </div>
              <Badge variant="outline" className="text-xs">Required for Contract Trajectories</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <span>subscription_id</span>
                  <span className="text-destructive">*</span>
                </label>
                {renderSelect(subMapping.subscription_id, (val) => setSubMapping({ ...subMapping, subscription_id: val }), "subscription_id", true)}
                <span className="text-[11px] text-muted-foreground block">Contract subscription ID</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <span>account_id (Foreign Key)</span>
                  <span className="text-destructive">*</span>
                </label>
                {renderSelect(subMapping.account_id, (val) => setSubMapping({ ...subMapping, account_id: val }), "account_id", true)}
                <span className="text-[11px] text-muted-foreground block">Matching account FK</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <span>start_date</span>
                  <span className="text-destructive">*</span>
                </label>
                {renderSelect(subMapping.start_date, (val) => setSubMapping({ ...subMapping, start_date: val }), "start_date", true)}
                <span className="text-[11px] text-muted-foreground block">Subscription activation date</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">mrr</label>
                {renderSelect(subMapping.mrr, (val) => setSubMapping({ ...subMapping, mrr: val }), "mrr")}
                <span className="text-[11px] text-muted-foreground block">Monthly recurring revenue ($)</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">end_date</label>
                {renderSelect(subMapping.end_date, (val) => setSubMapping({ ...subMapping, end_date: val }), "end_date")}
                <span className="text-[11px] text-muted-foreground block">Termination timestamp if ended</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">seats</label>
                {renderSelect(subMapping.seats, (val) => setSubMapping({ ...subMapping, seats: val }), "seats")}
                <span className="text-[11px] text-muted-foreground block">Licensed user seat count</span>
              </div>
            </div>
          </div>

          {/* Section 3: Feature Usage Concept (Optional for Telemetry) */}
          <div className="rounded-xl border border-border p-4 space-y-4 bg-muted/10">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <h3 className="text-sm font-bold text-foreground">3. Feature Usage Telemetry (Recommended)</h3>
              </div>
              <Badge variant="outline" className="text-xs">Powers Engagement Features</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">event_time</label>
                {renderSelect(usageMapping.event_time, (val) => setUsageMapping({ ...usageMapping, event_time: val }), "event_time")}
                <span className="text-[11px] text-muted-foreground block">Activity event timestamp</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">feature_name</label>
                {renderSelect(usageMapping.feature_name, (val) => setUsageMapping({ ...usageMapping, feature_name: val }), "feature_name")}
                <span className="text-[11px] text-muted-foreground block">Product module / action type</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">duration_secs</label>
                {renderSelect(usageMapping.duration_secs, (val) => setUsageMapping({ ...usageMapping, duration_secs: val }), "duration_secs")}
                <span className="text-[11px] text-muted-foreground block">Session length in seconds</span>
              </div>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <Button type="button" variant="outline" onClick={onBack} disabled={isLoading} className="gap-2">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to Profiling</span>
            </Button>

            <Button type="button" variant="primary" onClick={handleSubmit} disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Validating Schema & Assessing Readiness...</span>
                </>
              ) : (
                <>
                  <span>Validate Readiness</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
