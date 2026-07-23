import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/drizzle";
import * as schema from "./db/auth-schema";

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://admin-semtik26.netlify.app",
];

const envOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim().replace(/\/$/, ""))
  : [];

export const allowedOrigins = Array.from(
  new Set([...defaultOrigins, ...envOrigins])
);

export const auth = betterAuth({
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
});

