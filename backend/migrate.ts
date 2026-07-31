import "dotenv/config";
import { db } from "./src/db/drizzle";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Migrating database...");
  try {
    await db.execute(sql`ALTER TABLE "peserta_semtik" ADD COLUMN IF NOT EXISTS "is_email_sent" boolean DEFAULT false NOT NULL`);
    await db.execute(sql`ALTER TABLE "peserta_semtik" ADD COLUMN IF NOT EXISTS "email_sent_at" timestamp with time zone`);
    console.log("Migration completed.");
  } catch (error) {
    console.error("Migration failed", error);
  }
}

main();
