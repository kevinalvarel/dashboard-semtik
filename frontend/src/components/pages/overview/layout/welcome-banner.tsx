import { Link } from "react-router-dom";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WelcomeBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Atmin Dashboard
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
  );
}
