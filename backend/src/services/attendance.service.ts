import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { peserta } from "../db/attendance-schema";
import * as schema from "../db/auth-schema";
import * as attendanceSchema from "../db/attendance-schema";

type DB = NeonHttpDatabase<typeof schema & typeof attendanceSchema>;

export async function getAllAttendance(db: DB) {
  return await db.select().from(peserta);
}
