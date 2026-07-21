import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { routeData } from "@/components/layouts/app-sidebar";

export default function DashboardLayout() {
  const { pathname } = useLocation();

  const current = routeData.navMain
    .flatMap((r) =>
      r.items.map((c) => ({
        parent: r,
        child: c,
      })),
    )
    .find((r) => r.child.url === pathname);

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {/* Parents */}
                {current && (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      {current.parent.title}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                )}

                {/* Children */}
                {current && (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{current.child.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <main className="flex-1">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
