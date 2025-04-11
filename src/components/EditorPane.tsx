"use client"

import Editor from "@monaco-editor/react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  code: string
  setCode: (val: string) => void
  view: "split" | "editor" | "preview"
}

export default function EditorPane({ code, setCode, view }: Props) {
  return (
    <div
      className={cn(
        "h-full border-r border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300",
        view === "split" ? "w-1/2" : "w-full",
      )}
    >
      <Editor
        height="100%"
        defaultLanguage="markdown"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        loading={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        }
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          fontSize: 14,
          padding: { top: 16 },
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          renderLineHighlight: "all",
          fontFamily: "'JetBrains Mono', monospace",
          fontLigatures: true,
        }}
      />
    </div>
  )
}
