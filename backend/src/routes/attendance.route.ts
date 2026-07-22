import { Router } from "express";
import * as attendanceController from "../controller/attendance.controller";

const router = Router();

router.get("/", attendanceController.getAttendance);

export default router;
