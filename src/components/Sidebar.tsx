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
  onSelectSection,
  activeSection,
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
  onSelectSection?: (sectionId: string) => void;
  activeSection?: string;
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
    const isActive = activeSection === item.id

    return (
      <div key={item.id} className="w-full">
        <div
          className={cn(
            "group flex items-center py-2.5 px-3 my-0.5 rounded-md transition-all duration-200",
            "hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent",
            "relative cursor-pointer",
            !parentId && "font-medium tracking-tight",
            isActive && "bg-gradient-to-r from-primary/10 to-transparent text-primary font-medium"
          )}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id)
              if (!parentId && onSelectFile) {
                onSelectFile(`${item.id}.mdx`)
              }
            } else if (parentId && onSelectFile) {
              onSelectFile(`${parentId}.mdx#${item.id}`)
              if (onSelectSection) {
                onSelectSection(item.id)
              }
            } else if (onSelectSection) {
              onSelectSection(item.id)
            }
          }}
        >
          {isActive && (
            <div className="absolute left-0 w-[3px] h-5 bg-primary rounded-full" />
          )}
          {hasChildren ? (
            <span className={cn(
              "mr-2 transition-transform duration-200 rounded-md",
              isExpanded && "rotate-90",
              "bg-muted/80 p-0.5 group-hover:bg-primary/10"
            )}>
              <ChevronRight size={12} className={cn(
                "text-muted-foreground/70",
                isActive && "text-primary"
              )} />
            </span>
          ) : (
            <span className={cn(
              "mr-2 rounded-md p-0.5",
              "bg-muted/80 group-hover:bg-primary/10"
            )}>
              <FileText size={12} className={cn(
                "text-muted-foreground/70",
                isActive && "text-primary"
              )} />
            </span>
          )}
          <span className={cn(
            "truncate transition-colors duration-200",
            "text-muted-foreground/90 group-hover:text-foreground",
            isActive && "text-primary"
          )}>{item.title}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className="relative my-1 ml-3">
            <div className="absolute left-[1px] top-2 bottom-2 w-px bg-gradient-to-b from-border/0 via-border/50 to-border/0" />
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
            "group flex items-center py-2.5 px-3 my-0.5 rounded-md transition-all duration-200",
            "hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent cursor-pointer",
            "text-foreground/90"
          )}
          onClick={() => toggleExpand("history")}
        >
          <span className={cn(
            "mr-2 transition-transform duration-200 rounded-md",
            expandedItems["history"] && "rotate-90",
            "bg-muted/80 p-0.5 group-hover:bg-primary/10"
          )}>
            <ChevronRight size={12} className="text-muted-foreground/70" />
          </span>
          <span className="text-sm font-medium tracking-tight">Version History</span>
        </div>
        
        {expandedItems["history"] && (
          <div className="relative my-1 ml-3">
            <div className="absolute left-[1px] top-2 bottom-2 w-px bg-gradient-to-b from-border/0 via-border/50 to-border/0" />
            {history.map((version, index) => {
              const date = new Date(version.timestamp);
              const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).format(date);
              
              const isCurrentVersion = index === currentVersionIndex;
              
              return (
                <div 
                  key={`version-${index}`} 
                  className={cn(
                    "group flex items-center px-3 py-2.5 rounded-md transition-all duration-200",
                    "hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent cursor-pointer",
                    "relative",
                    isCurrentVersion && "bg-gradient-to-r from-primary/10 to-transparent text-primary"
                  )}
                  style={{ paddingLeft: '28px' }}
                  onClick={() => revertToVersion(index)}
                >
                  {isCurrentVersion && (
                    <div className="absolute left-0 w-[3px] h-5 bg-primary rounded-full" />
                  )}
                  <span className={cn(
                    "mr-2 rounded-md p-0.5",
                    "bg-muted/80 group-hover:bg-primary/10"
                  )}>
                    <FileText size={12} className={cn(
                      "text-muted-foreground/70",
                      isCurrentVersion && "text-primary"
                    )} />
                  </span>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{formattedDate}</span>
                      {index === 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full border border-primary/20 font-medium">
                          Latest
                        </span>
                      )}
                    </div>
                    <span className="text-xs truncate text-muted-foreground/70 w-36 group-hover:text-muted-foreground">
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
      <div className="p-4 border-t border-border/50 bg-gradient-to-b from-transparent to-muted/20">
        <div className="p-4 border rounded-lg shadow-lg bg-gradient-to-br from-background to-muted/20 border-border/50 backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-1.5">
                Project ID
              </span>
              <div className="flex items-center space-x-2 bg-primary/5 rounded-md px-2.5 py-1.5 border border-primary/10">
                <code className="text-[11px] font-mono text-primary">
                  {projectId.substring(0, 8)}...
                </code>
                <div className="flex-1" />
                <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-pulse" />
              </div>
            </div>
            {filename && (
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-1.5">
                  Current File
                </span>
                <div className="flex items-center space-x-2 bg-primary/5 rounded-md px-2.5 py-1.5 border border-primary/10">
                  <code className="text-[11px] font-mono text-primary truncate">
                    {filename}
                  </code>
                  <div className="flex-shrink-0 w-4 h-4">
                    <FileText size={12} className="text-primary/70" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "bg-gradient-to-b from-background to-background/95 border-r border-border/50 transition-all duration-300 flex flex-col h-full",
        "backdrop-blur-xl supports-[backdrop-filter]:bg-background/80",
        collapsed ? "w-16" : "w-72",
      )}
    >
      <div className="flex items-center justify-between px-4 border-b border-border/50 h-14 bg-gradient-to-b from-background to-background/95">
        {!collapsed && (
          <div className="flex items-center">
            <h2 className="text-lg font-semibold tracking-tight text-transparent bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
              Docs
            </h2>
            {projectId && (
              <div className="ml-2 px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full font-medium tracking-wide border border-primary/20">
                Connected
              </div>
            )}
          </div>
        )}
        {(setCollapsed || toggleSidebar) && (
          <Button 
            variant="ghost" 
            size="icon"
            className={cn(
              "ml-auto rounded-full hover:bg-primary/5 hover:text-primary", 
              collapsed && "mx-auto"
            )} 
            onClick={() => {
              if (setCollapsed) setCollapsed(!collapsed);
              if (toggleSidebar) toggleSidebar();
            }}
          >
            <ChevronRight 
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                collapsed ? "rotate-180" : ""
              )} 
            />
          </Button>
        )}
      </div>

      {collapsed ? (
        <div className="flex flex-col items-center py-4 space-y-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="transition-all duration-200 rounded-full hover:bg-primary/5 hover:text-primary active:scale-95"
          >
            <Home className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="transition-all duration-200 rounded-full hover:bg-primary/5 hover:text-primary active:scale-95"
          >
            <FolderOpen className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="transition-all duration-200 rounded-full hover:bg-primary/5 hover:text-primary active:scale-95"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              {projectId ? (
                docOutline ? (
                  docOutline.map(item => renderDocItem(convertToDocItem(item), 0))
                ) : (
                  <div className="w-full space-y-3">
                    <div className="flex items-center px-4 py-3 border rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border-primary/10">
                      <FileText size={16} className="mr-2 text-primary" />
                      <span className="text-sm font-medium truncate text-primary">
                        {filename || 'Current Document'}
                      </span>
                    </div>
                    <div className="px-4 py-3 text-xs border rounded-lg bg-muted/30 border-border/50">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <span>Project ID:</span>
                        <code className="px-1.5 py-0.5 rounded bg-background/50 text-primary font-mono text-[10px] border border-border/50">
                          {projectId.substring(0, 8)}...
                        </code>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                sampleDocs.map((item) => renderDocItem(item))
              )}
              {renderHistoryItems()}
            </div>
            <Separator className="my-2 opacity-30" />
          </ScrollArea>
          {renderProjectInfo()}
        </>
      )}
    </aside>
  )
}
