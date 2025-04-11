"use client";
import { SidebarMobileToggle } from "@/components/elements/sidebar-mobile-toggle";
import { DashboardHeaderAuth } from "@/components/elements/dashboard-header-auth";

export const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <h2> Dashboard Header</h2>

      <DashboardHeaderAuth />
      <SidebarMobileToggle />
    </header>
  );
};
