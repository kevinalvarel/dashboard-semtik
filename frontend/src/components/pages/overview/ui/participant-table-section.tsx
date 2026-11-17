import { Search, GraduationCap, Store, Globe, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Participant } from "../types";

interface ParticipantTableSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: "semua" | "hadir" | "belum hadir";
  setStatusFilter: (filter: "semua" | "hadir" | "belum hadir") => void;
  tabCounts: {
    semua: number;
    hadir: number;
    belumHadir: number;
  };
  filteredParticipants: Participant[];
  onOpenDetail: (participant: Participant) => void;
  formatDate: (dateStr: string | null) => string;
}

export function ParticipantTableSection({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  tabCounts,
  filteredParticipants,
  onOpenDetail,
  formatDate,
}: ParticipantTableSectionProps) {
  return (
    <div className="lg:col-span-2 flex flex-col gap-4 min-w-0 overflow-x-hidden">
      <Card className="border-border bg-card flex-1 min-w-0 overflow-x-hidden">
        <CardHeader className="p-4 sm:p-6 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div>
              <CardTitle className="text-base sm:text-lg font-semibold">
                Kehadiran Peserta Terkini
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Menampilkan status kehadiran real-time beberapa sampel peserta.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama, NIM, universitas, fakultas, prodi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/30 border-muted-foreground/20 focus-visible:ring-ring text-xs sm:text-sm h-9"
              />
            </div>
            <div className="grid grid-cols-3 sm:flex gap-1 bg-muted p-1 rounded-lg w-full sm:w-auto">
              <Button
                variant={statusFilter === "semua" ? "default" : "ghost"}
                size="sm"
                className={`h-7 px-2 sm:px-2.5 text-[11px] sm:text-xs font-medium rounded-md truncate ${
                  statusFilter === "semua"
                    ? "bg-background text-foreground shadow-xs"
                    : ""
                }`}
                onClick={() => setStatusFilter("semua")}
              >
                Semua ({tabCounts.semua})
              </Button>
              <Button
                variant={statusFilter === "hadir" ? "default" : "ghost"}
                size="sm"
                className={`h-7 px-2 sm:px-2.5 text-[11px] sm:text-xs font-medium rounded-md truncate ${
                  statusFilter === "hadir"
                    ? "bg-background text-foreground shadow-xs"
                    : ""
                }`}
                onClick={() => setStatusFilter("hadir")}
              >
                Hadir ({tabCounts.hadir})
              </Button>
              <Button
                variant={statusFilter === "belum hadir" ? "default" : "ghost"}
                size="sm"
                className={`h-7 px-2 sm:px-2.5 text-[11px] sm:text-xs font-medium rounded-md truncate ${
                  statusFilter === "belum hadir"
                    ? "bg-background text-foreground shadow-xs"
                    : ""
                }`}
                onClick={() => setStatusFilter("belum hadir")}
              >
                Belum ({tabCounts.belumHadir})
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border overflow-x-auto bg-card">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px] text-xs">Kategori</TableHead>
                  <TableHead className="text-xs">Nama</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">
                    Detail / Institusi
                  </TableHead>
                  <TableHead className="w-[95px] text-xs">Kehadiran</TableHead>
                  <TableHead className="text-xs w-[100px]">Status</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">
                    Waktu Presensi
                  </TableHead>
                  <TableHead className="text-right text-xs w-[70px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((p) => {
                    const isUmkm = p.kategori === "umkm";
                    const isOnline = p.jenisKehadiran?.toLowerCase() === "online";
                    return (
                      <TableRow
                        key={p.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-2 py-0.5 font-medium inline-flex items-center gap-1 ${
                              isUmkm
                                ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20"
                                : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20"
                            }`}
                          >
                            {isUmkm ? (
                              <Store className="h-2.5 w-2.5" />
                            ) : (
                              <GraduationCap className="h-2.5 w-2.5" />
                            )}
                            {isUmkm ? "UMKM" : "Mahasiswa"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-xs sm:text-sm truncate">
                              {p.nama}
                            </span>
                            {p.universitas && p.universitas !== "-" && (
                              <span className="text-[11px] text-muted-foreground font-normal truncate">
                                {p.universitas}
                              </span>
                            )}
                            <span className="text-[11px] text-muted-foreground truncate font-mono">
                              {isUmkm ? (p.kota || p.email) : (p.nim || p.email)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-[150px] truncate">
                          {isUmkm ? (p.bidang || "UMKM Mitra") : (p.fakultas || "-")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0.5 font-medium inline-flex items-center gap-1 ${
                              isOnline
                                ? "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20"
                                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                            }`}
                          >
                            {isOnline ? (
                              <Globe className="h-2.5 w-2.5" />
                            ) : (
                              <MapPin className="h-2.5 w-2.5" />
                            )}
                            {isOnline ? "Online" : "Offline"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              p.attendance.status === "hadir"
                                ? "default"
                                : "outline"
                            }
                            className={
                              p.attendance.status === "hadir"
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0 hover:bg-emerald-500/20 text-[10px] sm:text-xs"
                                : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-0 hover:bg-amber-500/20 text-[10px] sm:text-xs"
                            }
                          >
                            {p.attendance.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(p.attendance.checkedInAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 sm:h-8 px-2 text-xs text-primary hover:text-primary/90 hover:bg-accent cursor-pointer"
                            onClick={() => onOpenDetail(p)}
                          >
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-xs sm:text-sm text-muted-foreground"
                    >
                      Tidak ada peserta ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
