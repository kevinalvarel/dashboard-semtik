import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/drizzle";
import * as schema from "./db/auth-schema";

export const auth = betterAuth({
  trustedOrigins: [process.env.FRONTEND_URL!],

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
