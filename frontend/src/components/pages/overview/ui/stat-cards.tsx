import { Users, CheckCircle2, Clock, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Stats } from "../types";

interface StatCardsProps {
  stats: Stats;
}

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Total Peserta */}
      <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between p-3.5 sm:p-6 pb-1 sm:pb-2">
          <div className="space-y-0.5">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Pendaftar
            </CardTitle>
          </div>
          <div className="rounded-xl text-foreground">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-6 pt-0 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold tracking-tight">
            {stats.totalPeserta}
          </div>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 line-clamp-1">
            Peserta terdaftar secara keseluruhan
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Hadir */}
      <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between p-3.5 sm:p-6 pb-1 sm:pb-2">
          <div className="space-y-0.5">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Hadir
            </CardTitle>
          </div>
          <div className="rounded-xl text-foreground">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-6 pt-0 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {stats.hadir}
          </div>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 line-clamp-1">
            Sudah memindai QR code absensi
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Belum Hadir */}
      <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between p-3.5 sm:p-6 pb-1 sm:pb-2">
          <div className="space-y-0.5">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Belum Hadir
            </CardTitle>
          </div>
          <div className="rounded-xl text-foreground">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-6 pt-0 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {stats.belumHadir}
          </div>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 line-clamp-1">
            Menunggu kehadiran di lokasi event
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Persentase Kehadiran */}
      <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between p-3.5 sm:p-6 pb-1 sm:pb-2">
          <div className="space-y-0.5">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Persentase Kehadiran
            </CardTitle>
          </div>
          <div className="rounded-xl text-foreground">
            <Percent className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-6 pt-0 sm:pt-0">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {stats.persentaseKehadiran}%
            </span>
          </div>
          <div className="mt-1.5 sm:mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${stats.persentaseKehadiran}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
