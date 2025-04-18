import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

// Function to read component source code
function readComponentSource(componentPath: string): string {
  return fs.readFileSync(path.join(process.cwd(), componentPath), 'utf8');
}

// Gather all UI components and utilities
const componentSources = {
  'components/sidebars/DefaultSidebar.tsx': readComponentSource('src/components/sidebars/DefaultSidebar.tsx'),
  'components/DocPreview.tsx': readComponentSource('src/components/DocPreview.tsx'),
  'components/ui/scroll-area.tsx': readComponentSource('src/components/ui/scroll-area.tsx'),
  'components/ui/button.tsx': readComponentSource('src/components/ui/button.tsx'),
  'components/ui/separator.tsx': readComponentSource('src/components/ui/separator.tsx'),
  'components/mdx/MdxComponents.tsx': readComponentSource('src/components/mdx/MdxComponents.tsx'),
  'lib/utils.ts': readComponentSource('src/lib/utils.ts'),
};

// Read the component source code
const defaultSidebarSource = fs.readFileSync(
  path.join(process.cwd(), 'src/components/sidebars/DefaultSidebar.tsx'),
  'utf8'
);

const docPreviewSource = fs.readFileSync(
  path.join(process.cwd(), 'src/components/DocPreview.tsx'),
  'utf8'
);

// Template for the deployed site's package.json
const packageJsonTemplate = {
  "name": "api-docs-site",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "15.2.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@mdx-js/react": "^3.1.0",
    "@mdx-js/mdx": "^3.1.0",
    "lucide-react": "^0.487.0",
    "tailwindcss": "^4.1.4",
    "postcss": "^8.5.3",
    "autoprefixer": "^10.4.17",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.2.0",
    "typescript": "^5.3.3",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.47",
    "@types/react-dom": "^18.2.18"
  }
};

// Template for the deployed site's next.config.js
const nextConfigTemplate = `
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

module.exports = nextConfig;
`;

// Template for the deployed site's tailwind.config.js
const tailwindConfigTemplate = `
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

// Template for the main page component that matches our preview exactly
const pageTemplate = (content: string) => {
  // Escape any characters that could cause issues in template literals
  const escapedContent = content
    .replace(/\\/g, '\\\\')     // Escape backslashes
    .replace(/`/g, '\\`')       // Escape backticks
    .replace(/\$/g, '\\$');     // Escape dollar signs

  return `"use client";

import { useState } from 'react';
import { DefaultSidebar } from '../components/DefaultSidebar';
import { DocPreview } from '../components/DocPreview';

// Parse the MDX content to extract the outline
function extractOutline(content) {
  const outline = [];
  const lines = content.split('\\n');
  let currentSection = null;

  lines.forEach(line => {
    const h1Match = line.match(/^# (.*)/);
    const h2Match = line.match(/^## (.*)/);
    const h3Match = line.match(/^### (.*)/);

    if (h1Match) {
      currentSection = {
        id: h1Match[1].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: h1Match[1],
        children: []
      };
      outline.push(currentSection);
    } else if (h2Match && currentSection) {
      const h2Section = {
        id: h2Match[1].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: h2Match[1],
        children: []
      };
      currentSection.children.push(h2Section);
    } else if (h3Match && currentSection && currentSection.children.length > 0) {
      const lastH2 = currentSection.children[currentSection.children.length - 1];
      lastH2.children.push({
        id: h3Match[1].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: h3Match[1]
      });
    }
  });

  return outline;
}

export default function DocsPage() {
  const [selectedSection, setSelectedSection] = useState<string | undefined>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Handler function for selecting a section
  const handleSelectSection = (sectionId: string) => {
    setSelectedSection(sectionId);
  };
  
  // The MDX content is stored as a string
  const docContent = \`${escapedContent}\`;
  const docOutline = extractOutline(docContent);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex transition-all duration-300">
        <DefaultSidebar 
          projectId={process.env.DOCS_PROJECT_ID || ''}
          docOutline={docOutline}
          isOpen={!sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onSelectSection={handleSelectSection}
          activeSection={selectedSection}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <DocPreview 
          projectId={process.env.DOCS_PROJECT_ID || ''}
          content={docContent}
          selectedSection={selectedSection}
          onSelectSection={handleSelectSection}
        />
      </div>
    </div>
  );
}`;
};

