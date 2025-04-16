"use client";

import { AnimatePresence, motion } from "motion/react";
import { Link } from "@/components/ui/link";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type UserSectionProps = {
  isLoggedIn: boolean;
  userName: string;
};

export function HeaderUserSection({ isLoggedIn, userName }: UserSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  // Variants for the user/login area
  const containerVariants = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        when: "beforeChildren",
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
    exit: {
      opacity: prefersReducedMotion ? 1 : 0,
      y: prefersReducedMotion ? 0 : -10,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.2,
        when: "afterChildren",
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 },
  };

  // Example user/login section for larger screens.
  return (
    <div className="col-start-3 hidden justify-self-end sm:flex">
      <AnimatePresence mode="wait">
        {isLoggedIn ? (
          <motion.div
            key="user-profile"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center gap-4 whitespace-nowrap"
          >
            <Link
              href="/dashboard"
              aria-label={`${userName}'s Dashboard`}
              className="flex items-center gap-4 rounded-md px-2 py-1 text-white/90 transition-colors hover:text-white focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none"
            >
              <motion.div
                variants={itemVariants}
                className="flex aspect-square w-8 items-center justify-center rounded-full bg-gradient-to-tr from-green-500 from-60% to-emerald-500 font-medium text-zinc-950"
                aria-hidden="true"
              >
                {userName.charAt(0).toUpperCase()}
              </motion.div>
              <motion.span variants={itemVariants}>{userName}</motion.span>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="login-buttons"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center gap-4"
          >
            <motion.div variants={itemVariants}>
              <Link
                href="/login"
                variant="primary"
                className="whitespace-nowrap"
              >
                Sign In
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                href="/docs"
                variant="secondary"
                className="whitespace-nowrap"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
