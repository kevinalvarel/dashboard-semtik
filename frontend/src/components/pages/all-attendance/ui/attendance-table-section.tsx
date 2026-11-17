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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { AttendanceParticipant } from "@/api/attendance";

import {
  Search,
  FilterX,
  MoreHorizontal,
  Eye,
  Copy,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Mail,
  GraduationCap,
  Store,
  Globe,
  MapPin,
  Briefcase,
} from "lucide-react";

interface AttendanceTableSectionProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  kategoriFilter: string;
  setKategoriFilter: (val: string) => void;
  presenceTypeFilter: string;
  setPresenceTypeFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  facultyFilter: string;
  setFacultyFilter: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  facultyOptions: string[];
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  paginatedParticipants: AttendanceParticipant[];
  filteredCount: number;
  totalCount: number;
  isLoading: boolean;
  validPage: number;
  totalPages: number;
  pageSize: number;
  setPageSize: (val: number) => void;
  setCurrentPage: (val: number | ((prev: number) => number)) => void;
  onOpenDetail: (participant: AttendanceParticipant) => void;
  onCopyText: (text: string, label: string) => void;
  formatDate: (dateStr: string | null | undefined) => string;
  onSendEmail?: (participant: AttendanceParticipant) => void;
}

export function AttendanceTableSection({
  searchQuery,
  setSearchQuery,
  kategoriFilter,
  setKategoriFilter,
  presenceTypeFilter,
  setPresenceTypeFilter,
  statusFilter,
  setStatusFilter,
  facultyFilter,
  setFacultyFilter,
  sortBy,
  setSortBy,
  facultyOptions,
  hasActiveFilters,
  onResetFilters,
  paginatedParticipants,
  filteredCount,
  totalCount,
  isLoading,
  validPage,
  totalPages,
  pageSize,
  setPageSize,
  setCurrentPage,
  onOpenDetail,
  onCopyText,
  formatDate,
  onSendEmail,
}: AttendanceTableSectionProps) {
  return (
    <Card className="border-border bg-card flex-1 shadow-xs">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              Daftar Presensi Peserta
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Menampilkan {filteredCount} dari total {totalCount} peserta terdaftar.
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Menampilkan data presensi terintegrasi Mahasiswa & UMKM</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Controls Bar: Search, Filters, Sort */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama, NIM, email, bidang, kota, prodi..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-8 bg-muted/30 border-border focus-visible:ring-primary text-sm h-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Kategori Select */}
            <Select
              value={kategoriFilter}
              onValueChange={(val) => {
                if (val) {
                  setKategoriFilter(val);
                  setCurrentPage(1);
                }
              }}
            >
              <SelectTrigger className="w-[145px] h-9 text-xs border-border bg-card">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Kategori</SelectItem>
                <SelectItem value="mahasiswa">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                    Mahasiswa
                  </span>
                </SelectItem>
                <SelectItem value="umkm">
                  <span className="flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5 text-purple-500" />
                    UMKM
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Jenis Kehadiran Select */}
            <Select
              value={presenceTypeFilter}
              onValueChange={(val) => {
                if (val) {
                  setPresenceTypeFilter(val);
                  setCurrentPage(1);
                }
              }}
            >
              <SelectTrigger className="w-[145px] h-9 text-xs border-border bg-card">
                <SelectValue placeholder="Jenis Kehadiran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Kehadiran</SelectItem>
                <SelectItem value="offline">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                    Offline (Venue)
                  </span>
                </SelectItem>
                <SelectItem value="online">
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-sky-500" />
                    Online (Daring)
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Status Kehadiran Select */}
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                if (val) {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }
              }}
            >
              <SelectTrigger className="w-[135px] h-9 text-xs border-border bg-card">
                <SelectValue placeholder="Status Kehadiran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Status</SelectItem>
                <SelectItem value="hadir">Hadir</SelectItem>
                <SelectItem value="belum hadir">Belum Hadir</SelectItem>
              </SelectContent>
            </Select>

            {/* Faculty Select (hidden if specifically filtering to UMKM) */}
            {kategoriFilter !== "umkm" && facultyOptions.length > 0 && (
              <Select
                value={facultyFilter}
                onValueChange={(val) => {
                  if (val) {
                    setFacultyFilter(val);
                    setCurrentPage(1);
                  }
                }}
              >
                <SelectTrigger className="w-[155px] h-9 text-xs border-border bg-card">
                  <SelectValue placeholder="Fakultas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Fakultas</SelectItem>
                  {facultyOptions.map((fac) => (
                    <SelectItem key={fac} value={fac}>
                      {fac}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Sort By Select */}
            <Select
              value={sortBy}
              onValueChange={(val) => {
                if (val) {
                  setSortBy(val);
                  setCurrentPage(1);
                }
              }}
            >
              <SelectTrigger className="w-[140px] h-9 text-xs border-border bg-card">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="waktu_terbaru">Waktu Terbaru</SelectItem>
                <SelectItem value="waktu_terlama">Waktu Terlama</SelectItem>
                <SelectItem value="nama_asc">Nama (A-Z)</SelectItem>
                <SelectItem value="nama_desc">Nama (Z-A)</SelectItem>
                <SelectItem value="nim_asc">NIM (Asc)</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetFilters}
                className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
              >
                <FilterX className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-lg border border-border overflow-hidden bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[50px] text-center">No</TableHead>
                <TableHead className="w-[110px]">Kategori</TableHead>
                <TableHead>Peserta</TableHead>
                <TableHead className="hidden md:table-cell">Detail / Institusi</TableHead>
                <TableHead className="w-[115px]">Kehadiran</TableHead>
                <TableHead className="w-[115px]">Status</TableHead>
                <TableHead className="hidden sm:table-cell w-[130px]">
                  Waktu Presensi
                </TableHead>
                <TableHead className="w-[70px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-14 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedParticipants.length > 0 ? (
                paginatedParticipants.map((p, idx) => {
                  const rowNumber = (validPage - 1) * pageSize + idx + 1;
                  const isHadir = p.attendance?.status === "hadir";
                  const isUmkm = p.kategori === "umkm";
                  const isOnline = p.jenisKehadiran?.toLowerCase() === "online";

                  return (
                    <TableRow
                      key={p.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="text-center font-mono text-xs text-muted-foreground">
                        {rowNumber}
                      </TableCell>

                      {/* Kategori Badge */}
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
                            <Store className="h-3 w-3" />
                          ) : (
                            <GraduationCap className="h-3 w-3" />
                          )}
                          {isUmkm ? "UMKM" : "Mahasiswa"}
                        </Badge>
                      </TableCell>

                      {/* Peserta Info */}
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-xs ${
                              isUmkm
                                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {p.nama.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-xs text-foreground truncate">
                              {p.nama}
                            </span>
                            <span className="text-[11px] text-muted-foreground truncate">
                              {p.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Detail / Institusi */}
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-[200px]">
                        {isUmkm ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground flex items-center gap-1 truncate">
                              <Briefcase className="h-3 w-3 text-muted-foreground shrink-0" />
                              {p.bidang || "UMKM"}
                            </span>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                              <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                              {p.kota || "-"}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-mono font-medium text-foreground text-[11px]">
                              NIM: {p.nim || "-"}
                            </span>
                            <span className="text-[11px] text-muted-foreground truncate" title={`${p.fakultas} - ${p.prodi}`}>
                              {p.prodi || p.fakultas || "-"}
                            </span>
                          </div>
                        )}
                      </TableCell>

                      {/* Jenis Kehadiran Badge */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-2 py-0.5 font-medium inline-flex items-center gap-1 ${
                            isOnline
                              ? "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20"
                              : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                          }`}
                        >
                          {isOnline ? (
                            <Globe className="h-3 w-3" />
                          ) : (
                            <MapPin className="h-3 w-3" />
                          )}
                          {isOnline ? "Online" : "Offline"}
                        </Badge>
                      </TableCell>

                      {/* Status Kehadiran */}
                      <TableCell>
                        <div className="flex flex-col gap-1 items-start">
                          <Badge
                            variant={isHadir ? "default" : "outline"}
                            className={
                              isHadir
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0 hover:bg-emerald-500/20 text-[10px] font-medium"
                                : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-0 hover:bg-amber-500/20 text-[10px] font-medium"
                            }
                          >
                            {p.attendance?.status || "belum hadir"}
                          </Badge>
                          {p.isEmailSent && (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-indigo-50/50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800">
                              Email Terkirim
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">
                        {formatDate(p.attendance?.checkedInAt)}
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="rounded-md outline-none focus:ring-1 focus:ring-ring">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel className="text-xs">
                                Opsi Peserta
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onOpenDetail(p)}
                                className="text-xs gap-2 cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5 text-primary" />
                                Lihat Detail
                              </DropdownMenuItem>
                              {p.nim && p.nim !== "-" && (
                                <DropdownMenuItem
                                  onClick={() => onCopyText(String(p.nim), "NIM")}
                                  className="text-xs gap-2 cursor-pointer"
                                >
                                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                  Salin NIM
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => onCopyText(p.email, "Email")}
                                className="text-xs gap-2 cursor-pointer"
                              >
                                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                Salin Email
                              </DropdownMenuItem>
                              {onSendEmail && !p.isEmailSent && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => onSendEmail(p)}
                                    className="text-xs gap-2 cursor-pointer text-indigo-600 dark:text-indigo-400"
                                  >
                                    <Mail className="h-3.5 w-3.5" />
                                    Kirim Email QR
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-36 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium text-foreground">
                        Tidak ada data peserta ditemukan
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Coba sesuaikan kata kunci pencarian atau reset filter yang aktif.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Baris per halaman:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-16 text-xs border-border bg-card">
                <SelectValue placeholder={String(pageSize)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="hidden sm:inline">
              Menampilkan {Math.min(filteredCount, (validPage - 1) * pageSize + 1)}-
              {Math.min(filteredCount, validPage * pageSize)} dari {filteredCount} peserta
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground mr-2">
              Halaman {validPage} dari {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-border hover:bg-accent cursor-pointer"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={validPage <= 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-border hover:bg-accent cursor-pointer"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={validPage >= totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
