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
  Mail,
  Clock,
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">
                {lastResult.participant.nama}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <IdCard className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-muted-foreground">NIM:</span>
              <span>{lastResult.participant.nim}</span>
            </div>

            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span>
                {lastResult.participant.prodi} -{" "}
                {lastResult.participant.fakultas}
              </span>
            </div>

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
                  Waktu Absensi:{" "}
                  {new Date(
                    lastResult.participant.checkedInAt,
                  ).toLocaleString("id-ID")}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
