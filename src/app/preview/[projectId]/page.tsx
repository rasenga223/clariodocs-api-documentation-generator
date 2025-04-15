// Preview page with dynamic project ID routing
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, ChevronRight } from 'lucide-react';
import { getProject, getProjectMdx, getDocumentOutline } from '@/lib/docService';
import { DocOutlineItem, MdxFile } from '@/lib/docService';
import { DefaultSidebar } from '@/components/sidebars/DefaultSidebar';
import { DocPreview } from '@/components/DocPreview';
import { cn } from '@/lib/utils';

export default function PreviewPage() {
  const { projectId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [currentMdx, setCurrentMdx] = useState<string>('');
  const [docOutline, setDocOutline] = useState<DocOutlineItem[] | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mdxFiles, setMdxFiles] = useState<MdxFile[]>([]);
  const [filename, setFilename] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadProjectData() {
      if (!projectId) return;

      try {
        // Load project details
        const project = await getProject(projectId as string);
        if (!project) {
          setError('Project not found');
          setIsLoading(false);
          return;
        }

        setProjectTitle(project.title);

        // Load MDX content
        const files = await getProjectMdx(projectId as string);
        if (!files || files.length === 0) {
          setError('No documentation content found');
          setIsLoading(false);
          return;
        }

        // Store all MDX files
        setMdxFiles(files);
        
        // Set initial MDX content and filename
        setCurrentMdx(files[0].content);
        setFilename(files[0].filename);

        // Load document outline
        const outline = await getDocumentOutline(projectId as string);
        setDocOutline(outline);

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading project:', err);
        setError('Failed to load project data');
        setIsLoading(false);
      }
    }

    loadProjectData();
  }, [projectId]);

  // Handle file selection
  const handleFileSelect = (selectedFilename: string) => {
    // Extract the base filename without the anchor
    const [baseFilename, sectionId] = selectedFilename.split('#');
    
    // If there's a section ID, set it to be scrolled to
    if (sectionId) {
      setSelectedSection(sectionId);
    } else {
      // Reset selected section when changing files
      setSelectedSection(undefined);
    }
    
    // Find the file that matches the selected filename
    const selectedFile = mdxFiles.find(file => file.filename === baseFilename);
    
    if (selectedFile) {
      setCurrentMdx(selectedFile.content);
      setFilename(selectedFile.filename);
      console.log(`Loaded file: ${selectedFile.filename}${sectionId ? ` with section: ${sectionId}` : ''}`);
    } else {
      console.warn(`File not found: ${baseFilename}`);
    }
  };

  // Handle section selection
  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(sectionId);
    console.log(`Selected section: ${sectionId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading documentation...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={cn("flex transition-all duration-300", sidebarCollapsed ? "w-8" : "")}>
        {!sidebarCollapsed ? (
          <DefaultSidebar 
            projectId={projectId as string}
            projectTitle={projectTitle}
            docOutline={docOutline}
            isOpen={!sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            onSelectFile={handleFileSelect}
            onSelectSection={handleSectionSelect}
            activeSection={selectedSection}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            filename={filename}
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
        <div className="flex-1 overflow-hidden">
          <DocPreview 
            projectId={projectId as string}
            projectTitle={projectTitle}
            content={currentMdx}
            onSelectFile={handleFileSelect}
            selectedSection={selectedSection}
            onSelectSection={handleSectionSelect}
            allMdxFiles={mdxFiles}
          />
        </div>
      </div>
    </div>
  );
} 