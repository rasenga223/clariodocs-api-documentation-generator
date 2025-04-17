"use client";
import { usePathname } from "next/navigation";
import { SidebarMobileToggle } from "@/components/elements/sidebar-mobile-toggle";
import { DashboardHeaderAuth } from "@/components/elements/dashboard-header-auth";

export const DashboardHeader = () => {
  const pathname = usePathname();

  const headerTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/profile": "Profile",
    "/editor": "Editor",
    "/editor-test": "Editor",
  };

  const title = headerTitles[pathname] || "Dashboard Header";

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b">
      <h1 className="font-bold text-zinc-300">{title}</h1>
      <DashboardHeaderAuth />
    </header>
  );
};
