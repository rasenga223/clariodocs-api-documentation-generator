import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea } from "@/components/ui/scroll-area"
import { CodeGroup } from '@/components/ui/code-group'
import { Check, Copy, Clipboard } from 'lucide-react'

/**
 * A collection of Mintlify-style MDX components for API documentation
 * These components will render in the MDX preview and provide beautiful,
 * consistent styling for documentation elements.
 */

// =============================================================================
// UTILITY COMPONENTS
// =============================================================================

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
        "absolute right-3 top-3 p-2 rounded-2xl transition-all duration-200",
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

// =============================================================================
// BASIC TEXT COMPONENTS
// =============================================================================

export function H1({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 
      className={cn(
        "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
        className
      )} 
      {...props}
    >
      {children}
    </h1>
  )
}

export const H2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className, ...props }) => {
  // Convert children (assumed to be text) into a slug
  const text = React.Children.toArray(children).reduce((acc: string, child) => {
    if (typeof child === 'string') return acc + child;
    if (typeof child === 'number') return acc + child.toString();
    return acc;
  }, "");
  const slug = text.toLowerCase().trim().replace(/\s+/g, '-'); // simple slugify
  return (
    <h2 
      id={slug} 
      data-section-id={slug} 
      className={cn(
        "mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

export function H3({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )} 
      {...props}
    >
      {children}
    </h3>
  )
}

export function P({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} 
      {...props}
    >
      {children}
    </p>
  )
}

export function Ul({ children, className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul 
      className={cn("my-6 ml-6 list-disc", className)} 
      {...props}
    >
      {children}
    </ul>
  )
}

export function Ol({ children, className, ...props }: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol 
      className={cn("my-6 ml-6 list-decimal", className)} 
      {...props}
    >
      {children}
    </ol>
  )
}

export function Li({ children, className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li 
      className={cn("mt-2", className)} 
      {...props}
    >
      {children}
    </li>
  )
}

export function Blockquote({ children, className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote 
      className={cn(
        "mt-6 border-l-4 border-gray-300 pl-6 italic text-gray-700 dark:border-gray-600 dark:text-gray-300",
        className
      )} 
      {...props}
    >
      {children}
    </blockquote>
  )
}

export function InlineCode({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "relative rounded-2xl px-[0.3rem] py-[0.1rem] font-mono text-sm border border-gray-200/50 dark:border-gray-800/80 text-gray-700 dark:text-gray-300",
        className
      )}
      {...props}
    >
      {children}
    </code>
  )
}

export function Hr({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={cn("my-8 border-gray-200 dark:border-gray-800", className)}
      {...props}
    />
  )
}

// =============================================================================
// API DOCUMENTATION COMPONENTS
// =============================================================================

interface EndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | string
  path: string
  children?: React.ReactNode
  className?: string
  description?: string
}

