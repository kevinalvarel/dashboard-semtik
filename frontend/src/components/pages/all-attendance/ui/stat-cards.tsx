import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  CheckCircle2,
  Clock,
  Percent,
  GraduationCap,
  Store,
  Globe,
  MapPin,
} from "lucide-react";
import type { AttendanceStats } from "@/api/attendance";

interface StatCardsProps {
  stats: AttendanceStats;
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
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {stats.totalMahasiswa !== undefined && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-800/40">
                <GraduationCap className="h-3 w-3" />
                Mhs: {stats.totalMahasiswa}
              </span>
            )}
            {stats.totalUmkm !== undefined && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md border border-purple-200/60 dark:border-purple-800/40">
                <Store className="h-3 w-3" />
                UMKM: {stats.totalUmkm}
              </span>
            )}
          </div>
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
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {stats.totalOffline !== undefined && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                <MapPin className="h-3 w-3" />
                Offline: {stats.totalOffline}
              </span>
            )}
            {stats.totalOnline !== undefined && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-md border border-sky-200/60 dark:border-sky-800/40">
                <Globe className="h-3 w-3" />
                Online: {stats.totalOnline}
              </span>
            )}
          </div>
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
          <p className="text-xs text-muted-foreground mt-2">
            Menunggu kehadiran di sesi acara
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
          <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
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
