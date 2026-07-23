import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { scanAttendance } from "@/api/attendance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Keyboard } from "lucide-react";

import { ScanQRHeader } from "@/components/pages/scan-qr/ui/scan-qr-header";
import { QRViewfinder } from "@/components/pages/scan-qr/ui/qr-viewfinder";
import { ManualInputCard } from "@/components/pages/scan-qr/ui/manual-input-card";
import { ScanResultCard } from "@/components/pages/scan-qr/ui/scan-result-card";
import { ScanHistoryCard } from "@/components/pages/scan-qr/ui/scan-history-card";
import { playBeep } from "@/components/pages/scan-qr/types";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import type {
  RecentScan,
  ScanResultState,
} from "@/components/pages/scan-qr/types";

export default function ScanQRPage() {
  const queryClient = useQueryClient();
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment",
  );
  const [manualCode, setManualCode] = useState<string>("");
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [lastResult, setLastResult] = useState<ScanResultState>({
    status: "idle",
    message: "",
  });

  const lastScannedRef = useRef<{ code: string; time: number }>({
    code: "",
    time: 0,
  });

  const scanMutation = useMutation({
    mutationFn: (code: string) => scanAttendance(code),
    onSuccess: (res, code) => {
      const now = new Date();
      queryClient.invalidateQueries({ queryKey: ["attendance"] });

      if (res.success) {
        playBeep("success");
        toast.success("Check-in Berhasil!", { description: res.message });

        setLastResult({
          status: "success",
          message: res.message,
          participant: res.data,
          scannedAt: now,
        });

        setRecentScans((prev) => [
          {
            id: Math.random().toString(36).substring(2, 9),
            qrCode: code,
            status: "success",
            message: res.message,
            participant: res.data,
            scannedAt: now,
          },
          ...prev.slice(0, 19),
        ]);
      } else {
        if (res.message && res.message.includes("sudah")) {
          playBeep("warning");
          toast.warning("Sudah Check-in", { description: res.message });

          setLastResult({
            status: "warning",
            message: res.message,
            participant: res.data,
            scannedAt: now,
          });

          setRecentScans((prev) => [
            {
              id: Math.random().toString(36).substring(2, 9),
              qrCode: code,
              status: "warning",
              message: res.message,
              participant: res.data,
              scannedAt: now,
            },
            ...prev.slice(0, 19),
          ]);
        } else {
          playBeep("error");
          toast.error("Gagal Check-in", {
            description: res.message || "QR Code tidak valid",
          });

          setLastResult({
            status: "error",
            message: res.message || "QR Code tidak ditemukan / tidak valid",
            scannedAt: now,
          });

          setRecentScans((prev) => [
            {
              id: Math.random().toString(36).substring(2, 9),
              qrCode: code,
              status: "error",
              message: res.message || "QR Code tidak ditemukan",
              scannedAt: now,
            },
            ...prev.slice(0, 19),
          ]);
        }
      }
    },
    onError: (err: any) => {
      playBeep("error");
      const msg = err?.message || "Terjadi kesalahan saat memproses data";
      toast.error("Server Error", { description: msg });
      setLastResult({
        status: "error",
        message: msg,
        scannedAt: new Date(),
      });
    },
  });

  const handleScan = useCallback(
    (data: IDetectedBarcode[] | { text: string } | string | null) => {
      if (!data || scanMutation.isPending) return;

      let scannedText: string | undefined;
      if (Array.isArray(data)) {
        scannedText = data[0]?.rawValue;
      } else if (typeof data === "string") {
        scannedText = data;
      } else if (data && "text" in data) {
        scannedText = data.text;
      }

      if (!scannedText || typeof scannedText !== "string") return;

      const cleanCode = scannedText.trim();
      if (!cleanCode) return;

      const now = Date.now();
      if (
        lastScannedRef.current.code === cleanCode &&
        now - lastScannedRef.current.time < 2500
      ) {
        return;
      }

      lastScannedRef.current = { code: cleanCode, time: now };
      scanMutation.mutate(cleanCode);
    },
    [scanMutation],
  );

  const handleError = useCallback((err: any) => {
    console.error("Camera scanner error:", err);
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      toast.error("Masukkan kode QR / Token terlebih dahulu");
      return;
    }
    scanMutation.mutate(manualCode.trim());
    setManualCode("");
  };

  const toggleCamera = () => {
    setIsCameraActive((prev) => !prev);
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
      <ScanQRHeader
        isCameraActive={isCameraActive}
        onToggleCamera={toggleCamera}
        onToggleFacingMode={toggleFacingMode}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Scanner & Manual Input */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Tabs defaultValue="scanner" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scanner" className="gap-2">
                <QrCode className="h-4 w-4" /> Kamera Scanner
              </TabsTrigger>
              <TabsTrigger value="manual" className="gap-2">
                <Keyboard className="h-4 w-4" /> Input Manual
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scanner" className="mt-4">
              <QRViewfinder
                isCameraActive={isCameraActive}
                facingMode={facingMode}
                isPending={scanMutation.isPending}
                onScan={handleScan}
                onError={handleError}
                onToggleCamera={toggleCamera}
              />
            </TabsContent>

            <TabsContent value="manual" className="mt-4">
              <ManualInputCard
                manualCode={manualCode}
                isPending={scanMutation.isPending}
                onCodeChange={setManualCode}
                onSubmit={handleManualSubmit}
              />
            </TabsContent>
          </Tabs>

          <ScanResultCard lastResult={lastResult} />
        </div>

        {/* Right Column: Scan Session History */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <ScanHistoryCard recentScans={recentScans} />
        </div>
      </div>
    </div>
  );
}
