"use client";

import { motion, AnimatePresence } from "motion/react";
import { Link } from "@/components/ui/link";

type NavLink = {
  name: string;
  href: string;
};

type MobileNavMenuProps = {
  isOpen: boolean;
  links: NavLink[];
};

export function HeaderMobileNavMenu({ isOpen, links }: MobileNavMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          className="col-span-3 row-start-2 w-full sm:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <ul className="flex flex-col gap-2 pt-2">
            {links.map(link => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="block rounded px-2 py-1 text-white/90 transition-colors hover:text-white focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
