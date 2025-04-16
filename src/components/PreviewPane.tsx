/* eslint-disable react/display-name */
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { evaluate } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
// Import our comprehensive MDX components
import MdxComponents, {
  // Basic text components
  H1, H2, H3, P, Ul, Ol, Li, Blockquote, InlineCode, Hr,
  // API Documentation components
  Endpoint, Param, ParamsTable, Response, Note, Warning, RequestBody, Description,
  // UI Components
  Callout, CodeGroup, Card, CardGroup, Tabs, Tab, Accordion, AccordionItem,
  // Code component (pre formatting)
  Code,
  // New technical documentation components
  RateLimit, ApiResource, AuthMethod, StatusBadge, VersionHistory, 
  Version, ApiAttribute, AttributesTable,
  // Modern media components
  Image, Video, LinkPreview, Terminal
} from "@/components/mdx/MdxComponents"

interface Props {
  code: string
  view: "split" | "editor" | "preview"
}

// Define types for MDX components
interface MDXComponentProps {
  children?: React.ReactNode
  className?: string
  [key: string]: any
}

// Components available to MDX - use our comprehensive MDX components
// This is crucial - the keys must match the component names used in MDX
const mdxComponents = {
  // Basic text elements
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
  
  // Documentation components - note these need capital letters to match usage in MDX
  Endpoint: Endpoint,
  Param: Param,
  ParamsTable: ParamsTable,
  Response: Response,
  Note: Note,
  Warning: Warning,
  RequestBody: RequestBody,
  Description: Description,
  
  // UI Components - again with capital letters
  Callout: Callout,
  Code: Code,
  CodeGroup: CodeGroup,
  Card: Card,
  CardGroup: CardGroup,
  Tabs: Tabs,
  Tab: Tab,
  Accordion: Accordion,
  AccordionItem: AccordionItem,
  
  // New technical documentation components
  RateLimit: RateLimit,
  ApiResource: ApiResource,
  AuthMethod: AuthMethod,
  StatusBadge: StatusBadge,
  VersionHistory: VersionHistory,
  Version: Version,
  ApiAttribute: ApiAttribute,
  AttributesTable: AttributesTable,
  
  // Modern media components
  Image: Image,
  Video: Video,
  LinkPreview: LinkPreview,
  Terminal: Terminal,
}

export default function PreviewPane({ code, view }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [Content, setContent] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    let isMounted = true;
    
    async function processMdx() {
      setIsLoading(true)
      setError(null)

      try {
        // Use evaluate with the runtime that includes our components
        const evaluateOptions = {
          ...runtime,
          baseUrl: import.meta.url,
        }
        
        const { default: Component } = await evaluate(code, evaluateOptions)
        
        if (isMounted) {
          setContent(() => Component)
          setIsLoading(false)
        }
      } catch (err) {
        console.error("MDX Compile Error:", err)
        if (isMounted) {
          // Enhance the error message to be more helpful
          let errorMessage = (err as Error).message;
          
          // Try to provide more specific guidance for common errors
          if (errorMessage.includes("Could not parse expression with acorn")) {
            // Extract line number if available
            const lineMatch = errorMessage.match(/(\d+):(\d+):/);
            if (lineMatch) {
              const [, line, column] = lineMatch;
              
              // Get the line content from the code
              const codeLines = code.split('\n');
              const problematicLine = codeLines[parseInt(line) - 1] || '';
              
              errorMessage = `MDX Syntax Error at line ${line}, column ${column}:
              
${problematicLine}
${' '.repeat(parseInt(column) - 1)}^

This is likely caused by:
- Unbalanced curly braces {} in JSX expressions
- Invalid JavaScript inside curly braces
- Mixing Markdown and JSX improperly
- Using reserved characters without escaping them

Try checking for:
- Missing closing braces in expressions like {variable}
- Quotes inside JSX attributes (use single quotes inside double quotes or vice versa)
- Special characters that need to be escaped`;
            }
          }
          
          setError(errorMessage);
          setIsLoading(false);
          setContent(() => () => (
            <div className="p-5 border border-red-200 shadow-sm rounded-2xl bg-red-50/90 dark:bg-red-900/30 dark:border-red-800/90 backdrop-blur-sm">
              <h3 className="mb-2 font-medium text-red-600 dark:text-red-400">MDX Compile Error</h3>
              <pre className="text-sm text-red-500 whitespace-pre-wrap dark:text-red-300">{errorMessage}</pre>
            </div>
          ))
        }
      }
    }

    processMdx()
    
    // Cleanup function
    return () => {
      isMounted = false;
    }
  }, [code])

  // If we don't have a component yet, show loading
  if (isLoading) {
    return (
      <div className={cn("h-full transition-all duration-300 bg-background", view === "split" ? "w-1/2" : "w-full")}>
        <ScrollArea className="h-full">
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </ScrollArea>
      </div>
    )
  }

  // If we have an error, show the error
  if (error) {
    return (
      <div className={cn("h-full transition-all duration-300 bg-background", view === "split" ? "w-1/2" : "w-full")}>
        <ScrollArea className="h-full">
          <div className="max-w-3xl p-8 mx-auto">
            <div className="p-5 border rounded-2xl bg-destructive/5 border-destructive/10 backdrop-blur-sm">
              <h3 className="mb-2 font-medium text-destructive">MDX Compile Error</h3>
              <pre className="text-sm whitespace-pre-wrap text-destructive/90">{error}</pre>
            </div>
          </div>
        </ScrollArea>
      </div>
    )
  }

  // Otherwise, render the component with our components explicitly passed
  return (
    <div className={cn("h-full transition-all duration-300 bg-background", view === "split" ? "w-1/2" : "w-full")}>
      <ScrollArea className="h-full">
        <div className="max-w-3xl p-8 mx-auto prose dark:prose-invert 
          prose-pre:border prose-pre:border-gray-200/50 dark:prose-pre:border-gray-800/80 
          prose-pre:bg-transparent dark:prose-pre:bg-transparent 
          prose-pre:shadow-sm prose-pre:rounded-xl 
          prose-code:text-gray-800 dark:prose-code:text-gray-300 
          [&_.shiki]:!bg-transparent
          [&_pre_code]:!border-0 [&_pre_code]:!p-0 [&_pre_code]:!m-0
          [&_pre]:!bg-transparent [&_pre]:!overflow-x-auto">
          {Content && <Content components={mdxComponents} />}
        </div>
      </ScrollArea>
    </div>
  )
}
