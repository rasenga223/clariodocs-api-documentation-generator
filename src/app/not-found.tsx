"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function NotFoundPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only show the UI after mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <div className="relative w-full max-w-4xl">
        {/* Decorative radial gradient */}
        <div className="absolute -z-10 h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute right-0 top-0 -z-10 h-[30%] w-[30%] rounded-full bg-primary/30 blur-[60px]" />
        
        <motion.div
          className="relative z-10 overflow-hidden border rounded-lg shadow-lg border-border bg-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid md:grid-cols-2">
            {/* Visual section */}
            <div className="relative flex items-center justify-center p-8 overflow-hidden bg-muted">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative"
              >
                <div className="relative z-10">
                  <motion.div
                    initial={{ rotate: -5, scale: 0.9 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      delay: 0.4,
                    }}
                    className="relative"
                  >
                    <div className="absolute rounded-full -inset-10 -z-10 animate-pulse bg-primary/10 blur-xl"></div>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="w-32 h-32 mx-auto text-primary"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                      />
                    </svg>
                  </motion.div>
                  <h2 className="mt-4 text-2xl font-bold text-center text-foreground">
                    Page not found
                  </h2>
                </div>
              </motion.div>
            </div>

            {/* Content section */}
            <div className="p-8 md:p-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h1 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                  404 - That page doesn't exist
                </h1>

                <p className="mb-8 text-muted-foreground">
                  The page you're looking for doesn't exist or has been moved.
                  Here are some helpful links to get you back on track:
                </p>

                <ul className="mb-8 space-y-3">
                  {[
                    { text: "Return to home page", href: "/" },
                    { text: "Go back to dashboard", href: "/dashboard" },
                  ].map((link, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center group text-primary hover:text-primary/80"
                      >
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 mr-2 transition-transform transform group-hover:translate-x-1"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {link.text}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/" passHref>
                    <Button className="w-full sm:w-auto">
                      Back to home
                    </Button>
                  </Link>
                  <Link href="/dashboard" passHref>
                    <Button variant="outline" className="w-full sm:w-auto">
                      View dashboard
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
