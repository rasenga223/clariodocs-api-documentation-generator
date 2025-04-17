import { Link } from "@/components/ui/link";
import { motion } from "framer-motion";

// Animated shape component for the background
const AnimatedShape = ({ className }: { className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  />
);

export const CTASection = () => {
  return (
    <section className="relative px-4 py-32 isolate bg-zinc-950 md:py-40">
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

      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="relative">
          {/* Main content container */}
          <div className="px-8 py-16 overflow-hidden border shadow-2xl rounded-3xl border-zinc-800/50 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 backdrop-blur-xl md:px-16 md:py-24">
            {/* Glare effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute w-1/2 -translate-x-1/2 translate-y-0 -top-1/2 left-1/2 aspect-square bg-gradient-radial from-green-500/20 via-green-500/5 to-transparent blur-2xl" />
              <div className="absolute w-1/2 -translate-x-1/2 translate-y-0 -bottom-1/2 left-1/2 aspect-square bg-gradient-radial from-blue-500/20 via-blue-500/5 to-transparent blur-2xl" />
            </div>

            <div className="relative max-w-5xl mx-auto">
              {/* Decorative elements */}
              <div className="absolute -translate-x-1/2 -top-4 left-1/2">
                <div className="h-8 w-[2px] bg-gradient-to-b from-transparent via-green-500 to-transparent" />
              </div>

              {/* Content */}
              <div className="text-center">
                <motion.h2 
                  className="relative max-w-3xl mx-auto mb-6 text-4xl font-bold tracking-tight text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text md:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Create Beautiful API Documentation{" "}
                  <span className="whitespace-nowrap bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text">in Minutes</span>
                </motion.h2>

                <motion.p 
                  className="max-w-2xl mx-auto mb-12 text-lg text-zinc-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Join forward-thinking developers who are transforming their API documentation into 
                  engaging, interactive experiences that users love.
                </motion.p>

                {/* Feature highlights */}
                <motion.div 
                  className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="p-6 border rounded-xl border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm">
                    <div className="mb-2 text-green-500">
                      <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="mb-1 text-sm font-medium text-white">Instant Setup</h3>
                    <p className="text-xs text-zinc-400">Get your documentation live in under 5 minutes</p>
                  </div>
                  <div className="p-6 border rounded-xl border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm">
                    <div className="mb-2 text-green-500">
                      <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h3 className="mb-1 text-sm font-medium text-white">AI-Powered</h3>
                    <p className="text-xs text-zinc-400">Smart suggestions and auto-generated examples</p>
                  </div>
                  <div className="p-6 border rounded-xl border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm">
                    <div className="mb-2 text-green-500">
                      <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <h3 className="mb-1 text-sm font-medium text-white">Custom Domains</h3>
                    <p className="text-xs text-zinc-400">Host on your domain or use our subdomain</p>
                  </div>
                </motion.div>

                {/* CTA buttons */}
                <motion.div 
                  className="flex flex-wrap items-center justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Link
                    href="/login"
                    variant="primary"
                    className="w-60 transform rounded-xl bg-green-500 px-6 py-3 font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/20 focus:outline-none focus:ring-2 focus:ring-green-500/50 active:scale-[0.98]"
                  >
                    Generate Documentation
                  </Link>
                  <Link
                    href="/demo"
                    variant="secondary"
                    className="w-60 transform rounded-xl border border-zinc-800 bg-zinc-900/30 px-6 py-3 font-medium text-zinc-300 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-800/40 hover:border-zinc-700 hover:text-white hover:shadow-lg hover:shadow-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-zinc-400/20 active:scale-[0.98]"
                  >
                    Demo
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 