"use client"

import { useState, useRef, useEffect } from 'react'
import { ChatMessage, MDXFileInfo, ToolCall, chatService } from '@/lib/chatService'
import { cn } from '@/lib/utils'
import { ChevronRight, Send, Loader2, X, FileText, RefreshCw, Check, MessageSquare, ArrowUp, RotateCcw, Settings, Cpu, Trash2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AVAILABLE_MODELS } from '@/lib/openrouter'
import { saveProjectMdxFile } from '@/lib/mdxEditorUtils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import ReactMarkdown from 'react-markdown'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface ChatWindowProps {
  projectId: string;
  mdxFiles: MDXFileInfo[];
  onMdxFileUpdate?: (filename: string, content: string) => void;
  className?: string;
}

interface SuggestionFix {
  filename: string;
  operation: 'add' | 'edit' | 'remove' | 'fix';
  section?: string;
  replacement?: string;
  explanation: string;
}

interface MdxUpdate {
  filename: string;
  content: string;
  type: 'update' | 'add' | 'delete';
}

export default function ChatWindow({ projectId, mdxFiles, onMdxFileUpdate, className }: ChatWindowProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'system', content: chatService.getSystemPrompt(mdxFiles) }
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>(mdxFiles.map(file => file.filename))
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[1]?.id || 'anthropic/claude-3.5-sonnet')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [mdxUpdate, setMdxUpdate] = useState<MdxUpdate | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Update system message when mdxFiles change
    setMessages(prev => [
      { role: 'system', content: chatService.getSystemPrompt(mdxFiles) },
      ...prev.filter(m => m.role !== 'system')
    ])
  }, [mdxFiles])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return

    // Filter to only selected files
    const relevantFiles = mdxFiles.filter(file => selectedFiles.includes(file.filename))
    
    if (relevantFiles.length === 0) {
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: "Please select at least one MDX file to analyze. I need access to file content to help with your documentation."
        }
      ])
      return
    }
    
    const userMessage: ChatMessage = { role: 'user', content: inputValue }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsProcessing(true)

    try {
      // Update system message with current file selection
      const updatedMessages = messages.map(msg => 
        msg.role === 'system' 
          ? { ...msg, content: chatService.getSystemPrompt(relevantFiles) }
          : msg
      )
      
      const response = await chatService.sendChatMessage(
        [...updatedMessages, userMessage], 
        selectedModel,
        relevantFiles // Pass only selected files
      )
      
      setMessages(prev => [...prev, response])

      // Check for MDX update format in the response
      const update = detectMdxUpdate(response.content)
      if (update) {
        setMdxUpdate(update)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      let errorMessage = 'Sorry, I encountered an error communicating with the AI service.'
      if (error instanceof Error) {
        if (error.message.includes('OPENROUTER_API_KEY')) {
          errorMessage = "API key error: Please check that your OpenRouter API key is correctly set in your .env.local file."
        } else if (error.message.includes('fetch')) {
          errorMessage = "Network error: Could not connect to the AI service. Please check your internet connection."
        } else {
          errorMessage = `Error: ${error.message}`
        }
      }
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: errorMessage
        }
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const detectMdxUpdate = (content: string): MdxUpdate | null => {
    // Check for updates
    const updateRegex = /MDX_UPDATE_START\s+filename:\s*([^\n]+)\s+content:\s*([\s\S]*?)\s*MDX_UPDATE_END/;
    const updateMatch = content.match(updateRegex);
    
    if (updateMatch) {
      return {
        type: 'update',
        filename: updateMatch[1].trim(),
        content: updateMatch[2].trim()
      };
    }
    
    // Check for additions
    const addRegex = /MDX_ADD_START\s+filename:\s*([^\n]+)\s+content:\s*([\s\S]*?)\s*MDX_ADD_END/;
    const addMatch = content.match(addRegex);
    
    if (addMatch) {
      return {
        type: 'add',
        filename: addMatch[1].trim(),
        content: addMatch[2].trim()
      };
    }
    
    // Check for deletions
    const deleteRegex = /MDX_DELETE_START\s+filename:\s*([^\n]+)\s*MDX_DELETE_END/;
    const deleteMatch = content.match(deleteRegex);
    
    if (deleteMatch) {
      return {
        type: 'delete',
        filename: deleteMatch[1].trim(),
        content: ''
      };
    }
    
    return null;
  };

  const applyMdxUpdate = async () => {
    if (!mdxUpdate) return;
    
    try {
      setIsSaving(true);
      await saveProjectMdxFile(projectId, mdxUpdate.filename, mdxUpdate.content);
      
      if (onMdxFileUpdate) {
        onMdxFileUpdate(mdxUpdate.filename, mdxUpdate.content);
      }
      
      setMdxUpdate(null);
      
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: `✅ Successfully updated ${mdxUpdate.filename}`
        }
      ]);
    } catch (error) {
      console.error('Error applying MDX update:', error);
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: `Error applying update to ${mdxUpdate.filename}: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
        }
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleFileSelection = (filename: string) => {
    setSelectedFiles(prev => 
      prev.includes(filename)
        ? prev.filter(f => f !== filename)
        : [...prev, filename]
    )
  }

  const extractSuggestionFix = (content: string): SuggestionFix | null => {
    // Log the message content for debugging
    console.log('Analyzing message for fix suggestions:', content.substring(0, 100) + '...');
    
    // Check for our structured fix format first
    const structuredFixRegex = /I've identified the syntax error in \[?([^\]]+)\]?\.[\s\S]*?problematic section:\s*```(?:mdx|jsx)?\s*([\s\S]*?)```[\s\S]*?fixed version:\s*```(?:mdx|jsx)?\s*([\s\S]*?)```/i;
    const matchStructured = content.match(structuredFixRegex);
    
    if (matchStructured) {
      console.log('Found structured fix format');
      const [, filename, problematicSection, fixedVersion] = matchStructured;
      
      // Extract explanation from the text after the code blocks
      const explanationMatch = content.match(/The fix involves ([\s\S]*?)(?:$|\.)/);
      const explanation = explanationMatch ? explanationMatch[1].trim() : 'Applying syntax fix';
      
      return {
        filename: filename.trim(),
        operation: 'fix',
        section: problematicSection.trim(),
        replacement: fixedVersion.trim(),
        explanation: explanation
      };
    }
    
    // Look for code blocks that might contain fixes
    const codeBlockRegex = /```(?:mdx|jsx|typescript|javascript)?\s*([\s\S]*?)```/g;
    const sections = content.split(/\n#{2,3}\s+/);
    
    // Create a potential fix object
    let potentialFix: Partial<SuggestionFix> = {};
    
    // Check for explicit markers
    if (content.includes('I\'ve identified') || 
        content.includes('found the issue') || 
        content.includes('syntax error') || 
        content.includes('Here\'s the fix') ||
        content.includes('I recommend fixing this by') || 
        content.includes('Here is the fixed version') || 
        content.includes('This is how you can fix it') ||
        content.includes('The issue can be fixed by')) {
      console.log('Found a fix suggestion marker');
      
      // Try to identify the filename
      const filenameMatch = content.match(/in\s+["`']?([^"'`]+\.mdx)["`']?/i) || 
                          content.match(/file\s+["`']?([^"'`]+\.mdx)["`']?/i) ||
                          content.match(/([^"'`\s]+\.mdx)/i);
      
      if (filenameMatch) {
        potentialFix.filename = filenameMatch[1];
      } else if (selectedFiles.length > 0) {
        // Default to first selected file if filename not found
        potentialFix.filename = selectedFiles[0];
        console.log('No filename found in content, defaulting to:', selectedFiles[0]);
      }
      
      // Determine operation type
      if (content.toLowerCase().includes('add')) {
        potentialFix.operation = 'add';
      } else if (content.toLowerCase().includes('remove')) {
        potentialFix.operation = 'remove';
      } else if (content.toLowerCase().includes('replace') || content.toLowerCase().includes('edit')) {
        potentialFix.operation = 'edit';
      } else {
        potentialFix.operation = 'fix';
      }
      
      // Extract explanation
      const explanationLines = content.split('\n')
        .filter(line => !line.startsWith('```') && line.trim().length > 15 && 
                (line.includes('issue') || line.includes('error') || line.includes('fix')))
        .slice(0, 2);
      potentialFix.explanation = explanationLines.join(' ');
      
      // Extract code blocks
      let codeBlocks: string[] = [];
      let match;
      const codeBlockRegexGlobal = /```(?:mdx|jsx|typescript|javascript)?\s*([\s\S]*?)```/g;
      while ((match = codeBlockRegexGlobal.exec(content)) !== null) {
        codeBlocks.push(match[1].trim());
      }
      
      console.log(`Found ${codeBlocks.length} code blocks`);
      
      // Use code blocks for section and replacement
      if (codeBlocks.length === 1) {
        // Only one code block - treat as replacement
        potentialFix.replacement = codeBlocks[0];
      } else if (codeBlocks.length >= 2) {
        // Two or more code blocks - first could be the original section, second the replacement
        potentialFix.section = codeBlocks[0];
        potentialFix.replacement = codeBlocks[1];
      }
      
      // Log the extracted fix
      console.log('Extracted suggestion fix:', potentialFix);
      
      // Check if we have enough information
      if (potentialFix.filename && potentialFix.operation && 
          (potentialFix.replacement || potentialFix.operation === 'remove')) {
        return potentialFix as SuggestionFix;
      }
    }
    
    // If we didn't find a structured fix, look for code blocks with MDX content
    let mdxCodeBlock = '';
    let match;
    const codeBlockRegex2 = /```(?:mdx|jsx|typescript|javascript)?\s*([\s\S]*?)```/g;
    while ((match = codeBlockRegex2.exec(content)) !== null) {
      const blockContent = match[1].trim();
      if (blockContent.includes('<') && blockContent.includes('>')) {
        mdxCodeBlock = blockContent;
        break;
      }
    }
    
    if (mdxCodeBlock && selectedFiles.length > 0) {
      console.log('Found MDX code block, treating as a potential fix');
      return {
        filename: selectedFiles[0],
        operation: 'fix',
        replacement: mdxCodeBlock,
        explanation: 'Apply this fix to resolve the syntax issue'
      };
    }
    
    console.log('No valid fix suggestion found');
    return null;
  }

  const SuggestionFixView = ({ 
    suggestion, 
    onApply 
  }: { 
    suggestion: SuggestionFix, 
    onApply: (suggestion: SuggestionFix) => void 
  }) => {
    return (
      <div className="p-4 mt-2 border border-primary/20 bg-primary/5 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium text-primary">Suggested Fix</div>
          <Button 
            size="sm" 
            onClick={() => {
              // Create MDX update format
              const mdxUpdate: MdxUpdate = {
                filename: suggestion.filename,
                content: suggestion.replacement || '',
                type: 'update' as const
              };
              setMdxUpdate(mdxUpdate);
            }}
            className="gap-1"
          >
            <Check className="w-3 h-3" />
            Apply Fix
          </Button>
        </div>
        
        <div className="mb-2 text-sm text-gray-700 dark:text-gray-300">
          {suggestion.explanation}
        </div>
        
        <div className="flex items-center mb-3 text-xs text-gray-600 dark:text-gray-400">
          <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded mr-2">
            {suggestion.operation.charAt(0).toUpperCase() + suggestion.operation.slice(1)}
          </span>
          <FileText className="w-3 h-3 mr-1" />
          <span className="font-mono">{suggestion.filename}</span>
        </div>
        
        {suggestion.replacement && (
          <div className="p-3 border border-gray-200 rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <pre className="overflow-x-auto font-mono text-xs text-gray-800 break-all whitespace-pre-wrap dark:text-gray-200">
              {suggestion.replacement}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const renderChatMessage = (message: ChatMessage, index: number) => {
    // Skip system messages
    if (message.role === 'system') return null
    
    return (
      <div key={index} className={cn(
        "chat-message py-4 px-3",
        message.role === 'user' 
          ? "user-message flex flex-row-reverse" 
          : "assistant-message flex"
      )}>
        <div className={cn(
          "flex-none flex items-center justify-center w-8 h-8 rounded-full mr-3",
          message.role === 'user'
            ? "bg-primary text-white ml-3 mr-0"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
        )}>
          {message.role === 'user' ? (
            <span className="text-xs font-semibold">You</span>
          ) : (
            <MessageSquare className="w-4 h-4" />
          )}
        </div>
        <div className={cn(
          "flex-1 p-4 rounded-xl max-w-[80%]",
          message.role === 'user'
            ? "bg-primary text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
        )}>
          <div className="prose-sm prose dark:prose-invert">
            {message.role === 'user' ? (
              message.content
            ) : (
              <ReactMarkdown
                components={{
                  pre: ({ node, ...props }) => (
                    <div className="relative my-2">
                      <pre className="p-4 overflow-auto bg-gray-900 rounded-lg dark:bg-gray-800" {...props} />
                    </div>
                  ),
                  code: ({ node, inline, className, ...props }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode }) => {
                    if (className?.includes('language-update')) {
                      return (
                        <div className="p-3 my-2 border rounded-lg bg-primary/10 border-primary/20">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="font-mono text-sm text-primary" {...props} />
                          </div>
                        </div>
                      );
                    }
                    return inline 
                      ? <code className={cn("bg-gray-200 dark:bg-gray-700 rounded px-1", className)} {...props} />
                      : <code className={className} {...props} />;
                  }
                }}
              >
                {message.content
                  .replace(/MDX_UPDATE_START\s+filename:\s*([^\n]+)[\s\S]*?MDX_UPDATE_END/g, (match, filename) => `
\`\`\`update
📝 File Updated: ${filename}
\`\`\`
`)
                  .replace(/MDX_ADD_START\s+filename:\s*([^\n]+)[\s\S]*?MDX_ADD_END/g, (match, filename) => `
\`\`\`update
➕ File Added: ${filename}
\`\`\`
`)
                  .replace(/MDX_DELETE_START\s+filename:\s*([^\n]+)[\s\S]*?MDX_DELETE_END/g, (match, filename) => `
\`\`\`update
🗑️ File Deleted: ${filename}
\`\`\`
`)}
              </ReactMarkdown>
            )}
          </div>
          
          {message.role === 'assistant' && (
            (() => {
              const suggestionFix = extractSuggestionFix(message.content);
              if (suggestionFix) {
                console.log('Rendering suggestion fix component for:', suggestionFix);
                return (
                  <SuggestionFixView 
                    suggestion={suggestionFix} 
                    onApply={(suggestion) => {
                      console.log('Applying suggestion:', suggestion);
                      // Create MDX update format
                      const mdxUpdate: MdxUpdate = {
                        filename: suggestion.filename,
                        content: suggestion.replacement || '',
                        type: 'update' as const
                      };
                      setMdxUpdate(mdxUpdate);
                    }}
                  />
                );
              }
              return null;
            })()
          )}
        </div>
      </div>
    )
  }

  const handleClearChat = () => {
    const systemMessage = messages.find(m => m.role === 'system');
    if (systemMessage) {
      setMessages([systemMessage]);
    } else {
      setMessages([{ role: 'system', content: chatService.getSystemPrompt(mdxFiles) }]);
    }
    setMdxUpdate(null);
  };

  return (
    <div className={cn(
      "fixed z-50 bottom-4 right-4 transition-all duration-300 ease-in-out",
      isOpen 
        ? "w-[500px] h-[90vh] bg-background rounded-2xl shadow-xl border border-border flex flex-col" 
        : "w-auto h-auto",
      className
    )}>
      {isOpen ? (
        <>
          {/* Chat Window Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="font-medium text-foreground">API Docs Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Cpu className="w-4 h-4 mr-2" />
                      Model: {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || 'Select Model'}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {AVAILABLE_MODELS.map(model => (
                        <DropdownMenuItem key={model.id} onClick={() => setSelectedModel(model.id)}>
                          {model.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem onClick={handleClearChat} disabled={isProcessing || messages.length <= 1}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="w-8 h-8">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Selected Files - Collapsible */}
          <Collapsible className="px-4 py-2 border-b border-border">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Context Files</span>
                </div>
                <ChevronRight className="w-4 h-4 transition-transform ui-expanded:rotate-90" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="flex flex-wrap gap-2 pt-2">
                {mdxFiles.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No MDX files available
                  </div>
                ) : (
                  <>
                    {mdxFiles.map(file => (
                      <Button
                        key={file.filename}
                        variant={selectedFiles.includes(file.filename) ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-7 px-2 text-xs gap-1",
                          selectedFiles.includes(file.filename) 
                            ? "bg-primary/10 text-primary border-primary/20" 
                            : "hover:bg-primary/5",
                        )}
                        onClick={() => toggleFileSelection(file.filename)}
                      >
                        <FileText className="w-3 h-3" />
                        <span className="max-w-[160px] truncate">{file.filename}</span>
                        {selectedFiles.includes(file.filename) && (
                          <Check className="w-3 h-3" />
                        )}
                      </Button>
                    ))}
                  </>
                )}
              </div>
              {selectedFiles.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 text-muted-foreground"
                  onClick={() => setSelectedFiles([])}
                >
                  Clear Selection
                </Button>
              )}
            </CollapsibleContent>
          </Collapsible>
          
          {/* Messages */}
          <ScrollArea className="flex-1 px-4">
            <div className="py-4 space-y-6">
              {messages.slice(1).map(renderChatMessage)}
              <div ref={messagesEndRef} />
              
              {isProcessing && (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Processing...
                  </span>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="relative">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the API documentation..."
                className="pr-10 resize-none min-h-[80px] max-h-[160px] bg-muted/50"
                disabled={isProcessing}
              />
              <Button
                className="absolute right-2 bottom-2"
                size="icon"
                disabled={!inputValue.trim() || isProcessing}
                onClick={handleSendMessage}
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* MDX Update/Add/Delete Notification */}
          {mdxUpdate && (
            <div className="p-3 border-t border-border bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">
                    {mdxUpdate.type === 'update' && 'File Updated'}
                    {mdxUpdate.type === 'add' && 'File Added'}
                    {mdxUpdate.type === 'delete' && 'File Deleted'}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{mdxUpdate.filename}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={applyMdxUpdate}
                    disabled={isSaving}
                    className="h-7"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      mdxUpdate.type === 'delete' ? 'Delete' : 'Apply'
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-7 w-7" 
                    onClick={() => setMdxUpdate(null)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full shadow-lg w-14 h-14 bg-primary hover:bg-primary/90"
          size="icon"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}
    </div>
  )
} 