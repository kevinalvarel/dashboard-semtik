const TOKEN_KEY = "semtik.auth.token";

export function getAuthToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem(TOKEN_KEY) ?? undefined;
}

export function setAuthToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}