// Template for the DefaultSidebar component
const defaultSidebarTemplate = defaultSidebarSource;

// Template for the DocPreview component
const docPreviewTemplate = docPreviewSource;

// Template for the MDX components that match our preview
const mdxComponentsTemplate = `
import { FC, ReactNode } from 'react';
import { Search, Menu, ChevronRight } from 'lucide-react';

// Basic text components
export const H1: FC<{ children: ReactNode }> = ({ children }) => (
  <h1 className="mt-2 mb-4 text-4xl font-bold tracking-tight scroll-m-20" data-section-id={children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
    {children}
  </h1>
);

export const H2: FC<{ children: ReactNode }> = ({ children }) => (
  <h2 className="mt-10 mb-4 text-3xl font-semibold tracking-tight scroll-m-20" data-section-id={children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
    {children}
  </h2>
);

export const H3: FC<{ children: ReactNode }> = ({ children }) => (
  <h3 className="mt-8 mb-4 text-2xl font-semibold tracking-tight scroll-m-20" data-section-id={children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
    {children}
  </h3>
);

export const P: FC<{ children: ReactNode }> = ({ children }) => (
  <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
);

export const Ul: FC<{ children: ReactNode }> = ({ children }) => (
  <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
);

export const Ol: FC<{ children: ReactNode }> = ({ children }) => (
  <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
);

export const Li: FC<{ children: ReactNode }> = ({ children }) => (
  <li>{children}</li>
);

export const Blockquote: FC<{ children: ReactNode }> = ({ children }) => (
  <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
);

export const InlineCode: FC<{ children: ReactNode }> = ({ children }) => (
  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
    {children}
  </code>
);

export const Hr: FC = () => (
  <hr className="my-4 md:my-8" />
);

// API Documentation components
export const Endpoint: FC<{
  method: string;
  path: string;
  children: ReactNode;
}> = ({ method, path, children }) => (
  <div className="my-8 rounded-lg border p-4">
    <div className="flex items-center gap-4">
      <span className={\`px-2.5 py-0.5 text-sm font-semibold rounded-full \${
        method === 'GET' ? 'bg-blue-100 text-blue-800' :
        method === 'POST' ? 'bg-green-100 text-green-800' :
        method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
        method === 'DELETE' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }\`}>
        {method}
      </span>
      <code className="text-sm font-mono font-semibold">{path}</code>
    </div>
    <div className="mt-4">{children}</div>
  </div>
);

export const ParamsTable: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="my-6 rounded-lg border">
    <div className="p-4 border-b bg-muted/50">
      <h4 className="font-semibold">Parameters</h4>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

export const Param: FC<{
  name: string;
  type: string;
  required?: boolean;
  children: ReactNode;
}> = ({ name, type, required, children }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex items-center gap-2">
      <code className="text-sm font-semibold">{name}</code>
      <span className="text-sm text-muted-foreground">{type}</span>
      {required && (
        <span className="text-xs text-red-500">Required</span>
      )}
    </div>
    <p className="mt-1 text-sm text-muted-foreground">{children}</p>
  </div>
);

export const Response: FC<{
  status: number;
  description: string;
  children: ReactNode;
}> = ({ status, description, children }) => (
  <div className="my-6 rounded-lg border">
    <div className="flex items-center justify-between p-4 border-b bg-muted/50">
      <h4 className="font-semibold">Response</h4>
      <div className="flex items-center gap-2">
        <span className={\`px-2.5 py-0.5 text-sm font-semibold rounded-full \${
          status >= 200 && status < 300 ? 'bg-green-100 text-green-800' :
          status >= 300 && status < 400 ? 'bg-blue-100 text-blue-800' :
          status >= 400 && status < 500 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }\`}>
          {status}
        </span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

export const Code: FC<{
  children: ReactNode;
  title?: string;
  language?: string;
}> = ({ children, title, language }) => (
  <div className="my-6 rounded-lg border">
    {title && (
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <span className="text-sm font-medium">{title}</span>
        {language && (
          <span className="text-xs text-muted-foreground">{language}</span>
        )}
      </div>
    )}
    <pre className="p-4 overflow-x-auto">
      <code className="text-sm">{children}</code>
    </pre>
  </div>
);

export const Note: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="my-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-blue-700">{children}</p>
      </div>
    </div>
  </div>
);

export const Warning: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="my-6 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-yellow-700">{children}</p>
      </div>
    </div>
  </div>
);

export const MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  ul: Ul,
  ol: Ol,
  li: Li,
  blockquote: Blockquote,
  code: InlineCode,
  pre: Code,
  hr: Hr,
  Endpoint,
  ParamsTable,
  Param,
  Response,
  Note,
  Warning,
};
`;

