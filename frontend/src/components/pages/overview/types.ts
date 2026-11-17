export interface Participant {
  id: string | number;
  nim?: string | number;
  nama: string;
  email: string;
  fakultas?: string;
  prodi?: string;
  universitas?: string;
  bidang?: string;
  kota?: string;
  kategori?: "mahasiswa" | "umkm";
  jenisKehadiran?: string;
  attendance: {
    status: string;
    checkedInAt: string | null;
  };
}

export interface Stats {
  totalPeserta: number;
  hadir: number;
  belumHadir: number;
  persentaseKehadiran: number;
  totalMahasiswa?: number;
  totalUmkm?: number;
  totalOnline?: number;
  totalOffline?: number;
}

export interface FacultyStat {
  name: string;
  count: number;
}
