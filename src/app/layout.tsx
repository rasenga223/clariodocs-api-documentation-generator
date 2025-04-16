import "@/app/globals.css";
import type React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Loader } from "@/components/ui/loader";
import { Providers } from "@/provider";
import { ToastProvider } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Clario | API Documentation Generator",
  description:
    "Transform your API spec into a clean, branded, shareable documentation site instantly",
  openGraph: {
    title: "Clario | API Documentation Generator",
    type: "website",
    locale: "en_US",
    siteName: "Clario Docs",
    url: "https://clario-docs.vercel.app/",
    description:
      "One-click API documentation generator with AI enhancement and custom domain support",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Clario API Documentation Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clario | API Documentation Generator",
    description:
      "Transform your API spec into a clean, branded, shareable documentation site instantly",
    images: ["/og-image.png"],
  },
  icons: {
    icon: ["/favicon_io/favicon.ico?v=4"],
    apple: ["/favicon_io/apple-touch-icon.png?v=4"],
    shortcut: ["/favicon_io/apple-touch-icon.png"],
  },
  keywords: [
    "API documentation",
    "OpenAPI",
    "Postman Collection",
    "developer tools",
    "API specs",
    "documentation generator",
  ],
  authors: [
    {
      name: "Clario Team",
      url: "https://clario-docs.vercel.app/about",
    },
  ],
  creator: "Clario",
  publisher: "Clario",
};

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
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
      <body className={cn("min-h-screen bg-background antialiased", dmSans.variable)}>
        <Suspense fallback={<Loading />}>
          <Providers>
            <ToastProvider>
              {children}
            </ToastProvider>
          </Providers>
        </Suspense>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
