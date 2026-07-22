import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EventInfoCard() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex gap-2 items-center">
          <Info className="h-4 w-4 text-primary" />
          <CardTitle className="text-base font-semibold">
            Informasi Acara
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-xs space-y-2 text-muted-foreground">
        <div className="flex justify-between py-1 border-b border-muted">
          <span>Nama Event:</span>
          <span className="font-medium text-foreground">SEMTIK 2026</span>
        </div>
        <div className="flex justify-between py-1 border-b border-muted">
          <span>Tanggal Pelaksanaan:</span>
          <span className="font-medium text-foreground">
            15 September 2026
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span>Status Sinkronisasi:</span>
          <span className="text-emerald-600 font-medium flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Aktif
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
