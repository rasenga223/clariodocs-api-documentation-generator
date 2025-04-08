"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useIsMobile } from "@/hooks/use-ismobile";
import { useSidebar } from "@/provider/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
}

export const SidebarItem = ({ icon, label }: SidebarItemProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const { isOpen } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <Button
      type="button"
      variant={"ghost"}
      className="h-auto w-full cursor-pointer justify-start gap-4 rounded-md p-2 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      aria-label={label}
      role="menuitem"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <span
        className={cn(
          "flex aspect-square min-w-8 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800/50",
          isFocused &&
            "text-primary-300 ring-primary-300 dark:text-primary-100 dark:ring-primary-100 ring-2",
        )}
        aria-hidden="true"
      >
        {icon}
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
              "overflow-hidden whitespace-nowrap",
              isFocused &&
                "text-primary-300 dark:text-primary-100 font-semibold",
            )}
            aria-hidden={!isOpen}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
};
