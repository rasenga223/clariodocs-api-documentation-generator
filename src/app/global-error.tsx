"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-green-500 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-5xl overflow-hidden rounded-lg bg-zinc-950 p-6 shadow-2xl md:p-8"
          >
            {/* Decorative elements */}
            <div
              aria-hidden="true"
              className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-24 w-24 -translate-x-1/2 translate-y-1/2 rounded-full bg-green-500/10"
            />

            <div className="relative z-10">
              {/* Error icon */}
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-red-500"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>

              <h1 className="mb-2 text-center text-2xl font-bold text-white md:text-3xl">
                Critical Error
              </h1>

              <div className="mx-auto mb-6 h-0.5 w-16 bg-green-500/50" />

              <p className="mb-8 text-center text-zinc-400">
                We've encountered a critical error. Please try refreshing the
                page or come back later.
              </p>

              {/* Error details for developers */}
              {process.env.NODE_ENV === "development" && (
                <div className="mb-6 overflow-auto rounded border border-zinc-800 bg-zinc-900 p-3">
                  <p className="font-mono text-sm text-red-400">
                    {error.message}
                  </p>
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-zinc-500">
                        Stack trace
                      </summary>
                      <pre className="mt-2 overflow-auto p-2 text-xs text-zinc-400">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button
                  onClick={reset}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Try again
                </Button>
                <Link href="/" passHref>
                  <Button
                    variant="outline"
                    className="border-zinc-700 text-white hover:bg-zinc-800"
                  >
                    Back to home
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </body>
    </html>
  );
}
