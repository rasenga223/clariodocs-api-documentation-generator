import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API Route: POST /api/api-doc-generator/upload
 * 
 * This endpoint handles the upload of API specification files
 * It processes the file, validates it, and stores it in Supabase.
 * 
 * Expected form data:
 * - file: The API specification file
 */
export async function POST(req: Request) {
  try {
    // Get the current user's session
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse the form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file size
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      return NextResponse.json(
        { error: 'File size exceeds the 10MB limit' },
        { status: 400 }
      );
    }
    
    // Validate file type (basic check)
    const fileName = file.name.toLowerCase();
    const validExtensions = ['.json', '.yaml', '.yml', '.postman_collection'];
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a JSON or YAML file.' },
        { status: 400 }
      );
    }
    
    // Generate a unique projectId
    const projectId = crypto.randomUUID();
    
    // Create file path in storage
    const filePath = `${userId}/${projectId}/${file.name}`;
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('api-specifications')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });
    
    if (storageError) {
      console.error('Storage error:', storageError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }
    
    // Detect file type (placeholder implementation)
    let fileType: 'openapi' | 'postman' = 'openapi'; // Default to OpenAPI
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      
      if (json.info && json.item && Array.isArray(json.item)) {
        fileType = 'postman';
      }
    } catch (error) {
      // If we can't parse as JSON, assume it's a YAML OpenAPI spec
      console.error('Error parsing file:', error);
    }
    
    // Create project in database
    const { error: projectError } = await supabase
      .from('projects')
      .insert({
        id: projectId,
        user_id: userId,
        title: file.name.split('.')[0], // Use filename as title
        slug: projectId, // Initially use projectId as slug
        description: `API documentation for ${file.name}`,
        file_type: fileType,
        status: 'processing',
        ai_generated: true
      });
    
    if (projectError) {
      console.error('Project record error:', projectError);
      return NextResponse.json(
        { error: 'Failed to create project record' },
        { status: 500 }
      );
    }
    
    // Create uploaded file record
    const { error: fileError } = await supabase
      .from('uploaded_files')
      .insert({
        project_id: projectId,
        file_path: storageData.path,
        original_name: file.name,
        mime_type: file.type,
        size: file.size
      });
    
    if (fileError) {
      console.error('File record error:', fileError);
      return NextResponse.json(
        { error: 'Failed to create file record' },
        { status: 500 }
      );
    }
    
    // Create AI job record
    const { error: jobError } = await supabase
      .from('ai_jobs')
      .insert({
        project_id: projectId,
        status: 'pending',
        model_used: 'gpt-4',
        started_at: new Date().toISOString()
      });
    
    if (jobError) {
      console.error('AI job record error:', jobError);
      return NextResponse.json(
        { error: 'Failed to create AI job record' },
        { status: 500 }
      );
    }
    
    // Return success response with projectId
    return NextResponse.json({ 
      success: true, 
      projectId,
      message: 'File uploaded successfully'
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 