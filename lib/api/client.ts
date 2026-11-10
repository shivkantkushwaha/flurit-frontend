import { buildApiUrl, API_CONFIG } from "./config";
import { FluritApiError } from "./errors";
import { ApiErrorPayload } from "@/lib/types/api";

export type TokenProvider = () => Promise<string | null> | string | null;

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
  skipAuth?: boolean;
}

export class ApiClient {
  private tokenProvider: TokenProvider | null = null;

  /**
   * Registers a callback that retrieves the current user's Supabase JWT access token.
   */
  public setTokenProvider(provider: TokenProvider | null): void {
    this.tokenProvider = provider;
  }

  /**
   * Internal request executor.
   */
  public async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const {
      params,
      timeoutMs = API_CONFIG.timeoutMs,
      skipAuth = false,
      headers: customHeaders,
      signal: userSignal,
      ...fetchOptions
    } = options;

    let url = buildApiUrl(path);

    // Append query parameters if provided
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      }
      const queryString = searchParams.toString();
      if (queryString) {
        url += `${url.includes("?") ? "&" : "?"}${queryString}`;
      }
    }

    const headers = new Headers(customHeaders);

    // Attach JWT Bearer token if not explicitly skipped
    if (!skipAuth && this.tokenProvider) {
      try {
        const token = await this.tokenProvider();
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (err) {
        console.warn("Failed to retrieve auth token for request", err);
      }
    }

    // Set default Accept header
    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    // Configure timeout via Promise.race to guarantee cross-environment compatibility
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      if (timeoutMs && timeoutMs > 0) {
        timeoutId = setTimeout(() => {
          reject(
            new FluritApiError(`Request to ${path} timed out after ${timeoutMs}ms`, {
              status: 408,
              code: "TIMEOUT_ERROR",
              detail: `Timeout exceeded: ${timeoutMs}ms`,
            })
          );
        }, timeoutMs);
      }
    });

    try {
      const fetchPromise = fetch(url, {
        ...fetchOptions,
        headers,
        signal: userSignal,
      });

      const response = timeoutMs ? await Promise.race([fetchPromise, timeoutPromise]) : await fetchPromise;
      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        let errorPayload: ApiErrorPayload | string | null = null;
        const contentType = response.headers.get("content-type");

        try {
          if (contentType && contentType.includes("application/json")) {
            errorPayload = (await response.json()) as ApiErrorPayload;
          } else {
            errorPayload = await response.text();
          }
        } catch {
          // Fallback to response.statusText if body parsing fails
          errorPayload = null;
        }

        throw FluritApiError.fromResponse(response.status, response.statusText, errorPayload);
      }

      // If response is 204 No Content, return null
      if (response.status === 204) {
        return null as unknown as T;
      }

      const data = (await response.json()) as T;
      return data;
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);

      if (err instanceof FluritApiError) {
        throw err;
      }

      throw FluritApiError.networkError(err);
    }
  }

  public async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  public async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const headers = new Headers(options?.headers);
    if (!headers.has("Content-Type") && body !== undefined && !(body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    return this.request<T>(path, {
      ...options,
      method: "POST",
      headers,
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public async postFormData<T>(path: string, formData: FormData, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: formData,
    });
  }
}

// Export singleton instance as default API transport
export const apiClient = new ApiClient();
