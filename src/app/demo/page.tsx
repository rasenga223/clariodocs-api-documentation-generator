"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="text-white min-h-dvh bg-gradient-to-b from-zinc-900 to-black">
      {/* Hero Section */}
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20">
          {/* Heading with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text sm:text-6xl">
              API Documentation Generator
            </h1>
            <p className="mt-4 text-lg text-zinc-400 sm:text-xl">
              Transform your API specs into beautiful, interactive documentation in seconds
            </p>
          </motion.div>

          {/* Video Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-4xl mt-12"
          >
            <div className="relative overflow-hidden border shadow-2xl aspect-video rounded-xl border-zinc-800 bg-zinc-900">
              {/* Gradient Overlay for Video */}
              <div className="absolute inset-0 z-10 rounded-xl bg-gradient-to-tr from-purple-500/10 via-transparent to-pink-500/10" />
              
              {/* Video Player */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="object-cover w-full h-full"
              >
                <source src="/video/clariodocs-demo-1744869475563.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 border rounded-lg border-zinc-800 bg-zinc-900/50 backdrop-blur-sm"
              >
                <feature.icon className="w-6 h-6 text-purple-500" />
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col gap-4 mt-12 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Link href="/login">
                Try it now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white bg-transparent border-zinc-700 hover:bg-zinc-800"
            >
              <Link href="https://github.com/rasenga223/clariodocs-api-documentation-generator.git">
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Features data
const features = [
  {
    title: "AI-Powered Generation",
    description: "Leverage advanced AI to automatically generate comprehensive documentation from your API specs.",
    icon: function AiIcon(props: any) {
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a5 5 0 0 1 5 5v6a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      );
    },
  },
  {
    title: "Interactive Examples",
    description: "Beautiful, interactive code examples with syntax highlighting and copy functionality.",
    icon: function CodeIcon(props: any) {
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    },
  },
  {
    title: "Modern Design",
    description: "Clean, responsive interface with dark mode support and beautiful typography.",
    icon: function DesignIcon(props: any) {
      return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      );
    },
  },
]; 