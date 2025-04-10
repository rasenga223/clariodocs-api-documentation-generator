"use client"

import { useState } from "react"
import { saveAs } from "file-saver"
import { jsPDF } from "jspdf"
import { Code, Download, Eye, FileText, History, SplitIcon as LayoutSplit, Save, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
  view: "split" | "editor" | "preview"
  setView: (val: "split" | "editor" | "preview") => void
  history: { code: string; timestamp: string }[]
  revertToVersion: (index: number) => void
  saveVersion: () => void
  code: string
}

export default function EditorHeader({ view, setView, history, revertToVersion, saveVersion, code }: Props) {
  const [showSettings, setShowSettings] = useState(false)

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
        return <Code className="h-4 w-4" />
      case "preview":
        return <Eye className="h-4 w-4" />
      case "split":
      default:
        return <LayoutSplit className="h-4 w-4" />
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
    <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-semibold">MDX Editor</h1>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => setView(getNextView())}>
          {getViewIcon()}
          <span className="ml-2 hidden sm:inline">{view.charAt(0).toUpperCase() + view.slice(1)}</span>
        </Button>

        <Button variant="default" size="sm" onClick={saveVersion}>
          <Save className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Save</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Export As</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportMarkdown}>
              <FileText className="h-4 w-4 mr-2" />
              Markdown (.md)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportMDX}>
              <Code className="h-4 w-4 mr-2" />
              MDX (.mdx)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportJSON}>
              <FileText className="h-4 w-4 mr-2" />
              JSON (.json)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              PDF (.pdf)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {history.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">History</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Version History</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {history.map((commit, index) => (
                <DropdownMenuItem key={index} onClick={() => revertToVersion(index)}>
                  <div className="flex flex-col">
                    <span className="text-sm">{new Date(commit.timestamp).toLocaleString()}</span>
                    <span className="text-xs text-gray-500">{commit.code.substring(0, 20)}...</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
