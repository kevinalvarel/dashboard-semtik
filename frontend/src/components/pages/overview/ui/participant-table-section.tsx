import { Search } from "lucide-react";
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
                placeholder="Cari nama, NIM, fakultas, prodi..."
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
                  <TableHead className="w-[90px] sm:w-[100px] text-xs">NIM</TableHead>
                  <TableHead className="text-xs">Nama</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">
                    Fakultas
                  </TableHead>
                  <TableHead className="text-xs w-[100px]">Status</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">
                    Waktu Presensi
                  </TableHead>
                  <TableHead className="text-right text-xs w-[70px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((p) => (
                    <TableRow
                      key={p.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-mono text-[11px] sm:text-xs text-muted-foreground whitespace-nowrap">
                        {p.nim}
                      </TableCell>
                      <TableCell className="font-medium text-xs sm:text-sm max-w-[130px] sm:max-w-none truncate">
                        {p.nama}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-[150px] truncate">
                        {p.fakultas || "-"}
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
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
