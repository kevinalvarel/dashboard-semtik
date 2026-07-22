export interface Participant {
  id: string | number;
  nim: string | number;
  nama: string;
  email: string;
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

export interface FacultyStat {
  name: string;
  count: number;
}

