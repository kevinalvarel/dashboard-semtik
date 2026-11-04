import { createAuthClient } from "better-auth/react";
import { clearAuthToken, getAuthToken, setAuthToken } from "./auth-token";

const baseURL = (
  import.meta.env.VITE_API_URL ||
  "https://dashboard-semtik-production.up.railway.app"
).replace(/\/$/, "");

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
    auth: {
      type: "Bearer",
      token: () => getAuthToken(),
    },
    onSuccess: (context) => {
      const data = context.data as { token?: unknown } | null;
      if (typeof data?.token === "string") {
        setAuthToken(data.token);
      }
      if (String(context.request.url).includes("/sign-out")) {
        clearAuthToken();
      }
    },
    onError: (context) => {
      if (context.response.status === 401) {
        clearAuthToken();
      }
    },
  },
});
