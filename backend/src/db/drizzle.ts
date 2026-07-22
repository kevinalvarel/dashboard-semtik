import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "./auth-schema";
import * as attendanceSchema from "./attendance-schema";

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...authSchema, ...attendanceSchema },
});
