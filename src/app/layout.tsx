import "@/app/globals.css";
import type React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Loader } from "@/components/elements/loader";
import { Providers } from "@/provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "API Documentation Generator",
  description: "Create beautiful, interactive API documentation with ease",
};

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader />
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
      <body
        className={`${inter.className} dark bg-background text-foreground antialiased`}
      >
        <Suspense fallback={<Loading />}>
          <Providers>{children}</Providers>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
