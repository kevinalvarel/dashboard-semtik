import { Context } from "hono";
import { Env } from "../auth";
import * as attendanceService from "../services/attendance.service";

export async function getAttendance(c: Context<{ Bindings: Env }>) {
  const { db } = c.get("services");
  const data = await attendanceService.getAllAttendance(db);

  return c.json({
    success: true,
    data,
  });
}
