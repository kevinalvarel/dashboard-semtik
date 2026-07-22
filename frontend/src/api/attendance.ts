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

export function getAttendance(): Promise<AttendanceApiResponse> {
  return attendanceApi("/attendance");
}

