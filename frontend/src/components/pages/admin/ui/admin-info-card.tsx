import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Users, Key } from "lucide-react";

export function AdminInfoCard() {
  return (
    <Card className="border-border bg-card shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Petunjuk Keamanan Admin
            </CardTitle>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-0 text-[11px]">
              Sistem Aktif
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3 text-xs text-muted-foreground">
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/30 border border-border/40">
            <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground block">Password Kuat</span>
              <span>Gunakan kombinasi minimal 8 karakter dengan huruf, angka, dan simbol untuk keamanan maksimal akun admin.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/30 border border-border/40">
            <Users className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground block">Akses Terbatas</span>
              <span>Admin yang ditambahkan akan memiliki akses penuh ke manajemen presensi dan data pendaftar SEMTIK.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/30 border border-border/40">
            <Key className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground block">Manajemen Sesi</span>
              <span>Selalu lakukan logout saat selesai mengelola dashboard pada komputer bersama.</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
