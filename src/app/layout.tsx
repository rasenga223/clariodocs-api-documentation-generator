import '@/app/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from "@/components/ThemeProvider";
import { Suspense } from 'react';
import type React from "react";

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'API Documentation Generator',
  description: 'Create beautiful, interactive API documentation with ease',
};

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 rounded-full border-primary animate-spin border-t-transparent"></div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <Suspense fallback={<Loading />}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
