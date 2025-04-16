"use client";

import Link from "next/link";
// import { Button } from "@/components/ui/button"
import { motion } from "motion/react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-500 p-4">
      <div className="relative w-full max-w-4xl">
        {/* Decorative grid background */}
        <div className="bg-grid-white bg-grid-8 absolute inset-0 opacity-10" />

        <motion.div
          className="relative z-10 overflow-hidden rounded-lg bg-zinc-950 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid md:grid-cols-2">
            {/* Visual section */}
            <div className="relative flex items-center justify-center overflow-hidden bg-zinc-900 p-8">
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
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="mx-auto h-32 w-32 text-green-500"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                      />
                    </svg>
                  </motion.div>
                  <h2 className="mt-4 text-center text-2xl font-bold text-white">
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
                <h1 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                  Oops! You've ventured too far
                </h1>

                <p className="mb-8 text-zinc-400">
                  The page you're looking for doesn't exist or has been moved.
                  Here are some helpful links to get you back on track:
                </p>

                <ul className="mb-8 space-y-3">
                  {[
                    { text: "Return to home page", href: "/" },
                    { text: "Go back to dashboard", href: "/dashboard" },
                    // { text: "View API reference", href: "/api" },
                    // { text: "Contact support", href: "/support" },
                  ].map((link, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className="group flex items-center text-green-400 hover:text-green-600"
                      >
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="mr-2 h-4 w-4 transform transition-transform group-hover:translate-x-1"
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

                {/* <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/" passHref>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">Back to home</Button>
                  </Link>
                  <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                    Report this issue
                  </Button>
                </div> */}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
