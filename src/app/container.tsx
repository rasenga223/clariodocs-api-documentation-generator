"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/provider/auth";
import { Files } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  // Use client-side state to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);

  // Wait for component to mount before rendering auth-dependent content
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get user name from metadata if available
  const userName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.preferred_username ||
    user?.user_metadata?.user_name ||
    user?.email?.split("@")[0] ||
    "there";

  // Initial loading state for both client and server
  if (!isClient || loading) {
    return (
      <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
        <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-t-4 border-emerald-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        {user ? (
          <div className="w-full">
            <h2 className="mb-4 text-2xl font-bold">
              Hi,{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                {userName}
              </span>
              ! 👋
            </h2>
            <p className="mb-6 text-zinc-600 dark:text-zinc-300">
              Welcome back to your API Documentation Generator. You&apos;re
              currently signed in.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="bg-foreground text-background flex items-center justify-center rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:bg-[#383838] sm:h-12 sm:px-5 sm:text-base dark:hover:bg-[#ccc]"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => (window.location.href = "/api/auth/signout")}
                className="flex items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:px-5 sm:text-base dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-6 text-center sm:text-left">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                API Documentation Generator
              </h1>
              <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
                Create beautiful, interactive API documentation with ease. Sign
                in to get started.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="bg-foreground text-background flex items-center justify-center rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:bg-[#383838] sm:h-12 sm:px-5 sm:text-base dark:hover:bg-[#ccc]"
              >
                Sign In
              </Link>
              <Link
                href="/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:px-5 sm:text-base dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
              >
                Learn More
              </Link>
            </div>
          </>
        )}
      </main>

      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
        <a
          className="flex items-center gap-2 text-zinc-300 hover:text-emerald-500"
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Files />
          Explore the Docs
        </a>
      </footer>
    </div>
  );
}
