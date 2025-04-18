import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

interface PublishConfig {
  projectId: string;
  subdomain: string;
}

interface PublishStatus {
  status: 'pending' | 'published' | 'failed';
  url?: string;
  error?: string;
}

/**
 * Generates a unique subdomain from a project title
 * @param title - The project title
 * @returns A unique subdomain string
 */
async function generateUniqueSubdomain(title: string): Promise<string> {
  // Generate base subdomain from title
  const baseSubdomain = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 30); // Limit length before adding unique ID

  // Add first 8 chars of a UUID
  const uniqueId = uuidv4().split('-')[0];
  const subdomain = `${baseSubdomain}-${uniqueId}`;

  // Check if this subdomain already exists
  const { data: existing } = await supabase
    .from('published_docs')
    .select('subdomain')
    .eq('subdomain', subdomain)
    .single();

  // In the unlikely event of a collision, try again
  if (existing) {
    return generateUniqueSubdomain(title);
  }

  return subdomain;
}

/**
 * Publishes a project's documentation to a subdomain
 * @param projectId - The ID of the project to publish
 * @returns The publish status and URL
 */
export async function publishProject(projectId: string): Promise<PublishStatus> {
  try {
    // First, get the project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError) {
      console.error('Error fetching project:', projectError);
      throw new Error('Project not found');
    }

    if (!project) {
      console.error('Project not found for ID:', projectId);
      throw new Error('Project not found');
    }

    // Generate a unique subdomain
    const subdomain = await generateUniqueSubdomain(project.title);
    console.log('Generated subdomain:', subdomain);

    // Get the MDX content
    const { data: mdxData, error: mdxError } = await supabase
      .from('project_mdx')
      .select('full_mdx')
      .eq('project_id', projectId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (mdxError) {
      console.error('Error fetching MDX content:', mdxError);
      throw new Error('Documentation content not found');
    }

    if (!mdxData) {
      console.error('No MDX content found for project:', projectId);
      throw new Error('Documentation content not found');
    }

    console.log('Attempting to create publish record...');
    
    // Create or update the publish record
    const { data: publishData, error: publishError } = await supabase
      .from('published_docs')
      .upsert(
        {
          project_id: projectId,
          subdomain,
          content: mdxData.full_mdx,
          published_at: new Date().toISOString(),
          status: 'pending'
        },
        {
          onConflict: 'project_id',
          ignoreDuplicates: false
        }
      )
      .select()
      .single();

    if (publishError) {
      console.error('Error creating publish record:', publishError);
      console.error('Attempted data:', {
        project_id: projectId,
        subdomain,
        contentLength: mdxData.full_mdx.length,
        published_at: new Date().toISOString()
      });
      throw new Error(`Failed to create publish record: ${publishError.message}`);
    }

    // Trigger the Vercel deployment
    const response = await fetch('/api/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId,
        subdomain,
        content: mdxData.full_mdx
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to trigger deployment');
    }

    const deployData = await response.json();

    // Update the publish record with the deployment URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fbnkuzvnujtmvlkocjbj.supabase.co';
    const publishedUrl = `${subdomain}.${baseUrl.replace('https://', '')}`;

    await supabase
      .from('published_docs')
      .update({
        status: 'published',
        url: publishedUrl
      })
      .eq('project_id', projectId);

    return {
      status: 'published',
      url: publishedUrl
    };
  } catch (error) {
    console.error('Error publishing project:', error);
    
    // Update the publish record with the error
    await supabase
      .from('published_docs')
      .update({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      })
      .eq('project_id', projectId);

    return {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Failed to publish documentation'
    };
  }
}

/**
 * Gets the publish status of a project
 * @param projectId - The ID of the project
 * @returns The current publish status and URL if published
 */
export async function getPublishStatus(projectId: string): Promise<PublishStatus> {
  const { data, error } = await supabase
    .from('published_docs')
    .select('*')
    .eq('project_id', projectId)
    .single();

  if (error || !data) {
    return { status: 'pending' };
  }

  return {
    status: data.status,
    url: data.url,
    error: data.error
  };
} 