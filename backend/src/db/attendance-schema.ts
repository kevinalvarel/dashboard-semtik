import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const peserta = pgTable("peserta_semtik", {
  id: serial("id").primaryKey(),
  nim: integer("nim").notNull().unique(),
  nama: text("nama").notNull(),
  email: text("email").notNull().unique(),
  fakultas: text("fakultas").notNull(),
  prodi: text("prodi").notNull(),
  qrCode: text("qr_code").notNull().unique(),
  isCheckedIn: boolean("is_checked_in").default(false).notNull(),
  checkedInAt: timestamp("checked_in_at", {
    withTimezone: true,
  }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
});

export type Peserta = typeof peserta.$inferSelect;
export type NewPeserta = typeof peserta.$inferInsert;

