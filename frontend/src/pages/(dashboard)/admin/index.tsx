import { useState } from "react";

// Modular Page Components
import { HeaderBanner } from "@/components/pages/admin/layout/header-banner";
import { AddAdminForm } from "@/components/pages/admin/ui/add-admin-form";
import { AdminInfoCard } from "@/components/pages/admin/ui/admin-info-card";
import { LogoutDialog } from "@/components/pages/admin/ui/logout-dialog";

export default function AdminPage() {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 bg-background text-foreground">
      {/* Header Banner Layout Component */}
      <HeaderBanner onOpenLogout={() => setIsLogoutOpen(true)} />

      {/* Main Grid Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Form Tambah Admin */}
        <AddAdminForm />

        {/* Right Column: Petunjuk & Keamanan Sesi Admin */}
        <AdminInfoCard />
      </div>

      {/* Logout Confirmation Dialog Modal */}
      <LogoutDialog
        isOpen={isLogoutOpen}
        onOpenChange={setIsLogoutOpen}
      />
    </div>
  );
}
