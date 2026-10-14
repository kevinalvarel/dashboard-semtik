import { Hono } from "hono";
import { Env } from "../auth";
import * as attendanceController from "../controller/attendance.controller";
import * as checkinController from "../controller/checkin.controller";

const router = new Hono<{ Bindings: Env }>();

// GET /api/attendance - Get all attendance/participants list
router.get("/", attendanceController.getAttendance);

// POST /api/attendance/scan - Scan QR Code and process check-in
router.get("/scan", (c) =>
  c.json({
    success: true,
    message: "Attendance Scan API is active. Send a POST request with { qrCode }.",
  })
);
router.post("/scan", checkinController.scanQRCode);

// POST /api/attendance/check-in - Alias endpoint for check-in
router.get("/check-in", (c) =>
  c.json({
    success: true,
    message: "Attendance Check-In API is active. Send a POST request with { qrCode }.",
  })
);
router.post("/check-in", checkinController.scanQRCode);

export default router;
