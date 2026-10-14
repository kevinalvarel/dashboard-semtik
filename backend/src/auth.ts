import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDb } from "./db/drizzle";
import * as schema from "./db/auth-schema";

const defaultOrigins = [
  "https://admin-semtik26.netlify.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

export function getAllowedOrigins(frontendUrl?: string): string[] {
  const envOrigins = frontendUrl
    ? frontendUrl.split(",").map((url) => url.trim().replace(/\/$/, ""))
    : [];

  return Array.from(new Set([...defaultOrigins, ...envOrigins]));
}

export interface Env {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  FRONTEND_URL?: string;
  RESEND_API_KEY: string;
}

export function createAuth(env: Env, requestUrl?: string) {
  const db = createDb(env.DATABASE_URL);
  const allowedOrigins = getAllowedOrigins(env.FRONTEND_URL);

  // Validate or fallback baseURL dynamically so invalid secrets don't crash the server
  let baseURL = env.BETTER_AUTH_URL?.trim();
  if (!baseURL || baseURL === "-" || !baseURL.startsWith("http")) {
    if (requestUrl) {
      try {
        baseURL = new URL(requestUrl).origin;
      } catch {
        baseURL = "https://backend-semtik.alvarelkevin12.workers.dev";
      }
    } else {
      baseURL = "https://backend-semtik.alvarelkevin12.workers.dev";
    }
  }

  return {
    auth: betterAuth({
      secret: env.BETTER_AUTH_SECRET,
      baseURL,
      trustedOrigins: allowedOrigins,
      advanced: {
        defaultCookieAttributes: {
          sameSite: "none",
          secure: true,
        },
      },
      database: drizzleAdapter(db, {
        provider: "pg",
        schema,
      }),
      emailAndPassword: {
        enabled: true,
      },
      session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
      },
      rateLimit: {
        window: 10,
        max: 20,
      },
    }),
    db,
    allowedOrigins,
  };
}
