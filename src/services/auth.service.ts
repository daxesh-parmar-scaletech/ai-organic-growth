/**
 * Token/session storage helpers, mirroring the shape of the `mmscan` frontend's
 * `Auth.service.ts` (checkLogin/getAccessToken/setAuthData/getAuthData/removeAuthData).
 * There's no real OAuth token yet — sign-in is mocked — so this stores a plain
 * session record rather than an encrypted JWT; swap in real tokens here once
 * the backend issues them, without touching call sites.
 */

const AUTH_STORAGE_KEY = "organiq.auth";

export interface AuthData {
  accessToken: string;
  user: {
    name: string;
    email: string;
  };
}

export function checkLogin(): boolean {
  return sessionStorage.getItem(AUTH_STORAGE_KEY) !== null;
}

export function getAccessToken(): string | null {
  const data = getAuthData();
  return data ? data.accessToken : null;
}

export function setAuthData(data: AuthData): void {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

export function getAuthData(): AuthData | null {
  const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthData;
  } catch {
    return null;
  }
}

export function removeAuthData(): void {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}
