import { http, HttpResponse } from "msw";
import {
  MOCK_SCORE_RESPONSE,
  MOCK_CUSTOMER_RISK_RESPONSE,
  MOCK_PRIORITIZATION_RESPONSE,
  MOCK_PROFILE_RESPONSE,
  MOCK_READINESS_RESPONSE,
  MOCK_PREVIEW_RESPONSE,
  MOCK_PROCESS_RESPONSE,
} from "./fixtures";

/**
 * Standard MSW Request Handlers strictly modeling documented /api/v1 endpoints.
 */
export const handlers = [
  // 1. Scoring endpoint: POST /api/v1/predictions/score
  http.post("*/api/v1/predictions/score", async ({ request }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication required: Bearer token is missing" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as { account_id?: string; snapshot_date?: string };
    return HttpResponse.json({
      ...MOCK_SCORE_RESPONSE,
      account_id: body.account_id || MOCK_SCORE_RESPONSE.account_id,
      snapshot_date: body.snapshot_date || MOCK_SCORE_RESPONSE.snapshot_date,
    });
  }),

  // 2. Customer Risk & SHAP attribution: POST /api/v1/customers/:accountId/risk
  http.post("*/api/v1/customers/:accountId/risk", async ({ request, params }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication required: Bearer token is missing" },
        { status: 401 }
      );
    }

    const { accountId } = params;
    return HttpResponse.json({
      ...MOCK_CUSTOMER_RISK_RESPONSE,
      account_id: (accountId as string) || MOCK_CUSTOMER_RISK_RESPONSE.account_id,
    });
  }),

  // 3. Value x Risk Prioritization: POST /api/v1/prioritization/quadrants
  http.post("*/api/v1/prioritization/quadrants", async ({ request }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication required: Bearer token is missing" },
        { status: 401 }
      );
    }

    return HttpResponse.json(MOCK_PRIORITIZATION_RESPONSE);
  }),

  // 4. Dataset Profiling: POST /api/v1/onboarding/profile
  http.post("*/api/v1/onboarding/profile", async ({ request }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication required: Bearer token is missing" },
        { status: 401 }
      );
    }

    return HttpResponse.json(MOCK_PROFILE_RESPONSE);
  }),

  // 5. Schema Mapping & Readiness: POST /api/v1/onboarding/map
  http.post("*/api/v1/onboarding/map", async ({ request }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication required: Bearer token is missing" },
        { status: 401 }
      );
    }

    return HttpResponse.json(MOCK_READINESS_RESPONSE);
  }),

  // 6. Processing Dry-Run Preview: POST /api/v1/onboarding/preview
  http.post("*/api/v1/onboarding/preview", async ({ request }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication required: Bearer token is missing" },
        { status: 401 }
      );
    }

    return HttpResponse.json(MOCK_PREVIEW_RESPONSE);
  }),

  // 7. Full End-to-End Processing: POST /api/v1/onboarding/process
  http.post("*/api/v1/onboarding/process", async ({ request }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { detail: "Authentication required: Bearer token is missing" },
        { status: 401 }
      );
    }

    return HttpResponse.json(MOCK_PROCESS_RESPONSE);
  }),
];
