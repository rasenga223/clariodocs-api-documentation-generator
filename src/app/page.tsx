'use client';

import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  // Use client-side state to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);
  
  // Wait for component to mount before rendering auth-dependent content
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get user name from metadata if available
  const userName = user?.user_metadata?.name || 
    user?.user_metadata?.full_name || 
    user?.user_metadata?.preferred_username ||
    user?.user_metadata?.user_name || 
    user?.email?.split('@')[0] || 
    'there';

  // Initial loading state for both client and server
  if (!isClient || loading) {
    return (
      <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
        <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-t-4 border-blue-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        {user ? (
          <div className="w-full rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold">
              Hi, <span className="text-blue-600 dark:text-blue-400">{userName}</span>! 👋
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Welcome back to your API Documentation Generator. You&apos;re currently signed in.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="flex items-center justify-center rounded-full border border-solid border-transparent bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:px-5 sm:text-base"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => window.location.href = '/api/auth/signout'}
                className="flex items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:h-12 sm:px-5 sm:text-base"
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
              <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Create beautiful, interactive API documentation with ease. Sign in to get started.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="flex items-center justify-center rounded-full border border-solid border-transparent bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:px-5 sm:text-base"
              >
                Sign In
              </Link>
              <Link
                href="/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:h-12 sm:px-5 sm:text-base"
              >
                Learn More
              </Link>
            </div>
          </>
        )}

      </main>
      
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Explore the Docs
        </a>
      </footer>
    </div>
  );
}
