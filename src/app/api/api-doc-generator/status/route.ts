import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API Route: GET /api/api-doc-generator/status?projectId=<projectId>
 * 
 * This endpoint retrieves the current status of an API documentation generation project.
 * It returns both the project status and the AI job details.
 */
export async function GET(req: Request) {
  try {
    // Extract projectId from query parameters
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    // Get the current user's session
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        description,
        status,
        file_type,
        created_at,
        updated_at,
        ai_generated
      `)
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();
    
    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }
    
    // Get AI job details
    const { data: aiJob, error: aiJobError } = await supabase
      .from('ai_jobs')
      .select(`
        id,
        status,
        model_used,
        started_at,
        finished_at,
        error
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    // For demo purposes, let's simulate some progress
    // In a real app, this would be updated by a background process
    
    // If the status is 'processing' and it's been more than 30 seconds, update to 'ready'
    if (project.status === 'processing') {
      const processingTime = aiJob?.started_at 
        ? new Date().getTime() - new Date(aiJob.started_at).getTime()
        : 0;
        
      // If processing for more than 30 seconds, mark as ready
      if (processingTime > 30000) {
        await supabase
          .from('projects')
          .update({ status: 'ready', updated_at: new Date().toISOString() })
          .eq('id', projectId);
          
        // Only update the AI job if it exists
        if (aiJob) {
          await supabase
            .from('ai_jobs')
            .update({ 
              status: 'done', 
              finished_at: new Date().toISOString() 
            })
            .eq('id', aiJob.id);
            
          aiJob.status = 'done';
          aiJob.finished_at = new Date().toISOString();
        }
        
        project.status = 'ready';
      }
    }
    
    // Return combined project and AI job status
    return NextResponse.json({
      project,
      aiJob: aiJob || null,
      // Include some progress information
      progress: {
        percentage: project.status === 'ready' 
          ? 100 
          : project.status === 'failed' 
            ? 0 
            : Math.floor(Math.random() * 70) + 20, // Random progress between 20-90%
        stage: project.status === 'ready' 
          ? 'complete' 
          : project.status === 'failed' 
            ? 'error' 
            : ['parsing', 'analyzing', 'generating', 'finalizing'][Math.floor(Math.random() * 4)]
      }
    });
    
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 