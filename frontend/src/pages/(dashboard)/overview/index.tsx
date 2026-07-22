import { useState, useMemo } from "react";
import attendanceData from "@/data/attendance.json";
import { WelcomeBanner } from "@/components/pages/overview/layout/welcome-banner";
import { StatCards } from "@/components/pages/overview/ui/stat-cards";
import { ParticipantTableSection } from "@/components/pages/overview/ui/participant-table-section";
import { QuickLinksCard } from "@/components/pages/overview/ui/quick-links-card";
import { UniversityDistributionCard } from "@/components/pages/overview/ui/university-distribution-card";
import { EventInfoCard } from "@/components/pages/overview/ui/event-info-card";
import { ParticipantDetailDialog } from "@/components/pages/overview/ui/participant-detail-dialog";

import type { Participant } from "@/components/pages/overview/types";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "semua" | "hadir" | "belum hadir"
  >("semua");
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const stats = attendanceData.stats;
  const participants = attendanceData.participants as Participant[];

  const universityStats = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach((p) => {
      counts[p.universitas] = (counts[p.universitas] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [participants]);

  // Filtered participants list
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchesSearch =
        p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nim.includes(searchQuery) ||
        p.universitas.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.prodi.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "semua" ||
        p.attendance.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [participants, searchQuery, statusFilter]);

  // Counts for tabs
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

        {/* Right Side: University breakdown and Quick links */}
        <div className="flex flex-col gap-6">
          <QuickLinksCard />
          <UniversityDistributionCard
            universityStats={universityStats}
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
