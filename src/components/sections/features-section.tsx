"use client";

import { 
  FileText, 
  Zap, 
  Code, 
  Layout, 
  FileJson 
} from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export const FeaturesSection = () => {
  return (
    <section className="px-4 py-20 bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16 space-y-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            <span className="text-transparent bg-gradient-to-r from-green-400 to-green-600 bg-clip-text">Features</span> designed for developers
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-zinc-400">
            Transform your API specifications into beautiful, comprehensive documentation with our powerful features.
          </p>
        </div>
        
        {/* Grid Layout for Features */}
        <ul className="grid grid-cols-1 grid-rows-none gap-6 md:grid-cols-12 md:grid-rows-3 lg:gap-6 xl:max-h-[36rem] xl:grid-rows-2">
          <GridItem
            area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
            icon={<FileJson className="w-5 h-5 text-green-500" />}
            title="Easy API Spec Upload"
            description="Upload your OpenAPI or Postman collection in seconds. We support JSON and YAML formats to make getting started effortless."
          />

          <GridItem
            area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
            icon={<Zap className="w-5 h-5 text-green-500" />}
            title="AI-Powered Enhancement"
            description="Our AI technology automatically generates clear descriptions, code examples, and usage patterns from your API specification."
          />

          <GridItem
            area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
            icon={<Layout className="w-5 h-5 text-green-500" />}
            title="Beautiful Documentation UI"
            description="Get a modern, responsive documentation interface that makes your API easy to understand and implement. Complete with dark mode support."
          />

          <GridItem
            area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
            icon={<Code className="w-5 h-5 text-green-500" />}
            title="Code Examples That Work"
            description="AI-generated examples in multiple languages that developers can copy and paste directly into their projects. No more guesswork."
          />

          <GridItem
            area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
            icon={<FileText className="w-5 h-5 text-green-500" />}
            title="Custom Domain Support"
            description="Host your documentation on our platform or use your own domain for a seamless experience that matches your brand."
          />
        </ul>
      </div>
    </section>
  );
};

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full p-2 transition-all duration-300 border rounded-2xl border-zinc-800 md:rounded-3xl md:p-3 hover:border-green-500/30">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0 border-zinc-800 bg-[#0d0d0d]/90 p-6 md:p-6 backdrop-blur-sm dark:shadow-[0px_0px_27px_0px_#2D2D2D] transition-all duration-300 group">
          <div className="relative flex flex-col justify-between flex-1 gap-3">
            <div className="w-fit rounded-lg border border-zinc-700 bg-zinc-800 p-2.5 transition-all duration-300 group-hover:border-green-500/50 group-hover:bg-zinc-800/90">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="font-sans text-xl/[1.375rem] font-semibold text-balance text-white md:text-2xl/[1.875rem] group-hover:text-green-400 transition-colors duration-300">
                {title}
              </h3>
              <p className="font-sans text-sm/[1.125rem] text-zinc-400 md:text-base/[1.375rem]">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
