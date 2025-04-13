import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// Type definitions
export interface MdxFile {
  filename: string;
  content: string;
}

export interface DocProject {
  id?: string;
  title?: string;
  description?: string;
  slug?: string;
  user_id?: string;
  status?: 'draft' | 'processing' | 'ready' | 'failed';
  file_type?: string;
  ai_generated?: boolean;
  created_at?: string;
  updated_at?: string;
  template?: string;
}

// Define the document outline types
export interface DocOutlineItem {
  id: string;
  title: string;
  children?: DocOutlineItem[];
}

/**
 * Creates a new API documentation project in the database
 * 
 * @param title - Project title
 * @param description - Project description
 * @param fileType - File type (openapi, postman, apiblueprint)
 * @param userId - User ID
 * @returns The created project
 */
export async function createProject(
  title: string,
  description: string,
  fileType: string,
  userId: string
): Promise<DocProject | null> {
  // Generate a unique slug for the project
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${uuidv4().substring(0, 8)}`;
  
  // Create the project in the database
  const { data, error } = await supabase
    .from('projects')
    .insert({
      title,
      description,
      slug,
      user_id: userId,
      file_type: fileType,
      status: 'draft',
      ai_generated: true
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating project:', error);
    return null;
  }
  
  return data;
}

/**
 * Updates a project's status
 * 
 * @param projectId - Project ID
 * @param status - New status
 * @returns Success flag
 */
export async function updateProjectStatus(
  projectId: string,
  status: 'draft' | 'processing' | 'ready' | 'failed'
): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', projectId);
  
  return !error;
}

/**
 * Saves the generated MDX files for a project
 * 
 * @param projectId - Project ID
 * @param mdxFiles - Array of MDX files
 * @returns Success flag
 */
export async function saveMdxFiles(
  projectId: string,
  mdxFiles: MdxFile[]
): Promise<boolean> {
  // Convert all MDX files to a single string for storage
  const fullMdx = mdxFiles.map(file => 
    `# ${file.filename}\n\n${file.content}`
  ).join('\n\n---\n\n');
  
  // Save to project_mdx table
  const { error } = await supabase
    .from('project_mdx')
    .insert({
      project_id: projectId,
      full_mdx: fullMdx,
      generated_at: new Date().toISOString()
    });
  
  if (error) {
    console.error('Error saving MDX files:', error);
    return false;
  }
  
  // Update project status to ready
  return await updateProjectStatus(projectId, 'ready');
}

/**
 * Retrieves a project by ID
 * 
 * @param projectId - Project ID
 * @returns The project or null if not found
 */
export async function getProject(projectId: string): Promise<DocProject | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  
  if (error) {
    console.error('Error retrieving project:', error);
    return null;
  }
  
  return data;
}

/**
 * Retrieves all projects for a user
 * 
 * @param userId - User ID
 * @returns Array of projects
 */
