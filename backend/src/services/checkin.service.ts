import { eq } from "drizzle-orm";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { peserta, Peserta } from "../db/attendance-schema";
import * as schema from "../db/auth-schema";
import * as attendanceSchema from "../db/attendance-schema";

type DB = NeonHttpDatabase<typeof schema & typeof attendanceSchema>;

export interface CheckInResult {
  success: boolean;
  status: number;
  message: string;
  data?: Peserta;
}

/**
 * Process participant check-in using QR Code token
 * @param db Drizzle DB instance
 * @param token QR code string attached to participant
 */
export async function checkIn(db: DB, token: string): Promise<CheckInResult> {
  const cleanToken = token ? token.trim() : "";

  if (!cleanToken) {
    return {
      success: false,
      status: 400,
      message: "QR Code / Token tidak boleh kosong",
    };
  }

  // Find participant by qrCode
  const existingPeserta = await db.query.peserta.findFirst({
    where: eq(peserta.qrCode, cleanToken),
  });

  if (!existingPeserta) {
    return {
      success: false,
      status: 404,
      message: "Peserta tidak ditemukan atau QR Code tidak terdaftar",
    };
  }

  // Check if participant is already checked in
  if (existingPeserta.isCheckedIn) {
    const timeFormatted = existingPeserta.checkedInAt
      ? new Date(existingPeserta.checkedInAt).toLocaleString("id-ID")
      : "-";

    return {
      success: false,
      status: 409, // Conflict
      message: `Peserta ${existingPeserta.nama} (NIM: ${existingPeserta.nim}) sudah check-in pada ${timeFormatted}`,
      data: existingPeserta,
    };
  }

  // Perform atomic update
  const now = new Date();
  const updatedRecords = await db
    .update(peserta)
    .set({
      isCheckedIn: true,
      checkedInAt: now,
      updatedAt: now,
    })
    .where(eq(peserta.id, existingPeserta.id))
    .returning();

  const updatedPeserta = updatedRecords[0] || {
    ...existingPeserta,
    isCheckedIn: true,
    checkedInAt: now,
    updatedAt: now,
  };

  return {
    success: true,
    status: 200,
    message: `Check-in berhasil untuk ${updatedPeserta.nama} (NIM: ${updatedPeserta.nim})`,
    data: updatedPeserta,
  };
}

export const processCheckIn = checkIn;
