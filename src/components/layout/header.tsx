"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { scrollY } = useScroll();
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Animate background opacity: 0 at top, up to 0.95 after scrolling 100px.
  const bgOpacity = useTransform(scrollY, [0, 100], [0.3, 0.95]);
  // Animate border opacity: 0 at top, up to 0.3 after 100px.
  const borderOpacity = useTransform(scrollY, [0, 100], [0.1, 0.3]);
  // Create a dynamic border color using zinc-800 RGB and animated opacity.
  const borderColor = useTransform(
    borderOpacity,
    (value) => `rgba(39, 39, 42, ${value})`,
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Navigation links
  const navigationLinks = [
    { name: "Features", href: "/features" },
    { name: "Examples", href: "/examples" },
    { name: "Pricing", href: "/pricing" },
    { name: "Documentation", href: "/docs" },
  ];

  return (
    <motion.header
      ref={headerRef}
      role="banner"
      aria-label="Site header"
      style={{
        backgroundColor: prefersReducedMotion
          ? "rgba(10,10,10,0.85)"
          : `rgba(10,10,10,${bgOpacity})`,
        borderColor: borderColor, 
      }}
      className={cn(
        "fixed inset-x-0 w-[calc(100%-2rem)] top-4 z-50 mx-auto max-w-7xl rounded-full border px-6 py-3 backdrop-blur-xl transition-all duration-300",
        "flex items-center justify-between"
      )}
    >
      {/* Brand section */}
      <Link 
        href="/" 
        className="group"
      >
        <span className="text-xl font-semibold text-transparent transition-colors bg-gradient-to-r from-white to-zinc-300 bg-clip-text hover:from-green-400 hover:to-emerald-500">
          Clariodocs
        </span>
      </Link>

      {/* Navigation */}
      <nav className="hidden md:block">
        <ul className="flex items-center gap-8">
          {navigationLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={cn(
                  "text-sm transition-colors",
                  pathname === link.href
                    ? "text-white font-medium"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* CTA Buttons */}
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium transition-colors rounded-lg text-zinc-400 hover:text-white"
        >
          Sign in
        </Link>
        <Link
          href="/login"
          className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.98]"
        >
          Get Started
        </Link>
      </div>
    </motion.header>
  );
};
