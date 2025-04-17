/* eslint-disable react/display-name */
import { FC, useEffect, useState, useRef } from 'react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { Loader2, Search, X, ArrowRight, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from 'next/navigation';
import { MdxFile } from '@/lib/docService';
// Import our comprehensive MDX components
import MdxComponents, {
  // Basic text components
  H1, H2, H3, P, Ul, Ol, Li, Blockquote, InlineCode, Hr,
  // API Documentation components
  Endpoint, Param, ParamsTable, Response, Note, Warning, RequestBody, Description,
  // UI Components
  Callout, CodeGroup, Card, CardGroup, Tabs, Tab, Accordion, AccordionItem,
  // Code component (pre formatting)
  Code,
  // New technical documentation components
  RateLimit, ApiResource, AuthMethod, StatusBadge, VersionHistory, 
  Version, ApiAttribute, AttributesTable,
  // Modern media components
  Image, Video, LinkPreview, Terminal,
  // FAQ components
  FAQ, FAQItem
} from '@/components/mdx/MdxComponents';

interface DocPreviewProps {
  projectId: string;
  projectTitle: string;
  content?: string;
  onSelectFile?: (filename: string) => void;
  selectedSection?: string;
  onSelectSection?: (sectionId: string) => void;
  allMdxFiles?: MdxFile[]; // Add prop for all MDX files
}

// Define types for MDX components
interface MDXComponentProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

// Components available to MDX - use our comprehensive MDX components
// This is crucial - the keys must match the component names used in MDX
const mdxComponents = {
  // Basic text elements
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  ul: Ul,
  ol: Ol,
  li: Li,
  blockquote: Blockquote,
  code: InlineCode,
  pre: Code,
  hr: Hr,
  
  // Documentation components - note these need capital letters to match usage in MDX
  Endpoint: Endpoint,
  Param: Param,
  ParamsTable: ParamsTable,
  Response: Response,
  Note: Note,
  Warning: Warning,
  RequestBody: RequestBody,
  Description: Description,
  
  // UI Components - again with capital letters
  Callout: Callout,
  Code: Code,
  CodeGroup: CodeGroup,
  Card: Card,
  CardGroup: CardGroup,
  Tabs: Tabs,
  Tab: Tab,
  Accordion: Accordion,
  AccordionItem: AccordionItem,
  
  // New technical documentation components
  RateLimit: RateLimit,
  ApiResource: ApiResource,
  AuthMethod: AuthMethod,
  StatusBadge: StatusBadge,
  VersionHistory: VersionHistory,
  Version: Version,
  ApiAttribute: ApiAttribute,
  AttributesTable: AttributesTable,
  
  // Modern media components
  Image: Image,
  Video: Video,
  LinkPreview: LinkPreview,
  Terminal: Terminal,
  
  // FAQ components
  FAQ: FAQ,
  FAQItem: FAQItem,
};

// New types for search functionality
type SearchResult = {
  filename: string;
  sectionId?: string;
  title: string;
  content: string;
  matchPosition: number;
};

