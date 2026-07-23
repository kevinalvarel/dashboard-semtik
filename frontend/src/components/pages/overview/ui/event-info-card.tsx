import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EventInfoCard() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
        <div className="flex gap-2 items-center">
          <Info className="h-4 w-4 text-primary shrink-0" />
          <CardTitle className="text-sm sm:text-base font-semibold">
            Informasi Acara
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 text-xs space-y-2 text-muted-foreground">
        <div className="flex justify-between py-1 border-b border-border/50 gap-2">
          <span>Nama Event:</span>
          <span className="font-medium text-foreground text-right">SEMTIK 2026</span>
        </div>
        <div className="flex justify-between py-1 border-b border-border/50 gap-2">
          <span>Tanggal Pelaksanaan:</span>
          <span className="font-medium text-foreground text-right">16 Desember 2026</span>
        </div>
        <div className="flex justify-between py-1 gap-2">
          <span>Status Sinkronisasi:</span>
          <span className="text-emerald-600 font-medium flex items-center gap-1 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Aktif
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
