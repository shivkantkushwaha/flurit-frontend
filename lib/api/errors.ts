import { ApiErrorPayload } from "@/lib/types/api";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "PAYLOAD_TOO_LARGE"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "TIMEOUT_ERROR"
  | "UNKNOWN_ERROR";

export class FluritApiError extends Error {
  public readonly status: number;
  public readonly code: ApiErrorCode;
  public readonly detail: string;
  public readonly validationErrors?: Array<{ loc: (string | number)[]; msg: string; type: string }>;

  constructor(
    message: string,
    options: {
      status: number;
      code?: ApiErrorCode;
      detail?: string;
      validationErrors?: Array<{ loc: (string | number)[]; msg: string; type: string }>;
    }
  ) {
    super(message);
    this.name = "FluritApiError";
    this.status = options.status;
    this.code = options.code || FluritApiError.resolveCodeFromStatus(options.status);
    this.detail = options.detail || message;
    this.validationErrors = options.validationErrors;

    Object.setPrototypeOf(this, FluritApiError.prototype);
  }

  public static resolveCodeFromStatus(status: number): ApiErrorCode {
    switch (status) {
      case 401:
        return "UNAUTHORIZED";
      case 403:
        return "FORBIDDEN";
      case 404:
        return "NOT_FOUND";
      case 413:
        return "PAYLOAD_TOO_LARGE";
      case 422:
        return "VALIDATION_ERROR";
      case 500:
      case 502:
      case 503:
        return "SERVER_ERROR";
      default:
        return status >= 400 && status < 500 ? "VALIDATION_ERROR" : "UNKNOWN_ERROR";
    }
  }

  public static fromResponse(status: number, statusText: string, payload?: ApiErrorPayload | string | null): FluritApiError {
    let detail = statusText;
    let validationErrors: Array<{ loc: (string | number)[]; msg: string; type: string }> | undefined;

    if (payload) {
      if (typeof payload === "string") {
        detail = payload;
      } else if (typeof payload === "object") {
        if (typeof payload.detail === "string") {
          detail = payload.detail;
        } else if (Array.isArray(payload.detail)) {
          validationErrors = payload.detail;
          detail = payload.detail.map((d) => `${d.loc.join(".")}: ${d.msg}`).join("; ");
        } else if (payload.message) {
          detail = payload.message;
        }
      }
    }

    const message = `API request failed with status ${status}: ${detail}`;
    return new FluritApiError(message, {
      status,
      code: FluritApiError.resolveCodeFromStatus(status),
      detail,
      validationErrors,
    });
  }

  public static networkError(err: unknown): FluritApiError {
    const rawMessage = err instanceof Error ? err.message : String(err);
    return new FluritApiError(`Network failure communicating with Flurit API: ${rawMessage}`, {
      status: 0,
      code: "NETWORK_ERROR",
      detail: rawMessage,
    });
  }
}
