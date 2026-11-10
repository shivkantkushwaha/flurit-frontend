/**
 * Centralized API configuration for Flurit FastAPI backend.
 */

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://flurit-backend.onrender.com/api/v1";

export const API_CONFIG = {
  baseUrl: RAW_API_URL,
  apiPrefix: "/api/v1",
  timeoutMs: 90000,
} as const;

/**
 * Builds a normalized, fully qualified URL for the /api/v1 namespace.
 */
export function buildApiUrl(path: string): string {
  const normalizedBase = API_CONFIG.baseUrl.replace(/\/+$/, "");
  const normalizedPrefix = API_CONFIG.apiPrefix.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // If baseUrl already ends with /api/v1
  if (normalizedBase.endsWith(normalizedPrefix)) {
    // If path starts with /api/v1, strip prefix from path to avoid duplication
    if (normalizedPath.startsWith(normalizedPrefix)) {
      const stripped = normalizedPath.slice(normalizedPrefix.length);
      return `${normalizedBase}${stripped.startsWith("/") ? stripped : `/${stripped}`}`;
    }
    return `${normalizedBase}${normalizedPath}`;
  }

  // If path already starts with /api/v1, don't duplicate
  if (normalizedPath.startsWith(normalizedPrefix)) {
    return `${normalizedBase}${normalizedPath}`;
  }

  return `${normalizedBase}${normalizedPrefix}${normalizedPath}`;
}
