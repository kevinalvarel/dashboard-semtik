import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  User,
  IdCard,
  GraduationCap,
  School,
  Mail,
  Clock,
  Store,
  Globe,
  MapPin,
  Briefcase,
} from "lucide-react";
import type { ScanResultState } from "../types";

interface ScanResultCardProps {
  lastResult: ScanResultState;
}

export function ScanResultCard({ lastResult }: ScanResultCardProps) {
  if (lastResult.status === "idle") return null;

  return (
    <Card
      className={`border-2 transition-all duration-300 ${
        lastResult.status === "success"
          ? "border-emerald-500/50 bg-emerald-500/5"
          : lastResult.status === "warning"
            ? "border-amber-500/50 bg-amber-500/5"
            : "border-destructive/50 bg-destructive/5"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {lastResult.status === "success" && (
              <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            )}
            {lastResult.status === "warning" && (
              <div className="p-2 rounded-full bg-amber-500/10 text-amber-500">
                <AlertTriangle className="h-6 w-6" />
              </div>
            )}
            {lastResult.status === "error" && (
              <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                <XCircle className="h-6 w-6" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">
                {lastResult.status === "success" && "Check-in Berhasil!"}
                {lastResult.status === "warning" && "Peserta Sudah Check-in!"}
                {lastResult.status === "error" && "Gagal Memproses QR Code"}
              </CardTitle>
              <CardDescription className="text-foreground/80 mt-0.5">
                {lastResult.message}
              </CardDescription>
            </div>
          </div>

          <Badge
            variant={
              lastResult.status === "success"
                ? "default"
                : lastResult.status === "warning"
                  ? "secondary"
                  : "destructive"
            }
          >
            {lastResult.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      {/* Participant Details if available */}
      {lastResult.participant && (
        <CardContent className="pt-2 border-t">
          {/* Category & Presence badges */}
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant="outline"
              className={`text-[10px] px-2 py-0.5 font-medium inline-flex items-center gap-1 ${
                lastResult.participant.kategori === "umkm"
                  ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20"
                  : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20"
              }`}
            >
              {lastResult.participant.kategori === "umkm" ? (
                <Store className="h-3 w-3" />
              ) : (
                <GraduationCap className="h-3 w-3" />
              )}
              {lastResult.participant.kategori === "umkm"
                ? "UMKM"
                : "Mahasiswa"}
            </Badge>

            <Badge
              variant="outline"
              className={`text-[10px] px-2 py-0.5 font-medium inline-flex items-center gap-1 ${
                lastResult.participant.jenisKehadiran?.toLowerCase() ===
                "online"
                  ? "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20"
                  : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
              }`}
            >
              {lastResult.participant.jenisKehadiran?.toLowerCase() ===
              "online" ? (
                <Globe className="h-3 w-3" />
              ) : (
                <MapPin className="h-3 w-3" />
              )}
              {lastResult.participant.jenisKehadiran?.toLowerCase() === "online"
                ? "Online"
                : "Offline"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">
                {lastResult.participant.nama}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {lastResult.participant.kategori === "umkm" ? (
                <>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">
                    Domisili:
                  </span>
                  <span>{lastResult.participant.kota || "-"}</span>
                </>
              ) : (
                <>
                  <IdCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-muted-foreground">NIM:</span>
                  <span>{lastResult.participant.nim || "-"}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {lastResult.participant.kategori === "umkm" ? (
                <>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{lastResult.participant.bidang || "UMKM Mitra"}</span>
                </>
              ) : (
                <>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">
                    {lastResult.participant.prodi || "-"} -{" "}
                    {lastResult.participant.fakultas || "-"}
                  </span>
                </>
              )}
            </div>

            {lastResult.participant.universitas && (
              <div className="flex items-center gap-2">
                <School className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{lastResult.participant.universitas}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground text-xs" />
              <span className="truncate text-muted-foreground">
                {lastResult.participant.email}
              </span>
            </div>

            {lastResult.participant.checkedInAt && (
              <div className="flex items-center gap-2 sm:col-span-2 text-xs text-muted-foreground pt-1 border-t">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Waktu Presensi:{" "}
                  {new Date(lastResult.participant.checkedInAt).toLocaleString(
                    "id-ID",
                  )}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
