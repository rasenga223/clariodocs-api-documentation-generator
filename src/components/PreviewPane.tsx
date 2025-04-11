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
  Endpoint, Param, ParamsTable, Response,
  // UI Components
  Callout, CodeGroup, Card, CardGroup, Tabs, Tab, Accordion, AccordionItem,
  // Code component (pre formatting)
  Code
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
  
  // Documentation components
  Endpoint,
  Param,
  ParamsTable,
  Response,
  
  // UI Components
  Callout,
  Code,
  CodeGroup,
  Card,
  CardGroup,
  Tabs,
  Tab,
  Accordion,
  AccordionItem,
}

// Create a component that wraps MDX content and provides the components
function MDXContentWrapper({ Content }: { Content: React.ComponentType<any> }) {
  // We need to ensure the components are correctly named for MDX to use them
  return (
    <Content 
      components={{
        ...mdxComponents,
        // Explicit mapping for CodeGroup to ensure it's properly used
        CodeGroup: CodeGroup,
        pre: Code, // Map pre elements to our Code component
        code: InlineCode // Map inline code elements to InlineCode
      }} 
    />
  );
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
        // Use evaluate (async version) to compile the MDX
        // Pass only valid options
        const { default: Component } = await evaluate(code, {
          ...runtime,
          baseUrl: import.meta.url,
          // No custom global variables in options
        })
        
        if (isMounted) {
          setContent(() => Component)
          setIsLoading(false)
        }
      } catch (err) {
        console.error("MDX Compile Error:", err)
        if (isMounted) {
          setError((err as Error).message)
          setIsLoading(false)
          setContent(() => () => (
            <div className="p-5 border border-red-200 shadow-sm rounded-2xl bg-red-50/90 dark:bg-red-900/30 dark:border-red-800/90 backdrop-blur-sm">
              <h3 className="mb-2 font-medium text-red-600 dark:text-red-400">MDX Compile Error</h3>
              <pre className="text-sm text-red-500 whitespace-pre-wrap dark:text-red-300">{(err as Error).message}</pre>
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

  // Otherwise, render the component with our wrapper that provides components
  return (
    <div className={cn("h-full transition-all duration-300 bg-background", view === "split" ? "w-1/2" : "w-full")}>
      <ScrollArea className="h-full">
        <div className="max-w-3xl p-8 mx-auto prose dark:prose-invert prose-pre:bg-[#0A0A0A] prose-pre:text-muted-foreground">
          {Content && <MDXContentWrapper Content={Content} />}
        </div>
      </ScrollArea>
    </div>
  )
}
