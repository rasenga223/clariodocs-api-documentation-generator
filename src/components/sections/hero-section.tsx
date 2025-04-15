"use client";
import { useScroll, motion, useTransform } from "motion/react";
import { Spotlight } from "@/components/ui/spotlight";
import { Link } from "@/components/ui/link";

export const HeroSection = () => {
  const { scrollY } = useScroll();
  const margin = useTransform(scrollY, [0, 100], [4, 0]);
  const borderRadius = useTransform(scrollY, [0, 100], [4, 0]);

  return (
    <motion.section
      style={{
        marginLeft: margin,
        marginRight: margin,
        marginBottom: margin,
        borderRadius,
      }}
      className="relative mt-0 flex min-h-[calc(100svh-0.5rem)] items-center justify-center border bg-zinc-950 p-4 pt-24 text-center"
    >
      <Spotlight fill="green" />
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-6 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-[clamp(2.25rem,5vw,4.5rem)] font-bold tracking-tighter text-transparent">
          One-Click API Documentation Generator
        </h1>
        <p className="mb-4 max-w-[52rem] text-[clamp(0.875rem,2vw,1.25rem)] text-pretty text-zinc-500">
          Transform your API spec into a clean, branded, shareable documentation
          site instantly. Powered by AI for enhanced readability and developer
          experience.
        </p>
        <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            variant={"primary"}
            className="!h-12 min-w-40 bg-green-600 whitespace-nowrap hover:!bg-green-700"
          >
            Sign In
          </Link>
          <Link
            href="/docs"
            variant={"secondary"}
            className="h-12 min-w-40 whitespace-nowrap"
            target="_blank"
          >
            Learn More
          </Link>
        </div>
      </div>
    </motion.section>
  );
};
