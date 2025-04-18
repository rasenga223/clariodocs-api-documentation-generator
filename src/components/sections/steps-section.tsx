"use client";

import { useEffect, useState, useRef } from "react";
import { MousePointer, Sparkles, FileJson, ArrowRight, Upload, File } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { motion } from "framer-motion";
import { Note, Terminal } from "@/components/mdx/MdxComponents";

// Floating component with custom animation (copied from CTA section)
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

// Enhanced typewriter effect with syntax highlighting
const TypewriterEffect = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30 + Math.random() * 50); // Faster typing speed
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);
  
  return (
    <pre className="font-mono text-sm text-white">
      <code className="language-mdx">
        {displayText}
        {currentIndex < text.length && (
          <span className="inline-block w-2 h-4 ml-1 bg-green-500 animate-pulse" />
        )}
      </code>
    </pre>
  );
};

// Shorter, more focused MDX content
const mdxCode = `---
title: 'API Documentation'
---

# Getting Started
Integrate with our API in minutes.

\`\`\`typescript
const api = new ApiClient({
  apiKey: process.env.API_KEY
});
\`\`\``;

export const StepsSection = () => {
  const uploadRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isDragActive: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isDragActive);
  };
  
  return (
    <section className="px-4 py-24 bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        {/* Enhanced Section Header */}
        <div className="max-w-3xl mx-auto mb-20 space-y-4 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            <span className="inline-block text-transparent bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text">
              Three steps
            </span>
            <br />
            <span className="mt-2 text-3xl md:text-5xl">to beautiful documentation</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Transform your API specification into production-ready documentation in minutes
          </p>
        </div>
        
        {/* Modernized Steps Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Step 1: Enhanced Upload Container */}
          <div className="relative group">
            <div className="absolute inset-0 transition-all duration-300 rounded-3xl bg-gradient-to-r from-green-500/20 to-green-600/20 blur-xl group-hover:blur-2xl opacity-15" />
            <div className="relative h-full min-h-[24rem] rounded-2xl border border-zinc-800/50 bg-[#0d0d0d]/90 p-2 transition-all duration-300 group-hover:border-green-500/30">
              <GlowingEffect spread={60} glow={true} disabled={false} proximity={80} inactiveZone={0.01} />
              <div className="absolute -top-4 -left-4 z-10">
                <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20">
                  01
                </div>
              </div>
              <div 
                ref={uploadRef}
                className={`relative flex flex-col items-center justify-center h-full rounded-xl border-2 ${
                  isDragging 
                    ? 'border-dashed border-green-500 bg-green-500/5' 
                    : 'border-dashed border-zinc-800/50 bg-[#0d0d0d]'
                } transition-all duration-300`}
                onDragEnter={(e) => handleDragEvents(e, true)}
                onDragOver={(e) => handleDragEvents(e, true)}
                onDragLeave={(e) => handleDragEvents(e, false)}
                onDrop={(e) => handleDragEvents(e, false)}
              >
                {/* Animated upload icon */}
                <div className={`relative transition-all duration-500 ${isDragging ? 'scale-110' : 'scale-100'}`}>
                  <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                  <div className={`relative flex items-center justify-center w-24 h-24 transition-transform duration-300 rounded-full bg-gradient-to-br from-zinc-800/80 to-zinc-900 group-hover:scale-110 ${isDragging ? 'scale-110' : ''}`}>
                    <Upload className={`w-12 h-12 transition-colors duration-300 ${isDragging ? 'text-green-400' : 'text-green-500'}`} />
                  </div>
                </div>

                {/* Upload text content */}
                <div className="mt-6 space-y-2 text-center">
                  <h3 className="text-2xl font-bold text-white">Upload Specification</h3>
                  <p className="text-sm text-zinc-400">
                    Drag and drop your OpenAPI or Postman collection
                  </p>
                </div>

                {/* File types */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {['JSON', 'YAML', 'Postman'].map((type) => (
                    <div key={type} className="flex items-center px-3 py-1 space-x-1 text-xs rounded-full bg-zinc-800/80">
                      <File className="w-3 h-3 text-green-500" />
                      <span className="text-zinc-400">{type}</span>
                    </div>
                  ))}
                </div>

                {/* Browse button */}
                <button className="px-6 py-3 mt-6 text-sm font-medium text-white transition-all duration-300 rounded-lg bg-zinc-800 hover:bg-green-600 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  Browse Files
                </button>

                {/* Drop overlay */}
                <div className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
                  isDragging ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute inset-0 bg-green-500/5" />
                  <div className="absolute inset-0 border-2 border-dashed border-green-500/50 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 2: Enhanced AI Generation */}
          <div className="relative group">
            <div className="absolute inset-0 transition-all duration-300 rounded-3xl bg-gradient-to-r from-green-500/20 to-green-600/20 blur-xl group-hover:blur-2xl opacity-15" />
            <div className="relative h-full min-h-[24rem] rounded-2xl border border-zinc-800/50 bg-[#0d0d0d]/90 p-2 transition-all duration-300 group-hover:border-green-500/30">
              <GlowingEffect spread={60} glow={true} disabled={false} proximity={80} inactiveZone={0.01} />
              <div className="absolute -top-4 -left-4 z-10">
                <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20">
                  02
                </div>
              </div>
              <div className="relative flex flex-col h-full overflow-hidden rounded-xl bg-[#0d0d0d]">
                <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-zinc-700" />
                      <div className="w-3 h-3 rounded-full bg-zinc-700" />
                      <div className="w-3 h-3 rounded-full bg-zinc-700" />
                    </div>
                    <div className="flex items-center text-sm text-zinc-400">
                      <span className="text-green-500">docs</span>
                      <span>/getting-started.mdx</span>
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-green-500 animate-pulse" />
                </div>
                
                <div className="flex-1 p-4 overflow-auto bg-[#0d0d0d]/50 backdrop-blur-sm">
                  <TypewriterEffect text={mdxCode} />
                </div>
                
                <div className="flex items-center px-3 py-2 space-x-2 border-t border-zinc-800">
                  <div className="px-3 py-1 text-xs font-medium rounded-md bg-green-500/10 text-green-500">getting-started.mdx</div>
                  <div className="px-3 py-1 text-xs font-medium text-zinc-400 rounded-md bg-zinc-800">endpoints.mdx</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 3: Enhanced Publish Section */}
          <div className="relative col-span-1 md:col-span-2 group">
            <div className="absolute inset-0 transition-all duration-300 rounded-3xl bg-gradient-to-r from-green-500/20 via-green-600/20 to-green-700/20 blur-xl group-hover:blur-2xl opacity-15" />
            <div className="relative min-h-[16rem] rounded-2xl border border-zinc-800/50 bg-[#0d0d0d]/90 p-2 transition-all duration-300 group-hover:border-green-500/30">
              <GlowingEffect spread={80} glow={true} disabled={false} proximity={100} inactiveZone={0.01} />
              <div className="absolute -top-4 -left-4 z-20">
                <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20">
                  03
                </div>
              </div>
              
              <div className="relative h-full overflow-hidden rounded-xl">
                {/* Background layer */}
                <div className="absolute inset-0 bg-[#0d0d0d] z-0" />
                
                {/* Floating MDX Components layer */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10">
                  {/* Bottom left floating component */}
                  <FloatingComponent className="absolute bottom-[10%] left-[5%] w-[250px] transform -rotate-6 opacity-40" delay={1}>
                    <Note>
                      Your docs are ready to be published
                    </Note>
                  </FloatingComponent>

                  {/* Top right floating component */}
                  <FloatingComponent className="absolute top-[10%] right-[5%] w-[250px] transform rotate-3 opacity-40" delay={2}>
                    <Terminal title="Deploy" showPrompt={true}>
                      docs deploy --production
                    </Terminal>
                  </FloatingComponent>
                </div>

                {/* Content layer */}
                <div className="relative z-20 flex items-center justify-center h-full">
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <h3 className="mb-8 text-3xl font-bold text-white">Ready to Go Live?</h3>
                    
                    <div className="relative">
                      <button className="relative px-8 py-4 text-lg font-medium text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 group/button">
                        <span className="relative z-10 flex items-center">
                          Publish Documentation
                          <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/button:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 transition-all duration-300 rounded-lg opacity-50 bg-gradient-to-r from-green-500 to-green-600 blur group-hover/button:blur-md" />
                      </button>
                      
                      {/* Animated cursor */}
                      <div className="absolute -right-8 -bottom-8 animate-bounce-slow">
                        <MousePointer className="w-6 h-6 text-green-500 transform -rotate-45" />
                      </div>
                    </div>
                    
                    <p className="mt-8 text-sm text-zinc-400">
                      Your documentation will be instantly available at <span className="text-green-500">your-api.docs.com</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 