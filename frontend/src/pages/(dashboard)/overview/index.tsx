import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CheckCircle2,
  Clock,
  Percent,
  Search,
  QrCode,
  FileSpreadsheet,
  ArrowUpRight,
  School,
  Sparkles,
  Info,
} from "lucide-react";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import attendanceData from "@/data/attendance.json";

interface Participant {
  id: string;
  nim: string;
  nama: string;
  email: string;
  universitas: string;
  fakultas: string;
  prodi: string;
  attendance: {
    status: string;
    checkedInAt: string | null;
  };
}

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
      <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-primary-foreground/80 max-w-2xl text-sm md:text-base">
              Selamat datang di portal administrasi Seminar Nasional Teknologi
              Informasi dan Komputer (SEMTIK) 2026. Monitor kehadiran peserta,
              kelola verifikasi QR Code secara langsung.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link to="/scan-qr">
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-0 font-medium">
                <QrCode className="mr-2 h-4 w-4" /> Scan QR Presensi
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-primary-foreground/5 blur-3xl" />
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Peserta */}
        <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pendaftar
              </CardTitle>
            </div>
            <div className="rounded-xl text-foreground">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {stats.totalPeserta}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Peserta terdaftar secara keseluruhan
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Hadir */}
        <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Hadir
              </CardTitle>
            </div>
            <div className="rounded-xl text-foreground">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {stats.hadir}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sudah memindai QR code absensi
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Belum Hadir */}
        <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Belum Hadir
              </CardTitle>
            </div>
            <div className="rounded-xl text-foreground">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {stats.belumHadir}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Menunggu kehadiran di lokasi event
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Persentase Kehadiran */}
        <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Persentase Kehadiran
              </CardTitle>
            </div>
            <div className="rounded-xl text-foreground">
              <Percent className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {stats.persentaseKehadiran}%
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${stats.persentaseKehadiran}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Interactive Table of Participants */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="border-border bg-card flex-1">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Kehadiran Peserta Terkini
                  </CardTitle>
                  <CardDescription>
                    Menampilkan status kehadiran real-time beberapa sampel
                    peserta.
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
                    variant={
                      statusFilter === "belum hadir" ? "default" : "ghost"
                    }
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
                          <TableCell className="font-medium">
                            {p.nama}
                          </TableCell>
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
                              onClick={() => handleOpenDetail(p)}
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

        {/* Right Side: University breakdown and Quick links */}
        <div className="flex flex-col gap-6">
          {/* Quick Links Card */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Tautan Cepat
              </CardTitle>
              <CardDescription>
                Akses menu penting administrasi dengan cepat.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link to="/scan-qr" className="w-full">
                <Button
                  variant="outline"
                  className="w-full justify-between hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-primary" />
                    Scan QR Presensi
                  </span>
                  <ArrowUpRight className="h-4 w-4 opacity-50" />
                </Button>
              </Link>
              <Link to="/participants" className="w-full">
                <Button
                  variant="outline"
                  className="w-full justify-between hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Kelola Semua Peserta
                  </span>
                  <ArrowUpRight className="h-4 w-4 opacity-50" />
                </Button>
              </Link>
              <Link to="/export" className="w-full">
                <Button
                  variant="outline"
                  className="w-full justify-between hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-primary" />
                    Ekspor Excel / CSV
                  </span>
                  <ArrowUpRight className="h-4 w-4 opacity-50" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Top Universities Breakdown */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Distribusi Universitas
              </CardTitle>
              <CardDescription>
                Top 5 asal universitas peserta yang terdaftar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {universityStats.map((uni, idx) => {
                  const percentage = Math.round(
                    (uni.count / participants.length) * 100,
                  );
                  const colors = [
                    "bg-primary",
                    "bg-primary/80",
                    "bg-primary/60",
                    "bg-primary/40",
                    "bg-primary/20",
                  ];
                  return (
                    <div key={uni.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="truncate max-w-[190px] text-muted-foreground flex gap-1.5 items-center">
                          <School className="h-3 w-3 shrink-0 text-muted-foreground" />
                          {uni.name}
                        </span>
                        <span className="font-mono text-foreground">
                          {uni.count} Peserta
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full ${colors[idx % colors.length]} rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Event Information */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <div className="flex gap-2 items-center">
                <Info className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">
                  Informasi Acara
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs space-y-2 text-muted-foreground">
              <div className="flex justify-between py-1 border-b border-muted">
                <span>Nama Event:</span>
                <span className="font-medium text-foreground">SEMTIK 2026</span>
              </div>
              <div className="flex justify-between py-1 border-b border-muted">
                <span>Tanggal Pelaksanaan:</span>
                <span className="font-medium text-foreground">
                  15 September 2026
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Status Sinkronisasi:</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Aktif
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Participant Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedParticipant && (
          <DialogContent className="sm:max-w-md border-border bg-popover text-foreground">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                Detail Profil Peserta
              </DialogTitle>
              <DialogDescription>
                Informasi detail biodata dan status absensi peserta.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-3">
              {/* Header profile info */}
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                  {selectedParticipant.nama.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-base">
                    {selectedParticipant.nama}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {selectedParticipant.email}
                  </p>
                </div>
              </div>

              {/* Grid detail */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block mb-0.5">
                    NIM
                  </span>
                  <span className="font-mono font-medium">
                    {selectedParticipant.nim}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">
                    Universitas
                  </span>
                  <span className="font-medium flex items-center gap-1">
                    <School className="h-3 w-3 text-muted-foreground shrink-0" />
                    {selectedParticipant.universitas}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">
                    Fakultas
                  </span>
                  <span className="font-medium">
                    {selectedParticipant.fakultas}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">
                    Program Studi
                  </span>
                  <span className="font-medium">
                    {selectedParticipant.prodi}
                  </span>
                </div>
              </div>

              {/* Status Section */}
              <div className="mt-2 rounded-xl p-3 bg-muted/50 border border-border flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">
                    Status Kehadiran:
                  </span>
                  <Badge
                    variant={
                      selectedParticipant.attendance.status === "hadir"
                        ? "default"
                        : "outline"
                    }
                    className={
                      selectedParticipant.attendance.status === "hadir"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-0"
                    }
                  >
                    {selectedParticipant.attendance.status.toUpperCase()}
                  </Badge>
                </div>
                {selectedParticipant.attendance.status === "hadir" && (
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-muted-foreground/10">
                    <span className="text-muted-foreground">Waktu Masuk:</span>
                    <span className="font-mono text-foreground font-semibold">
                      {new Date(
                        selectedParticipant.attendance.checkedInAt!,
                      ).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "medium",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setIsDialogOpen(false)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 font-medium"
              >
                Tutup
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
