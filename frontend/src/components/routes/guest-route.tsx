import { Navigate, Outlet } from "react-router";
import { authClient } from "@/lib/auth-client";

export function GuestRoute() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (session) {
    return <Navigate to="/overview" replace />;
  }

  return <Outlet />;
}
