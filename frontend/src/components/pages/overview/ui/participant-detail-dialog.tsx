import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Participant } from "../types";

interface ParticipantDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  participant: Participant | null;
}

export function ParticipantDetailDialog({
  isOpen,
  onOpenChange,
  participant,
}: ParticipantDetailDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {participant && (
        <DialogContent className="sm:max-w-md border-border bg-popover text-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              Detail Profil Peserta
            </DialogTitle>
            <DialogDescription>
              Informasi detail biodata dan status absensi peserta.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-3">
            {/* Header profile info */}
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                {participant.nama.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold text-base">{participant.nama}</h4>
                <p className="text-xs text-muted-foreground">
                  {participant.email}
                </p>
              </div>
            </div>

            {/* Grid detail */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block mb-0.5">NIM</span>
                <span className="font-mono font-medium">{participant.nim}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">
                  Fakultas
                </span>
                <span className="font-medium">{participant.fakultas || "-"}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block mb-0.5">
                  Program Studi
                </span>
                <span className="font-medium">{participant.prodi || "-"}</span>
              </div>
            </div>

            {/* Status Section */}
            <div className="mt-2 rounded-xl p-3 bg-muted/50 border border-border flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Status Kehadiran:</span>
                <Badge
                  variant={
                    participant.attendance.status === "hadir"
                      ? "default"
                      : "outline"
                  }
                  className={
                    participant.attendance.status === "hadir"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-0"
                  }
                >
                  {participant.attendance.status.toUpperCase()}
                </Badge>
              </div>
              {participant.attendance.status === "hadir" && (
                <div className="flex justify-between items-center text-xs pt-1 border-t border-muted-foreground/10">
                  <span className="text-muted-foreground">Waktu Masuk:</span>
                  <span className="font-mono text-foreground font-semibold">
                    {new Date(
                      participant.attendance.checkedInAt!,
                    ).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "medium",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 font-medium"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
