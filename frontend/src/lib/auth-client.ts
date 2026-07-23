import { createAuthClient } from "better-auth/react";

const baseURL = (
  import.meta.env.VITE_API_URL || "https://dashboard-semtik-production.up.railway.app"
).replace(/\/$/, "");

export const authClient = createAuthClient({
  baseURL,
});

