"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import EditorHeader from "@/components/EditorHeader"
import EditorPane from "@/components/EditorPane"
import PreviewPane from "@/components/PreviewPane"
import { saveMdxFiles, getProjectMdx, getDocumentOutline, DocOutlineItem } from "@/lib/docService"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { DEFAULT_MDX_CONTENT } from "./DefaultContent"

export default function EditorPage() {
  const router = useRouter()
  const [code, setCode] = useState<string>(DEFAULT_MDX_CONTENT)
  const [view, setView] = useState<"split" | "editor" | "preview">("split")
  const [history, setHistory] = useState<{ code: string; timestamp: string }[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [filename, setFilename] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [docOutline, setDocOutline] = useState<DocOutlineItem[] | null>(null)
  
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
        }
        if (editorFilename) setFilename(editorFilename)
        
        // Add current content to history
        const now = new Date().toISOString()
        setHistory(prev => [
          { code: editorCode, timestamp: now },
          ...prev.filter(item => item.code !== editorCode)
        ])
      } else {
        // If not from preview, check for previously saved editor state
        const savedCode = localStorage.getItem("mdxEditorCode")
        const savedHistory = localStorage.getItem("mdxEditorHistory")
        const savedProjectId = localStorage.getItem("editorProjectId")
    
        if (savedCode) {
          setCode(savedCode)
        }
    
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory))
        }
        
        if (savedProjectId) {
          setProjectId(savedProjectId)
          // Load document outline when we have a project ID
          loadDocumentOutline(savedProjectId)
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
  const saveVersion = () => {
    const now = new Date().toISOString()
    
    // Add to history if content is different from most recent
    if (history.length === 0 || history[0].code !== code) {
      setHistory(prev => [
        { code, timestamp: now },
        ...prev.slice(0, 9) // Keep only the 10 most recent versions
      ])
    }
    
    // If we have a project ID, save to the project
    if (projectId) {
      saveToProject()
    } else {
      alert('Changes saved locally. Note: This is not connected to any project.')
    }
  }
  
  /**
   * Revert to a previous version
   */
  const revertToVersion = (index: number) => {
    if (index >= 0 && index < history.length) {
      setCode(history[index].code)
    }
  }

  // Update the handleFileSelect function to handle anchor links
  const handleFileSelect = async (selectedFilename: string) => {
    if (!projectId) return;
    
    try {
      // Extract the base filename without the anchor
      const [baseFilename] = selectedFilename.split('#');
      
      // Get all MDX files for the project
      const allFiles = await getProjectMdx(projectId);
      
      if (!allFiles) {
        console.error('Could not load files for project');
        return;
      }
      
      // Find the file that matches the selected filename
      const selectedFile = allFiles.find(file => file.filename === baseFilename);
      
      if (selectedFile) {
        // Update state with the selected file content and filename
        setCode(selectedFile.content);
        setFilename(selectedFile.filename);
        console.log(`Loaded file: ${selectedFile.filename}`);
        
        // Add to history if different from current code
        if (code !== selectedFile.content) {
          const now = new Date().toISOString();
          setHistory(prev => [
            { code: selectedFile.content, timestamp: now },
            ...prev.filter(item => item.code !== selectedFile.content).slice(0, 9)
          ]);
        }
      } else {
        console.warn(`File not found: ${baseFilename}`);
      }
    } catch (error) {
      console.error('Error loading selected file:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
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
          />
        ) : (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="flex items-center justify-center w-8 h-full bg-white border-r border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800"
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
    </div>
  )
}
