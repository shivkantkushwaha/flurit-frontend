# Flurit F5 Customer Intelligence Phase Report

**Status:** Partial implementation; the account roster is blocked by missing backend data capabilities.

## 1. Features implemented

- Replaced the `/app/customers` placeholder with a responsive customer-account table shell and a truthful unavailable state.
- Shows aggregate account count, high-risk count, and observation date when they are available from the completed dataset processing summary. These are clearly identified as portfolio summaries, not account rows.
- Added `/app/customers/assess` for requesting an individual risk assessment when the operator supplies an account ID and a complete canonical 45-feature snapshot.
- Validates JSON and canonical feature completeness before making a request. Does not populate defaults or infer customer information.
- Displays returned score tier, score interpretation, model version, segment, summary, returned factor attributions, and association disclaimer. Incomplete responses are withheld and reported as partial.
- Handles unauthorized, forbidden, timeout, and general request errors with user-facing messages. Uses the existing authenticated API client and Supabase token provider.
- Uses explicit language that scores are uncalibrated relative-risk rankings and that SHAP factors represent associations, not causes.

## 2. Routes and components

- Modified `app/(app)/app/customers/page.tsx`.
- Added `app/(app)/app/customers/assess/page.tsx`.
- Updated `lib/types/api.ts` to make account ID and snapshot date optional where the OpenAPI snapshot marks them optional.
- Added `tests/customers.test.tsx` for the roster unavailable state, feature validation, returned detail rendering, and unauthorized handling.

## 3. Backend endpoints and contracts reviewed

The repository's checked-in `openapi.json` was inspected. Its schema reports:

| Endpoint | Method in schema | Request / response contract |
| --- | --- | --- |
| `/api/v1/predictions/score` | POST | Feature payload with optional account ID and snapshot date; returns score, risk tier, and interpretation. |
| `/api/v1/customers/{account_id}/risk` | POST | Feature payload with optional snapshot date; returns model score/tier, segment, local factor attributions, summary, and disclaimers. |
| `/api/v1/prioritization/quadrants` | POST | A list of account ID, MRR, and model score records; returns portfolio totals and five priority quadrants. |
| `/api/v1/onboarding/process` | POST | Returns processing status and aggregate snapshot/scoring summaries, not account rows or canonical customer feature snapshots. |

The customer risk request and response definitions in `lib/types/api.ts` were checked against these schemas. The local API service already uses POST for all three listed operations. The live OpenAPI URL `https://flurit-backend.onrender.com/openapi.json` could not be fetched in this environment: the request failed because the hostname did not resolve. Therefore the deployed contract and live endpoint availability are **not verified in this phase**; the contract notes above are based on the checked-in schema only. No live customer request was made.

## 4. Features connected to live backend data

- Individual risk request is wired to the existing authenticated `POST /customers/{account_id}/risk` service. Integration is deterministic-test-mocked; it was not verified against the deployed service in this environment.
- Portfolio aggregates on `/app/customers` are sourced from the completed onboarding response already stored in the current session workspace state. No additional network request is made by the customer page.

## 5. Features unavailable due to backend limitations

- No customer roster/list endpoint is present in the checked-in OpenAPI schema.
- Dataset processing returns aggregate counts and aggregate prioritization summaries. It does not return customer IDs, account profile fields, subscription data, MRR by account, individual scores, or each account's canonical feature snapshot.
- Consequently live customer search, risk/industry filters, column sorting, pagination, account detail links, and retention-attention lists cannot be populated honestly. The roster search is disabled and the table explains why.
- The individual assessment screen requires an operator-provided account ID and full canonical feature snapshot; the backend cannot resolve these inputs from an account ID alone.
- The quadrants endpoint requires per-customer MRR and score records, which the current processing response does not expose. It is not called with invented records.
- Historical score changes, generated-at timestamps, customer-level revenue-at-risk values, and customer-specific retention actions are not returned by the reviewed contracts and are not displayed.

## 6. Tests and results

- Added tests for the empty roster, client-side feature validation, rendering returned risk and factor fields, and an unauthorized response.
- Existing `tests/api-client.test.ts` uses deterministic MSW mocks for the score, customer-risk, and prioritization POST services, including bearer token injection and error behavior.
- `pnpm test`: passed, 9 suites and 64 tests. Existing dataset onboarding tests emit React `act(...)` console warnings; they do not fail the suite.

## 7. Quality gate results

- `pnpm typecheck`: passed.
- `pnpm lint`: passed with no ESLint warnings or errors. Next.js reports that `next lint` is deprecated in Next.js 16.
- `pnpm test`: passed, 9 suites and 64 tests. The runner used a writable workspace temp directory after the host temp cache returned `EPERM`.
- `pnpm build`: passed; `/app/customers` and `/app/customers/assess` were generated as static routes.

## 8. Known issues and recommended next steps

- Backend work is needed to expose a tenant-scoped customer roster with account profile/subscription fields, latest score, snapshot date, and the exact feature snapshot needed for detail explanations. Add supported filter/sort/pagination semantics and an account detail/read endpoint (or include these records in an authorized processing response).
- The backend should document whether risk scoring persists assessments, whether a last-assessed timestamp exists, and how a user retrieves prior results.
- After the deployed OpenAPI URL is reachable, re-fetch it and verify the request/response schemas and CORS/auth behavior before claiming live integration.
- Search, filters, sorting, and pagination are **not implemented against local fabricated records** because no roster records are available from the current backend contract.
