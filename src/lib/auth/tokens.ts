/**
 * Token storage. The backend returns access/refresh tokens in the auth response
 * body (it does not set httpOnly cookies), so the client persists them and
 * attaches the access token as a Bearer header on every request.
 *
 * NOTE: localStorage is XSS-readable. This is acceptable for the current MVP;
 * if/when the backend issues httpOnly refresh cookies, drop refresh-token
 * persistence here and rely on the cookie instead.
 */
const ACCESS_KEY = "nitrogan.accessToken";
const REFRESH_KEY = "nitrogan.refreshToken";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const isBrowser = typeof window !== "undefined";

export function getAccessToken(): string | null {
  if (!isBrowser) return null;
  return window.localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser) return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function setTokens(tokens: AuthTokens): void {
  if (!isBrowser) return;
  window.localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
}

export function clearTokens(): void {
  if (!isBrowser) return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}

export function hasSession(): boolean {
  return Boolean(getAccessToken());
}
