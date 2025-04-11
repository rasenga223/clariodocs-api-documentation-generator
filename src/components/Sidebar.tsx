"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, FileText, FolderOpen, Home, Settings } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface DocItem {
  id: string
  title: string
  children?: DocItem[]
}

const sampleDocs: DocItem[] = [
  {
    id: "introduction",
    title: "Introduction",
  },
  {
    id: "getting-started",
    title: "Getting Started",
    children: [
      { id: "installation", title: "Installation" },
      { id: "configuration", title: "Configuration" },
    ],
  },
  {
    id: "api-reference",
    title: "API Reference",
    children: [
      { id: "endpoints", title: "Endpoints" },
      { id: "authentication", title: "Authentication" },
      { id: "errors", title: "Error Handling" },
    ],
  },
]

export default function Sidebar({
  collapsed = false,
  setCollapsed,
}: { collapsed?: boolean; setCollapsed?: (val: boolean) => void }) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "getting-started": true,
  })

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const renderDocItem = (item: DocItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems[item.id]

    return (
      <div key={item.id} className="w-full">
        <div
          className={cn(
            "flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
            "text-gray-700 dark:text-gray-300",
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => hasChildren && toggleExpand(item.id)}
        >
          {hasChildren ? (
            <span className="mr-2">{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
          ) : (
            <FileText size={16} className="mr-2" />
          )}
          <span className="text-sm truncate">{item.title}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-2">{item.children?.map((child) => renderDocItem(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <aside
      className={cn(
        "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col h-full",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 h-14 border-b border-gray-200 dark:border-gray-800">
        {!collapsed && <h2 className="text-lg font-semibold">Docs</h2>}
        {setCollapsed && (
          <Button variant="ghost" size="icon" className={cn("ml-auto", collapsed && "mx-auto")} onClick={() => setCollapsed(!collapsed)}>
            <ChevronRight className={cn("h-4 w-4 transition-transform", collapsed ? "rotate-180" : "")} />
          </Button>
        )}
      </div>

      {collapsed ? (
        <div className="flex flex-col items-center py-4 space-y-4">
          <Button variant="ghost" size="icon">
            <Home className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <FolderOpen className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">{sampleDocs.map((item) => renderDocItem(item))}</div>
          <Separator className="my-2" />
        </ScrollArea>
      )}
    </aside>
  )
}
