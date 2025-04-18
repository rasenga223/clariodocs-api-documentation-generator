"use client";

import { Link } from "@/components/ui/link";
import { motion } from "framer-motion";
import { 
  Endpoint, 
  Note, 
  Terminal, 
  ParamsTable, 
  Param, 
  RateLimit
} from "@/components/mdx/MdxComponents";

// Animated shape component for the background
const AnimatedShape = ({ className }: { className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  />
);

// Floating component with custom animation
const FloatingComponent = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: [0.5, 0.8, 0.5],
      y: [0, -20, 0],
      x: [0, 10, 0],
    }}
    transition={{ 
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

export const CTASection = () => {
  return (
    <section className="relative px-2 sm:px-4 py-24 sm:py-32 isolate bg-zinc-950 md:py-40 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <AnimatedShape className="absolute -left-[40%] top-0 h-[1000px] w-[1000px] rounded-full bg-gradient-to-tr from-green-500/10 via-emerald-500/5 to-transparent blur-[128px]" />
        <AnimatedShape className="absolute -right-[40%] bottom-0 h-[1000px] w-[1000px] rounded-full bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent blur-[128px]" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#88888808_1px,transparent_1px),linear-gradient(to_bottom,#88888808_1px,transparent_1px)] bg-[size:32px_32px]">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950"></div>
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 -z-10 opacity-[0.015] bg-[url('/noise.png')] bg-repeat"></div>

      {/* Floating MDX Components in Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {/* Top left component */}
        <FloatingComponent className="absolute top-[10%] left-[5%] w-[300px] max-[500px]:w-[200px] max-[500px]:top-[5%] max-[500px]:left-[2%] transform -rotate-6 opacity-50">
          <Note>
            Beautiful API documentation that developers love
          </Note>
        </FloatingComponent>

        {/* Top right component */}
        <FloatingComponent className="absolute top-[15%] right-[5%] w-[300px] max-[500px]:w-[200px] max-[500px]:top-[8%] max-[500px]:right-[2%] transform rotate-3 opacity-50" delay={2}>
          <Terminal title="Installation" showPrompt={true}>
            npm install @company/api-client
          </Terminal>
        </FloatingComponent>

        {/* Bottom left component */}
        <FloatingComponent className="absolute bottom-[20%] left-[8%] w-[300px] max-[500px]:w-[200px] max-[500px]:bottom-[25%] max-[500px]:left-[2%] transform -rotate-3 opacity-50" delay={1}>
          <RateLimit limit="100" period="1 minute">
            Premium plans have higher limits
          </RateLimit>
        </FloatingComponent>

        {/* Bottom right component */}
        <FloatingComponent className="absolute bottom-[15%] right-[8%] w-[300px] max-[500px]:w-[200px] max-[500px]:bottom-[28%] max-[500px]:right-[2%] transform rotate-6 opacity-50" delay={3}>
          <Endpoint 
            method="GET" 
            path="/api/v1/users"
          >
            <ParamsTable>
              <Param name="page" type="integer">Page number</Param>
            </ParamsTable>
          </Endpoint>
        </FloatingComponent>
      </div>

      <div className="mx-auto w-[90%] max-w-[1600px] relative z-10">
        <div className="relative">
          {/* Content */}
          <div className="text-center">
            <motion.h2 
              className="relative max-w-3xl mx-auto mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text md:text-6xl px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Create Beautiful API Documentation{" "}
              <span className="whitespace-nowrap bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text">in Minutes</span>
            </motion.h2>

            <motion.p 
              className="max-w-2xl mx-auto mb-8 sm:mb-12 text-base sm:text-lg text-zinc-400 px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Transform your API specifications into beautiful, interactive documentation with our AI-powered platform.
            </motion.p>

            {/* CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                href="/login"
                variant="primary"
                className="w-full sm:w-60 transform rounded-xl bg-green-500 px-6 py-3 font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/20 focus:outline-none focus:ring-2 focus:ring-green-500/50 active:scale-[0.98]"
              >
                Generate Documentation
              </Link>
              <Link
                href="/demo"
                variant="secondary"
                className="w-full sm:w-60 transform rounded-xl border border-zinc-800 bg-zinc-900/30 px-6 py-3 font-medium text-zinc-300 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-800/40 hover:border-zinc-700 hover:text-white hover:shadow-lg hover:shadow-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-zinc-400/20 active:scale-[0.98]"
              >
                Demo
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}; 