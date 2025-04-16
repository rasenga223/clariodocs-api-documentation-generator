"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import EditorHeader from "@/components/EditorHeader"
import EditorPane from "@/components/EditorPane"
import PreviewPane from "@/components/PreviewPane"
import { saveMdxFiles, getProjectMdx, getDocumentOutline, getProjectMdxVersions, DocOutlineItem, createMdxFile, deleteMdxFile } from "@/lib/docService"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { DEFAULT_MDX_CONTENT } from "./DefaultContent"
import ChatWindow from "@/components/ChatWindow"
import { MDXFileInfo } from "@/lib/chatService"

export default function EditorPage() {
  const router = useRouter()
  const [code, setCode] = useState<string>(DEFAULT_MDX_CONTENT)
  const [view, setView] = useState<"split" | "editor" | "preview">("split")
  const [history, setHistory] = useState<{ code: string; timestamp: string; id?: string }[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [filename, setFilename] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [docOutline, setDocOutline] = useState<DocOutlineItem[] | null>(null)
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0) // Track which version we're on
  const [selectedSection, setSelectedSection] = useState<string | undefined>(undefined)
  const [allMdxFiles, setAllMdxFiles] = useState<MDXFileInfo[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)  // Add this state for chat window
  
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

  // Add a function to load project versions from project_mdx table
  const loadProjectVersions = async (id: string) => {
    try {
      const versions = await getProjectMdxVersions(id)
      
      if (versions && versions.length > 0) {
        // Convert each full_mdx to code (first section if multiple)
        const versionHistory = await Promise.all(versions.map(async version => {
          // Split the MDX by sections
          const mdxSections = version.full_mdx.split('\n\n---\n\n')
          let content = ''
          
          // Extract content from the first section or the section matching current filename
          if (filename) {
            // Try to find the section with the matching filename
            for (const section of mdxSections) {
              const filenameMatch = section.match(/^# (.*?)$/m)
              if (filenameMatch && filenameMatch[1] === filename) {
                // Remove the filename heading and use this content
                content = section.replace(/^# .*?$/m, '').trim()
                break
              }
            }
            
            // If no matching section found, use the first section
            if (!content && mdxSections.length > 0) {
              const firstSection = mdxSections[0]
              const filenameMatch = firstSection.match(/^# (.*?)$/m)
              content = filenameMatch 
                ? firstSection.replace(/^# .*?$/m, '').trim()
                : firstSection.trim()
            }
          } else if (mdxSections.length > 0) {
            // Default to first section if no filename specified
            const firstSection = mdxSections[0]
            const filenameMatch = firstSection.match(/^# (.*?)$/m)
            content = filenameMatch 
              ? firstSection.replace(/^# .*?$/m, '').trim()
              : firstSection.trim()
            
            // If we find a filename here, update the filename state
            if (filenameMatch) {
              setFilename(filenameMatch[1])
            }
          }
          
          return { 
            code: content, 
            timestamp: version.generated_at,
            id: version.id 
          }
        }))
        
        console.log(`Loaded ${versionHistory.length} versions from project_mdx`)
        setHistory(versionHistory)
        
        // Set initial code to the most recent version if code is still default
        if (code === DEFAULT_MDX_CONTENT && versionHistory.length > 0) {
          setCode(versionHistory[0].code)
        }
      }
    } catch (error) {
      console.error('Error loading project versions:', error)
    }
  }

  // Load saved content and version history from sessionStorage
  useEffect(() => {
    async function loadEditor() {
      // First check if we are coming from the API documentation preview
      const editorCode = sessionStorage.getItem("mdxEditorCode") 
      const editorProjectId = sessionStorage.getItem("editorProjectId")
      const editorFilename = sessionStorage.getItem("editorFilename")
      
      if (editorCode) {
        setCode(editorCode)
        if (editorProjectId) {
          setProjectId(editorProjectId)
          // Load document outline when we have a project ID
          loadDocumentOutline(editorProjectId)
          // Load project versions when we have a project ID
          loadProjectVersions(editorProjectId)
        }
        if (editorFilename) setFilename(editorFilename)
      } else {
        // If not from preview, check for previously saved editor state
        const savedCode = localStorage.getItem("mdxEditorCode")
        const savedHistory = localStorage.getItem("mdxEditorHistory")
        const savedProjectId = localStorage.getItem("editorProjectId")
    
        if (savedCode) {
          setCode(savedCode)
        }
    
        if (savedHistory) {
          try {
            const parsedHistory = JSON.parse(savedHistory)
            setHistory(parsedHistory)
          } catch (error) {
            console.error('Error parsing saved history:', error)
          }
        }
        
        if (savedProjectId) {
          setProjectId(savedProjectId)
          // Load document outline when we have a project ID
          loadDocumentOutline(savedProjectId)
          // Load project versions when we have a project ID
          loadProjectVersions(savedProjectId)
        }
      }
      
      // Set appropriate view mode for mobile
      if (isMobile) {
        setView("editor")
        setSidebarCollapsed(true)
      }
      
      setIsLoaded(true)
    }
    
    loadEditor()
  }, [isMobile])

  // Save content to localStorage whenever the code changes
  useEffect(() => {
    if (code && isLoaded) {
      localStorage.setItem("mdxEditorCode", code)
    }
  }, [code, isLoaded])

  // Save version history separately
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("mdxEditorHistory", JSON.stringify(history))
    }
  }, [history])

  // Update the localStorage effect to also save the project ID
  useEffect(() => {
    if (projectId) {
      localStorage.setItem("editorProjectId", projectId)
    }
  }, [projectId])

  // Add a function to load the document outline
  const loadDocumentOutline = async (id: string) => {
    try {
      const outline = await getDocumentOutline(id)
      setDocOutline(outline)
    } catch (error) {
      console.error('Error loading document outline:', error)
    }
  }
  
  /**
   * Save changes back to the project
   */
  const saveToProject = async () => {
    if (!projectId || !code.trim()) {
      console.warn('Cannot save to project - missing project ID or content')
      return
    }
    
    setIsSaving(true)
    
    try {
      // Get existing MDX files for the project
      const existingFiles = await getProjectMdx(projectId)
      
      if (!existingFiles) {
        throw new Error('Failed to retrieve existing MDX files')
      }
      
      // If we have a specific filename, update that file
      // Otherwise, update the first file
      let updatedFiles
      
      if (filename) {
        // Find the file with the matching filename and update its content
        updatedFiles = existingFiles.map(file => 
          file.filename === filename 
            ? { ...file, content: code } 
            : file
        )
      } else {
        // If no specific filename is targeted, update the first file
        if (existingFiles.length > 0) {
          updatedFiles = [
            { ...existingFiles[0], content: code },
            ...existingFiles.slice(1)
          ]
        } else {
          // If no files exist, create a new one
          updatedFiles = [
            { filename: 'documentation.mdx', content: code }
          ]
        }
      }
      
      // Save updated files back to the project
      const success = await saveMdxFiles(projectId, updatedFiles)
      
      if (success) {
        alert('Documentation saved successfully!')
        
        // Redirect back to preview if needed
        if (confirm('Do you want to return to the documentation preview?')) {
          router.push('/api-doc-generator/preview')
        }
      } else {
        alert('Failed to save documentation. Please try again.')
      }
    } catch (error) {
      console.error('Error saving MDX content:', error)
      alert(`Error saving changes: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }
  
  /**
   * Save the current version of the code
   */
  const saveVersion = async () => {
    const now = new Date().toISOString()
    
    // If we have a project ID, save to the project
    if (projectId) {
      await saveToProject()
      
      // After saving to the project, reload the version history
      await loadProjectVersions(projectId)
      
      // Reset the current version index to 0 (latest)
      setCurrentVersionIndex(0)
    } else {
      // For local-only saving, maintain history in state
      // Add to history if content is different from most recent
      if (history.length === 0 || history[0].code !== code) {
        setHistory(prev => [
          { code, timestamp: now },
          ...prev.slice(0, 9) // Keep only the 10 most recent versions
        ])
      }
      
      alert('Changes saved locally. Note: This is not connected to any project.')
    }
  }
  
  /**
   * Revert to a previous version
   */
  const revertToVersion = (index: number) => {
    if (index >= 0 && index < history.length) {
      // Update the current version index
      setCurrentVersionIndex(index)
      
      // Set the editor code to the selected version
      setCode(history[index].code)
      
      // If this is not the latest version, show a notification
      if (index > 0) {
        alert(`You are now viewing an older version. Click "Save" to make this the latest version.`)
      }
    }
  }

  // Add handleSectionSelect function
  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(sectionId)
    console.log(`Selected section: ${sectionId}`)
    
    // Scroll to the section in the preview pane if it exists
    const sectionElement = document.querySelector(`[data-section-id="${sectionId}"]`)
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Update handleFileSelect to also handle section IDs
  const handleFileSelect = async (selectedFilename: string) => {
    if (!projectId) return
    
    try {
      // Extract the base filename and section ID if present
      const [baseFilename, sectionId] = selectedFilename.split('#')
      
      // If there's a section ID, set it to be scrolled to
      if (sectionId) {
        setSelectedSection(sectionId)
      } else {
        // Reset selected section when changing files
        setSelectedSection(undefined)
      }
      
      // Get all MDX files for the project
      const allFiles = await getProjectMdx(projectId)
      
      if (!allFiles) {
        console.error('Could not load files for project')
        return
      }
      
      // Find the file that matches the selected filename
      const selectedFile = allFiles.find(file => file.filename === baseFilename)
      
      if (selectedFile) {
        // Update state with the selected file content and filename
        setCode(selectedFile.content)
        setFilename(selectedFile.filename)
        console.log(`Loaded file: ${selectedFile.filename}${sectionId ? ` with section: ${sectionId}` : ''}`)
        
        // Add to history if different from current code
        if (code !== selectedFile.content) {
          const now = new Date().toISOString()
          setHistory(prev => [
            { code: selectedFile.content, timestamp: now },
            ...prev.filter(item => item.code !== selectedFile.content).slice(0, 9)
          ])
        }
      } else {
        console.warn(`File not found: ${baseFilename}`)
      }
    } catch (error) {
      console.error('Error loading selected file:', error)
    }
  }

  // Add handler for project selection
  const handleProjectSelect = async (selectedProjectId: string) => {
    if (selectedProjectId === projectId) return
    
    try {
      // Get the MDX files for the selected project
      const mdxFiles = await getProjectMdx(selectedProjectId)
      
      if (!mdxFiles || mdxFiles.length === 0) {
        console.error('No MDX files found for project')
        return
      }
      
      // Set the first file's content as the current code
      setCode(mdxFiles[0].content)
      
      // Update project-related state
      setProjectId(selectedProjectId)
      setFilename(mdxFiles[0].filename)
      
      // Load document outline
      loadDocumentOutline(selectedProjectId)
      
      // Load project versions
      loadProjectVersions(selectedProjectId)
      
      // Reset version index
      setCurrentVersionIndex(0)
      
      // Store the current project ID
      localStorage.setItem("editorProjectId", selectedProjectId)
      
      console.log(`Loaded project: ${selectedProjectId}`)
    } catch (error) {
      console.error('Error loading project:', error)
      alert('Failed to load project. Please try again.')
    }
  }

  const getMdxFileInfo = async (): Promise<MDXFileInfo[]> => {
    if (!projectId) return [];
    
    // If we have a current file, always include it
    const currentFileInfo = filename && code ? [{ filename, content: code }] : [];
    
    try {
      // Fetch all MDX files for the project
      const allFiles = await getProjectMdx(projectId);
      
      if (!allFiles) return currentFileInfo;
      
      // Combine the current file with all project files, avoiding duplicates
      const allFilesInfo: MDXFileInfo[] = allFiles.map(file => ({
        filename: file.filename,
        content: file.content
      }));
      
      // If currentFileInfo exists, replace the matching file in allFilesInfo
      if (currentFileInfo.length > 0) {
        const fileIndex = allFilesInfo.findIndex(file => file.filename === filename);
        if (fileIndex >= 0) {
          allFilesInfo[fileIndex] = currentFileInfo[0];
        } else {
          allFilesInfo.push(currentFileInfo[0]);
        }
      }
      
      return allFilesInfo;
    } catch (error) {
      console.error('Error fetching project files:', error);
      // Fall back to current file if there's an error
      return currentFileInfo;
    }
  }

  // Add useEffect to load all MDX files when projectId changes
  useEffect(() => {
    const loadAllFiles = async () => {
      if (projectId) {
        const files = await getMdxFileInfo();
        setAllMdxFiles(files);
      }
    };
    
    loadAllFiles();
  }, [projectId, filename, code]);

  /**
   * Handle creating a new MDX file
   */
  const handleCreateFile = async (newFilename: string) => {
    if (!projectId) return;
    
    try {
      // Create initial content with a section structure
      const sectionTitle = newFilename.replace(/\.mdx$/, '').split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      const initialContent = `# ${sectionTitle}

## Overview
Add an overview of this section here...

## Getting Started
Start with the basics...

## Features
List the main features...

## Examples
Show some examples...

## Reference
Add detailed reference documentation...
`;
      
      // Create the new file
      const success = await createMdxFile(projectId, newFilename, initialContent);
      
      if (success) {
        // Update the file list
        const updatedFiles = await getProjectMdx(projectId);
        if (updatedFiles) {
          setAllMdxFiles(updatedFiles);
        }
        
        // Switch to the new file
        setFilename(newFilename);
        setCode(initialContent);
        
        // Reload document outline
        loadDocumentOutline(projectId);
        
        // Add to history
        const now = new Date().toISOString();
        setHistory(prev => [
          { code: initialContent, timestamp: now },
          ...prev.slice(0, 9)
        ]);
      }
    } catch (error) {
      console.error('Error creating new file:', error);
      alert('Failed to create new file. Please try again.');
    }
  };

  /**
   * Handle deleting an MDX file
   */
  const handleDeleteFile = async (filenameToDelete: string) => {
    if (!projectId) return;
    
    try {
      // Delete the file
      const success = await deleteMdxFile(projectId, filenameToDelete);
      
      if (success) {
        // Update the file list
        const updatedFiles = await getProjectMdx(projectId);
        if (updatedFiles) {
          setAllMdxFiles(updatedFiles);
          
          // If we deleted the current file, switch to another one
          if (filename === filenameToDelete) {
            if (updatedFiles.length > 0) {
              setFilename(updatedFiles[0].filename);
              setCode(updatedFiles[0].content);
              
              // Add to history
              const now = new Date().toISOString();
              setHistory(prev => [
                { code: updatedFiles[0].content, timestamp: now },
                ...prev.slice(0, 9)
              ]);
            } else {
              // No files left
              setFilename(null);
              setCode('');
              setHistory([]);
            }
          }
        }
        
        // Reload document outline
        loadDocumentOutline(projectId);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); // Prevent default browser behavior
        setIsChatOpen(prev => !prev);
      }
      // Check for Cmd/Ctrl + S
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault(); // Prevent default browser behavior
        saveVersion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveVersion]); // Add saveVersion to dependencies

  return (
    <div className="flex h-full overflow-hidden">
      <div className={cn("flex transition-all duration-300", sidebarCollapsed ? "w-8" : "")}>
        {!sidebarCollapsed ? (
          <Sidebar 
            history={history} 
            revertToVersion={revertToVersion} 
            toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
            projectId={projectId}
            filename={filename}
            collapsed={false}
            docOutline={docOutline}
            onSelectFile={handleFileSelect}
            onSelectSection={handleSectionSelect}
            activeSection={selectedSection}
            currentVersionIndex={currentVersionIndex}
            onCreateFile={handleCreateFile}
            onDeleteFile={handleDeleteFile}
            onReorderFiles={(filenames) => {
              // Refresh document outline after reordering
              if (projectId) {
                loadDocumentOutline(projectId);
              }
            }}
          />
        ) : (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="flex items-center justify-center w-8 h-full bg-white border-r border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
        )}
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <EditorHeader 
          view={view} 
          setView={setView} 
          history={history} 
          revertToVersion={revertToVersion} 
          saveVersion={saveVersion} 
          code={code}
          isSaving={isSaving}
          hasProject={!!projectId}
          currentVersionIndex={currentVersionIndex}
          onProjectSelect={handleProjectSelect}
          currentProjectId={projectId || undefined}
        />
        <div className="flex flex-1 overflow-hidden">
          {view !== "preview" && (
            <EditorPane code={code} setCode={setCode} view={view} />
          )}
          {view !== "editor" && (
            <PreviewPane code={code} view={view} />
          )}
        </div>
      </div>
      
      {projectId && (
        <ChatWindow 
          projectId={projectId}
          mdxFiles={allMdxFiles}
          isOpen={isChatOpen}
          onOpenChange={setIsChatOpen}
          onMdxFileUpdate={(filename: string, newContent: string) => {
            // If this is the current file in the editor, update it
            if (filename === (filename || '')) {
              setCode(newContent);
              // Add to history if content is different
              const now = new Date().toISOString();
              setHistory(prev => [
                { code: newContent, timestamp: now },
                ...prev.filter(item => item.code !== newContent).slice(0, 9)
              ]);
            }
            
            // Update the file in allMdxFiles
            setAllMdxFiles(prev => 
              prev.map(file => 
                file.filename === filename 
                  ? { ...file, content: newContent } 
                  : file
              )
            );
          }}
        />
      )}
    </div>
  )
}
