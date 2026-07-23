import { Navigate, Outlet } from "react-router";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";

export function ProtectedRoute() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
