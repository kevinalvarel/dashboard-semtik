import * as React from "react";

import { SearchForm } from "./search-form";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

export const routeData = {
  navMain: [
    {
      title: "Dashboard",
      items: [
        {
          title: "Overview",
          url: "/overview",
        },
        {
          title: "Analytics",
          url: "/analytics",
        },
      ],
    },
    {
      title: "Peserta",
      items: [
        {
          title: "Daftar Peserta",
          url: "/participants",
        },
        {
          title: "Export Data",
          url: "/export",
        },
      ],
    },
    {
      title: "Absensi",
      items: [
        {
          title: "Scan QR",
          url: "/scan-qr",
        },
        {
          title: "Riwayat Absensi",
          url: "/history",
        },
        {
          title: "Semua Kehadiran",
          url: "/all-attendance",
        },
      ],
    },
    {
      title: "Pengaturan",
      items: [
        {
          title: "Admin",
          url: "/admin",
        },
      ],
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <span className="px-2 text-lg font-bold">Atmin Semtik</span>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {routeData.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={pathname === item.url}
                      render={<a href={item.url} />}
                    >
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