export const DocPreview: FC<DocPreviewProps> = ({ 
  content, 
  selectedSection, 
  onSelectSection, 
  onSelectFile,
  allMdxFiles = [],
  projectId 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [Content, setContent] = useState<React.ComponentType<any> | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Compile MDX content when content prop changes
  useEffect(() => {
    let isMounted = true;
    
    async function processMdx() {
      if (!content) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);

      try {
        // Use evaluate with the runtime that includes our components
        const evaluateOptions = {
          ...runtime,
          baseUrl: import.meta.url,
        };
        
        const { default: Component } = await evaluate(content as string, evaluateOptions);
        
        if (isMounted) {
          setContent(() => Component);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("MDX Compile Error:", err);
        if (isMounted) {
          // Enhance the error message to be more helpful
          let errorMessage = (err as Error).message;
          
          // Try to provide more specific guidance for common errors
          if (errorMessage.includes("Could not parse expression with acorn")) {
            // Extract line number if available
            const lineMatch = errorMessage.match(/(\d+):(\d+):/);
            if (lineMatch) {
              const [, line, column] = lineMatch;
              
              // Get the line content from the code
              const codeLines = content?.split('\n') || [];
              const problematicLine = codeLines[parseInt(line) - 1] || '';
              
              errorMessage = `MDX Syntax Error at line ${line}, column ${column}:
              
${problematicLine}
${' '.repeat(parseInt(column) - 1)}^

This is likely caused by:
- Unbalanced curly braces {} in JSX expressions
- Invalid JavaScript inside curly braces
- Mixing Markdown and JSX improperly
- Using reserved characters without escaping them

Try checking for:
- Missing closing braces in expressions like {variable}
- Quotes inside JSX attributes (use single quotes inside double quotes or vice versa)
- Special characters that need to be escaped`;
            }
          }
          
          setError(errorMessage);
          setIsLoading(false);
          setContent(() => () => (
            <div className="p-5 border border-red-200 shadow-sm rounded-2xl bg-red-50/90 dark:bg-red-900/30 dark:border-red-800/90 backdrop-blur-sm">
              <h3 className="mb-2 font-medium text-red-600 dark:text-red-400">MDX Compile Error</h3>
              <pre className="text-sm text-red-500 whitespace-pre-wrap dark:text-red-300">{errorMessage}</pre>
            </div>
          ));
        }
      }
    }

    processMdx();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [content]);

  // Effect to scroll to selected section when it changes
  useEffect(() => {
    if (!selectedSection || !scrollAreaRef.current) return;
    
    // Find the element with the matching section ID
    const sectionElement = document.querySelector(`[data-section-id="${selectedSection}"]`);
    
    if (sectionElement) {
      // Scroll the element into view
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedSection, Content]);

  // Search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || allMdxFiles.length === 0) return;
    
    setIsSearching(true);
    setShowSearchResults(true);
    
    // Perform the search across all MDX files
    setTimeout(() => {
      const results: SearchResult[] = [];
      
      allMdxFiles.forEach(file => {
        // Convert MDX content to lowercase for case-insensitive search
        const lowerContent = file.content.toLowerCase();
        const lowerQuery = searchQuery.toLowerCase();
        
        // Find all matches
        let position = lowerContent.indexOf(lowerQuery);
        while (position !== -1 && results.length < 20) {
          // Extract surrounding content for context (100 chars before and after)
          const start = Math.max(0, position - 100);
          const end = Math.min(file.content.length, position + searchQuery.length + 100);
          let snippet = file.content.substring(start, end);
          
          // Add ellipsis if needed
          if (start > 0) snippet = '...' + snippet;
          if (end < file.content.length) snippet = snippet + '...';
          
          // Try to extract title from nearby heading
          let title = file.filename;
          const headingRegex = /#+\s+(.+)/;
          const contentBefore = file.content.substring(Math.max(0, position - 500), position);
          const headingMatch = contentBefore.match(headingRegex);
          if (headingMatch && headingMatch[1]) {
            title = headingMatch[1].trim();
          }
          
          // Try to find nearby section ID
          const sectionIdRegex = /<h\d[^>]*data-section-id="([^"]+)"[^>]*>/i;
          const sectionMatch = file.content.substring(Math.max(0, position - 1000), position + 1000).match(sectionIdRegex);
          
          results.push({
            filename: file.filename,
            sectionId: sectionMatch ? sectionMatch[1] : undefined,
            title,
            content: snippet,
            matchPosition: position
          });
          
          // Find next match
          position = lowerContent.indexOf(lowerQuery, position + 1);
        }
      });
      
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const handleResultClick = (result: SearchResult) => {
    if (onSelectFile) {
      const destination = result.sectionId 
        ? `${result.filename}#${result.sectionId}`
        : result.filename;
      
      onSelectFile(destination);
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  // If we don't have a component yet, show loading
  if (isLoading) {
    return (
      <div className="w-full h-full transition-all duration-300 bg-background">
        <ScrollArea className="h-full">
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </ScrollArea>
      </div>
    );
  }

  // If we have an error, show the error
  if (error) {
    return (
      <div className="w-full h-full transition-all duration-300 bg-background">
        <ScrollArea className="h-full">
          <div className="max-w-3xl p-8 mx-auto">
            <div className="p-5 border rounded-2xl bg-destructive/5 border-destructive/10 backdrop-blur-sm">
              <h3 className="mb-2 font-medium text-destructive">MDX Compile Error</h3>
              <pre className="text-sm whitespace-pre-wrap text-destructive/90">{error}</pre>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Otherwise, render the component with our components explicitly passed
  return (
    <div className="w-full h-full transition-all duration-300 bg-background">
      {/* Search Bar */}
      <div 
        ref={searchRef}
        className="sticky top-0 z-50 w-full px-4 py-3 border-b backdrop-blur-xl bg-background/80 border-border/30"
      >
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <div className={cn(
              "relative flex items-center overflow-hidden transition-all duration-300",
              "backdrop-blur-sm shadow-sm border border-border/40",
              "rounded-xl bg-background/60",
              "group focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30"
            )}>
              <div className={cn(
                "absolute left-3 transition-colors duration-300",
                searchQuery && "text-primary"
              )}>
                {isSearching ? 
                  <Loader2 className="w-5 h-5 text-primary animate-spin" /> : 
                  <Search className="w-5 h-5 text-muted-foreground/60 group-focus-within:text-primary" />
                }
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className={cn(
                  "w-full h-full px-11 py-3 transition-all duration-300",
                  "bg-transparent outline-none",
                  "placeholder:text-muted-foreground/50 text-foreground"
                )}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowSearchResults(false);
                  }}
                  className={cn(
                    "absolute right-12 transition-opacity duration-200",
                    "text-muted-foreground/60 hover:text-foreground"
                  )}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className={cn(
                  "absolute right-3 transition-all duration-300",
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  searchQuery ? "bg-primary/90 text-white" : "bg-muted/60 text-muted-foreground/60",
                  searchQuery && "hover:bg-primary active:bg-primary/80"
                )}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className={cn(
                "absolute left-0 right-0 mt-2 z-50 transition-all duration-300 transform",
                "bg-background/95 backdrop-blur-xl border border-border/30",
                "shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-xl overflow-hidden",
                "max-h-[70vh] overflow-y-auto"
              )}>
                {searchResults.length === 0 && !isSearching ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-background/80">
                    <div className="p-3 mb-3 rounded-full bg-muted">
                      <Search className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <p className="mb-1 text-lg font-medium">No results found</p>
                    <p className="text-sm text-muted-foreground">Try different keywords or check your spelling</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/20">
                    {isSearching ? (
                      <div className="flex items-center justify-center p-6 bg-background/80">
                        <Loader2 className="w-5 h-5 mr-2 animate-spin text-primary" />
                        <span className="text-muted-foreground">Searching documentation...</span>
                      </div>
                    ) : (
                      searchResults.map((result, index) => (
                        <div
                          key={`${result.filename}-${index}`}
                          onClick={() => handleResultClick(result)}
                          className={cn(
                            "p-4 transition-all duration-200 cursor-pointer bg-background/80",
                            "hover:bg-primary/5 flex flex-col group",
                            "border-l-2 border-l-transparent hover:border-l-primary"
                          )}
                        >
                          <div className="flex items-center mb-2">
                            <div className="flex items-center flex-1 min-w-0">
                              <FileText className="w-4 h-4 mr-2 text-primary/70 group-hover:text-primary" />
                              <span className="font-medium truncate text-foreground group-hover:text-primary">
                                {result.title}
                              </span>
                            </div>
                            <div className="px-2 py-0.5 ml-3 text-xs rounded-full bg-primary/10 text-primary/90 font-mono group-hover:bg-primary/20">
                              {result.filename}
                            </div>
                          </div>
                          <div className="pl-6 pr-2 rounded bg-muted/30 group-hover:bg-muted/50">
                            <p className="py-2 text-sm text-muted-foreground">
                              {result.content.split(new RegExp(`(${searchQuery})`, 'i')).map((part, i) => 
                                part.toLowerCase() === searchQuery.toLowerCase() ? 
                                  <mark key={i} className="px-1 font-medium rounded bg-primary/20 text-primary">
                                    {part}
                                  </mark> : 
                                  part
                              )}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="h-[calc(100%-56px)]">
        <div className="max-w-3xl p-8 mx-auto prose dark:prose-invert 
          prose-pre:border prose-pre:border-gray-200/50 dark:prose-pre:border-gray-800/80 
          prose-pre:bg-transparent dark:prose-pre:bg-transparent 
          prose-pre:shadow-sm prose-pre:rounded-xl 
          prose-code:text-gray-800 dark:prose-code:text-gray-300 
          [&_.shiki]:!bg-transparent
          [&_pre_code]:!border-0 [&_pre_code]:!p-0 [&_pre_code]:!m-0
          [&_pre]:!bg-transparent [&_pre]:!overflow-x-auto">
          {Content && <Content components={mdxComponents} />}
        </div>
      </ScrollArea>
    </div>
  );
}; 