export async function getUserProjects(userId: string): Promise<DocProject[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  
  if (error) {
    console.error('Error retrieving user projects:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Gets the MDX content for a project
 * 
 * @param projectId - Project ID
 * @returns Array of MDX files or null if not found
 */
export async function getProjectMdx(projectId: string): Promise<MdxFile[] | null> {
  // Get the latest MDX content by ordering by generated_at
  const { data, error } = await supabase
    .from('project_mdx')
    .select('full_mdx')
    .eq('project_id', projectId)
    .order('generated_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error || !data) {
    console.error('Error retrieving project MDX:', error);
    return null;
  }
  
  // Split the full MDX back into separate files
  const mdxSections = data.full_mdx.split('\n\n---\n\n');
  const mdxFiles: MdxFile[] = [];
  
  for (const section of mdxSections) {
    // Extract filename from the first heading
    const filenameMatch = section.match(/^# (.*?)$/m);
    if (filenameMatch) {
      const filename = filenameMatch[1];
      // Remove the filename heading from the content
      const content = section.replace(/^# .*?$/m, '').trim();
      mdxFiles.push({ filename, content });
    } else {
      // Fallback if no heading is found
      mdxFiles.push({
        filename: `section-${mdxFiles.length + 1}.mdx`,
        content: section.trim()
      });
    }
  }
  
  return mdxFiles;
}

/**
 * Save uploaded API spec file information
 * 
 * @param projectId - Project ID
 * @param filePath - Path to the uploaded file
 * @param originalName - Original filename
 * @param mimeType - File MIME type
 * @param size - File size in bytes
 * @returns Success flag
 */
export async function saveUploadedFile(
  projectId: string,
  filePath: string,
  originalName: string,
  mimeType: string,
  size: number
): Promise<boolean> {
  const { error } = await supabase
    .from('uploaded_files')
    .insert({
      project_id: projectId,
      file_path: filePath,
      original_name: originalName,
      mime_type: mimeType,
      size
    });
  
  return !error;
}

/**
 * Save AI job information
 * 
 * @param projectId - Project ID
 * @param modelUsed - AI model used
 * @returns Success flag
 */
export async function saveAiJob(
  projectId: string,
  modelUsed: string
): Promise<boolean> {
  const { error } = await supabase
    .from('ai_jobs')
    .insert({
      project_id: projectId,
      model_used: modelUsed,
      status: 'pending',
      started_at: new Date().toISOString()
    });
  
  return !error;
}

/**
 * Update AI job status
 * 
 * @param projectId - Project ID
 * @param status - New status
 * @param error - Error message (if status is 'failed')
 * @returns Success flag
 */
export async function updateAiJob(
  projectId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  error?: string
): Promise<boolean> {
  const updateData: any = {
    status
  };
  
  if (status === 'completed' || status === 'failed') {
    updateData.finished_at = new Date().toISOString();
  }
  
  if (status === 'failed' && error) {
    updateData.error = error;
  }
  
  const { error: dbError } = await supabase
    .from('ai_jobs')
    .update(updateData)
    .eq('project_id', projectId);
  
  return !dbError;
}

/**
 * Gets a structured outline of documentation for a project
 * This can be used to populate a sidebar navigation
 * 
 * @param projectId - Project ID
 * @returns Structured outline of the documentation or null if not found
 */
export async function getDocumentOutline(projectId: string): Promise<DocOutlineItem[] | null> {
  // First get the MDX content
  const mdxFiles = await getProjectMdx(projectId);
  
  if (!mdxFiles || mdxFiles.length === 0) {
    return null;
  }
  
  // Create a structured outline from the MDX content
  const outline: DocOutlineItem[] = [];
  
  for (const file of mdxFiles) {
    // Create a section for each file
    const section: DocOutlineItem = {
      id: file.filename.replace(/\.mdx$/, ''),
      title: file.filename.replace(/\.mdx$/, '').replace(/-/g, ' '),
      children: []
    };
    
    // Extract headings from the content to create a hierarchical structure
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    let match;
    let lastLevel2Item: DocOutlineItem | null = null;
    
    while ((match = headingRegex.exec(file.content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      
      if (level === 1) {
        // Override the section title with the first h1 if found
        section.title = text;
      } else if (level === 2) {
        // Add as a direct child of the section
        const item: DocOutlineItem = { id, title: text, children: [] };
        section.children!.push(item);
        lastLevel2Item = item;
      } else if (level === 3 && lastLevel2Item) {
        // Add as a child of the last level 2 item
        lastLevel2Item.children!.push({ id, title: text });
      }
    }
    
    outline.push(section);
  }
  
  return outline;
}

/**
 * Gets all versions of MDX content for a project
 * 
 * @param projectId - Project ID
 * @returns Array of project MDX versions with timestamps or null if not found
 */
export async function getProjectMdxVersions(
  projectId: string
): Promise<{ full_mdx: string; generated_at: string; id: string }[] | null> {
  // Get all MDX content versions ordered by generation time (newest first)
  const { data, error } = await supabase
    .from('project_mdx')
    .select('id, full_mdx, generated_at')
    .eq('project_id', projectId)
    .order('generated_at', { ascending: false });
  
  if (error || !data) {
    console.error('Error retrieving project MDX versions:', error);
    return null;
  }
  
  return data;
} 