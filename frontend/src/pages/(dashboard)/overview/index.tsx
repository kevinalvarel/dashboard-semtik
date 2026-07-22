import { useState, useMemo } from "react";
import { useAttendance } from "@/hooks/use-attendance";
import { WelcomeBanner } from "@/components/pages/overview/layout/welcome-banner";
import { StatCards } from "@/components/pages/overview/ui/stat-cards";
import { ParticipantTableSection } from "@/components/pages/overview/ui/participant-table-section";
import { QuickLinksCard } from "@/components/pages/overview/ui/quick-links-card";
import { FacultyDistributionCard } from "@/components/pages/overview/ui/faculty-distribution-card";
import { EventInfoCard } from "@/components/pages/overview/ui/event-info-card";
import { ParticipantDetailDialog } from "@/components/pages/overview/ui/participant-detail-dialog";
import { AlertCircle, Loader2 } from "lucide-react";

import type { Participant } from "@/components/pages/overview/types";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "semua" | "hadir" | "belum hadir"
  >("semua");
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch data using useAttendance hook (React Query)
  const { data: apiResponse, isLoading, isError, error } = useAttendance();

  // Normalize participants list from API response or fallback local data
  const participants: Participant[] = useMemo(() => {
    const rawList =
      apiResponse?.data ||
      apiResponse?.participants ||
      [];

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
        attendance: {
          status,
          checkedInAt,
        },
      };
    });
  }, [apiResponse, isError]);

  // Compute stats dynamically if not supplied by API
  const stats = useMemo(() => {
    if (apiResponse?.stats) return apiResponse.stats;

    const totalPeserta = participants.length;
    const hadir = participants.filter(
      (p) => p.attendance.status === "hadir",
    ).length;
    const belumHadir = participants.filter(
      (p) => p.attendance.status === "belum hadir",
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

  // Distribution by Faculty
  const facultyStats = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach((p) => {
      const key = p.fakultas || "Lainnya";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [participants]);

  // Filtered participants list for search & tabs
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchesSearch =
        p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.nim).includes(searchQuery) ||
        p.fakultas.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.prodi.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "semua" ||
        p.attendance.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [participants, searchQuery, statusFilter]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      semua: participants.length,
      hadir: participants.filter((p) => p.attendance.status === "hadir").length,
      belumHadir: participants.filter(
        (p) => p.attendance.status === "belum hadir",
      ).length,
    };
  }, [participants]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  };

  const handleOpenDetail = (p: Participant) => {
    setSelectedParticipant(p);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Loading & Error Indicators */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-muted/40 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Memuat data absensi terkini...
        </div>
      )}

      {isError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-sm">Koneksi API Gagal</h5>
            <p className="text-xs text-muted-foreground mt-0.5">
              Gagal mengambil data dari server (
              {error instanceof Error ? error.message : "Error"}). Menampilkan
              data lokal sementara.
            </p>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <StatCards stats={stats} />

      {/* Main Content Sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Interactive Table of Participants */}
        <ParticipantTableSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          tabCounts={tabCounts}
          filteredParticipants={filteredParticipants}
          onOpenDetail={handleOpenDetail}
          formatDate={formatDate}
        />

        {/* Right Side: Faculty breakdown and Quick links */}
        <div className="flex flex-col gap-6">
          <QuickLinksCard />
          <FacultyDistributionCard
            facultyStats={facultyStats}
            totalParticipants={participants.length}
          />
          <EventInfoCard />
        </div>
      </div>

      {/* Participant Detail Dialog */}
      <ParticipantDetailDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        participant={selectedParticipant}
      />
    </div>
  );
}