// Template for the document layout
const docLayoutTemplate = `
import { FC, ReactNode } from 'react';

interface DocLayoutProps {
  children: ReactNode;
}

export const DocLayout: FC<DocLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-50 w-full border-b backdrop-blur-xl bg-white/80 dark:bg-zinc-950/80 border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center flex-1">
              <nav className="flex items-center space-x-4">
                <span className="text-xl font-semibold">API Documentation</span>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
`;

const additionalPackageJson = {
  "dependencies": {
    "@radix-ui/react-scroll-area": "^1.2.4",
    "@radix-ui/react-separator": "^1.1.3",
    "@radix-ui/react-slot": "^1.2.0",
    "class-variance-authority": "^0.7.1",
    "tailwindcss-animate": "^1.0.7"
  }
};

export async function POST(request: Request) {
  try {
    const { projectId, subdomain, content } = await request.json();

    if (!projectId || !subdomain || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fix component paths for proper importing
    // Create simpler components for the deployment environment
    const simplifiedDefaultSidebar = `// DefaultSidebar component for documentation preview
"use client"

import { FC, useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, FolderOpen, Home, Settings, ChevronDown, BookOpen } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { cn } from '../lib/utils';

interface DocItem {
  id: string;
  title: string;
  children?: DocItem[];
}

interface DefaultSidebarProps {
  projectId: string;
  projectTitle?: string;
  docOutline: any[] | null;
  isOpen?: boolean;
  onToggle?: () => void;
  onSelectSection?: (sectionId: string) => void;
  onSelectFile?: (filename: string) => void;
  activeSection?: string;
  collapsed?: boolean;
  setCollapsed?: (val: boolean) => void;
  filename?: string | null;
}

export const DefaultSidebar: FC<DefaultSidebarProps> = ({
  projectId,
  projectTitle = '',
  docOutline,
  isOpen = true,
  onToggle,
  onSelectSection,
  onSelectFile,
  activeSection,
  collapsed = false,
  setCollapsed,
  filename = null,
}) => {
  // Initialize expandedItems with all top-level items expanded
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(() => {
    if (!docOutline) return {};
    // Create an object with all top-level items set to true
    return docOutline.reduce((acc, item) => {
      acc[item.id] = true; // Set each top-level item to be expanded
      return acc;
    }, {} as Record<string, boolean>);
  });

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderDocItem = (item: DocItem, depth = 0, parentId?: string) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];
    const isActive = activeSection === item.id;

    return (
      <div key={item.id} className="w-full mb-1.5">
        <div
          className={cn(
            "group flex items-center py-3 px-4 rounded-xl transition-all duration-300",
            "backdrop-blur-sm border border-transparent",
            "hover:border-primary/20 hover:bg-primary/5",
            hasChildren && "hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5",
            "relative cursor-pointer",
            !parentId && "font-medium tracking-tight",
            isActive && [
              "bg-gradient-to-r from-primary/15 to-primary/5",
              "border-primary/30 shadow-[0_4px_12px_rgba(var(--primary),0.15)]",
              "text-primary font-medium"
            ],
            depth > 0 && "text-[13px]"
          )}
          style={{ paddingLeft: \`\${depth * 20 + 16}px\` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
              if (onSelectSection) {
                onSelectSection(item.id);
              }
            } else if (onSelectSection) {
              onSelectSection(item.id);
            }
          }}
        >
          {hasChildren ? (
            <span className={cn(
              "w-6 h-6 mr-3 flex items-center justify-center",
              "rounded-lg transition-all duration-300",
              "bg-muted/50 group-hover:bg-primary/10",
              isExpanded && "bg-primary/20 rotate-90",
              isActive && "bg-primary/30"
            )}>
              <ChevronRight size={14} className={cn(
                "text-muted-foreground transition-colors duration-200",
                isActive && "text-primary",
                "group-hover:text-primary"
              )} />
            </span>
          ) : (
            <span className={cn(
              "w-6 h-6 mr-3 flex items-center justify-center",
              "rounded-lg transition-all duration-300",
              "bg-muted/50 group-hover:bg-primary/10",
              isActive && "bg-primary/30"
            )}>
              <FileText size={14} className={cn(
                "text-muted-foreground transition-colors duration-200",
                isActive && "text-primary",
                "group-hover:text-primary"
              )} />
            </span>
          )}
          <span className={cn(
            "truncate transition-all duration-300",
            "text-muted-foreground/90 group-hover:text-foreground",
            isActive && "text-primary font-medium"
          )}>{item.title}</span>
          
          {hasChildren && (
            <div className={cn(
              "ml-auto px-2 py-0.5 rounded-full text-xs",
              "bg-muted/30 text-muted-foreground/70",
              "transition-opacity duration-200",
              "flex items-center justify-center",
              isActive && "bg-primary/10 text-primary"
            )}>
              {item.children?.length || 0}
            </div>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="relative mt-2 mb-2 ml-6">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full bg-gradient-to-b from-primary/5 via-primary/20 to-primary/5" />
            {item.children?.map((child) => renderDocItem(child, depth + 1, parentId || item.id))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "bg-gradient-to-br from-background/80 via-background/70 to-background/90",
        "border-r border-border/20 backdrop-blur-xl",
        "shadow-[1px_0_20px_rgba(0,0,0,0.03)]",
        "flex flex-col h-full relative",
        "transition-all duration-300 ease-out",
        collapsed ? "w-20" : "w-80"
      )}
    >
      <div className={cn(
        "flex items-center justify-between h-16 px-5",
        "border-b border-border/10",
        "bg-gradient-to-r from-background/90 to-background/50",
        "backdrop-blur-xl supports-[backdrop-filter]:bg-background/30",
        "transition-all duration-300 ease-out",
        "relative z-10"
      )}>
        <div className={cn(
          "flex items-center transition-all duration-300",
          collapsed ? "opacity-0 scale-95" : "opacity-100 scale-100 delay-100"
        )}>
          <h2 className={cn(
            "text-xl font-bold tracking-tight",
            "bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent"
          )}>
            {projectTitle || 'Docs'}
          </h2>
        </div>
        {(setCollapsed || onToggle) && (
          <Button 
            variant="ghost" 
            size="icon"
            className={cn(
              "rounded-xl transition-all duration-300", 
              "bg-background/60 backdrop-blur-sm border border-border/20",
              "hover:bg-primary/5 hover:border-primary/30 hover:text-primary",
              "active:scale-95 hover:scale-105 shadow-sm hover:shadow",
              collapsed ? "mx-auto" : "ml-auto"
            )} 
            onClick={() => {
              if (setCollapsed) setCollapsed(!collapsed);
              if (onToggle) onToggle();
            }}
          >
            <ChevronRight 
              className={cn(
                "h-4 w-4 transition-transform duration-500 ease-in-out",
                collapsed ? "rotate-180" : "rotate-0"
              )} 
            />
          </Button>
        )}
      </div>

      {collapsed ? (
        <div className="flex flex-col items-center pt-8 pb-4 space-y-6"></div>
      ) :
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden",
          "transition-all duration-300 ease-out",
          collapsed ? "opacity-0 scale-95" : "opacity-100 scale-100 delay-100"
        )}>
          <ScrollArea className="flex-1 px-5 py-2">
            <div className="py-3 space-y-1">
              {docOutline ? (
                docOutline.map(item => renderDocItem(item, 0))
              ) : (
                <div></div>
              )}
            </div>
          </ScrollArea>
        </div>
      }
    </aside>
  );
};`;

    const simplifiedDocPreview = `// DocPreview component for documentation preview
"use client"

import { FC, useEffect, useState, useRef } from 'react';
import { Loader2, Search } from "lucide-react";
import { cn } from "../lib/utils";
import { ScrollArea } from "../components/ui/scroll-area";

interface DocPreviewProps {
  projectId: string;
  content?: string;
  selectedSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

export const DocPreview: FC<DocPreviewProps> = ({ 
  content, 
  selectedSection, 
  onSelectSection,
  projectId 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Scroll to section when selected
  useEffect(() => {
    if (selectedSection && scrollAreaRef.current) {
      const element = document.querySelector(\`[data-section-id="\${selectedSection}"]\`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedSection]);

  // Render the MDX content as plain HTML
  const renderContent = () => {
    if (!content) return <div>No content available</div>;
    
    // Simple conversion of markdown headings and paragraphs
    const html = content
      .replace(/^# (.*$)/gm, '<h1 class="mt-2 mb-4 text-4xl font-bold tracking-tight scroll-m-20" data-section-id="$1">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="mt-10 mb-4 text-3xl font-semibold tracking-tight scroll-m-20" data-section-id="$1">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="mt-8 mb-4 text-2xl font-semibold tracking-tight scroll-m-20" data-section-id="$1">$1</h3>')
      .replace(/(?:^|\\n)(?!#)(.*?)(?:\\n|$)/g, '<p class="leading-7 [&:not(:first-child)]:mt-6">$1</p>');
    
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="w-full h-full transition-all duration-300 bg-background">
      <div className="sticky top-0 z-50 w-full px-4 py-3 border-b backdrop-blur-xl bg-background/80 border-border/30">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="relative flex items-center overflow-hidden transition-all duration-300 backdrop-blur-sm shadow-sm border border-border/40 rounded-xl bg-background/60 group">
              <div className="absolute left-3 transition-colors duration-300">
                <Search className="w-5 h-5 text-muted-foreground/60 group-focus-within:text-primary" />
              </div>
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full h-full px-11 py-3 transition-all duration-300 bg-transparent outline-none placeholder:text-muted-foreground/50 text-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="h-full" ref={scrollAreaRef}>
        <div className="max-w-3xl p-8 mx-auto">
          <article className="prose max-w-none">
            {renderContent()}
          </article>
        </div>
      </ScrollArea>
    </div>
  );
};`;

    const simplifiedUtils = `// Utility functions
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

    const simplifiedScrollArea = `// ScrollArea component
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "../../lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }`;

    const simplifiedButton = `// Button component
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`;

    const simplifiedSeparator = `// Separator component
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "../../lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }`;

    // Create a new deployment using Vercel API
    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: subdomain,
        target: 'production',
        project: process.env.VERCEL_PROJECT_ID,
        files: [
          {
            file: 'package.json',
            data: JSON.stringify({
              ...packageJsonTemplate,
              dependencies: {
                ...packageJsonTemplate.dependencies,
                ...additionalPackageJson.dependencies
              }
            }, null, 2),
          },
          {
            file: 'next.config.js',
            data: nextConfigTemplate,
          },
          {
            file: 'tailwind.config.js',
            data: tailwindConfigTemplate,
          },
          {
            file: 'app/page.tsx',
            data: pageTemplate(content),
          },
          // Use our simplified components with fixed import paths
          {
            file: 'components/DefaultSidebar.tsx',
            data: simplifiedDefaultSidebar,
          },
          {
            file: 'components/DocPreview.tsx',
            data: simplifiedDocPreview,
          },
          {
            file: 'components/ui/scroll-area.tsx',
            data: simplifiedScrollArea,
          },
          {
            file: 'components/ui/button.tsx',
            data: simplifiedButton,
          },
          {
            file: 'components/ui/separator.tsx',
            data: simplifiedSeparator,
          },
          {
            file: 'lib/utils.ts',
            data: simplifiedUtils,
          },
          {
            file: 'app/globals.css',
            data: `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}`,
          },
          {
            file: 'app/layout.tsx',
            data: `
import './globals.css';
              
export const metadata = {
  title: 'API Documentation',
  description: 'Generated API documentation',
};
              
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
            `,
          },
        ],
        env: {
          DOCS_PROJECT_ID: projectId,
          DOCS_SUBDOMAIN: subdomain,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Vercel API error:', error);
      return NextResponse.json(
        { error: 'Failed to create deployment' },
        { status: response.status }
      );
    }

    const deploymentData = await response.json();
    
    // Use the Vercel-provided deployment URL
    const deploymentUrl = deploymentData.url;
    console.log('Deployment URL:', deploymentUrl);

    // Update the publish record with the deployment URL
    await supabase
      .from('published_docs')
      .update({
        status: 'published',
        url: `https://${deploymentUrl}`
      })
      .eq('project_id', projectId);

    return NextResponse.json({
      deploymentId: deploymentData.id,
      url: `https://${deploymentUrl}`,
    });
  } catch (error) {
    console.error('Error in publish API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 