"use client"

import Editor, { BeforeMount } from "@monaco-editor/react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type * as Monaco from 'monaco-editor'

type Props = {
  code: string
  setCode: (val: string) => void
  view: "split" | "editor" | "preview"
}

export default function EditorPane({ code, setCode, view }: Props) {
  // Define the theme configuration
  const handleEditorWillMount: BeforeMount = (monaco: typeof Monaco) => {
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0A0A0A',
        'editor.foreground': '#FAFAFA',
        'editor.lineHighlightBackground': '#151515',
        'editor.selectionBackground': '#202020',
        'editorCursor.foreground': '#FFFFFF',
        'editor.inactiveSelectionBackground': '#151515',
        'editorLineNumber.foreground': '#404040',
        'editorLineNumber.activeForeground': '#808080',
        'editor.findMatchBackground': '#303030',
        'editor.findMatchHighlightBackground': '#252525',
        'editorSuggestWidget.background': '#0A0A0A',
        'editorSuggestWidget.border': '#202020',
        'editorSuggestWidget.selectedBackground': '#202020',
      }
    })
  }

  return (
    <div
      className={cn(
        "h-full border-r border-border overflow-hidden transition-all duration-300 bg-[#0A0A0A]",
        view === "split" ? "w-1/2" : "w-full",
      )}
    >
      <Editor
        height="100%"
        defaultLanguage="markdown"
        theme="custom-dark"
        beforeMount={handleEditorWillMount}
        value={code}
        onChange={(value) => setCode(value || "")}
        loading={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
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
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          contextmenu: true,
          mouseWheelZoom: true,
          bracketPairColorization: {
            enabled: true,
          },
        }}
      />
    </div>
  )
}
