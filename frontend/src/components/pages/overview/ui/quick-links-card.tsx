import { Link } from "react-router-dom";
import { QrCode, Users, ArrowUpRight, Settings } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickLinksCard() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
        <CardTitle className="text-sm sm:text-base font-semibold">Tautan Cepat</CardTitle>
        <CardDescription className="text-xs">
          Akses menu penting administrasi dengan cepat.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 grid gap-2">
        <Link to="/scan-qr" className="w-full">
          <Button
            variant="outline"
            className="w-full justify-between hover:bg-accent hover:text-accent-foreground text-xs sm:text-sm h-9 sm:h-10 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <QrCode className="h-4 w-4 text-primary" />
              Scan QR Presensi
            </span>
            <ArrowUpRight className="h-4 w-4 opacity-50" />
          </Button>
        </Link>
        <Link to="/all-attendance" className="w-full">
          <Button
            variant="outline"
            className="w-full justify-between hover:bg-accent hover:text-accent-foreground text-xs sm:text-sm h-9 sm:h-10 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Kelola Kehadiran
            </span>
            <ArrowUpRight className="h-4 w-4 opacity-50" />
          </Button>
        </Link>
        <Link to="/admin" className="w-full">
          <Button
            variant="outline"
            className="w-full justify-between hover:bg-accent hover:text-accent-foreground text-xs sm:text-sm h-9 sm:h-10 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              Pengaturan Admin
            </span>
            <ArrowUpRight className="h-4 w-4 opacity-50" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
