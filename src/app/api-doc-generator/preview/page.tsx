'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SyntaxHighlighter from 'react-syntax-highlighter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Add new imports for enhanced UI components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChevronLeft, FileText, Download, ExternalLink, Menu, Code, Eye, Github, Copy } from 'lucide-react';

// Define the structure of each MDX file
interface MdxFile {
  filename: string;
  content: string;
}

// Add interface for table of contents
interface TocItem {
  id: string;
  text: string;
  level: number;
}

// Add interface for code examples
interface CodeExample {
  language: string;
  code: string;
  title?: string;
}

// Add interface for API endpoint
interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  examples: CodeExample[];
}

// Add custom components for enhanced markdown rendering
const CustomH1 = ({ children, ...props }: any) => {
  const id = children?.toString().toLowerCase().replace(/[^\w]+/g, '-');
  return (
    <h1
      id={id}
      className="mt-2 mb-6 text-4xl font-bold tracking-tight scroll-m-20"
      {...props}
    >
      {children}
      <a
        href={`#${id}`}
        className="ml-2 transition-opacity opacity-0 hover:opacity-100"
        aria-label="Link to section"
      >
        #
      </a>
    </h1>
  );
};

const CustomH2 = ({ children, ...props }: any) => {
  const id = children?.toString().toLowerCase().replace(/[^\w]+/g, '-');
  return (
    <h2
      id={id}
      className="pb-2 mt-12 mb-4 text-3xl font-semibold tracking-tight border-b scroll-m-20 first:mt-0"
      {...props}
    >
      {children}
      <a
        href={`#${id}`}
        className="ml-2 transition-opacity opacity-0 hover:opacity-100"
        aria-label="Link to section"
      >
        #
      </a>
    </h2>
  );
};

