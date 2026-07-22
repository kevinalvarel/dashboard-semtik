import { Search, Sparkles } from "lucide-react";
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
    <div className="lg:col-span-2 flex flex-col gap-4">
      <Card className="border-border bg-card flex-1">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold">
                Kehadiran Peserta Terkini
              </CardTitle>
              <CardDescription>
                Menampilkan status kehadiran real-time beberapa sampel peserta.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="px-2 py-1 flex gap-1 items-center bg-muted text-muted-foreground border-0 font-normal"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                Real-time Sync
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama, NIM, universitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/30 border-muted-foreground/20 focus-visible:ring-ring"
              />
            </div>
            <div className="flex gap-1 bg-muted p-1 rounded-lg self-start">
              <Button
                variant={statusFilter === "semua" ? "default" : "ghost"}
                size="sm"
                className={`h-7 px-2.5 text-xs font-medium rounded-md ${
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
                className={`h-7 px-2.5 text-xs font-medium rounded-md ${
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
                className={`h-7 px-2.5 text-xs font-medium rounded-md ${
                  statusFilter === "belum hadir"
                    ? "bg-background text-foreground shadow-xs"
                    : ""
                }`}
                onClick={() => setStatusFilter("belum hadir")}
              >
                Belum Hadir ({tabCounts.belumHadir})
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px]">NIM</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Universitas
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Waktu Presensi
                  </TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((p) => (
                    <TableRow
                      key={p.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {p.nim}
                      </TableCell>
                      <TableCell className="font-medium">{p.nama}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground max-w-[150px] truncate">
                        {p.universitas}
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
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0 hover:bg-emerald-500/20"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-0 hover:bg-amber-500/20"
                          }
                        >
                          {p.attendance.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">
                        {formatDate(p.attendance.checkedInAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-primary hover:text-primary/90 hover:bg-accent"
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
                      className="h-24 text-center text-muted-foreground"
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
