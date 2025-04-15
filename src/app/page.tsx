"use client";
import { useRef } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="no-scrollbar bg-green-900 pt-1 text-white"
      ref={containerRef}
    >
      <Header />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
