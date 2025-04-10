"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import EditorHeader from "@/components/EditorHeader"
import EditorPane from "@/components/EditorPane"
import PreviewPane from "@/components/PreviewPane"

const DEFAULT_MDX_CONTENT = `# Working MDX

- Lists
- **Bold**
- MDX Button

asda is king

King was queen sometimes

now its time to save

wallah im so good at coding bruh :)

why my code isnt exported with md mdx json or pdf
`

export default function HomePage() {
  const [code, setCode] = useState<string>(DEFAULT_MDX_CONTENT)
  const [view, setView] = useState<"split" | "editor" | "preview">("split")
  const [history, setHistory] = useState<{ code: string; timestamp: string }[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  // Load saved content and version history from localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem("mdxEditorCode")
    const savedHistory = localStorage.getItem("mdxEditorHistory")

    if (savedCode) {
      setCode(savedCode)
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }

    // Set appropriate view mode for mobile
    if (isMobile) {
      setView("editor")
      setSidebarCollapsed(true)
    }
  }, [isMobile])

  // Save content to localStorage whenever the code changes
  useEffect(() => {
    if (code) {
      localStorage.setItem("mdxEditorCode", code)
    }
  }, [code])

  // Save version history separately
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("mdxEditorHistory", JSON.stringify(history))
    }
  }, [history])

  // Save the current version and add it to history
  const saveVersion = () => {
    const newCommit = { code, timestamp: new Date().toISOString() }
    const updatedHistory = [newCommit, ...history]
    setHistory(updatedHistory)
  }

  // Revert to a specific version from the history
  const revertToVersion = (versionIndex: number) => {
    const selectedVersion = history[versionIndex]
    setCode(selectedVersion.code)
  }

  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-950">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <EditorHeader
          code={code}
          saveVersion={saveVersion}
          setView={setView}
          view={view}
          history={history}
          revertToVersion={revertToVersion}
        />
        <div className="flex flex-1 overflow-hidden">
          {(view === "split" || view === "editor") && <EditorPane code={code} setCode={setCode} view={view} />}
          {(view === "split" || view === "preview") && <PreviewPane code={code} view={view} />}
        </div>
      </div>
    </div>
  )
}
