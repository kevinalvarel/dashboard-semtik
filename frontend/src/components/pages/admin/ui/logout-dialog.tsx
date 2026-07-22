import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

// shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut, AlertTriangle } from "lucide-react";

interface LogoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutDialog({ isOpen, onOpenChange }: LogoutDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut();
      toast.success("Anda telah keluar dari akun admin");
      onOpenChange(false);
      navigate("/");
    } catch (error) {
      toast.error("Gagal melakukan proses logout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-popover text-foreground">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Konfirmasi Keluar Sesi
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Apakah Anda yakin ingin keluar dari akun admin? Anda harus login kembali untuk mengakses dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="text-xs h-9 cursor-pointer"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoading}
            className="text-xs h-9 cursor-pointer gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            {isLoading ? "Keluar..." : "Ya, Keluar Akun"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
