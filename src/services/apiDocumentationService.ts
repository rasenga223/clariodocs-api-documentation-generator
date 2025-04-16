import { supabase } from '@/lib/supabase';

interface ProjectMetadata {
  title: string;
  description?: string;
  file_type: 'openapi' | 'postman';
}

/**
 * Service for handling API documentation generation, including file uploads and processing
 */
export const apiDocumentationService = {
  /**
   * Upload API specification file to Supabase storage
   */
  async uploadSpecFile(file: File, userId: string): Promise<{ projectId: string; filePath: string } | null> {
    try {
      // Generate a unique project ID
      const projectId = self.crypto.randomUUID();
      
      // Create a file path in the format: {userId}/{projectId}/{originalFilename}
      const filePath = `${userId}/${projectId}/${file.name}`;
      
      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('api-specifications')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (error) {
        console.error('File upload error:', error);
        return null;
      }
      
      return { projectId, filePath: data.path };
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  },
  
  /**
   * Create a new project in the database
   */
  async createProject(
    userId: string,
    projectId: string,
    filePath: string,
    file: File,
    metadata: ProjectMetadata
  ): Promise<boolean> {
    try {
      // 1. Insert project record
      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          id: projectId,
          user_id: userId,
          title: metadata.title,
          description: metadata.description || null,
          file_type: metadata.file_type,
          slug: projectId, // Initially set slug to projectId, can be updated later
          status: 'processing',
          ai_generated: true
        });
      
      if (projectError) {
        console.error('Project creation error:', projectError);
        return false;
      }
      
      // 2. Insert uploaded file record
      const { error: fileError } = await supabase
        .from('uploaded_files')
        .insert({
          project_id: projectId,
          file_path: filePath,
          original_name: file.name,
          mime_type: file.type,
          size: file.size
        });
      
      if (fileError) {
        console.error('File record creation error:', fileError);
        return false;
      }
      
      // 3. Create AI job record
      const { error: jobError } = await supabase
        .from('ai_jobs')
        .insert({
          project_id: projectId,
          status: 'pending',
          model_used: 'gpt-4',
          started_at: new Date().toISOString()
        });
      
      if (jobError) {
        console.error('AI job record creation error:', jobError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error creating project records:', error);
      return false;
    }
  },
  
  /**
   * Determine file type (OpenAPI or Postman) based on file content
   * This is a placeholder implementation - in a real app, you would parse the file
   * and detect based on structure
   */
  async detectFileType(file: File): Promise<'openapi' | 'postman' | null> {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      
      // Very basic detection - in a real app this would be more robust
      if (json.openapi || json.swagger) {
        return 'openapi';
      } else if (json.info && json.item && Array.isArray(json.item)) {
        return 'postman';
      }
      
      return null;
    } catch (error) {
      console.error('Error detecting file type:', error);
      return null;
    }
  },
  
  /**
   * Get project status
   */
  async getProjectStatus(projectId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('status')
      .eq('id', projectId)
      .single();
    
    if (error) {
      console.error('Error getting project status:', error);
      return null;
    }
    
    return data.status;
  },
  
  /**
   * Simulate processing for demo purposes (would be replaced with actual backend processing)
   */
  simulateProcessing(projectId: string, callback: (status: string) => void): void {
    const stages = ['processing', 'ready'];
    let currentStage = 0;
    
    const interval = setInterval(() => {
      callback(stages[currentStage]);
      currentStage++;
      
      if (currentStage >= stages.length) {
        clearInterval(interval);
      }
    }, 2000);
  }
}; 