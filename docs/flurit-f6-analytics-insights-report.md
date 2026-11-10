# Flurit F6 Analytics & Insights Report

**Status:** Implemented for values returned by the current dataset processing response; historical trends and account-level analytics remain blocked by backend response granularity.

## 1. Features implemented

- Replaced `/app/analytics` placeholder with portfolio KPIs, risk-tier count bars, observation coverage, target counts, returned revenue prioritization summaries, model metadata, global factor attribution summaries, segment counts, processing readiness, warnings, blockers, and rejected-record counts.
- Added explicit empty and partial-processing states. No time series is inferred from aggregate churn or from observation dates alone.
- Displays uncalibrated relative-risk interpretation, SHAP association disclaimer, and estimated-revenue-at-risk heuristic disclosure.
- Labels the source as the latest processed dataset and reports uploaded file count/status.
- Preserves the actual `EndToEndAnalysisResponse` alongside existing workspace state in session storage for the analytics route. Existing F4 summary flow is preserved.
- Uses responsive native components and CSS bars; no charting dependency was added.

## 2. Routes and components changed

- Replaced `app/(app)/app/analytics/page.tsx`.
- Extended `WorkspaceState` with optional `analysisResult` and stored the full processing response in `components/workspace/WorkspaceContext.tsx`.
- Added `tests/analytics.test.tsx` for empty and partial-result states and interpretation disclosures.

## 3. Existing APIs and contracts used

- Reuses the F4 authenticated `POST /api/v1/onboarding/process` response already received by dataset onboarding; the analytics route makes no additional request and creates no second API client.
- Reviewed checked-in `openapi.json` and existing `EndToEndAnalysisResponse` types. This processing response includes optional `snapshot_summary` and `scoring_summary` objects.
- As in F5, the deployed OpenAPI host could not be resolved from this environment; this work relies on the checked-in schema and does not claim a new live integration.

## 4. Metrics available in processing response

When the corresponding summary objects/fields are returned, the UI displays eligible account count, total snapshots, scored snapshot count, aggregate churn rate, positive/negative/censored target counts, observation dates/count, risk-tier counts, model name/version, average model score (not displayed as probability), segment distribution, global mean absolute SHAP feature summaries, prioritization quadrant MRR and estimated risk MRR, processing readiness, blockers, warnings, and rejection totals.

## 5. Metrics unavailable due to backend limitations

- No per-observation-date churn outcomes are returned, so trend charts are unavailable even if multiple observation dates are listed.
- No customer-level rows/features are returned; no customer drilldown, cohort breakdown, filters, or account-level exposure can be produced.
- Processing response does not include feature coverage detail (available earlier during readiness assessment, but not retained in the F4 workspace result), so coverage is not shown here.
- Customer-specific retention patterns, model calibration/performance metrics, historical comparison, and retention actions are unavailable.
- Revenue exposure is only shown if prioritization quadrant values were actually returned; otherwise the page displays unavailable and explains why.

## 6. Tests and quality gates

- Added empty-state and partial-result tests with deterministic values.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed with no ESLint warnings or errors (Next 15 emits a deprecation notice for `next lint`).
- `pnpm test`: passed, 10 suites and 66 tests. Existing onboarding tests emit React `act(...)` and worker teardown warnings, but the command exits successfully.
- `pnpm build`: passed; `/app/analytics` built as a static route.

## 7. Known issues

- Workspace analysis is session-scoped; refresh retains the latest result in session storage, while ending the browser session clears it.
- Existing dataset onboarding tests may log React `act(...)` warnings despite passing.
- Charts are aggregate count bars only; trend and cohort visualizations require granular backend data.

## 8. Backend capabilities needed for production completion

- Return per-date churn outcomes and observation-level model summaries for defensible trend visualizations.
- Persist and expose readiness feature coverage with the processing result.
- Provide tenant-scoped account-level scores, canonical feature snapshots, and commercial data to support cohorts and drilldowns.
- Define calibration and model evaluation metadata if calibrated probability or performance views are desired.
