import { Link } from "@/components/ui/link";

const FeatureCard: React.FC<Feature> = ({ title, description }) => {
  return (
    <li className="group cursor-pointer space-y-4 p-4">
      <span className="animate-radial-aura flex aspect-square flex-col justify-end rounded bg-radial-[at_0%_-75%] via-green-500 via-70% to-emerald-500 bg-[175%_175%] p-4">
        <h3 className="bg-gradient-to-r from-zinc-950 to-zinc-800 bg-clip-text text-2xl text-transparent transition-all duration-200 group-hover:border-l-4 group-hover:border-zinc-950 group-hover:px-3">
          {title}
        </h3>
      </span>

      <p className="text-[clamp(0.875rem,2vw,1rem)] leading-[150%] text-zinc-400">
        {description}
      </p>

      <Link href="/login" className="text-green-500">
        Get Started
      </Link>
    </li>
  );
};

export const FeaturesSection = () => {
  return (
    <section className="space-y-8 bg-zinc-950 p-4 py-10 pb-40">
      <h2 className="text-center text-3xl">
        Transform Your{" "}
        <span className="inline-block bg-green-500 px-2 text-zinc-950">
          API
        </span>{" "}
        Specs Instantly
      </h2>

      <ul className="mx-auto grid max-w-7xl divide-x border md:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.id} {...feature} />
        ))}
      </ul>
    </section>
  );
};

// Define the feature data structure
type Feature = {
  id: string;
  title: string;
  description: string;
  bgColor?: string;
};

// Create a structured array of features
const FEATURES: Feature[] = [
  {
    id: "ai-enhanced",
    title: "AI-Enhanced Docs",
    description:
      "Our AI engine automatically generates endpoint summaries, usage examples, and code snippets from your raw API specs, saving hours of manual documentation work.",
    bgColor: "bg-green-500",
  },
  {
    id: "one-click",
    title: "One-Click Deploy",
    description:
      "Get a branded documentation site on your own subdomain instantly. No configuration needed - upload your OpenAPI or Postman Collection and we handle the rest.",
    bgColor: "bg-green-500",
  },
  {
    id: "custom-domains",
    title: "Custom Domains",
    description:
      "Seamlessly connect your own domain with simple DNS configuration. Present a professional image with documentation that lives on your own branded URL.",
    bgColor: "bg-green-500",
  },
  {
    id: "developer-first",
    title: "Developer-First",
    description:
      "Built by developers for developers. Clean, responsive interface with searchable navigation, syntax highlighting, and interactive examples that accelerate API adoption.",
    bgColor: "bg-green-500",
  },
];
