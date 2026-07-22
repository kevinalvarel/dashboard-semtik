// services/peserta.service.ts

import { db } from "../db/drizzle";
import { peserta } from "../db/attendance-schema";

export async function getAllAttendance() {
  return await db.select().from(peserta);
}
