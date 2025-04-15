"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type MobileNavToggleProps = {
  isOpen: boolean;
  toggle: () => void;
};

export function HeaderMobileNavToggle({
  isOpen,
  toggle,
}: MobileNavToggleProps) {
  return (
    <div className="flex items-center sm:hidden">
      <Button
        onClick={toggle}
        variant="ghost"
        className="p-2 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        aria-label="Toggle navigation"
      >
        {isOpen ? <X /> : <Menu />}
      </Button>
    </div>
  );
}
