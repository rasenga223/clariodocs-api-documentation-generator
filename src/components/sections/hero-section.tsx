"use client";

import { motion } from "motion/react";
import { Link } from "@/components/ui/link";

export const HeroSection = () => {
  return (
    <div className="relative flex flex-col items-center justify-center mx-auto my-10 max-w-7xl">
      {/* Left border with gradient effect */}
      <div className="absolute inset-y-0 left-0 w-px h-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 w-px h-40 bg-gradient-to-b from-transparent via-green-500 to-transparent" />
      </div>
      {/* Right border with gradient effect */}
      <div className="absolute inset-y-0 right-0 w-px h-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute w-px h-40 bg-gradient-to-b from-transparent via-green-500 to-transparent" />
      </div>
      {/* Bottom border with gradient effect */}
      <div className="absolute inset-x-0 bottom-0 w-full h-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute w-40 h-px mx-auto bg-gradient-to-r from-transparent via-green-500 to-transparent" />
      </div>
      
      <div className="px-4 py-10 md:py-20">
        {/* Animated heading */}
        <h1 className="relative z-10 max-w-4xl mx-auto text-2xl font-bold text-center text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"Transform Your API Specs into Beautiful Docs"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        
        {/* Animated description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 max-w-xl py-4 mx-auto text-lg font-normal text-center text-neutral-600 dark:text-neutral-400"
        >
          Upload your OpenAPI or Postman collection and let our AI transform it into
          comprehensive, beautiful documentation in seconds. No coding required.
        </motion.p>
        
        {/* Animated buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="relative z-10 flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          <Link
            href="/login"
            variant="primary"
            className="w-60 transform rounded-xl bg-green-500 px-6 py-3 font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/20 focus:outline-none focus:ring-2 focus:ring-green-500/50 active:scale-[0.98] dark:bg-green-600 dark:hover:bg-green-500"
          >
            Generate Documentation
          </Link>
          <Link
            href="/demo"
            variant="secondary"
            className="w-60 transform rounded-xl border border-gray-200 bg-white/20 px-6 py-3 font-medium text-gray-800 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/40 hover:shadow-lg hover:shadow-gray-200/10 focus:outline-none focus:ring-2 focus:ring-gray-400/20 active:scale-[0.98] dark:border-gray-800 dark:bg-gray-900/30 dark:text-gray-200 dark:hover:bg-gray-800/40 dark:hover:border-gray-700"
          >
            Demo
          </Link>
        </motion.div>
        
        {/* Animated preview image */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
          className="relative z-10 p-4 mt-20 border shadow-md rounded-3xl border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="w-full overflow-hidden border border-gray-300 rounded-xl dark:border-gray-700">
            <img
              src="/images/docs-screenshot.png"
              alt="API Documentation Preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1000}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
