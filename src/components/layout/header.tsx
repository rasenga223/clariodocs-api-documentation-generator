"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useAuth } from "@/provider/auth";
import { cn } from "@/lib/utils";

import { HeaderMobileNavMenu } from "@/components/elements/header-mobile-nav-menu";
import { HeaderLogo } from "@/components/elements/header-logo";
import { HeaderDesktopNavigation } from "@/components/elements/header-desktop-navigation";
import { HeaderMobileNavToggle } from "@/components/elements/header-mobile-nav-toggle";
import { HeaderUserSection } from "@/components/elements/header-user-section";

export const Header = () => {
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Animate background opacity: 0 at top, up to 0.8 after scrolling 100px.
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.8]);
  // Animate border opacity: 0 at top, up to 0.3 after 100px.
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.3]);
  // Create a dynamic border color using zinc-800 RGB and animated opacity.
  const borderColor = useTransform(
    borderOpacity,
    (value) => `rgba(39, 39, 42, ${value})`,
  );

  // Track mobile nav open state
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Define navigation links
  const navigationLinks = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Documentation", href: "/docs" },
  ];

  // Get user name with fallback
  const userName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.preferred_username ||
    user?.user_metadata?.user_name ||
    (user?.email ? user.email.split("@")[0] : "") ||
    "there";

  return (
    <motion.header
      ref={headerRef}
      role="banner"
      aria-label="Site header"
      // We set backgroundColor and borderColor dynamically based on scroll.
      style={{
        width: "100%",
        backgroundColor: prefersReducedMotion
          ? "rgba(10,10,10,0.65)"
          : `rgba(10,10,10,${bgOpacity})`,
        borderColor: borderColor, // dynamic border color for glassmorphism
      }}
      className={cn(
        // Remove static border opacity from className.
        "fixed inset-x-0 top-4 z-50 mx-auto max-w-7xl rounded-full border px-4 py-2 backdrop-blur-md transition-all duration-300",
        "grid grid-cols-3 items-center justify-items-center",
      )}
    >
      <HeaderMobileNavToggle
        isOpen={isMobileNavOpen}
        toggle={() => setIsMobileNavOpen((prev) => !prev)}
      />

      <HeaderDesktopNavigation links={navigationLinks} />

      <HeaderLogo />

      <HeaderUserSection isLoggedIn={!!user} userName={userName} />

      <HeaderMobileNavMenu isOpen={isMobileNavOpen} links={navigationLinks} />
    </motion.header>
  );
};
