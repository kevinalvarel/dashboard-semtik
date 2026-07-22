import { Link } from "react-router-dom";
import { QrCode, Users, FileSpreadsheet, ArrowUpRight } from "lucide-react";
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
      <CardHeader>
        <CardTitle className="text-base font-semibold">Tautan Cepat</CardTitle>
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
  );
}
