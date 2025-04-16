import React, { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * CodeGroup component for displaying multiple code blocks in tabs
 * Modern, minimal design with border-only styling and no backgrounds
 */
interface CodeProps {
  title?: string
  children: React.ReactNode
  className?: string
  language?: string
}

interface CodeGroupProps {
  children: React.ReactNode
  className?: string
}

// Add a proper interface for element props
interface ElementProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  [key: string]: any;
}

// Interface for processed code block
interface ProcessedCodeBlockProps {
  className?: string;
  children?: React.ReactNode;
  'data-type': 'processed';
  'data-language': string;
  'data-title': string;
  [key: string]: any;
}

// Type guard for processed code blocks
function isProcessedCodeBlock(props: any): props is ProcessedCodeBlockProps {
  return (
    typeof props === 'object' &&
    props !== null &&
    'data-type' in props &&
    props['data-type'] === 'processed'
  );
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
        "absolute right-3 top-3 p-2 rounded-full transition-all duration-200",
        "border border-gray-200/50 dark:border-gray-800/60",
        "bg-white/60 dark:bg-black/60 backdrop-blur-sm",
        "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
        "focus:outline-none focus:ring-2 focus:ring-gray-300/40 dark:focus:ring-gray-700/40 shadow-sm",
        className
      )}
    >
      {copied ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
      <span className="sr-only">Copy</span>
    </button>
  )
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
  http: 'HTTP',
}

// Add this function before the CodeGroup component
/**
 * Preprocesses code content to fix common MDX parsing issues:
 * - Fixes backticks in object literals
 * - Ensures proper escaping of problematic characters
 */
function preprocessCode(code: string): string {
  if (!code) return code;
  
  return code
    // Fix backticks in object literals by converting to single quotes
    .replace(/({[^}]*)`([^`]*)`([^}]*})/g, (match, start, content, end) => {
      // If it's an object literal property with backticks, convert to single quotes
      return `${start}'${content}'${end}`;
    })
    // Fix any remaining unescaped backticks that aren't part of code blocks
    .replace(/(?<!\\)`(?!`)/g, '\\`')
    // Ensure proper escaping of curly braces in code blocks
    .replace(/(?<!\\){(?!`)/g, '\\{')
    .replace(/(?<!\\)}(?!`)/g, '\\}');
}

export function CodeGroup({ children, className }: CodeGroupProps) {
  const [activeTab, setActiveTab] = useState(0)
  const childrenArray = React.Children.toArray(children)

  // Process children to handle both JSX components and markdown code blocks
  const processedChildren = childrenArray.map((child, index) => {
    // Handle markdown code blocks that are passed as string children
    if (typeof child === 'string') {
      const match = child.trim().match(/^```([a-zA-Z0-9+#]+)(?:\s+([^\n]+))?\n([\s\S]*?)```$/);
      if (match) {
        const [, language, title, code] = match;
        const displayTitle = title || LANGUAGE_NAMES[language.toLowerCase()] || language;
        
        // Preprocess the code content
        const processedCode = preprocessCode(code);
        
        return React.createElement('div', {
          key: `${index}-${displayTitle}`,
          className: "font-mono text-sm processed-code-block",
          'data-type': 'processed',
          'data-language': language,
          'data-title': displayTitle,
          children: processedCode
        });
      }
    }
    
    // Handle regular JSX components (likely our <Code> component)
    if (React.isValidElement(child)) {
      const element = child as React.ReactElement<ElementProps>;
      
      // If the child has string content, preprocess it
      if (typeof element.props.children === 'string') {
        return React.cloneElement(element, {
          ...element.props,
          children: preprocessCode(element.props.children)
        });
      }
      
      // If the child has nested content, process it recursively
      if (React.isValidElement(element.props.children)) {
        const nestedElement = element.props.children as React.ReactElement<ElementProps>;
        if (nestedElement.props?.children && typeof nestedElement.props.children === 'string') {
          return React.cloneElement(element, {
            ...element.props,
            children: React.cloneElement(nestedElement, {
              ...nestedElement.props,
              children: preprocessCode(nestedElement.props.children)
            })
          });
        }
      }
    }
    
    return child;
  });

  // Extract content to copy from the active tab
  const getContentToCopy = () => {
    const activeChild = processedChildren[activeTab];
    
    // For processed markdown code blocks
    if (React.isValidElement(activeChild) && 
        isProcessedCodeBlock(activeChild.props)) {
      return String(activeChild.props.children || '');
    }
    
    // For JSX components
    if (React.isValidElement(activeChild)) {
      const activeElement = activeChild as React.ReactElement<ElementProps>;
      
      // If direct string child
      if (typeof activeElement.props.children === 'string') {
        return activeElement.props.children;
      }
      
      // If nested in a code element
      if (React.isValidElement(activeElement.props.children)) {
        const nestedElement = activeElement.props.children as React.ReactElement<ElementProps>;
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
      
      return extractNestedContent(activeElement.props.children);
    }
    
    return '';
  };

  // Get language and title for tab display
  const getTabInfo = (child: React.ReactNode, index: number) => {
    // For processed markdown code blocks
    if (React.isValidElement(child) && 
        isProcessedCodeBlock(child.props)) {
      return {
        title: child.props['data-title'] || `Tab ${index + 1}`,
        language: child.props['data-language'] || ''
      };
    }
    
    // For JSX components
    if (React.isValidElement(child)) {
      const element = child as React.ReactElement<ElementProps>;
      
      // Try to get language from className (e.g., "language-javascript")
      let language = '';
      if (element.props.className) {
        const match = String(element.props.className).match(/language-(\w+)/);
        if (match) {
          language = match[1].toLowerCase();
        }
      }
      
      // Get title from props or language
      const title = element.props.title || 
                   (language && LANGUAGE_NAMES[language]) || 
                   `Tab ${index + 1}`;
                   
      return { title, language };
    }
    
    return { title: `Tab ${index + 1}`, language: '' };
  };

  return (
    <div className={cn(
      "relative my-6 overflow-hidden rounded-3xl border border-gray-200/50 dark:border-gray-800/80", 
      "shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm",
      className
    )}>
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200/50 dark:border-gray-800/80 scrollbar-none">
        {processedChildren.map((child, index) => {
          const { title } = getTabInfo(child, index);
          
          return (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={cn(
                'px-5 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200',
                activeTab === index
                  ? 'border-b-2 border-gray-800 text-gray-900 dark:border-gray-200 dark:text-gray-100'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              )}
            >
              {title}
            </button>
          );
        })}
      </div>
      
      {/* Content - clean minimal style */}
      <div className="relative p-5 font-mono text-sm text-gray-800 dark:text-gray-200">
        {processedChildren[activeTab]}
        <CopyButton value={getContentToCopy()} />
      </div>
    </div>
  )
}

export function Code({ title, children, className }: CodeProps) {
  return (
    <div className={cn("font-mono text-sm", className)}>
      {children}
    </div>
  )
} 