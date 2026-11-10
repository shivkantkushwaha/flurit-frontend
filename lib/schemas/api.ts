import { z } from "zod";
import { CanonicalFeaturesSchema } from "./features";

export const ScorePredictionRequestSchema = z.object({
  account_id: z.string().min(1, "account_id is required"),
  snapshot_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "snapshot_date must be YYYY-MM-DD"),
  features: CanonicalFeaturesSchema,
});

export const CustomerRiskRequestSchema = z.object({
  snapshot_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "snapshot_date must be YYYY-MM-DD"),
  features: CanonicalFeaturesSchema,
});

export const PrioritizationRecordSchema = z.object({
  account_id: z.string().min(1),
  sub_current_mrr: z.number().min(0),
  model_score: z.number().min(0).max(1),
});

export const PrioritizationRequestSchema = z.object({
  records: z.array(PrioritizationRecordSchema).min(1, "At least one customer record is required"),
  mrr_high_threshold: z.number().optional(),
  mrr_mid_threshold: z.number().optional(),
  score_high_threshold: z.number().optional(),
  score_mid_threshold: z.number().optional(),
});

export const AccountConceptMappingSchema = z.object({
  account_id: z.string().min(1, "account_id is required"),
  signup_date: z.string().min(1, "signup_date is required"),
  industry: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  referral_source: z.string().nullable().optional(),
  initial_seats: z.string().nullable().optional(),
  is_trial: z.string().nullable().optional(),
});

export const SubscriptionConceptMappingSchema = z.object({
  subscription_id: z.string().min(1, "subscription_id is required"),
  account_id: z.string().min(1, "account_id is required"),
  start_date: z.string().min(1, "start_date is required"),
  end_date: z.string().nullable().optional(),
  mrr: z.string().nullable().optional(),
  arr: z.string().nullable().optional(),
  seats: z.string().nullable().optional(),
  billing_frequency: z.string().nullable().optional(),
  auto_renew: z.string().nullable().optional(),
  is_trial: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
});

export const SchemaMappingRequestSchema = z.object({
  accounts: AccountConceptMappingSchema.nullable().optional(),
  subscriptions: SubscriptionConceptMappingSchema.nullable().optional(),
  feature_usage: z.record(z.string(), z.any()).nullable().optional(),
  support_tickets: z.record(z.string(), z.any()).nullable().optional(),
  churn_events: z.record(z.string(), z.any()).nullable().optional(),
  dataset_profiles: z.array(z.any()).nullable().optional(),
  prediction_window_days: z.number().min(1).max(365).optional(),
  mappings: z.record(z.string(), z.record(z.string(), z.string())).optional(),
  source_tables: z.array(z.string()).optional(),
});
