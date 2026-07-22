import QrScanner from "react-qr-scanner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, RefreshCw } from "lucide-react";

interface QRViewfinderProps {
  isCameraActive: boolean;
  facingMode: "environment" | "user";
  isPending: boolean;
  onScan: (data: { text: string } | string | null) => void;
  onError: (err: any) => void;
  onToggleCamera: () => void;
}

export function QRViewfinder({
  isCameraActive,
  facingMode,
  isPending,
  onScan,
  onError,
  onToggleCamera,
}: QRViewfinderProps) {
  return (
    <Card className="overflow-hidden border-2 shadow-sm">
      <CardHeader className="bg-muted/30 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" /> Viewfinder Scanner
            </CardTitle>
            <CardDescription>
              Posisikan QR Code di dalam area kotak pemindai
            </CardDescription>
          </div>
          {isCameraActive && (
            <Badge
              variant="secondary"
              className="animate-pulse bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            >
              ● Live
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        {isCameraActive ? (
          <div className="relative aspect-square sm:aspect-[4/3] bg-black/95 flex items-center justify-center overflow-hidden">
            <QrScanner
              delay={300}
              onError={onError}
              onScan={onScan}
              constraints={{
                video: { facingMode },
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* Viewfinder Overlay Frame */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-primary/80 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
                {/* Corner Markers */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />

                {/* Laser Line Pulse */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent absolute top-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_8px_#3b82f6]" />
              </div>
            </div>

            {isPending && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Memproses Check-in...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-square sm:aspect-[4/3] bg-muted/40 flex flex-col items-center justify-center p-6 text-center gap-4">
            <div className="p-4 rounded-full bg-muted">
              <CameraOff className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Kamera Dinonaktifkan</h3>
              <p className="text-sm text-muted-foreground max-w-xs mt-1">
                Aktifkan kamera untuk mulai memindai QR Code absensi peserta
                secara otomatis.
              </p>
            </div>
            <Button onClick={onToggleCamera} className="gap-2">
              <Camera className="h-4 w-4" /> Aktifkan Kamera Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
