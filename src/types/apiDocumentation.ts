/**
 * API Documentation Types
 * These types define the structures used in the API documentation generator.
 */

// Documentation project information
export interface DocProject {
  id: string;
  title: string;
  description: string;
  slug: string;
  userId: string;
  status: 'draft' | 'processing' | 'ready' | 'failed';
  fileType: 'openapi' | 'postman' | 'apiblueprint';
  createdAt: string;
  updatedAt: string;
  aiGenerated: boolean;
  template?: string;
}

// API Endpoint information
export interface Endpoint {
  id: string;
  projectId: string;
  method: string;
  path: string;
  tag: string;
  summary: string;
  description: string;
  parameters: Parameter[];
  requestBody?: RequestBody;
  responses: Response[];
  codeSnippet: string;
  mdx?: string; // MDX content for custom documentation
  createdAt: string;
}

// Parameter for API endpoints
export interface Parameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description: string;
  required?: boolean;
  schema: Schema;
}

// Schema definition
export interface Schema {
  type: string;
  format?: string;
  items?: Schema;
  properties?: Record<string, Schema>;
  additionalProperties?: Schema;
  required?: string[];
  description?: string;
  example?: any;
}

// Request body for POST/PUT endpoints
export interface RequestBody {
  description: string;
  required?: boolean;
  content: Record<string, { schema?: Schema }>;
}

// Response definition
export interface Response {
  code: string;
  description: string;
  content: Record<string, { schema?: Schema }>;
}

// API Documentation Settings
export interface DocSettings {
  id: string;
  projectId: string;
  theme: 'default' | 'dark' | 'light' | 'custom';
  visibility: 'public' | 'private' | 'team';
  customCss?: string;
  logoUrl?: string;
  faviconUrl?: string;
}

// MDX Component for documentation
export interface MDXComponent {
  id: string;
  projectId: string;
  endpointId?: string; // Optional link to an endpoint
  name: string;
  type: 'intro' | 'endpoint' | 'schema' | 'guide' | 'example' | 'authentication' | 'custom';
  content: string; // MDX content
  order: number;
  createdAt: string;
  updatedAt: string;
}

// AI Job status for tracking generation
export interface AIJob {
  id: string;
  projectId: string;
  status: 'pending' | 'processing' | 'done' | 'failed';
  modelUsed: string;
  startedAt: string;
  finishedAt?: string;
  error?: string;
}

// File upload information
export interface UploadedFile {
  id: string;
  projectId: string;
  filePath: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

// Custom domain for documentation
export interface CustomDomain {
  id: string;
  projectId: string;
  domain: string;
  verified: boolean;
  createdAt: string;
} 