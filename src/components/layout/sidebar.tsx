"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import {
  FileText,
  Home,
  User as UserIcon,
  LogOut,
  BookOpen,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import type { User } from "@/types/user";
import Link from "next/link";
import { useAuth } from "@/provider/auth";

import { Button } from "@/components/ui/button";
import { SidebarItem } from "@/components/elements/sidebar-item";
import { useSidebar } from "@/provider/sidebar";
import { useIsMobile } from "@/hooks/use-ismobile";
import { cn } from "@/lib/utils";

const ITEMS = [
  { id: 1, label: "Dashboard", Icon: Home, link: "/dashboard" },
  { id: 2, label: "Generate Docs", Icon: BookOpen, link: "/api-doc-generator/generate" },
  { id: 3, label: "Editor", Icon: FileText, link: "/editor" },
];

export const Sidebar = () => {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const { isOpen, openSidebar, closeSidebar, toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();

  // Get first initial of email
  const getInitial = (email?: string) => {
    return email ? email.charAt(0).toUpperCase() : "U";
  };

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

  // Prevent hydration mismatch
  if (!hasMounted) {
    return null;
  }

  // SIDEBAR MOTION VARIANTS
  const SIDEBAR_VARIANTS = {
    open: {
      x: 0,
      width: "16rem",
      transition: {
        x: { duration: 0.2, ease: "easeOut" },
        width: { delay: isMobile ? 0.1 : 0, duration: 0.2, ease: "easeOut" },
      },
    },
    closed: {
      x: isMobile ? "-100%" : 0,
      width: isMobile ? "0rem" : "5rem",
      transition: {
        x: { duration: 0.2, ease: "easeIn" },
        width: { duration: 0.2, ease: "easeIn" },
      },
    },
  };

  return (
    <motion.aside
      ref={sidebarRef}
      className={cn(
        "z-50 h-svh min-w-20 space-y-8 p-4 max-md:absolute md:z-50 md:space-y-4",
        "bg-zinc-100/80 dark:bg-[#0b0b0b]/60 backdrop-blur-xl",
        !isOpen && isMobile && "pointer-events-none",
      )}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={SIDEBAR_VARIANTS}
      role="navigation"
      aria-label="Main navigation"
      {...(!isMobile
        ? { onMouseEnter: openSidebar, onMouseLeave: closeSidebar }
        : {})}
      tabIndex={-1}
    >
      <div className="flex flex-col h-full">
        {/* User Profile */}
        <Link 
          href="/profile"
          className={cn(
            "mb-6 relative group",
            "transition-all duration-300 ease-in-out",
          )}
        >
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-xl",
            "transition-all duration-300 ease-in-out",
            "hover:bg-accent/50",
            !isOpen && "justify-center"
          )}>
            <div className={cn(
              "flex items-center justify-center shrink-0",
              "w-10 h-10 rounded-full",
              "bg-gradient-to-br from-primary/80 to-primary",
              "text-sm font-medium text-primary-foreground",
              "ring-2 ring-border/50 shadow-sm",
              "transition-all duration-300 ease-in-out",
              "group-hover:shadow-md group-hover:ring-border"
            )}>
              {getInitial(user?.email)}
            </div>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex flex-col overflow-hidden"
              >
                <span className={cn(
                  "text-sm font-medium truncate transition-colors duration-300",
                  "text-foreground/80 group-hover:text-foreground"
                )}>
                  {user?.email}
                </span>
                <span className={cn(
                  "text-xs truncate transition-colors duration-300",
                  "text-muted-foreground/70 group-hover:text-muted-foreground"
                )}>
                  {user?.email}
                </span>
              </motion.div>
            )}
          </div>
        </Link>

        <menu
          className={cn(
            "flex flex-col items-start justify-start gap-2 font-medium tracking-wide",
            isOpen && "md:items-start",
          )}
          role="menu"
        >
          {ITEMS.map((item) => {
            const isActive = pathname === item.link;
            return (
              <li key={item.id} onClick={toggleSidebar} className="w-full">
                <SidebarItem {...item} isActive={isActive} />
              </li>
            );
          })}
        </menu>

        {/* Theme Switcher */}
        <div className="flex justify-center pt-4 mt-auto">
          <button
            onClick={() => {
              const newTheme = theme === "dark" ? "light" : "dark";
              setTheme(newTheme);
            }}
            className={cn(
              "relative flex items-center rounded-full transition-all duration-300 overflow-hidden",
              isOpen ? "w-[120px] p-1" : "w-10 p-1",
              "bg-secondary border border-border/50"
            )}
            aria-label="Toggle theme"
          >
            {/* Sliding background */}
            <div
              className={cn(
                "absolute top-0 bottom-0 w-[60px] rounded-full bg-accent transition-all duration-300 z-0",
                isOpen ? (
                  theme === "dark" ? "left-0" : "left-[60px]"
                ) : "w-full left-0"
              )}
            />
            
            {isOpen ? (
              // Expanded state with both icons
              <>
                <span className={cn(
                  "flex h-8 w-[60px] items-center justify-center transition-colors duration-300 relative z-10",
                  theme === "dark" ? "text-primary-foreground font-medium" : "text-muted-foreground"
                )}>
                  <Moon className="w-4 h-4" />
                </span>
                <span className={cn(
                  "flex h-8 w-[60px] items-center justify-center transition-colors duration-300 relative z-10",
                  theme === "light" ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  <Sun className="w-4 h-4" />
                </span>
              </>
            ) : (
              // Collapsed state with active icon
              <div className="relative z-10 flex items-center justify-center w-8 h-8">
                {theme === "dark" ? (
                  <Moon className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <Sun className="w-4 h-4 text-foreground" />
                )}
              </div>
            )}
          </button>
        </div>

        {/* Logout button */}
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            className={cn(
              "flex items-center gap-4 p-3 text-muted-foreground/70 hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors font-medium tracking-wide",
              !isOpen && "justify-center",
              isOpen ? "w-full" : "w-12"
            )}
            onClick={async () => {
              try {
                await signOut();
              } catch (error) {
                console.error("Error signing out:", error);
              }
            }}
          >
            <LogOut className="w-4 h-4" />
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden font-medium tracking-wide whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </Button>
        </div>
      </div>
    </motion.aside>
  );
};
