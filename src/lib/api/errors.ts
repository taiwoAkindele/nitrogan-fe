import { AxiosError } from "axios";

/**
 * The error envelope returned by the Nitrogan API
 * (see backend `AllExceptionsFilter`).
 */
export interface ApiErrorEnvelope {
  statusCode: number;
  message: string;
  errors?: unknown;
  path?: string;
  timestamp?: string;
}

/**
 * Normalized error thrown by the API layer. Carries the HTTP `status` so the
 * React Query retry logic (`src/lib/query/client.tsx`) can short-circuit on 4xx.
 */
export class ApiError extends Error {
  readonly status: number;
  /** Field-level validation issues, when the backend provides them. */
  readonly errors?: unknown;

  constructor(message: string, status: number, errors?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

/** Convert any thrown value (usually an AxiosError) into an `ApiError`. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof AxiosError) {
    const envelope = error.response?.data as ApiErrorEnvelope | undefined;
    const status = envelope?.statusCode ?? error.response?.status ?? 0;
    const message =
      envelope?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    return new ApiError(message, status, envelope?.errors);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0);
  }

  return new ApiError("Unexpected error", 0);
}