// Add custom code block component
const CustomCodeBlock = ({ language, code, title }: CodeExample) => {
  return (
    <div className="my-6 border rounded-lg bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      {title && (
        <div className="px-4 py-2 font-mono text-sm text-gray-600 border-b dark:border-gray-800 dark:text-gray-400">
          {title}
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          margin: 0,
          borderRadius: title ? '0 0 8px 8px' : '8px',
          padding: '1rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

// Add API endpoint component
const ApiEndpointComponent = ({ method, path, description, examples }: ApiEndpoint) => {
  const methodColors = {
    GET: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    POST: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    PATCH: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  };

  return (
    <div className="p-6 my-8 bg-white border rounded-lg shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <span className={cn(
          'rounded px-2.5 py-1 text-sm font-semibold',
          methodColors[method as keyof typeof methodColors]
        )}>
          {method}
        </span>
        <code className="px-2 py-1 font-mono text-sm bg-gray-100 rounded dark:bg-gray-800">
          {path}
        </code>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">{description}</p>
      {examples.length > 0 && (
        <Tabs defaultValue={examples[0].language} className="mt-6">
          <TabsList>
            {examples.map((example, index) => (
              <TabsTrigger 
                key={`${example.language}-${index}-trigger`} 
                value={`${example.language}-${index}`}
              >
                {example.language}
              </TabsTrigger>
            ))}
          </TabsList>
          {examples.map((example, index) => (
            <TabsContent 
              key={`${example.language}-${index}-content`} 
              value={`${example.language}-${index}`}
            >
              <CustomCodeBlock {...example} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default function PreviewDocumentationPage() {
  const router = useRouter();
  const [mdxFiles, setMdxFiles] = useState<MdxFile[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'source'>('preview');
  const [tableOfContents, setTableOfContents] = useState<TocItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('');
  const [projectTitle, setProjectTitle] = useState<string>('API Documentation');
  
  /**
   * Load the generated MDX files from sessionStorage on component mount
   */
  useEffect(() => {
    setIsClient(true);
    
    // Get generated docs from sessionStorage
    const storedDocs = sessionStorage.getItem('generatedDocs');
    console.log('📦 Retrieved from sessionStorage:', storedDocs ? 'data found' : 'no data');
    
    if (!storedDocs) {
      router.push('/dashboard/api-doc-generator/generate');
      return;
    }
    
    try {
      const parsedDocs = JSON.parse(storedDocs);
      console.log('🔍 Parsed docs structure:', parsedDocs);
      
      // Ensure we have the correct structure (array of objects with filename and content)
      let formattedDocs: MdxFile[];
      
      if (Array.isArray(parsedDocs)) {
        if (parsedDocs.length > 0 && typeof parsedDocs[0] === 'string') {
          // Handle case where we have an array of strings
          formattedDocs = parsedDocs.map((content, index) => ({
            filename: `section-${index + 1}.mdx`,
            content: content
          }));
          console.log('⚙️ Converted array of strings to MdxFile objects');
        } else if (parsedDocs.length > 0 && parsedDocs[0].filename && parsedDocs[0].content) {
          // Already in the correct format
          formattedDocs = parsedDocs;
          console.log('✅ Files already in correct format');
        } else {
          // Handle other array formats
          formattedDocs = parsedDocs.map((item, index) => {
            if (typeof item === 'object' && item !== null) {
              return {
                filename: item.filename || `section-${index + 1}.mdx`,
                content: item.content || JSON.stringify(item)
              };
            } else {
              return {
                filename: `section-${index + 1}.mdx`,
                content: typeof item === 'string' ? item : JSON.stringify(item)
              };
            }
          });
          console.log('🔄 Restructured array items to MdxFile format');
        }
      } else if (typeof parsedDocs === 'object' && parsedDocs !== null) {
        // Handle case where we have a single object
        formattedDocs = [{
          filename: parsedDocs.filename || 'documentation.mdx',
          content: parsedDocs.content || JSON.stringify(parsedDocs)
        }];
        console.log('🔄 Converted single object to MdxFile array');
      } else {
        // Fallback for string or other types
        formattedDocs = [{
          filename: 'documentation.mdx',
          content: typeof parsedDocs === 'string' ? parsedDocs : JSON.stringify(parsedDocs)
        }];
        console.log('🔄 Created fallback MdxFile from non-array data');
      }
      
      console.log('📚 Final files to display:', formattedDocs.map(f => f.filename));
      setMdxFiles(formattedDocs);
    } catch (err) {
      console.error('❌ Error parsing stored documentation:', err);
      router.push('/dashboard/api-doc-generator/generate');
    }
  }, [router]);
  
  /**
   * Download all MDX files as a zip archive
   */
  const handleDownloadAll = () => {
    if (!mdxFiles.length) return;
    
    const zip = new JSZip();
    
    // Add all MDX files to the zip
    mdxFiles.forEach((file) => {
      zip.file(file.filename, file.content);
    });
    
    // Add a simple README file
    zip.file('README.md', 
      `# API Documentation\n\nGenerated on ${new Date().toLocaleDateString()}\n\n` +
      `This archive contains ${mdxFiles.length} MDX files that can be used in your documentation website.\n`
    );
    
    // Generate and download the zip file
    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        saveAs(content, 'api-documentation.zip');
      });
  };
  
  /**
   * Download the current MDX file
   */
  const handleDownloadCurrent = () => {
    if (!mdxFiles.length) return;
    
    const currentFile = mdxFiles[currentFileIndex];
    const blob = new Blob([currentFile.content], { type: 'text/markdown' });
    saveAs(blob, currentFile.filename);
  };
  
  /**
   * Copy the current MDX file content to clipboard
   */
  const handleCopyToClipboard = () => {
    if (!mdxFiles.length) return;
    
    const content = mdxFiles[currentFileIndex].content;
    console.log('📋 Copying to clipboard:', content.substring(0, 100) + '...');
    
    navigator.clipboard.writeText(content)
      .then(() => {
        console.log('✅ Content copied to clipboard');
        alert('Content copied to clipboard!');
      })
      .catch((err) => {
        console.error('❌ Failed to copy content:', err);
      });
  };
  
  /**
   * Navigate to the next file in the list
   */
  const handleNextFile = () => {
    if (currentFileIndex < mdxFiles.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
    }
  };
  
  /**
   * Navigate to the previous file in the list
   */
  const handlePrevFile = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex(currentFileIndex - 1);
    }
  };
  
  /**
   * Change the currently displayed MDX file
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentFileIndex(Number(e.target.value));
  };
  
  // Add function to extract headings from markdown content
  const extractTableOfContents = (content: string): TocItem[] => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const toc: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      toc.push({ id, text, level });
    }

    return toc;
  };

  // Update table of contents when current file changes
  useEffect(() => {
    if (mdxFiles.length > 0) {
      const currentContent = mdxFiles[currentFileIndex].content;
      setTableOfContents(extractTableOfContents(currentContent));
    }
  }, [currentFileIndex, mdxFiles]);

  // Add scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentActiveSection = '';
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentActiveSection = heading.id;
        }
      });
      
      setActiveSection(currentActiveSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  /**
   * Navigate to the editor with the current MDX file content
   */
  const handleEditInEditor = () => {
    if (!mdxFiles.length) return;
    
    const currentFile = mdxFiles[currentFileIndex];
    
    // Store the current MDX content in sessionStorage for the editor
    sessionStorage.setItem('mdxEditorCode', currentFile.content);
    
    // Get project ID from sessionStorage if available
    const projectId = sessionStorage.getItem('projectId') || null;
    if (projectId) {
      sessionStorage.setItem('editorProjectId', projectId);
      console.log('📝 Set project ID for editor:', projectId);
    }
    
    // Get the filename for reference
    sessionStorage.setItem('editorFilename', currentFile.filename);
    
    // Navigate to the editor
    router.push('/editor');
  };
  
  // Show loading state while checking for client-side rendering
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg
            className="w-10 h-10 mx-auto text-blue-500 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          <p className="mt-3 text-lg">Loading documentation...</p>
        </div>
      </div>
    );
  }
  
  // Show message if no files were generated
  if (mdxFiles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14a7 7 0 110-14 7 7 0 010 14z"
            ></path>
          </svg>
          <h1 className="mt-4 text-2xl font-bold">No Documentation Available</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            We couldn't find any generated documentation. Try generating it again.
          </p>
          <Link
            href="/dashboard/api-doc-generator/generate"
            className="inline-block px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Generate Documentation
          </Link>
        </div>
      </div>
    );
  }
  
  // Make sure we have a valid current file
  const currentFile = mdxFiles[currentFileIndex] || mdxFiles[0];
  
  // Update the return statement with new UI
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      {/* Modern Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-80 transform overflow-hidden bg-gray-50 transition-transform duration-200 ease-in-out dark:bg-gray-800/95 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:relative lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="sticky top-0 z-10 px-6 py-4 border-b border-gray-200 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{projectTitle}</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">API Reference</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Version Badge */}
            <div className="inline-flex items-center px-2.5 py-0.5 mt-4 text-xs font-medium rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              <span className="w-1 h-1 mr-1.5 rounded-full bg-blue-500"></span>
              Latest Version
            </div>
          </div>

          {/* Enhanced Navigation */}
          <ScrollArea className="flex-1">
            <div className="px-4 py-6">
              <nav className="space-y-1">
                {mdxFiles.map((file, index) => {
                  const isActive = index === currentFileIndex;
                  const fileName = file.filename.replace(/\.mdx$/, '').replace(/-/g, ' ');
                  
                  return (
                    <button
                      key={file.filename}
                      onClick={() => setCurrentFileIndex(index)}
                      className={cn(
                        'w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                        isActive 
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                      )}
                    >
                      <FileText className={cn(
                        'w-4 h-4 mr-3',
                        isActive ? 'text-blue-500' : 'text-gray-400'
                      )} />
                      <span className="capitalize truncate">{fileName}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="mt-8">
                  <h3 className="px-4 mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    On This Page
                  </h3>
                  <nav className="space-y-1">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        style={{ paddingLeft: `${(item.level - 1) * 12 + 16}px` }}
                        className={cn(
                          'block py-2 pr-3 text-sm transition-colors rounded-lg',
                          activeSection === item.id
                            ? 'text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/50'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50'
                        )}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer with Links */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <nav className="items-center hidden ml-6 space-x-4 lg:flex">
                <a
                  href="#"
                  className="px-3 py-2 text-sm font-medium text-gray-900 rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Overview
                </a>
                <a
                  href="#"
                  className="px-3 py-2 text-sm font-medium text-gray-900 rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  API Reference
                </a>
                <a
                  href="#"
                  className="px-3 py-2 text-sm font-medium text-gray-900 rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Examples
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'preview' ? 'source' : 'preview')}>
                {viewMode === 'preview' ? (
                  <>
                    <Code className="w-4 h-4 mr-2" />
                    View Source
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    View Preview
                  </>
                )}
              </Button>
              <Button variant="default" size="sm">
                <Github className="w-4 h-4 mr-2" />
                Edit on GitHub
              </Button>
            </div>
          </div>
        </header>

        {/* Documentation Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl py-8 mx-auto">
            <article className={cn(
              'prose prose-lg max-w-none dark:prose-invert',
              'prose-headings:scroll-m-20 prose-headings:font-semibold',
              'prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-blue-400',
              'prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm dark:prose-code:bg-gray-800',
              'prose-pre:rounded-lg prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700',
              viewMode === 'preview' ? '' : 'hidden'
            )}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h1: CustomH1,
                  h2: CustomH2,
                  h3: ({node, ...props}) => (
                    <h3
                      id={props.children?.toString().toLowerCase().replace(/[^\w]+/g, '-')}
                      className="mt-8 mb-4 text-2xl font-semibold tracking-tight scroll-m-20"
                      {...props}
                    />
                  ),
                  code({node, inline, className, children, ...props}: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <CustomCodeBlock
                        language={match[1]}
                        code={String(children).replace(/\n$/, '')}
                      />
                    ) : (
                      <code
                        className={cn(
                          'rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800',
                          className
                        )}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  // Add support for API endpoint documentation
                  div({node, className, children, ...props}: any) {
                    if (className === 'api-endpoint') {
                      const endpoint = node.properties?.endpoint;
                      if (endpoint) {
                        return <ApiEndpointComponent {...endpoint} />;
                      }
                    }
                    return <div className={className} {...props}>{children}</div>;
                  },
                }}
              >
                {currentFile?.content || '# No content available'}
              </ReactMarkdown>
            </article>

            {/* Source View */}
            <div className={viewMode === 'source' ? '' : 'hidden'}>
              <div className="border border-gray-200 rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Source Code
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(currentFile?.content || '')}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <CustomCodeBlock
                  language="markdown"
                  code={currentFile?.content || '# No content available'}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 