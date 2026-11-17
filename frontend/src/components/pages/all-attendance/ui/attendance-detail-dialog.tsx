import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AttendanceParticipant } from '@/api/attendance';
import {
  Users,
  Building2,
  GraduationCap,
  Calendar,
  Mail,
  Store,
  MapPin,
  Briefcase,
  Globe,
  School,
} from 'lucide-react';
import QRCode from 'react-qr-code';

interface AttendanceDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  participant: AttendanceParticipant | null;
}

export function AttendanceDetailDialog({
  isOpen,
  onOpenChange,
  participant,
}: AttendanceDetailDialogProps) {
  if (!participant) return null;

  const isUmkm = participant.kategori === 'umkm';
  const isOnline = participant.jenisKehadiran?.toLowerCase() === 'online';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md border-border bg-popover text-foreground'>
        <DialogHeader>
          <DialogTitle className='text-lg font-bold flex items-center gap-2'>
            <Users className='h-5 w-5 text-primary' />
            Profil Presensi Peserta
          </DialogTitle>
          <DialogDescription className='text-xs text-muted-foreground'>
            Informasi detail biodata dan status presensi peserta event SEMTIK.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-2'>
          {/* Header profile info */}
          <div className='flex items-center gap-3.5 pb-3 border-b border-border'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-base border border-primary/20'>
              {participant.nama.substring(0, 2).toUpperCase()}
            </div>
            <div className='flex flex-col min-w-0 flex-1'>
              <div className='flex items-center gap-1.5 flex-wrap'>
                <h4 className='font-bold text-base text-foreground truncate'>
                  {participant.nama}
                </h4>
              </div>
              <p className='text-xs text-muted-foreground truncate'>
                {participant.email}
              </p>
              {/* Badges bar */}
              <div className='flex items-center gap-1.5 mt-1.5 flex-wrap'>
                <Badge
                  variant='outline'
                  className={`text-[10px] px-2 py-0.2 font-medium inline-flex items-center gap-1 ${
                    isUmkm
                      ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20'
                      : 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20'
                  }`}
                >
                  {isUmkm ? (
                    <Store className='h-2.5 w-2.5' />
                  ) : (
                    <GraduationCap className='h-2.5 w-2.5' />
                  )}
                  {isUmkm ? 'UMKM' : 'Mahasiswa'}
                </Badge>

                <Badge
                  variant='outline'
                  className={`text-[10px] px-2 py-0.2 font-medium inline-flex items-center gap-1 ${
                    isOnline
                      ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20'
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                  }`}
                >
                  {isOnline ? (
                    <Globe className='h-2.5 w-2.5' />
                  ) : (
                    <MapPin className='h-2.5 w-2.5' />
                  )}
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Grid details */}
          <div className='grid grid-cols-2 gap-3 text-xs'>
            <div className='bg-muted/30 p-2.5 rounded-lg border border-border/50'>
              <span className='text-muted-foreground block text-[11px] mb-0.5'>
                {isUmkm ? 'Kategori Peserta' : 'NIM Mahasiswa'}
              </span>
              <span className='font-mono font-semibold text-foreground'>
                {isUmkm ? 'UMKM Mitra' : participant.nim || '-'}
              </span>
            </div>

            <div className='bg-muted/30 p-2.5 rounded-lg border border-border/50'>
              <span className='text-muted-foreground block text-[11px] mb-0.5'>
                Status Presensi
              </span>
              <Badge
                variant={
                  participant.attendance?.status === 'hadir'
                    ? 'default'
                    : 'outline'
                }
                className={
                  participant.attendance?.status === 'hadir'
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0'
                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-0'
                }
              >
                {(
                  participant.attendance?.status || 'belum hadir'
                ).toUpperCase()}
              </Badge>
            </div>

            {isUmkm ? (
              <>
                <div className='bg-muted/30 p-2.5 rounded-lg border border-border/50'>
                  <span className='text-muted-foreground block text-[11px] mb-0.5 flex items-center gap-1'>
                    <Briefcase className='h-3 w-3 text-muted-foreground' />
                    Bidang Usaha
                  </span>
                  <span className='font-medium text-foreground'>
                    {participant.bidang || '-'}
                  </span>
                </div>

                <div className='bg-muted/30 p-2.5 rounded-lg border border-border/50'>
                  <span className='text-muted-foreground block text-[11px] mb-0.5 flex items-center gap-1'>
                    <MapPin className='h-3 w-3 text-muted-foreground' />
                    Kota / Domisili
                  </span>
                  <span className='font-medium text-foreground'>
                    {participant.kota || '-'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className='bg-muted/30 p-2.5 rounded-lg border border-border/50 col-span-2'>
                  <span className='text-muted-foreground block text-[11px] mb-0.5 flex items-center gap-1'>
                    <School className='h-3 w-3 text-muted-foreground' />
                    Universitas / Perguruan Tinggi
                  </span>
                  <span className='font-medium text-foreground'>
                    {participant.universitas || '-'}
                  </span>
                </div>

                <div className='bg-muted/30 p-2.5 rounded-lg border border-border/50'>
                  <span className='text-muted-foreground block text-[11px] mb-0.5 flex items-center gap-1'>
                    <Building2 className='h-3 w-3 text-muted-foreground' />
                    Fakultas
                  </span>
                  <span className='font-medium text-foreground'>
                    {participant.fakultas || '-'}
                  </span>
                </div>

                <div className='bg-muted/30 p-2.5 rounded-lg border border-border/50'>
                  <span className='text-muted-foreground block text-[11px] mb-0.5 flex items-center gap-1'>
                    <GraduationCap className='h-3 w-3 text-muted-foreground' />
                    Program Studi
                  </span>
                  <span className='font-medium text-foreground'>
                    {participant.prodi || '-'}
                  </span>
                </div>
              </>
            )}

            {participant.isEmailSent && (
              <div className='bg-muted/30 p-2.5 rounded-lg border border-border/50 col-span-2'>
                <span className='text-muted-foreground block text-[11px] mb-0.5 flex items-center gap-1'>
                  <Mail className='h-3 w-3 text-muted-foreground' />
                  Status Email Undangan
                </span>
                <span className='font-medium text-foreground flex items-center gap-1.5'>
                  <Badge
                    variant='outline'
                    className='text-[10px] bg-indigo-50/50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800'
                  >
                    Terkirim
                  </Badge>
                  {participant.emailSentAt && (
                    <span className='text-muted-foreground text-[10px]'>
                      {new Date(participant.emailSentAt).toLocaleDateString(
                        'id-ID',
                      )}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* QR Code Section */}
          <div className='flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-50 rounded-xl border border-border/50 shadow-sm my-1'>
            <QRCode
              value={participant.qrCode}
              size={140}
              level='M'
              className='mb-3 rounded-md'
            />
            <div className='text-center'>
              <span className='text-[11px] text-slate-500 font-medium uppercase tracking-wider block mb-1'>
                QR Code Identitas
              </span>
              <Badge
                variant='secondary'
                className='font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-700 border-slate-200'
              >
                {participant.qrCode}
              </Badge>
            </div>
          </div>

          {/* Timestamp Card */}
          <div className='rounded-xl p-3.5 bg-muted/40 border border-border flex items-center justify-between'>
            <div className='flex items-center gap-2 text-xs'>
              <Calendar className='h-4 w-4 text-primary' />
              <span className='text-muted-foreground'>
                Waktu Check-in:
              </span>
            </div>
            <span className='font-mono text-xs font-semibold text-foreground'>
              {participant.attendance?.checkedInAt
                ? new Date(participant.attendance.checkedInAt).toLocaleString(
                    'id-ID',
                    {
                      dateStyle: 'medium',
                      timeStyle: 'medium',
                    },
                  )
                : '- Belum Check-in -'}
            </span>
          </div>
        </div>

        <div className='flex justify-end gap-2 pt-2 border-t border-border'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='text-xs h-9 cursor-pointer'
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
