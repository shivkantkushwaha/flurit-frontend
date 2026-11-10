# Flurit F7 Product Completion Audit

**Classification: Partial completion; integration is not verified and Flurit is not a production candidate.**

## Audited implementation

- Frontend: Next.js 15 App Router, React 19, TypeScript, Tailwind, Supabase Auth adapter, authenticated FastAPI client, onboarding, customer assessment, analytics, and session workspace state.
- Backend: FastAPI v1 routes, Supabase JWT verification, workspace membership resolution, SQLAlchemy tenant-scoped account/snapshot/feature/prediction/explanation/segment/job models, Alembic migrations, async processing jobs, upload storage and queues, 45-feature pipeline, frozen model artifact, SHAP explainer, segmenter, prioritization, and prediction persistence repository.
- Existing frontend F5/F6 and backend implementation documentation, OpenAPI snapshot, tests and model artifact metadata were reviewed. The deployed backend/OpenAPI could not be reached from this environment; no live API, Supabase, database, or CORS verification is claimed.

## Changes in this phase

- Added a reusable cursive-style `BrandWordmark` using local system font fallbacks and applied it to the marketing header/footer, app sidebar/header, and login/signup screens. Removed the generic chart icon mark from those brand placements.
- Removed customer-facing Supabase infrastructure wording from login status copy while retaining auth behavior and making preview mode explicit.
- Replaced the settings placeholder with functional account profile display and session sign-out. Did not present unsupported billing, integrations, or team controls.
- F5/F6 analytics/report changes remain as previously implemented; no existing inference or onboarding pipeline was replaced.

## High-priority findings

1. **Onboarding results are not persisted.** `OnboardingService.process_dataset` returns the processor's in-memory aggregate response. The `/onboarding/process` handler does not inject a DB session or call `PredictionService.run_and_persist_batch`. The database tables and repository exist, but this dataset path does not save customer snapshots/features/predictions for retrieval after refresh.
2. **Customer roster/history is unavailable.** The reviewed prediction routes include one-off score, customer risk, and quadrants POST operations; there is no tenant-scoped GET roster/history endpoint. The customer risk endpoint checks workspace ownership against the account table, but onboarding processing does not persist the uploaded accounts into that table.
3. **Feature readiness is not retained in the processing result.** Readiness mapping computes coverage, but `EndToEndAnalysisResponse` does not include that report. In `ProcessingOptions`, sentinel scoring can be explicitly enabled; the UI must preserve the distinction between full readiness and sentinel-based partial scoring.
4. **Workspace state is browser-session scoped.** Frontend analysis summaries are stored in session storage and are not a durable source of truth across sessions/devices.
5. **Data path for model run metadata:** inference preloads model artifacts and checks feature order; database model run/prediction persistence is implemented in a separate service, but no live job execution verified its use.
6. **Production service verification is blocked.** The configured deployed API host did not resolve in this environment. No signup/login against a real Supabase project, real upload, production DB migration, model-backed live request, or cross-workspace production test was performed.

## Feature completeness review

- The backend defines 45 canonical features across account, subscription, product usage, support, and churn history. The mapper can report domain coverage and readiness. The exact 31/45 state must be confirmed using an actual customer mapping; this audit did not claim a fixed current coverage value.
- Usage and support features are derived from the corresponding user-provided tables and transformations. If these domains are absent, scoring readiness is false; sentinel scoring is opt-in and carries distribution-shift warnings. Arbitrary customer values were not added.
- Frozen model artifact metadata and inference validation code are present locally. Artifact load/inference passed only insofar as the repo's test paths are run; the production deployed artifact and a real customer's dataset were not exercised end to end.

## Verification

- Frontend `pnpm typecheck`: passed.
- Frontend `pnpm lint`: passed with no ESLint findings (Next 15 emits its `next lint` deprecation notice).
- Frontend `pnpm test`: passed, 10 suites / 66 tests. Existing dataset onboarding React `act(...)` and Jest worker teardown warnings remain.
- Frontend `pnpm build`: passed. The first build attempt hit a transient Windows `EPERM` creating a generated `.next` directory; retry completed and emitted all 12 static pages.
- Backend focused test runs were attempted but did not complete within the available execution window. The first verbose selection stalled in `tests/test_inference.py::TestAuthentication::test_expired_token_rejected`; a focused processing run advanced through several tests then stalled. Both were interrupted; no backend pass is claimed.
- Alembic migration status, Postgres readiness, RLS policies, CORS, production secrets, and API integration remain unverified because they depend on external deployment/database access.

## Required work before production candidacy

- Wire dataset processing to a transactional tenant-scoped persistence flow, including source account/subscription data, snapshots, canonical features, model run, predictions, explanations, and segments; add migration coverage only if schema changes are needed.
- Add authenticated tenant-scoped list/detail/history endpoints with search/filter/sort/pagination, and verify cross-tenant access is denied.
- Return durable processing/job identifiers and retrieve completed results after refresh. Persist readiness and feature coverage with those results.
- Correctly report scoring eligibility, sentinel use, inference failures, partial records and successful scores as distinct statuses.
- Verify deployed OpenAPI, Supabase auth, database migrations/readiness, model artifact health, CORS, API calls and the upload-to-inference-to-retrieval journey against real services.
- Run backend tests and relevant security/migration/integration tests to completion; run a real but synthetic benchmark dataset only with clear benchmark labeling and a separate customer-provided dataset before claims about customer performance.
