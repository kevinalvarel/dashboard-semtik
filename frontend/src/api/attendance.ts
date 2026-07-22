import { attendanceApi } from "@/lib/api";

export interface AttendanceParticipant {
  id: string | number;
  nim: string | number;
  nama: string;
  email: string;
  fakultas: string;
  prodi: string;
  isCheckedIn?: boolean;
  checkedInAt?: string | null;
  attendance?: {
    status: string;
    checkedInAt: string | null;
  };
}

export interface AttendanceStats {
  totalPeserta: number;
  hadir: number;
  belumHadir: number;
  persentaseKehadiran: number;
}

export interface AttendanceApiResponse {
  success: boolean;
  data?: AttendanceParticipant[];
  participants?: AttendanceParticipant[];
  stats?: AttendanceStats;
}
export interface ScanResponse {
  success: boolean;
  message: string;
  data?: AttendanceParticipant;
  error?: string;
}

export function getAttendance(): Promise<AttendanceApiResponse> {
  return attendanceApi("/attendance");
}

export function scanAttendance(qrCode: string): Promise<ScanResponse> {
  return attendanceApi("/attendance/scan", {
    method: "POST",
    body: JSON.stringify({ qrCode }),
  });
}
