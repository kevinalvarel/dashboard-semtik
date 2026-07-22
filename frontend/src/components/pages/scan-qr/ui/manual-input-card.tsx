import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Keyboard, RefreshCw, UserCheck } from "lucide-react";

interface ManualInputCardProps {
  manualCode: string;
  isPending: boolean;
  onCodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ManualInputCard({
  manualCode,
  isPending,
  onCodeChange,
  onSubmit,
}: ManualInputCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Keyboard className="h-4 w-4 text-primary" /> Input QR Code / Token
          Manual
        </CardTitle>
        <CardDescription>
          Gunakan opsi ini jika scanner kamera berkendala atau untuk pengujian
          kode secara langsung.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Kode QR / Token Peserta
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Masukkan token QR (contoh: SEMTIK-12345)"
                value={manualCode}
                onChange={(e) => onCodeChange(e.target.value)}
                disabled={isPending}
                className="font-mono"
              />
              <Button
                type="submit"
                disabled={isPending || !manualCode.trim()}
                className="gap-2"
              >
                {isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <UserCheck className="h-4 w-4" />
                )}
                Check-in
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
