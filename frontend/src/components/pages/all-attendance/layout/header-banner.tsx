import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, QrCode, Mail } from "lucide-react";

interface HeaderBannerProps {
  isFetching: boolean;
  onRefetch: () => void;
  onExportCSV: () => void;
  onSendEmailAll?: () => void;
  isSendingEmail?: boolean;
}

export function HeaderBanner({
  isFetching,
  onRefetch,
  onExportCSV,
  onSendEmailAll,
  isSendingEmail,
}: HeaderBannerProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Data Kehadiran Peserta
          </h1>
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5"
          >
            Real-time
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Monitoring dan pengelolaan seluruh presensi pendaftar SEMTIK secara terpusat.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefetch}
          disabled={isFetching}
          className="h-9 gap-1.5 text-xs font-medium border-border hover:bg-accent cursor-pointer"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-primary" : ""}`}
          />
          {isFetching ? "Memuat..." : "Refresh"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExportCSV}
          className="h-9 gap-1.5 text-xs font-medium border-border hover:bg-accent cursor-pointer hidden sm:flex"
        >
          <Download className="h-3.5 w-3.5 text-primary" />
          Export CSV
        </Button>

        {onSendEmailAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSendEmailAll}
            disabled={isSendingEmail}
            className="h-9 gap-1.5 text-xs font-medium border-border hover:bg-accent cursor-pointer text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
          >
            <Mail className={`h-3.5 w-3.5 ${isSendingEmail ? "animate-pulse" : ""}`} />
            {isSendingEmail ? "Mengirim..." : "Kirim Email ke Semua"}
          </Button>
        )}

        <Link to="/scan-qr">
          <Button
            size="sm"
            className="h-9 gap-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            <QrCode className="h-3.5 w-3.5" />
            Scan Presensi
          </Button>
        </Link>
      </div>
    </div>
  );
}
