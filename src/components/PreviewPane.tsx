/* eslint-disable react/display-name */
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { compileSync, runSync } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime"
import { MDXProvider } from "@mdx-js/react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Props {
  code: string
  view: "split" | "editor" | "preview"
}

export default function PreviewPane({ code, view }: Props) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    try {
      const compiled = compileSync(code, {
        outputFormat: "function-body",
      })

      const result = runSync(String(compiled), {
        ...runtime,
        baseUrl: import.meta.url,
      })

      setComponent(() => result.default)
      setIsLoading(false)
    } catch (err) {
      console.error("MDX Compile Error:", err)
      setError((err as Error).message)
      setIsLoading(false)
      setComponent(() => () => (
        <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md">
          <h3 className="text-red-600 dark:text-red-400 font-medium mb-2">MDX Compile Error</h3>
          <pre className="text-sm text-red-500 dark:text-red-300 whitespace-pre-wrap">{(err as Error).message}</pre>
        </div>
      ))
    }
  }, [code])

  return (
    <div className={cn("h-full transition-all duration-300", view === "split" ? "w-1/2" : "w-full")}>
      <ScrollArea className="h-full">
        <div className="p-8 max-w-3xl mx-auto prose dark:prose-invert">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md">
              <h3 className="text-red-600 dark:text-red-400 font-medium mb-2">MDX Compile Error</h3>
              <pre className="text-sm text-red-500 dark:text-red-300 whitespace-pre-wrap">{error}</pre>
            </div>
          ) : (
            <MDXProvider>{Component && <Component />}</MDXProvider>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
