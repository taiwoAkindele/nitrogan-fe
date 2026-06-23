import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { toApiError } from "./errors";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
  type AuthTokens,
} from "@/lib/auth/tokens";

declare module "axios" {
  // Per-request opt-out for the central action toast.
  export interface AxiosRequestConfig {
    skipToast?: boolean;
  }
}

/** Actions (mutations) are non-GET requests — only these get toasted. */
function isAction(config?: { method?: string }): boolean {
  const method = config?.method?.toLowerCase();
  return !!method && method !== "get";
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

/** Backend uses URI versioning — every route is mounted under `/v<n>`. */
export const API_VERSION = "v1";

/** The success envelope every 2xx backend response is wrapped in. */
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

/** True when a response body is the standard `{ success, data }` envelope. */
function isEnvelope(body: unknown): body is ApiSuccess<unknown> {
  return (
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    "data" in body
  );
}

/**
 * Endpoints that must never trigger the refresh-and-retry flow: a 401 from any
 * of them is a genuine credential failure, not an expired access token.
 */
const AUTH_FREE_PATHS = [
  `/${API_VERSION}/auth/login`,
  `/${API_VERSION}/auth/register`,
  `/${API_VERSION}/auth/refresh`,
  `/${API_VERSION}/auth/invite/accept`,
  `/${API_VERSION}/auth/password/forgot`,
  `/${API_VERSION}/auth/password/reset`,
];

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // allow the refresh cookie path if the backend adopts it
  headers: { "Content-Type": "application/json" },
});

// ── Request: attach the access token ────────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// ── Response: refresh on 401, then normalize every error to ApiError ────────

// Single-flight: concurrent 401s share one refresh round-trip.
let refreshPromise: Promise<AuthTokens> | null = null;

async function refreshTokens(): Promise<AuthTokens> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  // Bare axios call (no interceptors) so we don't attach the stale access token
  // or recurse into this handler. The backend reads the refresh token from the
  // Authorization header (or a cookie). Because this bypasses the instance
  // interceptor, we unwrap the success envelope here ourselves.
  const { data } = await axios.post<ApiSuccess<AuthTokens> | AuthTokens>(
    `${API_URL}/${API_VERSION}/auth/refresh`,
    {},
    {
      headers: { Authorization: `Bearer ${refreshToken}` },
      withCredentials: true,
    },
  );
  return isEnvelope(data) ? (data.data as AuthTokens) : data;
}

function onSessionExpired() {
  clearTokens();
  if (typeof window !== "undefined") {
    const { pathname, search } = window.location;
    // Avoid bouncing the public auth pages.
    if (!pathname.startsWith("/sign-in")) {
      const next = encodeURIComponent(pathname + search);
      window.location.assign(`/sign-in?next=${next}`);
    }
  }
}

interface RetriableConfig extends AxiosRequestConfig {
  _retried?: boolean;
}

api.interceptors.response.use(
  (response) => {
    // Toast the action message on mutations only (never reads), then unwrap the
    // envelope so every caller gets the raw payload and stays envelope-agnostic.
    // This is the single client-side choke point for both behaviors.
    if (isEnvelope(response.data)) {
      const { message } = response.data;
      response.data = response.data.data;
      if (message && isAction(response.config) && !response.config.skipToast) {
        toast.success(message);
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    const original = error.config as
      | (RetriableConfig & InternalAxiosRequestConfig)
      | undefined;

    const status = error.response?.status;
    const url = original?.url ?? "";
    const isAuthFree = AUTH_FREE_PATHS.some((p) => url.includes(p));

    if (status === 401 && original && !original._retried && !isAuthFree) {
      original._retried = true;
      try {
        refreshPromise = refreshPromise ?? refreshTokens();
        const tokens = await refreshPromise;
        refreshPromise = null;
        setTokens(tokens);
        original.headers.set("Authorization", `Bearer ${tokens.accessToken}`);
        return api(original);
      } catch (refreshError) {
        refreshPromise = null;
        onSessionExpired();
        return Promise.reject(toApiError(refreshError));
      }
    }

    // Final rejection: toast failures of actions (mutations) only. Read failures
    // surface as inline error states, and the refresh-expiry path above already
    // redirects, so neither toasts here.
    const apiError = toApiError(error);
    if (isAction(original) && !original?.skipToast) {
      toast.error(apiError.message);
    }
    return Promise.reject(apiError);
  },
);
