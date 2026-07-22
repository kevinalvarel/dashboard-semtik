import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, RefreshCw, Sparkles } from "lucide-react";

interface ScanQRHeaderProps {
  isCameraActive: boolean;
  onToggleCamera: () => void;
  onToggleFacingMode: () => void;
}

export function ScanQRHeader({
  isCameraActive,
  onToggleCamera,
  onToggleFacingMode,
}: ScanQRHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Scan QR Code Absensi
          </h1>
          <Badge variant="outline" className="gap-1 text-xs">
            <Sparkles className="h-3 w-3 text-primary" /> Live Scanner
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Arahkan kamera ke QR Code peserta atau masukkan kode manual untuk
          mencatat kehadiran.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={isCameraActive ? "destructive" : "default"}
          size="sm"
          onClick={onToggleCamera}
          className="gap-2"
        >
          {isCameraActive ? (
            <>
              <CameraOff className="h-4 w-4" /> Matikan Kamera
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" /> Aktifkan Kamera
            </>
          )}
        </Button>

        {isCameraActive && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFacingMode}
            className="gap-2"
            title="Ganti Kamera"
          >
            <RefreshCw className="h-4 w-4" /> Ganti Kamera
          </Button>
        )}
      </div>
    </div>
  );
}
