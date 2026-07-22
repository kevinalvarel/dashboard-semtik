import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, ShieldCheck } from "lucide-react";

interface HeaderBannerProps {
  onOpenLogout: () => void;
}

export function HeaderBanner({ onOpenLogout }: HeaderBannerProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Kelola Admin & Sesi
          </h1>
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5"
          >
            <ShieldCheck className="h-3 w-3 mr-1" />
            Super Admin
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Pengaturan akun pengelola dan kontrol akses otentikasi dashboard SEMTIK.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={onOpenLogout}
          className="h-9 gap-1.5 text-xs font-medium cursor-pointer shadow-xs"
        >
          <LogOut className="h-3.5 w-3.5" />
          Keluar (Logout)
        </Button>
      </div>
    </div>
  );
}
