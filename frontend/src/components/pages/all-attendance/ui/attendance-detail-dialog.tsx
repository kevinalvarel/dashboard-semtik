import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AttendanceParticipant } from "@/api/attendance";
import { Users, Building2, GraduationCap, Calendar } from "lucide-react";

interface AttendanceDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  participant: AttendanceParticipant | null;
}

export function AttendanceDetailDialog({
  isOpen,
  onOpenChange,
  participant,
}: AttendanceDetailDialogProps) {
  if (!participant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-popover text-foreground">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Profil Presensi Peserta
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Informasi detail biodata dan status presensi peserta event SEMTIK.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Header profile info */}
          <div className="flex items-center gap-3.5 pb-3 border-b border-border">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-base border border-primary/20">
              {participant.nama.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <h4 className="font-bold text-base text-foreground">
                {participant.nama}
              </h4>
              <p className="text-xs text-muted-foreground">
                {participant.email}
              </p>
            </div>
          </div>

          {/* Grid details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50">
              <span className="text-muted-foreground block text-[11px] mb-0.5">
                NIM / ID
              </span>
              <span className="font-mono font-semibold text-foreground">
                {participant.nim}
              </span>
            </div>

            <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50">
              <span className="text-muted-foreground block text-[11px] mb-0.5">
                Status Presensi
              </span>
              <Badge
                variant={
                  participant.attendance?.status === "hadir"
                    ? "default"
                    : "outline"
                }
                className={
                  participant.attendance?.status === "hadir"
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-0"
                }
              >
                {(participant.attendance?.status || "belum hadir").toUpperCase()}
              </Badge>
            </div>

            <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50">
              <span className="text-muted-foreground block text-[11px] mb-0.5 flex items-center gap-1">
                <Building2 className="h-3 w-3 text-muted-foreground" />
                Fakultas
              </span>
              <span className="font-medium text-foreground">
                {participant.fakultas}
              </span>
            </div>

            <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50">
              <span className="text-muted-foreground block text-[11px] mb-0.5 flex items-center gap-1">
                <GraduationCap className="h-3 w-3 text-muted-foreground" />
                Program Studi
              </span>
              <span className="font-medium text-foreground">
                {participant.prodi}
              </span>
            </div>
          </div>

          {/* Timestamp Card */}
          <div className="rounded-xl p-3.5 bg-muted/40 border border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Waktu Masuk Check-in:</span>
            </div>
            <span className="font-mono text-xs font-semibold text-foreground">
              {participant.attendance?.checkedInAt
                ? new Date(participant.attendance.checkedInAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                  })
                : "- Belum Check-in -"}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs h-9 cursor-pointer"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
