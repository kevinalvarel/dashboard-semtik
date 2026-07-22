import { useState, useMemo } from "react";
import { useAttendance } from "@/hooks/use-attendance";
import type { AttendanceParticipant } from "@/api/attendance";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

// Modular Page Components
import { HeaderBanner } from "@/components/pages/all-attendance/layout/header-banner";
import { StatCards } from "@/components/pages/all-attendance/ui/stat-cards";
import { AttendanceTableSection } from "@/components/pages/all-attendance/ui/attendance-table-section";
import { AttendanceDetailDialog } from "@/components/pages/all-attendance/ui/attendance-detail-dialog";

export default function AllAttendancePage() {
  // Filters & State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("semua");
  const [facultyFilter, setFacultyFilter] = useState<string>("semua");
  const [sortBy, setSortBy] = useState<string>("waktu_terbaru");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal State
  const [selectedParticipant, setSelectedParticipant] =
    useState<AttendanceParticipant | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch using TanStack React Query
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAttendance();

  // Normalize participants data
  const participants: AttendanceParticipant[] = useMemo(() => {
    const rawList = apiResponse?.data || apiResponse?.participants || [];

    if (!Array.isArray(rawList)) return [];

    return rawList.map((item: any) => {
      const status =
        item.attendance?.status ?? (item.isCheckedIn ? "hadir" : "belum hadir");
      const checkedInAt =
        item.attendance?.checkedInAt ?? item.checkedInAt ?? null;

      return {
        id: item.id ?? Math.random().toString(),
        nim: String(item.nim ?? "-"),
        nama: item.nama || "Tanpa Nama",
        email: item.email || "-",
        fakultas: item.fakultas || "-",
        prodi: item.prodi || "-",
        isCheckedIn: status === "hadir",
        checkedInAt,
        attendance: {
          status,
          checkedInAt,
        },
      };
    });
  }, [apiResponse, isError]);

  // Extract unique faculties list for filter dropdown
  const facultyOptions = useMemo(() => {
    const set = new Set<string>();
    participants.forEach((p) => {
      if (p.fakultas && p.fakultas !== "-") set.add(p.fakultas);
    });
    return Array.from(set).sort();
  }, [participants]);

  // Calculate overall stats dynamically
  const stats = useMemo(() => {
    if (apiResponse?.stats) return apiResponse.stats;

    const totalPeserta = participants.length;
    const hadir = participants.filter(
      (p) => p.attendance?.status === "hadir",
    ).length;
    const belumHadir = participants.filter(
      (p) => p.attendance?.status === "belum hadir",
    ).length;
    const persentaseKehadiran =
      totalPeserta > 0 ? Math.round((hadir / totalPeserta) * 1000) / 10 : 0;

    return {
      totalPeserta,
      hadir,
      belumHadir,
      persentaseKehadiran,
    };
  }, [apiResponse?.stats, participants]);

  // Filter & Sorting Logic
  const filteredAndSortedParticipants = useMemo(() => {
    let result = participants.filter((p) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.nama.toLowerCase().includes(query) ||
        String(p.nim).includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.fakultas.toLowerCase().includes(query) ||
        p.prodi.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "semua" ||
        p.attendance?.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesFaculty =
        facultyFilter === "semua" || p.fakultas === facultyFilter;

      return matchesSearch && matchesStatus && matchesFaculty;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "nama_asc") return a.nama.localeCompare(b.nama);
      if (sortBy === "nama_desc") return b.nama.localeCompare(a.nama);
      if (sortBy === "nim_asc")
        return String(a.nim).localeCompare(String(b.nim));

      const timeA = a.attendance?.checkedInAt
        ? new Date(a.attendance.checkedInAt).getTime()
        : 0;
      const timeB = b.attendance?.checkedInAt
        ? new Date(b.attendance.checkedInAt).getTime()
        : 0;

      if (sortBy === "waktu_terlama") return timeA - timeB;
      // default: waktu_terbaru
      return timeB - timeA;
    });

    return result;
  }, [participants, searchQuery, statusFilter, facultyFilter, sortBy]);

  // Pagination Logic
  const totalItems = filteredAndSortedParticipants.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validPage = Math.min(currentPage, totalPages);

  const paginatedParticipants = useMemo(() => {
    const start = (validPage - 1) * pageSize;
    return filteredAndSortedParticipants.slice(start, start + pageSize);
  }, [filteredAndSortedParticipants, validPage, pageSize]);

  // Handlers
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("semua");
    setFacultyFilter("semua");
    setSortBy("waktu_terbaru");
    setCurrentPage(1);
    toast.info("Filter telah direset");
  };

  const handleOpenDetail = (p: AttendanceParticipant) => {
    setSelectedParticipant(p);
    setIsDetailOpen(true);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin ke clipboard`);
  };

  const handleExportCSV = () => {
    if (filteredAndSortedParticipants.length === 0) {
      toast.error("Tidak ada data untuk diexport");
      return;
    }

    const headers = [
      "NIM",
      "Nama",
      "Email",
      "Fakultas",
      "Prodi",
      "Status",
      "Waktu Check-In",
    ];
    const rows = filteredAndSortedParticipants.map((p) => [
      `"${p.nim}"`,
      `"${p.nama}"`,
      `"${p.email}"`,
      `"${p.fakultas}"`,
      `"${p.prodi}"`,
      `"${p.attendance?.status || "belum hadir"}"`,
      `"${p.attendance?.checkedInAt ? new Date(p.attendance.checkedInAt).toLocaleString("id-ID") : "-"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `presensi_semtik_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("File CSV presensi berhasil diunduh");
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const hasActiveFilters =
    searchQuery !== "" || statusFilter !== "semua" || facultyFilter !== "semua";

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 bg-background text-foreground">
      {/* Header Banner Component */}
      <HeaderBanner
        isFetching={isFetching}
        onRefetch={refetch}
        onExportCSV={handleExportCSV}
      />

      {/* Error Alert Banner */}
      {isError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-sm">
              Gagal Mengambil Data Server
            </h5>
            <p className="text-xs text-muted-foreground mt-0.5">
              {error instanceof Error
                ? error.message
                : "Terjadi kesalahan koneksi API."}
              . Menampilkan sampel data presensi lokal.
            </p>
          </div>
        </div>
      )}

      {/* Stat Cards Component */}
      <StatCards stats={stats} isLoading={isLoading} />

      {/* Main Table Section Component */}
      <AttendanceTableSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        facultyFilter={facultyFilter}
        setFacultyFilter={setFacultyFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        facultyOptions={facultyOptions}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        paginatedParticipants={paginatedParticipants}
        filteredCount={totalItems}
        totalCount={participants.length}
        isLoading={isLoading}
        validPage={validPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setCurrentPage={setCurrentPage}
        onOpenDetail={handleOpenDetail}
        onCopyText={handleCopyText}
        formatDate={formatDate}
      />

      {/* Participant Detail Dialog Component */}
      <AttendanceDetailDialog
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        participant={selectedParticipant}
      />
    </div>
  );
}
