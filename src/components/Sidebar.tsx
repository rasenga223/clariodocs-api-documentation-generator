"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, FileText, FolderOpen, Home, Settings } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DocOutlineItem } from "@/lib/docService"

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
  history = [],
  revertToVersion,
  toggleSidebar,
  projectId = null,
  filename = null,
  docOutline = null,
  collapsed = false,
  setCollapsed,
  onSelectFile,
  currentVersionIndex = 0
}: { 
  history?: { code: string; timestamp: string; id?: string }[];
  revertToVersion?: (index: number) => void;
  toggleSidebar?: () => void;
  projectId?: string | null;
  filename?: string | null;
  docOutline?: DocOutlineItem[] | null;
  collapsed?: boolean; 
  setCollapsed?: (val: boolean) => void;
  onSelectFile?: (filename: string) => void;
  currentVersionIndex?: number;
}) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "getting-started": true,
    "history": true,
  })

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Convert DocOutlineItem to DocItem format
  const convertToDocItem = (item: DocOutlineItem): DocItem => {
    return {
      id: item.id,
      title: item.title,
      children: item.children?.map(convertToDocItem)
    }
  }

  const renderDocItem = (item: DocItem, depth = 0, parentId?: string) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems[item.id]

    return (
      <div key={item.id} className="w-full">
        <div
          className={cn(
            "flex items-center py-2 px-3 rounded-md hover:bg-[#0A0A0A] cursor-pointer",
            "text-foreground",
            !parentId && "font-medium"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id)
              if (!parentId && onSelectFile) {
                onSelectFile(`${item.id}.mdx`)
              }
            } else if (parentId && onSelectFile) {
              onSelectFile(`${parentId}.mdx#${item.id}`)
            }
          }}
        >
          {hasChildren ? (
            <span className="mr-2">{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
          ) : (
            <FileText size={16} className="mr-2" />
          )}
          <span className="text-sm truncate">{item.title}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {item.children?.map((child) => renderDocItem(child, depth + 1, parentId || item.id))}
          </div>
        )}
      </div>
    )
  }

  const renderHistoryItems = () => {
    if (!history || history.length === 0 || !revertToVersion) return null;
    
    return (
      <div className="w-full">
        <div
          className={cn(
            "flex items-center py-2 px-3 rounded-md hover:bg-[#0A0A0A] cursor-pointer",
            "text-foreground",
          )}
          onClick={() => toggleExpand("history")}
        >
          <span className="mr-2">
            {expandedItems["history"] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          <span className="text-sm font-medium">Version History</span>
        </div>
        
        {expandedItems["history"] && (
          <div className="ml-2">
            {history.map((version, index) => {
              // Format the date for better display
              const date = new Date(version.timestamp);
              const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).format(date);
              
              return (
                <div 
                  key={`version-${index}`} 
                  className={cn(
                    "flex items-center px-3 py-2 pl-8 rounded-md cursor-pointer hover:bg-[#0A0A0A] text-foreground",
                    index === currentVersionIndex && "bg-blue-50/10 border-l-2 border-primary"
                  )}
                  onClick={() => revertToVersion(index)}
                >
                  <FileText size={16} className="mr-2" />
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="text-xs">{formattedDate}</span>
                      {index === 0 && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded">
                          Latest
                        </span>
                      )}
                    </div>
                    <span className="text-xs truncate text-muted-foreground w-36">
                      {version.code.substring(0, 25)}...
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const renderProjectInfo = () => {
    if (!projectId) return null;
    
    return (
      <div className="p-2 border-t border-border">
        <div className="p-2 text-xs text-muted-foreground">
          <div>
            <span className="font-semibold">Project:</span> 
            <span className="block ml-1 truncate text-foreground">{projectId.substring(0, 8)}...</span>
          </div>
          {filename && (
            <div className="mt-1">
              <span className="font-semibold">File:</span> 
              <span className="block ml-1 truncate text-foreground">{filename}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "bg-background border-r border-border transition-all duration-300 flex flex-col h-full",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border h-14">
        {!collapsed && (
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-foreground">Docs</h2>
            {projectId && (
              <div className="ml-2 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded">
                Connected
              </div>
            )}
          </div>
        )}
        {(setCollapsed || toggleSidebar) && (
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("ml-auto", collapsed && "mx-auto")} 
            onClick={() => {
              if (setCollapsed) setCollapsed(!collapsed);
              if (toggleSidebar) toggleSidebar();
            }}
          >
            <ChevronRight className={cn("h-4 w-4 transition-transform", collapsed ? "rotate-180" : "")} />
          </Button>
        )}
      </div>

      {collapsed ? (
        <div className="flex flex-col items-center py-4 space-y-4">
          <Button variant="ghost" size="icon">
            <Home className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <FolderOpen className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {projectId ? (
                docOutline ? (
                  docOutline.map(item => renderDocItem(convertToDocItem(item), 0))
                ) : (
                  <div className="w-full">
                    <div className="flex items-center px-3 py-2 rounded-md bg-primary/5 text-primary">
                      <FileText size={16} className="mr-2" />
                      <span className="text-sm font-medium truncate">
                        {filename || 'Current Document'}
                      </span>
                    </div>
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      This document is linked to project ID: {projectId.substring(0, 8)}...
                    </div>
                  </div>
                )
              ) : (
                sampleDocs.map((item) => renderDocItem(item))
              )}
              {renderHistoryItems()}
            </div>
            <Separator className="my-2" />
          </ScrollArea>
          {renderProjectInfo()}
        </>
      )}
    </aside>
  )
}
