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

export function H2({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 
      className={cn(
        "mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )} 
      {...props}
    >
      {children}
    </h2>
  )
}

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
        "relative rounded-md px-[0.3rem] py-[0.1rem] font-mono text-sm font-medium text-gray-200 dark:text-gray-300",
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
}

export function Endpoint({ method, path, children, className }: EndpointProps) {
  const methodColors = {
    GET: "bg-green-100/90 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-900/80",
    POST: "bg-blue-100/90 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-900/80",
    PUT: "bg-yellow-100/90 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-900/80",
    DELETE: "bg-red-100/90 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-900/80",
    PATCH: "bg-purple-100/90 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-400 dark:border-purple-900/80",
    OPTIONS: "bg-gray-100/90 text-gray-700 border-gray-200 dark:bg-gray-800/90 dark:text-gray-400 dark:border-gray-700/80",
  } as const;
  
  const methodColor = methodColors[method.toUpperCase() as keyof typeof methodColors] || methodColors.OPTIONS;
  
  return (
    <div className={cn(
      "my-6 relative rounded-2xl border border-gray-200/90 bg-white shadow-sm backdrop-blur-sm dark:border-gray-800/90 dark:bg-gray-900/95 dark:shadow-md dark:shadow-black/10", 
      className
    )}>
      <div className="flex items-center px-5 py-4 border-b border-gray-200/90 dark:border-gray-800/90 rounded-t-2xl">
        <div className={cn("px-3 py-1 mr-3 text-sm font-medium rounded-full", methodColor)}>
          {method.toUpperCase()}
        </div>
        <code className="font-mono text-sm font-semibold">{path}</code>
      </div>
      <CopyButton value={path} />
      {children && <div className="p-5">{children}</div>}
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
      "my-6 overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm backdrop-blur-sm dark:border-gray-800/90 dark:bg-gray-900/95 dark:shadow-md dark:shadow-black/10", 
      className
    )}>
      <div className="px-5 py-3 text-sm font-medium text-gray-700 bg-gray-50/90 dark:bg-gray-800/70 dark:text-gray-300 rounded-t-2xl">
        Parameters
      </div>
      <div className="p-5 space-y-3">
        {children}
      </div>
    </div>
  )
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
  
  return (
    <div className={cn(
      "my-6 relative rounded-2xl border border-gray-200/90 bg-white shadow-sm backdrop-blur-sm dark:border-gray-800/90 dark:bg-gray-900/95 dark:shadow-md dark:shadow-black/10", 
      className
    )}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200/90 dark:border-gray-800/90 rounded-t-2xl">
        <div className="flex items-center">
          <div className={cn("mr-2 font-medium", statusColor)}>
            {status}
          </div>
          {description && <div className="text-sm text-gray-700 dark:text-gray-300">{description}</div>}
        </div>
      </div>
      {children && <div className="p-5">{children}</div>}
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
    info: "bg-blue-50/90 border-blue-200/90 dark:bg-blue-900/30 dark:border-blue-800/60",
    warning: "bg-yellow-50/90 border-yellow-200/90 dark:bg-yellow-900/30 dark:border-yellow-800/60",
    error: "bg-red-50/90 border-red-200/90 dark:bg-red-900/30 dark:border-red-800/60",
    success: "bg-green-50/90 border-green-200/90 dark:bg-green-900/30 dark:border-green-800/60",
    tip: "bg-purple-50/90 border-purple-200/90 dark:bg-purple-900/30 dark:border-purple-800/60",
  };
  
  const titleColors = {
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
  
  return (
    <div className={cn(
      "my-6 rounded-2xl border p-5 shadow-sm backdrop-blur-sm dark:shadow-md dark:shadow-black/10", 
      styles[type], 
      className
    )}>
      {(title || defaultTitles[type]) && (
        <div className={cn("mb-2 font-medium", titleColors[type])}>
          {title || defaultTitles[type]}
        </div>
      )}
      <div className="text-sm">
        {children}
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
  [key: string]: any
}

export function Code({ children, title, className, ...props }: CodeProps) {
  return (
    <div className="relative">
      {title && (
        <div className="px-5 py-2 text-xs font-medium text-gray-400 border-b border-gray-800 rounded-t-2xl">
          {title}
        </div>
      )}
      <pre className={cn(
        "my-0 overflow-x-auto rounded-2xl border border-gray-800 p-5 shadow-sm backdrop-blur-sm dark:shadow-md dark:shadow-black/10",
        title && "rounded-t-none border-t-0",
        className
      )}>
        <code className="font-mono text-sm text-gray-300" {...props}>
          {children}
        </code>
      </pre>
      <CopyButton 
        value={typeof children === 'string' ? children : ''}
        className={title ? "top-2" : ""}
      />
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
}

export function Card({ title, icon, children, className }: CardProps) {
  return (
    <div className={cn(
      "my-6 rounded-2xl border border-gray-200/90 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm dark:border-gray-800/90 dark:bg-gray-900/95 dark:shadow-md dark:shadow-black/10", 
      className
    )}>
      {(title || icon) && (
        <div className="flex items-center mb-4">
          {icon && <div className="mr-3">{icon}</div>}
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
        </div>
      )}
      <div>{children}</div>
    </div>
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
      "my-6 rounded-2xl border border-gray-200/90 bg-white overflow-hidden shadow-sm backdrop-blur-sm dark:border-gray-800/90 dark:bg-gray-900/95 dark:shadow-md dark:shadow-black/10", 
      className
    )}>
      <div className="flex overflow-x-auto border-b border-gray-200/90 bg-gray-50/90 dark:border-gray-800/90 dark:bg-gray-800/70 scrollbar-none rounded-t-2xl">
        {childrenArray.map((child, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={cn(
              "px-5 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200",
              activeTab === index
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            )}
          >
            {child.props.title}
          </button>
        ))}
      </div>
      <div className="relative p-5">
        {childrenArray[activeTab]}
        {typeof childrenArray[activeTab]?.props?.children === 'string' && (
          <CopyButton value={childrenArray[activeTab]?.props?.children || ''} />
        )}
      </div>
    </div>
  )
}

export function Tab({ children, className }: TabProps) {
  return <div className={cn("", className)}>{children}</div>
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
      "my-6 divide-y divide-gray-200/90 rounded-2xl border border-gray-200/90 bg-white shadow-sm backdrop-blur-sm dark:divide-gray-800/90 dark:border-gray-800/90 dark:bg-gray-900/95 dark:shadow-md dark:shadow-black/10", 
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
        className="flex items-center justify-between w-full px-5 py-4 text-sm font-medium text-left text-gray-900 transition-colors duration-200 hover:bg-gray-50/50 dark:text-gray-100 dark:hover:bg-gray-800/50"
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
      {isOpen && <div className="px-5 pt-0 pb-4">{children}</div>}
    </div>
  )
}

// Export all components as default object
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
}

export default MdxComponents 