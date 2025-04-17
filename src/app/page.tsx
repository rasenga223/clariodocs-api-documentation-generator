"use client";
import { useRef } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { CTASection } from "@/components/sections/cta-section";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="pt-1 text-white no-scrollbar bg-gradient-to-b from-zinc-950 to-zinc-900"
      ref={containerRef}
    >
      <Header />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
