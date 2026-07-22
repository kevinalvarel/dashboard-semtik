export interface Participant {
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

export interface Stats {
  totalPeserta: number;
  hadir: number;
  belumHadir: number;
  persentaseKehadiran: number;
}

export interface UniversityStat {
  name: string;
  count: number;
}
