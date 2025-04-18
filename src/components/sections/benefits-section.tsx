"use client";

import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

const features = [
  {
    title: "Built for developers",
    description: "Transform your API specifications into beautiful, comprehensive documentation with our powerful features.",
    icon: <IconTerminal2 className="w-6 h-6" />,
  },
  {
    title: "Easy to use",
    description: "Upload your OpenAPI or Postman collection in seconds. We support JSON and YAML formats.",
    icon: <IconEaseInOut className="w-6 h-6" />,
  },
  {
    title: "AI-Powered",
    description: "Our AI technology automatically generates clear descriptions, code examples, and usage patterns.",
    icon: <IconAdjustmentsBolt className="w-6 h-6" />,
  },
  {
    title: "Cloud-hosted",
    description: "Host your documentation on our platform or use your own domain for a seamless experience.",
    icon: <IconCloud className="w-6 h-6" />,
  },
  {
    title: "Multi-format Support",
    description: "Support for OpenAPI, Swagger, and Postman Collections out of the box.",
    icon: <IconRouteAltLeft className="w-6 h-6" />,
  },
  {
    title: "24/7 Support",
    description: "Get help when you need it with our responsive support team and comprehensive guides.",
    icon: <IconHelp className="w-6 h-6" />,
  },
  {
    title: "Customizable",
    description: "Customize your documentation with your brand colors, logo, and domain.",
    icon: <IconCurrencyDollar className="w-6 h-6" />,
  },
  {
    title: "Developer-first",
    description: "Built by developers, for developers, with features you'll actually use.",
    icon: <IconHeart className="w-6 h-6" />,
  },
];

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-zinc-800",
        (index === 0 || index === 4) && "lg:border-l border-zinc-800",
        index < 4 && "lg:border-b border-zinc-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-[#0d0d0d] to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-zinc-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-zinc-700 group-hover/feature:bg-green-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-zinc-400 max-w-xs relative z-10 px-10">
        {description}
      </p>
  </div>
);
};

export const BenefitsSection = () => {
  return (
    <section className="px-4 py-20 bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            <span className="text-transparent bg-gradient-to-r from-green-400 to-green-600 bg-clip-text">Powerful features</span> for developers
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-zinc-400">
            Create documentation that is smarter, more accessible, and continuously improving with our intelligent features.
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};