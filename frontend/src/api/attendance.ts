import { attendanceApi } from "@/lib/api";

export type ParticipantCategory = "mahasiswa" | "umkm";
export type PresenceType = "online" | "offline";

export interface AttendanceParticipant {
  id: string | number;
  nama: string;
  email: string;
  qrCode: string;
  kategori?: ParticipantCategory;
  jenisKehadiran?: string;
  // Mahasiswa fields
  nim?: string | number;
  fakultas?: string;
  prodi?: string;
  universitas?: string;
  // UMKM fields
  bidang?: string;
  kota?: string;
  // Common attendance fields
  isEmailSent?: boolean;
  emailSentAt?: string | null;
  isCheckedIn?: boolean;
  checkedInAt?: string | null;
  attendance?: {
    status: string;
    checkedInAt: string | null;
  };
}

export interface AttendanceFilterParams {
  kategori?: string;
  jenis_kehadiran?: string;
  status?: string;
}

export interface AttendanceStats {
  totalPeserta: number;
  hadir: number;
  belumHadir: number;
  persentaseKehadiran: number;
  totalMahasiswa?: number;
  totalUmkm?: number;
  totalOnline?: number;
  totalOffline?: number;
}

export interface AttendanceApiResponse {
  success: boolean;
  kategori?: string;
  jenis_kehadiran?: string;
  total?: number;
  data?: AttendanceParticipant[];
  participants?: AttendanceParticipant[];
  mahasiswa?: AttendanceParticipant[];
  umkm?: AttendanceParticipant[];
  stats?: AttendanceStats;
}

export interface ScanResponse {
  success: boolean;
  message: string;
  data?: AttendanceParticipant;
  error?: string;
}

export function getAttendance(
  params?: AttendanceFilterParams,
): Promise<AttendanceApiResponse> {
  const query = new URLSearchParams();
  if (params?.kategori && params.kategori !== "semua" && params.kategori !== "all") {
    query.set("kategori", params.kategori);
  }
  if (params?.jenis_kehadiran && params.jenis_kehadiran !== "semua" && params.jenis_kehadiran !== "all") {
    query.set("jenis_kehadiran", params.jenis_kehadiran);
  }
  if (params?.status && params.status !== "semua" && params.status !== "all") {
    query.set("status", params.status);
  }

  const qs = query.toString();
  return attendanceApi(qs ? `/attendance?${qs}` : "/attendance");
}

export function scanAttendance(qrCode: string): Promise<ScanResponse> {
  return attendanceApi("/attendance/scan", {
    method: "POST",
    body: JSON.stringify({ qrCode }),
  });
}

export function sendEmailToParticipant(
  email: string,
  qrCode: string,
): Promise<any> {
  return attendanceApi("/emails/send", {
    method: "POST",
    body: JSON.stringify({ email, qrCode }),
  });
}

export function sendEmailToAll(): Promise<any> {
  return attendanceApi("/emails/send-all", {
    method: "POST",
  });
}
