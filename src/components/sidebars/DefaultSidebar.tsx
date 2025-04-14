// Default sidebar component for documentation preview
"use client"

import { FC, useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, FolderOpen, Home, Settings, ChevronDown, BookOpen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DocOutlineItem } from '@/lib/docService';
import { cn } from '@/lib/utils';

interface DocItem {
  id: string;
  title: string;
  children?: DocItem[];
}

interface DefaultSidebarProps {
  projectId: string;
  projectTitle?: string;
  docOutline: DocOutlineItem[] | null;
  isOpen?: boolean;
  onToggle?: () => void;
  onSelectSection?: (sectionId: string) => void;
  onSelectFile?: (filename: string) => void;
  activeSection?: string;
  collapsed?: boolean;
  setCollapsed?: (val: boolean) => void;
  filename?: string | null;
}

export const DefaultSidebar: FC<DefaultSidebarProps> = ({
  projectId,
  projectTitle = '',
  docOutline,
  isOpen = true,
  onToggle,
  onSelectSection,
  onSelectFile,
  activeSection,
  collapsed = false,
  setCollapsed,
  filename = null,
}) => {
  // Initialize expandedItems with all top-level items expanded
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(() => {
    if (!docOutline) return {};
    // Create an object with all top-level items set to true
    return docOutline.reduce((acc, item) => {
      acc[item.id] = true; // Set each top-level item to be expanded
      return acc;
    }, {} as Record<string, boolean>);
  });

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Convert DocOutlineItem to DocItem format
  const convertToDocItem = (item: DocOutlineItem): DocItem => {
    return {
      id: item.id,
      title: item.title,
      children: item.children?.map(convertToDocItem)
    };
  };

  const renderDocItem = (item: DocItem, depth = 0, parentId?: string) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];
    const isActive = activeSection === item.id;

    return (
      <div key={item.id} className="w-full mb-1.5">
        <div
          className={cn(
            "group flex items-center py-3 px-4 rounded-xl transition-all duration-300",
            "backdrop-blur-sm border border-transparent",
            "hover:border-primary/20 hover:bg-primary/5",
            hasChildren && "hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5",
            "relative cursor-pointer",
            !parentId && "font-medium tracking-tight",
            isActive && [
              "bg-gradient-to-r from-primary/15 to-primary/5",
              "border-primary/30 shadow-[0_4px_12px_rgba(var(--primary),0.15)]",
              "text-primary font-medium"
            ],
            depth > 0 && "text-[13px]"
          )}
          style={{ paddingLeft: `${depth * 20 + 16}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
              if (!parentId && onSelectFile) {
                onSelectFile(`${item.id}.mdx`);
              } else if (onSelectSection) {
                onSelectSection(item.id);
              }
            } else if (parentId && onSelectFile) {
              onSelectFile(`${parentId}.mdx#${item.id}`);
            } else if (onSelectSection) {
              onSelectSection(item.id);
            }
          }}
        >
          {isActive && (
            <>
              <div className="absolute top-0 bottom-0 left-0 w-1 rounded-full bg-primary" />
              <div className="absolute w-4 h-4 -translate-y-1/2 rounded-full -left-2 top-1/2 bg-primary/30 blur-md" />
            </>
          )}
          {hasChildren ? (
            <span className={cn(
              "w-6 h-6 mr-3 flex items-center justify-center",
              "rounded-lg transition-all duration-300",
              "bg-muted/50 group-hover:bg-primary/10",
              isExpanded && "bg-primary/20 rotate-90",
              isActive && "bg-primary/30"
            )}>
              <ChevronRight size={14} className={cn(
                "text-muted-foreground transition-colors duration-200",
                isActive && "text-primary",
                "group-hover:text-primary"
              )} />
            </span>
          ) : (
            <span className={cn(
              "w-6 h-6 mr-3 flex items-center justify-center",
              "rounded-lg transition-all duration-300",
              "bg-muted/50 group-hover:bg-primary/10",
              isActive && "bg-primary/30"
            )}>
              <FileText size={14} className={cn(
                "text-muted-foreground transition-colors duration-200",
                isActive && "text-primary",
                "group-hover:text-primary"
              )} />
            </span>
          )}
          <span className={cn(
            "truncate transition-all duration-300",
            "text-muted-foreground/90 group-hover:text-foreground",
            isActive && "text-primary font-medium"
          )}>{item.title}</span>
          
          {hasChildren && (
            <div className={cn(
              "ml-auto px-2 py-0.5 rounded-full text-xs",
              "bg-muted/30 text-muted-foreground/70",
              "transition-opacity duration-200",
              "flex items-center justify-center",
              isActive && "bg-primary/10 text-primary"
            )}>
              {item.children?.length || 0}
            </div>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="relative mt-2 mb-2 ml-6">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full bg-gradient-to-b from-primary/5 via-primary/20 to-primary/5" />
            {item.children?.map((child) => renderDocItem(child, depth + 1, parentId || item.id))}
          </div>
        )}
      </div>
    );
  };

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
  };

  return (
    <aside
      className={cn(
        "bg-gradient-to-br from-background/80 via-background/70 to-background/90",
        "border-r border-border/20 backdrop-blur-xl",
        "shadow-[1px_0_20px_rgba(0,0,0,0.03)]",
        "flex flex-col h-full relative",
        "transition-all duration-300 ease-out",
        collapsed ? "w-20" : "w-80"
      )}
    >
      {/* Decorative elements */}
      <div className="absolute w-12 h-12 rounded-full top-20 -right-6 bg-primary/5 blur-xl" />
      <div className="absolute w-16 h-16 rounded-full bottom-40 -left-8 bg-primary/10 blur-xl" />
      
      <div className={cn(
        "flex items-center justify-between h-16 px-5",
        "border-b border-border/10",
        "bg-gradient-to-r from-background/90 to-background/50",
        "backdrop-blur-xl supports-[backdrop-filter]:bg-background/30",
        "transition-all duration-300 ease-out",
        "relative z-10"
      )}>
        <div className={cn(
          "flex items-center transition-all duration-300",
          collapsed ? "opacity-0 scale-95" : "opacity-100 scale-100 delay-100"
        )}>
          <h2 className={cn(
            "text-xl font-bold tracking-tight",
            "bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent"
          )}>
            {projectTitle || 'Docs'}
          </h2>
        </div>
        {(setCollapsed || onToggle) && (
          <Button 
            variant="ghost" 
            size="icon"
            className={cn(
              "rounded-xl transition-all duration-300", 
              "bg-background/60 backdrop-blur-sm border border-border/20",
              "hover:bg-primary/5 hover:border-primary/30 hover:text-primary",
              "active:scale-95 hover:scale-105 shadow-sm hover:shadow",
              collapsed ? "mx-auto" : "ml-auto"
            )} 
            onClick={() => {
              if (setCollapsed) setCollapsed(!collapsed);
              if (onToggle) onToggle();
            }}
          >
            <ChevronRight 
              className={cn(
                "h-4 w-4 transition-transform duration-500 ease-in-out",
                collapsed ? "rotate-180" : "rotate-0"
              )} 
            />
          </Button>
        )}
      </div>

      {collapsed ? (
        <div className={cn(
          "flex flex-col items-center pt-8 pb-4 space-y-6",
          "transition-all duration-300 ease-out",
          "opacity-100 scale-100 delay-100"
        )}>
          {[
            {icon: 'home', label: 'Home'},
            {icon: 'folder', label: 'Projects'},
            {icon: 'settings', label: 'Settings'}
          ].map((item, index) => (
            <Button 
              key={item.icon}
              variant="ghost" 
              size="icon"
              className={cn(
                "transition-all duration-300 w-12 h-12",
                "rounded-xl bg-background/60 border border-border/10",
                "backdrop-blur-sm shadow-sm",
                "hover:bg-primary/5 hover:border-primary/30 hover:text-primary",
                "hover:shadow-md hover:scale-105 active:scale-95",
                "group relative"
              )}
            >
              {item.icon === 'home' && <Home className="w-5 h-5 transition-colors duration-200 group-hover:text-primary" />}
              {item.icon === 'folder' && <FolderOpen className="w-5 h-5 transition-colors duration-200 group-hover:text-primary" />}
              {item.icon === 'settings' && <Settings className="w-5 h-5 transition-colors duration-200 group-hover:text-primary" />}
              
              <span className={cn(
                "absolute left-full ml-2 px-2 py-1 rounded-md text-xs whitespace-nowrap",
                "bg-background/80 backdrop-blur-sm border border-border/20",
                "shadow-sm opacity-0 -translate-x-1 pointer-events-none",
                "transition-all duration-200",
                "group-hover:opacity-100 group-hover:translate-x-0",
                "z-50"
              )}>
                {item.label}
              </span>
            </Button>
          ))}
        </div>
      ) : (
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden",
          "transition-all duration-300 ease-out",
          collapsed ? "opacity-0 scale-95" : "opacity-100 scale-100 delay-100"
        )}>
          <ScrollArea className="flex-1 px-5 py-2">
            <div className="py-3 space-y-1">
              {docOutline ? (
                docOutline.map(item => renderDocItem(convertToDocItem(item), 0))
              ) : (
                <div className={cn(
                  "flex items-center px-5 py-4 m-2 transition-all duration-200",
                  "border rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent",
                  "border-primary/20 hover:border-primary/30 shadow-sm",
                  "backdrop-blur-sm"
                )}>
                  <FileText size={16} className="mr-3 text-primary" />
                  <span className="text-sm font-medium truncate text-primary">
                    Documentation
                  </span>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </aside>
  );
}; 