import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API Route: GET /api/api-doc-generator/project/[projectId]
 * 
 * This endpoint retrieves the full project details, including all endpoints
 * and documentation for a given project ID.
 */
export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId;
    
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
        slug,
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
    
    // Get endpoints
    const { data: endpoints, error: endpointsError } = await supabase
      .from('endpoints')
      .select(`
        id,
        method,
        path,
        tag,
        summary,
        description,
        parameters,
        request_body,
        response_body,
        code_snippet,
        mdx,
        created_at
      `)
      .eq('project_id', projectId)
      .order('path', { ascending: true });
    
    // Get uploaded file info
    const { data: files, error: filesError } = await supabase
      .from('uploaded_files')
      .select(`
        id,
        file_path,
        original_name,
        mime_type,
        size,
        uploaded_at
      `)
      .eq('project_id', projectId);
    
    // Get project settings
    const { data: settings, error: settingsError } = await supabase
      .from('project_settings')
      .select(`
        id,
        theme,
        visibility,
        custom_css,
        logo_url,
        favicon_url
      `)
      .eq('project_id', projectId)
      .maybeSingle();
    
    // Get domain info if available
    const { data: domain, error: domainError } = await supabase
      .from('custom_domains')
      .select(`
        id,
        domain,
        verified,
        created_at
      `)
      .eq('project_id', projectId)
      .maybeSingle();
    
    // Generate Mock Data for Demo Purposes
    // In a real app, this would come from the database
    if (project.status === 'ready' && (!endpoints || endpoints.length === 0)) {
      // Create mock data for demonstration purposes
      const mockEndpoints = generateMockEndpoints(projectId);
      return NextResponse.json({
        project,
        endpoints: mockEndpoints,
        files: files || [],
        settings: settings || {
          theme: 'default',
          visibility: 'private'
        },
        domain: domain || null
      });
    }
    
    // Return the complete project data
    return NextResponse.json({
      project,
      endpoints: endpoints || [],
      files: files || [],
      settings: settings || {
        theme: 'default',
        visibility: 'private'
      },
      domain: domain || null
    });
    
  } catch (error) {
    console.error('Project retrieval error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to generate mock endpoints for demo purposes
 */
function generateMockEndpoints(projectId: string) {
  return [
    {
      id: crypto.randomUUID(),
      project_id: projectId,
      method: 'GET',
      path: '/pets',
      tag: 'pets',
      summary: 'List all pets',
      description: 'Returns all pets from the system that the user has access to.',
      parameters: [
        { name: 'limit', in: 'query', description: 'Maximum number of items to return', schema: { type: 'integer', format: 'int32' } }
      ],
      response_body: JSON.stringify({
        '200': {
          description: 'A paged array of pets',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    tag: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        '500': {
          description: 'Unexpected error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'integer' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }),
      code_snippet: `curl -X GET "https://api.example.com/pets?limit=10" -H "accept: application/json"`,
      created_at: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      project_id: projectId,
      method: 'POST',
      path: '/pets',
      tag: 'pets',
      summary: 'Create a pet',
      description: 'Creates a new pet in the store.',
      parameters: [],
      request_body: JSON.stringify({
        description: 'Pet to add to the store',
        content: { 
          'application/json': { 
            schema: { 
              type: 'object', 
              properties: { 
                name: { type: 'string' }, 
                tag: { type: 'string' } 
              } 
            } 
          } 
        }
      }),
      response_body: JSON.stringify({
        '201': {
          description: 'Null response'
        },
        '400': {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: { 
                type: 'object',
                properties: {
                  code: { type: 'integer' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }),
      code_snippet: `curl -X POST "https://api.example.com/pets" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \\"name\\": \\"Fluffy\\", \\"tag\\": \\"cat\\" }"`,
      created_at: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      project_id: projectId,
      method: 'GET',
      path: '/pets/{petId}',
      tag: 'pets',
      summary: 'Info for a specific pet',
      description: 'Returns a pet based on a single ID.',
      parameters: [
        { name: 'petId', in: 'path', description: 'The id of the pet to retrieve', required: true, schema: { type: 'string' } }
      ],
      response_body: JSON.stringify({
        '200': {
          description: 'Expected response to a valid request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  tag: { type: 'string' }
                }
              }
            }
          }
        },
        '404': {
          description: 'Pet not found'
        }
      }),
      code_snippet: `curl -X GET "https://api.example.com/pets/123" -H "accept: application/json"`,
      created_at: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      project_id: projectId,
      method: 'GET',
      path: '/store/inventory',
      tag: 'store',
      summary: 'Returns pet inventories by status',
      description: 'Returns a map of status codes to quantities',
      parameters: [],
      response_body: JSON.stringify({
        '200': {
          description: 'successful operation',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                additionalProperties: {
                  type: 'integer',
                  format: 'int32'
                }
              }
            }
          }
        }
      }),
      code_snippet: `curl -X GET "https://api.example.com/store/inventory" -H "accept: application/json"`,
      created_at: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      project_id: projectId,
      method: 'POST',
      path: '/user',
      tag: 'user',
      summary: 'Create user',
      description: 'This can only be done by the logged in user.',
      parameters: [],
      request_body: JSON.stringify({
        description: 'Created user object',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                username: { type: 'string' },
                email: { type: 'string' }
              }
            }
          }
        }
      }),
      response_body: JSON.stringify({
        '200': {
          description: 'successful operation',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  username: { type: 'string' },
                  email: { type: 'string' }
                }
              }
            }
          }
        }
      }),
      code_snippet: `curl -X POST "https://api.example.com/user" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \\"username\\": \\"johndoe\\", \\"email\\": \\"john@example.com\\" }"`,
      created_at: new Date().toISOString()
    }
  ];
} 