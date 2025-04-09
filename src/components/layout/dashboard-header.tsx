"use client";
import { Button } from "@/components/ui/button";
import { SidebarMobileToggle } from "@/components/elements/sidebar-mobile-toggle";

export const DashboardHeader = () => {
  return (
    <header className="relative flex items-center justify-between border-b px-4 py-4">
      <h2> Dashboard Header</h2>

      <div className="flex gap-2">
        <Button variant={"ghost"}>Log in</Button>
        <Button className="hover:bg-emerald-500 hover:text-white">
          Sign Up
        </Button>
      </div>

      <SidebarMobileToggle />
    </header>
  );
};
