import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, QrCode, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { RecentScan } from "../types";

interface ScanHistoryCardProps {
  recentScans: RecentScan[];
}

export function ScanHistoryCard({ recentScans }: ScanHistoryCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4 text-primary" /> Riwayat Scan Sesi Ini
          </CardTitle>
          <Badge variant="outline">{recentScans.length} item</Badge>
        </div>
        <CardDescription>
          Daftar absensi yang telah di-scan selama sesi browser ini.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {recentScans.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
            <QrCode className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm">Belum ada aktivitas scan pada sesi ini.</p>
          </div>
        ) : (
          <div className="divide-y max-h-[480px] overflow-y-auto">
            {recentScans.map((scan) => (
              <div
                key={scan.id}
                className="p-3 hover:bg-muted/40 transition-colors flex items-center justify-between text-sm gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {scan.status === "success" && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  )}
                  {scan.status === "warning" && (
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                  )}
                  {scan.status === "error" && (
                    <XCircle className="h-4 w-4 text-destructive shrink-0" />
                  )}

                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {scan.participant?.nama || scan.qrCode}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {scan.participant
                        ? `NIM: ${scan.participant.nim} • ${scan.participant.prodi}`
                        : scan.message}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-muted-foreground block font-mono">
                    {scan.scannedAt.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                  <Badge
                    variant={
                      scan.status === "success"
                        ? "default"
                        : scan.status === "warning"
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-[10px] px-1.5 py-0 mt-0.5"
                  >
                    {scan.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
