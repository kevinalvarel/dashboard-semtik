import { Request, Response } from "express";
import * as checkinService from "../services/checkin.service";

/**
 * Controller to handle QR Code scanning and check-in request from frontend
 * POST /api/attendance/scan or POST /api/attendance/check-in
 * Request body: { "qrCode": "..." } or { "token": "..." }
 */
export async function scanQRCode(req: Request, res: Response) {
  try {
    const { qrCode, token, qr_code, code } = req.body || {};
    const qrValue = qrCode || token || qr_code || code;

    if (!qrValue || typeof qrValue !== "string" || qrValue.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "QR Code / Token tidak valid atau tidak boleh kosong",
      });
    }

    const result = await checkinService.checkIn(qrValue);

    return res.status(result.status).json({
      success: result.success,
      message: result.message,
      ...(result.data ? { data: result.data } : {}),
    });
  } catch (error: any) {
    console.error("Error during check-in processing:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan internal server saat memproses check-in",
      error: error?.message || "Internal Server Error",
    });
  }
}

// Export checkIn alias for backward compatibility / flexibility
export const checkIn = scanQRCode;
