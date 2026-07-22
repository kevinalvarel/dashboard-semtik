import { Router } from "express";
import * as attendanceController from "../controller/attendance.controller";
import * as checkinController from "../controller/checkin.controller";

const router = Router();

// GET /api/attendance - Get all attendance/participants list
router.get("/", attendanceController.getAttendance);

// POST /api/attendance/scan - Scan QR Code and process check-in
router.post("/scan", checkinController.scanQRCode);

// POST /api/attendance/check-in - Alias endpoint for check-in
router.post("/check-in", checkinController.scanQRCode);

export default router;
