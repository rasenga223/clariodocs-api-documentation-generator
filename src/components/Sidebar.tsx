"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, FileText, FolderOpen, Home, Settings, Plus, Trash2, AlertCircle, GripVertical } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DocOutlineItem } from "@/lib/docService"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from '@supabase/supabase-js'
import { updateMdxFileOrder } from '@/lib/docService'
import { toast } from '@/components/ui/use-toast'

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

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

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
  currentVersionIndex = 0,
  onCreateFile,
  onDeleteFile,
  onReorderFiles,
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
  onCreateFile?: (filename: string) => void;
  onDeleteFile?: (filename: string) => void;
  onReorderFiles?: (filenames: string[]) => void;
}) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "getting-started": true,
    "history": true,
  })
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newFilename, setNewFilename] = useState("")
  const [deleteConfirmFile, setDeleteConfirmFile] = useState<string | null>(null)
  const [isReordering, setIsReordering] = useState(false);
  
  // Extract filenames from docOutline for reordering
  const outlineFilenames = docOutline ? docOutline.map(item => `${item.id}.mdx`) : [];
  const [orderedFiles, setOrderedFiles] = useState<string[]>(outlineFilenames);
  
  // Update orderedFiles when docOutline changes
  useEffect(() => {
    if (docOutline) {
      setOrderedFiles(docOutline.map(item => `${item.id}.mdx`));
    }
  }, [docOutline]);

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

  const handleCreateFile = () => {
    if (!newFilename) return;
    
    // Format the filename
    let filename = newFilename.toLowerCase()
      // Replace spaces with dashes
      .replace(/\s+/g, '-')
      // Remove special characters
      .replace(/[^a-z0-9-]/g, '')
      // Add .mdx extension if not present
      .replace(/\.mdx$|$/, '.mdx');
    
    onCreateFile?.(filename);
    setNewFilename("");
    setIsCreateDialogOpen(false);
  }

  const handleDeleteFile = (filename: string) => {
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
      onDeleteFile?.(filename);
    }
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.opacity = '0.5';
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
  };

  // Handle drop
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    e.currentTarget.style.opacity = '1';
    
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    const items = Array.from(orderedFiles);
    const [reorderedItem] = items.splice(dragIndex, 1);
    items.splice(dropIndex, 0, reorderedItem);
    
    setOrderedFiles(items);
    
    try {
      if (!projectId) return;
      const success = await updateMdxFileOrder(projectId, items);
      if (success) {
        if (onReorderFiles) {
          onReorderFiles(items);
        }
        toast({
          title: "Files reordered",
          description: "The sidebar order has been updated",
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error reordering files:', error);
      toast({
        title: "Reordering failed",
        description: "There was an error updating the file order",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  // Toggle reordering mode
  const toggleReordering = () => {
    setIsReordering(!isReordering);
  };

  // Subscribe to real-time updates
  useEffect(() => {
    if (!projectId) return;

    // Subscribe to project_mdx table changes
    const mdxSubscription = supabase
      .channel('project_mdx_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_mdx',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          // Trigger a refresh of the document outline
          if (onSelectFile) {
            onSelectFile(filename || '');
          }
        }
      )
      .subscribe();

    // Subscribe to project_versions table changes
    const versionsSubscription = supabase
      .channel('project_versions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_versions',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          // Refresh version history if the revertToVersion handler exists
          if (revertToVersion) {
            revertToVersion(currentVersionIndex);
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      mdxSubscription.unsubscribe();
      versionsSubscription.unsubscribe();
    };
  }, [projectId, filename, currentVersionIndex]);

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
          {!parentId && onDeleteFile && (
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 ml-auto opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFile(`${item.id}.mdx`);
              }}
            >
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </Button>
          )}
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

  // Render doc items as normal or as draggable items
  const renderDocItems = () => {
    if (!docOutline) return null;
    
    if (isReordering) {
      return (
        <div className="space-y-1">
          {orderedFiles.map((filename, index) => {
            const item = docOutline.find(item => `${item.id}.mdx` === filename);
            if (!item) return null;
            
            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                className={cn(
                  "group flex items-center py-2.5 px-3 my-0.5 rounded-md transition-all duration-200",
                  "bg-gradient-to-r from-primary/5 to-transparent border border-primary/10",
                  "relative cursor-move"
                )}
              >
                <div 
                  className="p-1 mr-2 text-muted-foreground hover:text-primary"
                >
                  <GripVertical size={14} />
                </div>
                <span className="mr-2 rounded-md p-0.5 bg-muted/80 group-hover:bg-primary/10">
                  <FileText size={12} className="text-muted-foreground/70" />
                </span>
                <span className="truncate text-muted-foreground/90 group-hover:text-foreground">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    
    return docOutline.map(item => renderDocItem(convertToDocItem(item), 0));
  };

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
          <div className="flex items-center justify-between w-full">
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
            
            <div className="flex items-center gap-1">
              {projectId && docOutline && docOutline.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 rounded-full hover:bg-primary/5 hover:text-primary"
                  onClick={toggleReordering}
                >
                  <GripVertical className="w-4 h-4" />
                </Button>
              )}
              {projectId && onCreateFile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 rounded-full hover:bg-primary/5 hover:text-primary"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
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
                  isReordering ? (
                    <>
                      <div className="flex items-center justify-between px-3 mb-2">
                        <span className="text-sm font-medium text-primary">Reorder Files</span>
                        <Button variant="ghost" size="sm" className="h-8 px-2" onClick={toggleReordering}>
                          Done
                        </Button>
                      </div>
                      {renderDocItems()}
                    </>
                  ) : (
                    renderDocItems()
                  )
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

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Documentation Section</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1.5">
              This will create a new top-level section in your documentation.
              Each section can contain multiple subsections and content.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="filename">Section Name</Label>
            <Input
              id="filename"
              value={newFilename}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFilename(e.target.value)}
              placeholder="e.g. Getting Started"
              className="mt-2"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              This will be converted to a filename like "getting-started.mdx"
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFile}>
              Create Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  )
}
