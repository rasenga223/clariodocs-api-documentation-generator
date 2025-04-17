import Link from "next/link";
import { Github } from "lucide-react";

// Custom X (formerly Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    aria-hidden="true" 
    className={className}
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FooterSection = ({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) => (
  <div className="flex flex-col gap-4">
    <h3 className="text-sm font-semibold text-white">{title}</h3>
    <ul className="flex flex-col gap-2">
      {links.map((link) => (
        <li key={link.name}>
          <Link
            href={link.href}
            className="text-sm transition-colors text-zinc-400 hover:text-green-400"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="px-4 py-12 mx-auto max-w-7xl">
        {/* Main footer content */}
        <div className="grid grid-cols-2 gap-8 pb-12 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand section */}
          <div className="flex flex-col col-span-2 gap-6 lg:col-span-2">
            <Link href="/" className="group">
              <span className="text-xl font-semibold text-transparent transition-colors bg-gradient-to-r from-white to-zinc-300 bg-clip-text hover:from-green-400 hover:to-emerald-500">
                Clariodocs
              </span>
            </Link>
            <p className="max-w-sm text-sm text-zinc-400">
              Transform your API specifications into beautiful, comprehensive documentation 
              with our AI-powered platform.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://x.com/clariodocs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X (formerly Twitter)"
                className="p-2 transition-colors border rounded-lg border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-green-400"
              >
                <XIcon className="w-5 h-5" />
              </Link>
              <Link
                href="https://github.com/clariodocs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our GitHub repository"
                className="p-2 transition-colors border rounded-lg border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-green-400"
              >
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Product links */}
          <FooterSection
            title="Product"
            links={[
              { name: "Features", href: "/features" },
              { name: "Pricing", href: "/pricing" },
              { name: "Documentation", href: "/docs" },
              { name: "API Reference", href: "/api" },
              { name: "Integration Guide", href: "/integration" },
            ]}
          />

          {/* Resources links */}
          <FooterSection
            title="Resources"
            links={[
              { name: "Blog", href: "/blog" },
              { name: "Examples", href: "/examples" },
              { name: "Changelog", href: "/changelog" },
              { name: "Status", href: "/status" },
            ]}
          />

          {/* Company links */}
          <FooterSection
            title="Company"
            links={[
              { name: "About", href: "/about" },
              { name: "Contact", href: "/contact" },
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Terms of Service", href: "/terms" },
            ]}
          />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 border-t border-zinc-800 md:flex-row">
          <p className="text-sm text-zinc-400">
            © {new Date().getFullYear()} Clariodocs. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm transition-colors text-zinc-400 hover:text-green-400"
            >
              Privacy
            </Link>
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <Link
              href="/terms"
              className="text-sm transition-colors text-zinc-400 hover:text-green-400"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
