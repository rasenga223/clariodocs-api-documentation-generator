"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useIsMobile } from "@/hooks/use-ismobile";
import { useSidebar } from "@/provider/sidebar";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  Icon: React.ElementType;
  label: string;
  link: string;
  isActive: boolean;
}

export const SidebarItem = ({
  Icon,
  label,
  link,
  isActive,
}: SidebarItemProps) => {
  const isMobile = useIsMobile();
  const { isOpen } = useSidebar();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Link
      href={link}
      aria-labelledby={label}
      className={cn(
        "group flex h-auto w-full cursor-pointer items-center justify-start gap-4 rounded-none p-2 py-1.5 text-sm",
        "focus-visible:ring-0 focus-visible:ring-offset-0",
      )}
      aria-label={label}
      role="menuitem"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <span
        className={cn(
          "flex aspect-square min-w-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-500 group-hover:text-zinc-100 dark:bg-zinc-800/50",
          isFocused && "text-zinc-100 ring-2 ring-emerald-500",
          isActive &&
            "bg-emerald-500 text-zinc-100 ring-2 ring-emerald-500 dark:bg-emerald-500/80",
        )}
        aria-hidden="true"
      >
        <Icon size={20} />
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{
              opacity: 1,
              width: "auto",
              transition: { duration: 0.3, delay: isMobile ? 0.5 : 0 },
            }}
            exit={{
              opacity: 0,
              width: 0,
              transition: { duration: 0.3 },
            }}
            className={cn(
              "overflow-hidden whitespace-nowrap text-zinc-400 transition-colors group-hover:!text-white",
              (isFocused || isActive) &&
                "font-semibold text-emerald-500 dark:text-emerald-500",
            )}
            aria-hidden={!isOpen}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
};
