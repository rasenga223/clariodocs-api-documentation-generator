"use client"

import { saveAs } from "file-saver"
import { jsPDF } from "jspdf"
import { Code, Download, Eye, FileText, History, SplitIcon as LayoutSplit, Save } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type Props = {
  view: "split" | "editor" | "preview"
  setView: (val: "split" | "editor" | "preview") => void
  history: { code: string; timestamp: string; id?: string }[]
  revertToVersion: (index: number) => void
  saveVersion: () => void
  code: string
  isSaving?: boolean
  hasProject?: boolean
  currentVersionIndex?: number
}

export default function EditorHeader({ view, setView, history, revertToVersion, saveVersion, code, isSaving, hasProject, currentVersionIndex = 0 }: Props) {

  const exportMarkdown = () => {
    if (code.trim()) {
      const blob = new Blob([code], { type: "text/markdown" })
      saveAs(blob, "document.md")
    } else {
      alert("Cannot export empty content.")
    }
  }

  const exportMDX = () => {
    if (code.trim()) {
      const blob = new Blob([code], { type: "text/markdown" })
      saveAs(blob, "document.mdx")
    } else {
      alert("Cannot export empty content.")
    }
  }

  const exportJSON = () => {
    if (code.trim()) {
      const jsonContent = JSON.stringify({ content: code, timestamp: new Date().toISOString() })
      const blob = new Blob([jsonContent], { type: "application/json" })
      saveAs(blob, "document.json")
    } else {
      alert("Cannot export empty content.")
    }
  }

  const exportPDF = () => {
    if (code.trim()) {
      const doc = new jsPDF()
      const lines = doc.splitTextToSize(code, 180)
      doc.text(lines, 10, 10)
      doc.save("document.pdf")
    } else {
      alert("Cannot export empty content.")
    }
  }

  const getViewIcon = () => {
    switch (view) {
      case "editor":
        return <Code className="w-4 h-4" />
      case "preview":
        return <Eye className="w-4 h-4" />
      case "split":
      default:
        return <LayoutSplit className="w-4 h-4" />
    }
  }

  const getNextView = () => {
    switch (view) {
      case "split":
        return "editor"
      case "editor":
        return "preview"
      case "preview":
      default:
        return "split"
    }
  }

  return (
    <header className="flex items-center justify-between px-4 border-b h-14 bg-background border-border">
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-semibold text-foreground">MDX Editor</h1>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => setView(getNextView())}>
          {getViewIcon()}
          <span className="hidden ml-2 sm:inline">{view.charAt(0).toUpperCase() + view.slice(1)}</span>
        </Button>

        <Button variant="default" size="sm" onClick={saveVersion} disabled={isSaving}>
          {isSaving ? (
            <>
              <svg className="w-4 h-4 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span className="hidden sm:inline">Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Save{hasProject ? ' to Project' : ''}</span>
            </>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            <DropdownMenuLabel>Export As</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportMarkdown}>
              <FileText className="w-4 h-4 mr-2" />
              Markdown (.md)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportMDX}>
              <Code className="w-4 h-4 mr-2" />
              MDX (.mdx)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportJSON}>
              <FileText className="w-4 h-4 mr-2" />
              JSON (.json)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportPDF}>
              <FileText className="w-4 h-4 mr-2" />
              PDF (.pdf)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {history.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">History</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
              <DropdownMenuLabel>Version History</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {history.map((commit, index) => {
                // Format the date for better display
                const date = new Date(commit.timestamp);
                const formattedDate = new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(date);
                
                return (
                  <DropdownMenuItem 
                    key={index} 
                    onClick={() => revertToVersion(index)}
                    className={cn(
                      index === currentVersionIndex && "bg-blue-50/10 border-l-2 border-primary"
                    )}
                  >
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{formattedDate}</span>
                        {index === 0 && (
                          <span className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded">
                            Latest
                          </span>
                        )}
                        {index === currentVersionIndex && index !== 0 && (
                          <span className="px-1.5 py-0.5 text-[10px] bg-yellow-50 text-yellow-700 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <span className="text-xs truncate text-muted-foreground">{commit.code.substring(0, 25)}...</span>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
