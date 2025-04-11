import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Check, Copy } from 'lucide-react'

/**
 * CodeGroup component for displaying multiple code blocks in tabs
 * Used for API documentation to show examples in different languages
 */
interface CodeProps {
  title?: string
  children: React.ReactNode
  className?: string
  language?: string
}

interface CodeGroupProps {
  children: React.ReactNode
  // Add any additional props needed for the code group
  className?: string
}

// Add a proper interface for element props
interface ElementProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  [key: string]: any;
}

// Language display names mapping
const LANGUAGE_NAMES: { [key: string]: string } = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JavaScript (JSX)',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TypeScript (JSX)',
  bash: 'Bash',
  shell: 'Shell',
  sh: 'Shell',
  zsh: 'Shell',
  python: 'Python',
  py: 'Python',
  ruby: 'Ruby',
  rb: 'Ruby',
  go: 'Go',
  rust: 'Rust',
  rs: 'Rust',
  java: 'Java',
  kotlin: 'Kotlin',
  kt: 'Kotlin',
  swift: 'Swift',
  cpp: 'C++',
  'c++': 'C++',
  c: 'C',
  csharp: 'C#',
  cs: 'C#',
  php: 'PHP',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  sql: 'SQL',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  xml: 'XML',
  graphql: 'GraphQL',
  mdx: 'MDX',
  md: 'Markdown',
  dockerfile: 'Dockerfile',
  docker: 'Dockerfile',
}

/**
 * A reusable copy button component for copying content
 */
function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={onCopy}
      className={cn(
        "absolute right-3 top-3 z-10 rounded-full p-2 transition-all duration-200",
        "bg-gray-100/90 hover:bg-gray-200/90 dark:bg-gray-800/90 dark:hover:bg-gray-700/90",
        "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm",
        className
      )}
    >
      {copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
      <span className="sr-only">Copy</span>
    </button>
  )
}

export function CodeGroup({ children, className }: CodeGroupProps) {
  const [activeTab, setActiveTab] = useState(0)
  const childrenArray = React.Children.toArray(children)

  // Extract content to copy from the active tab
  const getContentToCopy = () => {
    const activeChild = childrenArray[activeTab] as React.ReactElement<ElementProps>;
    
    // Improved content extraction logic
    if (activeChild && activeChild.props) {
      // If direct string child
      if (typeof activeChild.props.children === 'string') {
        return activeChild.props.children;
      }
      
      // If nested in a code element
      if (React.isValidElement(activeChild.props.children)) {
        const nestedElement = activeChild.props.children as React.ReactElement<ElementProps>;
        if (nestedElement.props?.children && typeof nestedElement.props.children === 'string') {
          return nestedElement.props.children;
        }
      }
      
      // If wrapped in multiple levels (handle MDX compiled structure)
      const extractNestedContent = (node: React.ReactNode): string => {
        if (typeof node === 'string') {
          return node;
        }
        
        if (React.isValidElement(node)) {
          const element = node as React.ReactElement<ElementProps>;
          if (typeof element.props?.children === 'string') {
            return element.props.children;
          }
          if (Array.isArray(element.props?.children)) {
            return element.props.children.map(extractNestedContent).join('');
          }
          if (element.props?.children) {
            return extractNestedContent(element.props.children);
          }
        }
        
        return '';
      };
      
      return extractNestedContent(activeChild.props.children);
    }
    
    return '';
  };

  // Extract language from className (e.g., "language-javascript" -> "JavaScript")
  const getLanguageFromClassName = (className?: string) => {
    if (!className) return '';
    
    // First, try to match language-* pattern
    const match = className.match(/language-(\w+)/);
    if (match) {
      const lang = match[1].toLowerCase();
      return LANGUAGE_NAMES[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
    }
    
    // For MDX-generated code blocks, check for direct language names in the className
    for (const lang of Object.keys(LANGUAGE_NAMES)) {
      if (className.toLowerCase().includes(lang.toLowerCase())) {
        return LANGUAGE_NAMES[lang];
      }
    }
    
    return '';
  };

  return (
    <div className={cn(
      "relative my-6 overflow-hidden rounded-2xl border border-gray-800 shadow-sm backdrop-blur-sm dark:shadow-md dark:shadow-black/10", 
      className
    )}>
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-800 scrollbar-none rounded-t-2xl">
        {childrenArray.map((child: any, index) => {
          const language = getLanguageFromClassName(child.props?.className);
          const title = child.props?.title || language || `Tab ${index + 1}`;
          
          return (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={cn(
                'px-5 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200',
                activeTab === index
                  ? 'border-b-2 border-blue-500 text-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              )}
            >
              {title}
            </button>
          );
        })}
      </div>
      
      {/* Content */}
      <div className="relative p-5">
        {childrenArray[activeTab]}
        <CopyButton value={getContentToCopy()} />
      </div>
    </div>
  )
}

export function Code({ title, children, className }: CodeProps) {
  // Determine if this is a code block inside a CodeGroup
  const isInCodeGroup = React.useContext(React.createContext<boolean>(false));
  
  return (
    <div className={cn("font-mono text-sm", className)}>
      {children}
    </div>
  )
} 