export function Endpoint({ method, path, children, className, description }: EndpointProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const methodColors = {
    GET: "border-green-200 text-green-700 dark:border-green-900/50 dark:text-green-400",
    POST: "border-blue-200 text-blue-700 dark:border-blue-900/50 dark:text-blue-400",
    PUT: "border-yellow-200 text-yellow-700 dark:border-yellow-900/50 dark:text-yellow-400",
    DELETE: "border-red-200 text-red-700 dark:border-red-900/50 dark:text-red-400",
    PATCH: "border-purple-200 text-purple-700 dark:border-purple-900/50 dark:text-purple-400",
    OPTIONS: "border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-400",
  } as const;
  
  const methodColor = methodColors[method.toUpperCase() as keyof typeof methodColors] || methodColors.OPTIONS;

  const handleCopy = () => {
    navigator.clipboard.writeText(path);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  return (
    <div className={cn(
      "my-6 relative rounded-3xl border border-gray-200/50 dark:border-gray-800/80 backdrop-blur-sm", 
      "shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      {/* Header Section - No bottom border when collapsed */}
      <div className={cn(
        "flex items-center justify-between px-5 py-4",
        (isExpanded && (description || children)) && "border-b border-gray-200/50 dark:border-gray-800/80"
      )}>
        <div className="flex items-center flex-1 min-w-0">
          <div className={cn("px-3 py-1 mr-3 text-sm font-medium rounded-2xl border whitespace-nowrap", methodColor)}>
            {method.toUpperCase()}
          </div>
          <code className="font-mono text-sm font-semibold text-gray-800 truncate dark:text-gray-200">
            {path}
          </code>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button 
            onClick={handleCopy}
            className="p-2 text-gray-400 transition-colors rounded-2xl hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            title="Copy endpoint path"
          >
            {isCopied ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
            <span className="sr-only">{isCopied ? 'Copied!' : 'Copy endpoint path'}</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 transition-colors rounded-2xl hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            title={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            <svg 
              className={cn("w-4 h-4 transition-transform", isExpanded ? 'rotate-180' : '')} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
            <span className="sr-only">{isExpanded ? 'Collapse' : 'Expand'}</span>
          </button>
        </div>
      </div>

      {/* Description Section - Only show if expanded */}
      {isExpanded && description && (
        <div className="px-5 py-3 text-sm text-gray-600 border-b dark:text-gray-400 border-gray-200/50 dark:border-gray-800/80">
          {description}
        </div>
      )}

      {/* Content Section - Only show if expanded */}
      {isExpanded && children && (
        <div className="px-5 py-4 space-y-6">
          {children}
        </div>
      )}
    </div>
  )
}

interface ParamProps {
  name: string
  type?: string
  required?: boolean
  children?: React.ReactNode
  className?: string
}

export function Param({ name, type = "string", required = false, children, className }: ParamProps) {
  return (
    <div className={cn("mb-4 last:mb-0", className)}>
      <div className="flex items-center mb-1">
        <code className="font-mono text-sm font-semibold">{name}</code>
        <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">{type}</div>
        {required && (
          <div className="ml-2 text-xs font-medium text-red-500 dark:text-red-400 px-2 py-0.5 bg-red-50 dark:bg-red-900/30 rounded-full">Required</div>
        )}
      </div>
      {children && <div className="text-sm text-gray-700 dark:text-gray-300">{children}</div>}
    </div>
  )
}

interface ParamsTableProps {
  children: React.ReactNode
  className?: string
}

export function ParamsTable({ children, className }: ParamsTableProps) {
  return (
    <div className={cn(
      "my-6 overflow-hidden rounded-3xl border border-gray-200/50 dark:border-gray-800/80 backdrop-blur-sm", 
      "shadow-sm",
      className
    )}>
      <div className="px-5 py-3 text-sm font-medium text-gray-700 border-b border-gray-200/50 dark:border-gray-800/80 dark:text-gray-300">
        Parameters
      </div>
      <div className="p-5 space-y-3">
        {children}
      </div>
    </div>
  )
}

// Define interface for child props
interface ChildProps {
  'data-parent'?: string;
  [key: string]: any;
}

// Add interface for CodeGroup props
interface CodeGroupElement extends React.ReactElement {
  type: typeof CodeGroup;
  props: {
    children: React.ReactNode;
  };
}

interface ResponseProps {
  status: number
  description?: string
  children?: React.ReactNode
  className?: string
}

export function Response({ status, description, children, className }: ResponseProps) {
  const statusColors = {
    2: "text-green-600 dark:text-green-400",  // 2xx
    3: "text-blue-600 dark:text-blue-400",    // 3xx
    4: "text-yellow-600 dark:text-yellow-400", // 4xx
    5: "text-red-600 dark:text-red-400",      // 5xx
  } as const;
  
  const statusColor = statusColors[Math.floor(status / 100) as keyof typeof statusColors] || statusColors[5];

  // Process children to handle code blocks directly
  const processedChildren = React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;

    // Check if it's a CodeGroup component
    if (child.type === CodeGroup) {
      return (child as CodeGroupElement).props.children;
    }
    return child;
  });
  
  return (
    <div className={cn("my-4", className)}>
      <div className="flex items-center gap-2 mb-2">
        <div className={cn("font-mono text-sm font-medium", statusColor)}>
          {status}
        </div>
        {description && <div className="text-sm text-gray-700 dark:text-gray-300">{description}</div>}
      </div>
      <div className="space-y-3">
        {processedChildren}
      </div>
    </div>
  )
}

// =============================================================================
// CALLOUT COMPONENTS
// =============================================================================

interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success' | 'tip'
  title?: string
  children: React.ReactNode
  className?: string
}

export function Callout({ type = 'info', title, children, className }: CalloutProps) {
  const styles = {
    info: "border-blue-200/60 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800/60 dark:text-blue-400",
    warning: "border-yellow-200/60 bg-yellow-50/50 dark:bg-yellow-950/20 dark:border-yellow-800/60 dark:text-yellow-400",
    error: "border-red-200/60 bg-red-50/50 dark:bg-red-950/20 dark:border-red-800/60 dark:text-red-400",
    success: "border-green-200/60 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800/60 dark:text-green-400",
    tip: "border-purple-200/60 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-800/60 dark:text-purple-400",
  };
  
  const iconStyles = {
    info: "text-blue-600 dark:text-blue-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    error: "text-red-600 dark:text-red-400",
    success: "text-green-600 dark:text-green-400",
    tip: "text-purple-600 dark:text-purple-400",
  };
  
  const defaultTitles = {
    info: "Note",
    warning: "Warning",
    error: "Error",
    success: "Success",
    tip: "Tip",
  };
  
  const icons = {
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    tip: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  };
  
  return (
    <div className={cn(
      "my-6 rounded-3xl border p-5 shadow-sm backdrop-blur-sm", 
      styles[type], 
      className
    )}>
      <div className="flex items-start">
        <div className={cn("mr-3 mt-0.5", iconStyles[type])}>
          {icons[type]}
        </div>
        <div className="flex-1">
          {(title || defaultTitles[type]) && (
            <div className={cn("mb-2 font-medium", iconStyles[type])}>
              {title || defaultTitles[type]}
            </div>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// CODE COMPONENTS
// =============================================================================

interface CodeProps {
  children: React.ReactNode
  title?: string
  className?: string
  'data-parent'?: string
  [key: string]: any
}

export function Code({ children, title, className, 'data-parent': parent, ...props }: CodeProps) {
  const codeContent = typeof children === 'string' ? children : '';
  const showCopyButton = !parent || (parent !== 'codegroup' && parent !== 'response');
  const isNested = parent === 'response' || parent === 'codegroup';
  
  const preClassName = cn(
    "my-0 overflow-x-auto p-4 font-mono text-sm text-gray-800 dark:text-gray-300",
    isNested 
      ? "border-t border-gray-200/50 dark:border-gray-800/80"
      : cn(
          "border border-gray-200/50 dark:border-gray-800/80 shadow-sm",
          title ? "rounded-b-2xl rounded-t-none border-t-0" : "rounded-2xl"
        ),
    className
  );
  
  return (
    <div className="relative">
      {title && (
        <div className={cn(
          "px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400",
          isNested ? "border-t border-gray-200/50 dark:border-gray-800/80" : "border-t border-l border-r border-gray-200/50 dark:border-gray-800/80 rounded-t-2xl"
        )}>
          {title}
        </div>
      )}
      <pre className={preClassName}>
        <code className="block" {...props}>
          {children}
        </code>
      </pre>
      {showCopyButton && <CopyButton value={codeContent} className={title ? "top-11" : ""} />}
    </div>
  )
}

// Re-export CodeGroup
export { CodeGroup }

// =============================================================================
// CARD COMPONENTS
// =============================================================================

interface CardProps {
  title?: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
  href?: string
}

export function Card({ title, icon, children, className, href }: CardProps) {
  const CardWrapper = href ? 'a' : 'div';
  
  return (
    <CardWrapper 
      href={href}
      className={cn(
        "my-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/80 p-6 backdrop-blur-sm", 
        "shadow-sm hover:shadow-md transition-all duration-300",
        href && "block no-underline hover:bg-gray-50/50 dark:hover:bg-gray-800/30",
        className
      )}
    >
      {(title || icon) && (
        <div className="flex items-center mb-4">
          {icon && <div className="mr-3">{icon}</div>}
          {title && <h3 className={cn(
            "text-lg font-semibold text-gray-800 dark:text-gray-200",
            href && "hover:text-gray-600 dark:hover:text-gray-300"
          )}>{title}</h3>}
        </div>
      )}
      <div className={cn(
        "text-gray-600 dark:text-gray-400",
        href && "hover:text-gray-500 dark:hover:text-gray-300"
      )}>{children}</div>
    </CardWrapper>
  )
}

interface CardGroupProps {
  children: React.ReactNode
  className?: string
}

export function CardGroup({ children, className }: CardGroupProps) {
  return (
    <div className={cn(
      "my-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", 
      className
    )}>
      {children}
    </div>
  )
}

// =============================================================================
// TAB COMPONENTS
// =============================================================================

interface TabProps {
  title: string
  children: React.ReactNode
  className?: string
}

interface TabsProps {
  children: React.ReactNode
  className?: string
}

export function Tabs({ children, className }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(0)
  const childrenArray = React.Children.toArray(children) as React.ReactElement<TabProps>[]

  return (
    <div className={cn(
      "my-6 rounded-3xl border border-gray-200/50 overflow-hidden shadow-sm backdrop-blur-sm dark:border-gray-800/80", 
      className
    )}>
      <div className="flex overflow-x-auto border-b border-gray-200/50 dark:border-gray-800/80 scrollbar-none">
        {childrenArray.map((child, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={cn(
              "px-5 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200",
              activeTab === index
                ? "border-b-2 border-gray-800 text-gray-900 dark:border-gray-200 dark:text-gray-100"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            )}
          >
            {child.props.title}
          </button>
        ))}
      </div>
      <div className="relative p-5">
        {childrenArray[activeTab]}
      </div>
    </div>
  )
}

export function Tab({ children, className }: TabProps) {
  return <div className={cn("text-gray-600 dark:text-gray-400", className)}>{children}</div>
}

// =============================================================================
// ACCORDION COMPONENTS
// =============================================================================

interface AccordionItemProps {
  title: string
  children: React.ReactNode
  className?: string
}

interface AccordionProps {
  children: React.ReactNode
  className?: string
}

export function Accordion({ children, className }: AccordionProps) {
  return (
    <div className={cn(
      "my-6 divide-y divide-gray-200/50 rounded-3xl border border-gray-200/50 shadow-sm backdrop-blur-sm dark:divide-gray-800/80 dark:border-gray-800/80", 
      className
    )}>
      {children}
    </div>
  )
}

export function AccordionItem({ title, children, className }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-5 py-4 text-sm font-medium text-left text-gray-800 transition-colors duration-200 hover:bg-gray-50/50 dark:text-gray-100 dark:hover:bg-gray-800/30"
      >
        <span>{title}</span>
        <svg
          className={cn(
            "h-5 w-5 text-gray-500 transition-transform duration-200 dark:text-gray-400",
            isOpen ? "rotate-180 transform" : ""
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="px-5 pt-0 pb-4 text-gray-600 dark:text-gray-400">{children}</div>}
    </div>
  )
}

// =============================================================================
// TECHNICAL DOCUMENTATION COMPONENTS
// =============================================================================

interface RateLimitProps {
  limit: string;
  period: string;
  children?: React.ReactNode;
  className?: string;
}

export function RateLimit({ limit, period, children, className }: RateLimitProps) {
  return (
    <div className={cn(
      "my-6 relative border rounded-3xl", 
      "border-amber-200/60 dark:border-amber-800/50",
      "bg-amber-50/50 dark:bg-amber-950/20",
      "shadow-sm hover:shadow-md transition-all duration-300",
      "overflow-hidden",
      className
    )}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-amber-200/60 dark:border-amber-800/50 bg-amber-100/50 dark:bg-amber-900/30">
        <div className="flex items-center">
          <svg 
            className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-400" 
            fill="none" 
            strokeWidth="1.5" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium text-amber-900 dark:text-amber-100">Rate Limit</span>
        </div>
        <div className="px-3 py-1 font-mono text-sm border rounded-full text-amber-800 dark:text-amber-200 border-amber-200/70 dark:border-amber-700/50 bg-white/80 dark:bg-black/50">
          {limit} / {period}
        </div>
      </div>
      <div className="p-5 text-amber-800 dark:text-amber-200">
        {children}
      </div>
    </div>
  )
}

interface ApiResourceProps {
  name: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function ApiResource({ name, description, children, className }: ApiResourceProps) {
  return (
    <div className={cn(
      "my-6 relative border border-gray-200/50 dark:border-gray-800/80 rounded-3xl backdrop-blur-sm", 
      "shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="px-5 py-4 border-b border-gray-200/50 dark:border-gray-800/80">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{name}</h3>
        {description && <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>}
      </div>
      {children && <div className="p-5">{children}</div>}
    </div>
  )
}

interface AuthMethodProps {
  type: 'api-key' | 'oauth2' | 'bearer' | 'basic' | string;
  name?: string;
  children?: React.ReactNode;
  className?: string;
}

export function AuthMethod({ type, name, children, className }: AuthMethodProps) {
  const authIcons = {
    'api-key': (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
    'oauth2': (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    'bearer': (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    'basic': (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  };

  const defaultIcon = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  return (
    <div className={cn(
      "my-6 relative border border-gray-200/50 dark:border-gray-800/80 rounded-3xl backdrop-blur-sm", 
      "shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex items-center px-5 py-4 border-b border-gray-200/50 dark:border-gray-800/80">
        <div className="p-2 mr-3 text-gray-500 border border-gray-200 rounded-md dark:border-gray-700 dark:text-gray-400">
          {/* Added type assertion to fix TypeScript error when indexing authIcons */}
          {authIcons[type as keyof typeof authIcons] || defaultIcon}
        </div>
        <div>
          <h3 className="font-medium text-gray-800 dark:text-gray-200">
            {name || `${type.charAt(0).toUpperCase() + type.slice(1)} Authentication`}
          </h3>
        </div>
      </div>
      {children && <div className="p-5">{children}</div>}
    </div>
  )
}

interface StatusBadgeProps {
  type: 'active' | 'deprecated' | 'beta' | 'stable' | string;
  className?: string;
}

export function StatusBadge({ type, className }: StatusBadgeProps) {
  const styles = {
    active: "border-green-200 text-green-700 dark:border-green-900/50 dark:text-green-400",
    deprecated: "border-red-200 text-red-700 dark:border-red-900/50 dark:text-red-400",
    beta: "border-blue-200 text-blue-700 dark:border-blue-900/50 dark:text-blue-400",
    stable: "border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-400",
  };
  
  const style = styles[type as keyof typeof styles] || styles.stable;
  
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-2xl text-xs font-medium border",
      style,
      className
    )}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  )
}

interface VersionHistoryProps {
  children: React.ReactNode;
  className?: string;
}

export function VersionHistory({ children, className }: VersionHistoryProps) {
  return (
    <div className={cn(
      "my-6 relative border border-gray-200/50 dark:border-gray-800/80 rounded-3xl p-5 backdrop-blur-sm", 
      "shadow-sm",
      className
    )}>
      <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-gray-200">Version History</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

interface VersionProps {
  version: string;
  date: string;
  children: React.ReactNode;
  className?: string;
}

export function Version({ version, date, children, className }: VersionProps) {
  return (
    <div className={cn("relative pl-6 border-l border-gray-200 dark:border-gray-800", className)}>
      <div className="flex items-center mb-2">
        <div className="absolute -left-1.5 mt-1 w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-black"></div>
        <div className="font-mono text-sm font-medium text-gray-700 dark:text-gray-300">{version}</div>
        <div className="ml-3 text-xs text-gray-500 dark:text-gray-400">{date}</div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{children}</div>
    </div>
  )
}

interface ApiAttributeProps {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  className?: string;
}

export function ApiAttribute({ name, type, required = false, description, className }: ApiAttributeProps) {
  return (
    <div className={cn("px-5 py-4 border-b border-gray-100 dark:border-gray-800/60 last:border-0", className)}>
      <div className="flex flex-wrap items-center gap-2 mb-1.5">
        <code className="font-mono text-sm font-medium text-gray-700 dark:text-gray-300">{name}</code>
        <div className="px-2 py-0.5 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">{type}</div>
        {required && (
          <div className="px-2 py-0.5 text-xs rounded-full border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400">Required</div>
        )}
      </div>
      {description && <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>}
    </div>
  )
}

interface AttributesTableProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function AttributesTable({ title = "Attributes", children, className }: AttributesTableProps) {
  return (
    <div className={cn(
      "my-6 overflow-hidden border border-gray-200/50 dark:border-gray-800/80 rounded-3xl backdrop-blur-sm", 
      "shadow-sm",
      className
    )}>
      <div className="px-5 py-3 text-sm font-medium text-gray-700 border-b border-gray-200/50 dark:border-gray-800/80 dark:text-gray-300">
        {title}
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
        {children}
      </div>
    </div>
  )
}

// =============================================================================
// MODERN MEDIA COMPONENTS
// =============================================================================

interface ImageProps {
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function Image({ src, alt, caption, className, width, height }: ImageProps) {
  return (
    <figure className={cn("my-8 w-full overflow-hidden rounded-3xl", className)}>
      {/* Image wrapper with modern aspect ratio and blur loading */}
      <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800/50 rounded-3xl">
        <img
          src={src}
          alt={alt || caption || ""}
          width={width}
          height={height}
          className={cn(
            "w-full h-full object-cover transition-all duration-300",
            "hover:scale-[1.02] transform-gpu",
            "border border-gray-200/50 dark:border-gray-800/80"
          )}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-center text-gray-600 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

interface VideoProps {
  src: string;
  title?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export function Video({ src, title, poster, className, autoPlay = false, muted = true, loop = false, controls = true }: VideoProps) {
  return (
    <div className={cn(
      "my-8 w-full overflow-hidden rounded-3xl border border-gray-200/50 dark:border-gray-800/80",
      "shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm",
      className
    )}>
      <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800/50">
        <video
          className="object-cover w-full h-full"
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      {title && (
        <div className="px-4 py-3 text-sm text-gray-600 border-t dark:text-gray-400 border-gray-200/50 dark:border-gray-800/80">
          {title}
        </div>
      )}
    </div>
  )
}

interface LinkPreviewProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  className?: string;
}

export function LinkPreview({ url, title, description, image, className }: LinkPreviewProps) {
  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex flex-col w-full my-8 no-underline group",
        "rounded-3xl border border-gray-200/50 dark:border-gray-800/80",
        "overflow-hidden backdrop-blur-sm",
        "shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      <span className="flex flex-col md:flex-row">
        {image && (
          <span className="overflow-hidden bg-gray-100 md:w-48 lg:w-64 dark:bg-gray-800/50">
            <img 
              src={image} 
              alt={title}
              className="object-cover w-full h-48 transition-transform duration-300 md:h-full group-hover:scale-105"
            />
          </span>
        )}
        <span className="flex-1 p-6">
          <span className="block text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {title}
          </span>
          {description && (
            <span className="block mt-2 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </span>
          )}
          <span className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {new URL(url).hostname}
          </span>
        </span>
      </span>
    </a>
  )
}

interface TerminalProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  showPrompt?: boolean;
  language?: string;
}

export function Terminal({ title = "Terminal", children, className, showPrompt = true, language }: TerminalProps) {
  return (
    <div className={cn(
      "my-8 overflow-hidden rounded-3xl",
      "border border-gray-200/50 dark:border-gray-800/80",
      "shadow-sm backdrop-blur-sm",
      className
    )}>
      {/* Terminal Header */}
      <div className="flex items-center px-4 py-3 border-b bg-gray-100/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-800/80">
        <div className="flex mr-4 space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
        </div>
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </div>
      </div>
      {/* Terminal Content */}
      <div className="p-4 font-mono text-sm bg-gray-900/95">
        {showPrompt ? (
          <div className="flex">
            <span className="mr-2 text-green-400">$</span>
            <span className="text-gray-100">{children}</span>
          </div>
        ) : (
          <pre className={cn("text-gray-100", language && `language-${language}`)}>
            {children}
          </pre>
        )}
      </div>
    </div>
  )
}

// Add new components to the default export
const MdxComponents = {
  // Basic text components
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
  
  // Documentation components
  Endpoint,
  Param,
  ParamsTable,
  Response,
  
  // UI Components
  Callout,
  CodeGroup,
  Card,
  CardGroup,
  Tabs,
  Tab,
  Accordion,
  AccordionItem,
  
  // New technical documentation components
  RateLimit,
  ApiResource,
  AuthMethod,
  StatusBadge,
  VersionHistory,
  Version,
  ApiAttribute,
  AttributesTable,
  
  // New modern components
  Image,
  Video,
  LinkPreview,
  Terminal,
}

export default MdxComponents 