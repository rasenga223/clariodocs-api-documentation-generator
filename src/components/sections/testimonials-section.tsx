import Image from "next/image";
import { Link } from "@/components/ui/link";

// Testimonial card component
const TestimonialCard = ({ quote, author, role, company, companyLogo }: Testimonial) => {
  return (
    <div className="flex flex-col rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-md">
      {/* Quote */}
      <p className="mb-6 flex-1 text-lg leading-relaxed text-zinc-300">"{quote}"</p>
      
      {/* Author info */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="font-medium text-white">{author}</span>
          <span className="text-sm text-zinc-400">{role}, {company}</span>
        </div>
        
        {/* Company logo */}
        <div className="ml-auto h-8 w-auto">
          <Image 
            src={companyLogo}
            alt={`${company} logo`}
            width={100}
            height={32}
            className="h-8 w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export const TestimonialsSection = () => {
  return (
    <section className="bg-zinc-950 px-4 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Powering experiences from next-gen startups to enterprises
          </h2>
          <p className="mb-8 text-lg text-zinc-400">
            See how companies are transforming their documentation with our platform
          </p>
        </div>
        
        {/* Testimonials grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
        
        {/* CTA */}
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 text-center">
          <Link 
            href="/case-studies" 
            className="text-lg font-medium text-green-500 hover:text-green-400"
          >
            Explore case studies
          </Link>
          <Link
            href="/wall-of-love"
            className="text-lg font-medium text-green-500 hover:text-green-400"
          >
            Wall of love
          </Link>
        </div>
        
        {/* Logos section */}
        <div className="mt-16">
          <p className="mb-6 text-center text-sm font-medium uppercase tracking-wide text-zinc-500">
            Trusted by innovative companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
            {COMPANY_LOGOS.map((logo) => (
              <div key={logo.id} className="h-6 w-auto">
                <Image 
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={24}
                  className="h-6 w-auto object-contain grayscale transition-all duration-300 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Define the testimonial data structure
type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  companyLogo: string;
};

// Create a structured array of testimonials
const TESTIMONIALS: Testimonial[] = [
  {
    id: "testimonial-1",
    quote: "We scaled our global support by putting documentation first. The AI-generated content saved us countless hours and improved our developer experience.",
    author: "Alex Johnson",
    role: "CTO",
    company: "Captions",
    companyLogo: "/logos/captions.svg",
  },
  {
    id: "testimonial-2",
    quote: "The one-click deployment and beautiful design made our API docs look professional with minimal effort. Our implementation rates increased by 35%.",
    author: "Sarah Chen",
    role: "Head of Developer Relations",
    company: "Turso",
    companyLogo: "/logos/turso.svg",
  },
  {
    id: "testimonial-3",
    quote: "We leveraged the platform to create interactive documentation. The integration with our existing systems was seamless, and our users love it.",
    author: "Michael Patel",
    role: "Product Manager",
    company: "Perplexity",
    companyLogo: "/logos/perplexity.svg",
  },
];

// Company logos for the trust section
const COMPANY_LOGOS = [
  { id: "logo-1", src: "/logos/anthropic.svg", alt: "Anthropic" },
  { id: "logo-2", src: "/logos/cursor.svg", alt: "Cursor" },
  { id: "logo-3", src: "/logos/fidelity.svg", alt: "Fidelity" },
  { id: "logo-4", src: "/logos/loops.svg", alt: "Loops" },
  { id: "logo-5", src: "/logos/resend.svg", alt: "Resend" },
  { id: "logo-6", src: "/logos/pinecone.svg", alt: "Pinecone" },
]; 