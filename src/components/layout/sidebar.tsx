"use client";
import { useRef, useEffect, useState } from "react";
import { SidebarIcon } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { SidebarItem } from "@/components/elements/sidebar-item";
import { useSidebar } from "@/provider/sidebar";
import { useIsMobile } from "@/hooks/use-ismobile";
import { cn } from "@/lib/utils";

const ITEMS = [
  { id: 1, label: "Dashboard", icon: "D" },
  { id: 2, label: "Settings", icon: "S" },
  { id: 3, label: "Profile", icon: "P" },
];

export const Sidebar = () => {
  const isMobile = useIsMobile();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const { isOpen, toggleSidebar } = useSidebar();

  // Set the Component has mounted
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Handle FOCUS trap on mobile screens
  useEffect(() => {
    if (!isMobile) return;

    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    if (!isOpen) {
      sidebar.setAttribute("inert", "");
    } else {
      sidebar.removeAttribute("inert");
    }
  }, [isOpen, isMobile]);

  // SIDEBAR MOTION VARIANTS
  const SIDEBAR_VARIANTS = {
    open: {
      x: 0,
      width: "16rem",
      transition: {
        x: { duration: 0.5, ease: "easeInOut" },
        width: { delay: isMobile ? 0.3 : 0, duration: 0.5, ease: "easeInOut" },
      },
    },
    closed: {
      x: isMobile ? "-100%" : 0,
      width: isMobile ? "0rem" : "5rem",
      transition: {
        x: { duration: 0.5, ease: "easeInOut" },
        width: { duration: 0.5, ease: "easeInOut" },
      },
    },
  };

  return (
    <motion.aside
      ref={sidebarRef}
      className={cn(
        "dark:bg-background z-50 h-svh min-w-20 space-y-8 border-r bg-white p-4 max-md:absolute md:z-50 md:space-y-4",
        !isOpen && isMobile && "pointer-events-none",
      )}
      initial="closed"
      animate={isOpen && hasMounted ? "open" : "closed"}
      variants={SIDEBAR_VARIANTS}
      role="navigation"
      aria-label="Main navigation"
      tabIndex={-1}
    >
      <header className={cn("mr-1 grid place-content-end")}>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={toggleSidebar}
          className="aspect-square cursor-pointer shadow-sm max-lg:hidden"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isOpen}
        >
          <SidebarIcon />
        </Button>
      </header>

      <menu
        className={cn(
          "flex flex-col items-start justify-start gap-2",
          isOpen && "md:items-start",
        )}
        role="menu"
      >
        {/* SHOW a header only when open */}
        <motion.li
          initial={{ opacity: 0, width: 0 }}
          animate={{
            opacity: isOpen ? 1 : 0,
            width: isOpen ? "auto" : 0,
            height: isOpen ? "2rem" : 0,
            transition: { duration: 0.3, delay: isOpen ? 0.5 : 0 },
          }}
          className="ml-2 overflow-hidden whitespace-nowrap"
          aria-hidden={!isOpen}
        >
          {isOpen && hasMounted && "example@email.com"}
        </motion.li>

        {ITEMS.map((item) => (
          <li key={item.id} className="w-full">
            <SidebarItem icon={item.icon} label={item.label} />
          </li>
        ))}
      </menu>
    </motion.aside>
  );
};
