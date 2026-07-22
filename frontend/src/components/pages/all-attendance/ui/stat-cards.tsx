import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CheckCircle2, Clock, Percent } from "lucide-react";

interface StatCardsProps {
  stats: {
    totalPeserta: number;
    hadir: number;
    belumHadir: number;
    persentaseKehadiran: number;
  };
  isLoading: boolean;
}

export function StatCards({ stats, isLoading }: StatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Peserta */}
      <Card className="border-border bg-card shadow-xs transition-all hover:border-primary/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Pendaftar
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Users className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold text-foreground">
              {stats.totalPeserta}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Peserta terdaftar secara keseluruhan
          </p>
        </CardContent>
      </Card>

      {/* Hadir */}
      <Card className="border-border bg-card shadow-xs transition-all hover:border-emerald-500/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Sudah Presensi
          </CardTitle>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.hadir}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Telah melakukan check-in kehadiran
          </p>
        </CardContent>
      </Card>

      {/* Belum Hadir */}
      <Card className="border-border bg-card shadow-xs transition-all hover:border-amber-500/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Belum Presensi
          </CardTitle>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.belumHadir}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Menunggu kehadiran di venue acara
          </p>
        </CardContent>
      </Card>

      {/* Persentase */}
      <Card className="border-border bg-card shadow-xs transition-all hover:border-primary/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Tingkat Kehadiran
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Percent className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold text-foreground">
              {stats.persentaseKehadiran}%
            </div>
          )}
          <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
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
