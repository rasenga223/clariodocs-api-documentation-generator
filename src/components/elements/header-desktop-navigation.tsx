"use client";

import { Link } from "@/components/ui/link";

type NavLink = {
  name: string;
  href: string;
};

type DesktopNavigationProps = {
  links: NavLink[];
};

export function HeaderDesktopNavigation({ links }: DesktopNavigationProps) {
  return (
    <nav aria-label="Main navigation" className="hidden sm:block col-start-1">
      <ul className="flex items-center gap-8">
        {links.map(link => (
          <li key={link.name}>
            <Link href={link.href} className="rounded px-2 py-1 text-white/90 transition-colors hover:text-white focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
