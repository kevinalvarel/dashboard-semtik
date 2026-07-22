import { Request, Response } from "express";
import * as attendanceService from "../services/attendance.service";

export async function getAttendance(req: Request, res: Response) {
  const data = await attendanceService.getAllAttendance();

  res.json({
    success: true,
    data,
  });
}
