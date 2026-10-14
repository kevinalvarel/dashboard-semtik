import { Context } from "hono";
import { Env } from "../auth";
import * as checkinService from "../services/checkin.service";

/**
 * Controller to handle QR Code scanning and check-in request from frontend
 * POST /api/attendance/scan or POST /api/attendance/check-in
 * Request body: { "qrCode": "..." } or { "token": "..." }
 */
export async function scanQRCode(c: Context<{ Bindings: Env }>) {
  try {
    const { db } = c.get("services");
    const body = await c.req.json<{
      qrCode?: string;
      token?: string;
      qr_code?: string;
      code?: string;
    }>();

    const { qrCode, token, qr_code, code } = body || {};
    const qrValue = qrCode || token || qr_code || code;

    if (!qrValue || typeof qrValue !== "string" || qrValue.trim() === "") {
      return c.json(
        {
          success: false,
          message: "QR Code / Token tidak valid atau tidak boleh kosong",
        },
        400
      );
    }

    const result = await checkinService.checkIn(db, qrValue);

    return c.json(
      {
        success: result.success,
        message: result.message,
        ...(result.data ? { data: result.data } : {}),
      },
      result.status as 200 | 400 | 404 | 409 | 500
    );
  } catch (error: any) {
    console.error("Error during check-in processing:", error);

    return c.json(
      {
        success: false,
        message: "Terjadi kesalahan internal server saat memproses check-in",
        error: error?.message || "Internal Server Error",
      },
      500
    );
  }
}

// Export checkIn alias for backward compatibility / flexibility
export const checkIn = scanQRCode;
