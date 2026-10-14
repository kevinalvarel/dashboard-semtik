import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "./auth-schema";
import * as attendanceSchema from "./attendance-schema";

// In Cloudflare Workers, env vars come from the Worker env, not process.env.
// DATABASE_URL is injected at request time — use createDb(env) pattern.
export function createDb(databaseUrl: string) {
  return drizzle(databaseUrl, {
    schema: { ...authSchema, ...attendanceSchema },
  });
}
