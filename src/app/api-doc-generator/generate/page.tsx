'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateDocumentation, AVAILABLE_MODELS } from '@/lib/openrouter';
import { createProject, saveMdxFiles, updateProjectStatus, saveAiJob, updateAiJob } from '@/lib/docService';
import { getUser } from '@/lib/supabase';

export default function GenerateDocumentationPage() {
  const router = useRouter();
  
  // Form state
  const [apiSpec, setApiSpec] = useState('');
  const [fileType, setFileType] = useState('openapi');
  const [model, setModel] = useState('anthropic/claude-3-sonnet');
  const [template, setTemplate] = useState('minimal');
  const [extraInstructions, setExtraInstructions] = useState('');
  const [title, setTitle] = useState('My API Documentation');
  const [description, setDescription] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Get the current user
  useEffect(() => {
    async function fetchUser() {
      const user = await getUser();
      if (user) {
        setUserId(user.id);
      } else {
        // Redirect to login if user is not authenticated
        router.push('/login');
      }
    }
    fetchUser();
  }, [router]);
  
  /**
   * Handle form submission to generate documentation
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!apiSpec.trim()) {
      setError('API specification is required');
      return;
    }
    
    if (!userId) {
      setError('You must be logged in to generate documentation');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First create a project in the database
      const project = await createProject(
        title, 
        description || `Generated API documentation for ${title}`, 
        fileType, 
        userId
      );
      
      if (!project) {
        throw new Error('Failed to create project. Please try again.');
      }
      
      console.log('📝 Created project:', project.id);
      
      // Update project status to processing
      await updateProjectStatus(project.id!, 'processing');
      
      // Create an AI job record
      await saveAiJob(project.id!, model);
      
      // Store the API specification in sessionStorage for access in the preview page
      sessionStorage.setItem('apiSpec', apiSpec);
      sessionStorage.setItem('fileType', fileType);
      sessionStorage.setItem('model', model);
      sessionStorage.setItem('template', template);
      sessionStorage.setItem('projectId', project.id!);
      console.log('💾 Saved project ID to sessionStorage:', project.id);
      
      // Generate documentation
      const mdxFiles = await generateDocumentation(apiSpec, model, {
        fileType,
        template,
        extraInstructions,
      });
      
      // Log the response for debugging
      console.log('📄 Generated docs:', mdxFiles);
      
      // Ensure each file has both filename and content fields
      const formattedFiles = mdxFiles.map((file, index) => {
        // For string items, convert to object
        if (typeof file === 'string') {
          return {
            filename: `section-${index + 1}.mdx`,
            content: file
          };
        }
        
        // For objects, ensure they have the right properties
        return {
          filename: file.filename || `section-${index + 1}.mdx`,
          content: file.content || (typeof file === 'string' ? file : JSON.stringify(file))
        };
      });
      
      // Check if we received meaningful data
      if (formattedFiles.length === 0) {
        // Update AI job to failed
        await updateAiJob(project.id!, 'failed', 'No documentation content was generated');
        throw new Error('No documentation content was generated. Please try again or check your API specification.');
      }
      
      // Save the MDX files to the database
      const saveSuccess = await saveMdxFiles(project.id!, formattedFiles);
      
      if (!saveSuccess) {
        throw new Error('Failed to save documentation to database. Please try again.');
      }
      
      // Mark AI job as completed
      await updateAiJob(project.id!, 'completed');
      
      // Store generated MDX files in sessionStorage
      sessionStorage.setItem('generatedDocs', JSON.stringify(formattedFiles));
      console.log('💾 Saved formatted docs to sessionStorage');
      
      // Store project ID for access in the editor
      sessionStorage.setItem('currentProjectId', project.id!);
      
      // Navigate to preview page
      router.push('/api-doc-generator/preview');
    } catch (err) {
      console.error('Error generating documentation:', err);
      setError(err instanceof Error 
        ? `${err.message}. Please check your API specification and try again.` 
        : 'Failed to generate documentation. Please try again or check your API specification.');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Handle API specification text area changes
   */
  const handleApiSpecChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setApiSpec(e.target.value);
  };
  
  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">Generate API Documentation</h1>
          <Link
            href="/api-doc-generator/generate"
            className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Back
          </Link>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold">API Specification</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Enter your API specification in OpenAPI/Swagger JSON, YAML, or Postman Collection format. 
            Our AI will analyze it and generate beautiful documentation.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Project Details */}
            <div className="grid gap-4 mb-6 md:grid-cols-2">
              <div>
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Title
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description (Optional)
                </label>
                <input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* API Specification Input */}
            <div className="mb-6">
              <label htmlFor="apiSpec" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Paste your API specification here
              </label>
              <textarea
                id="apiSpec"
                value={apiSpec}
                onChange={handleApiSpecChange}
                rows={12}
                placeholder={`# Example OpenAPI YAML\nopenapi: 3.0.0\ninfo:\n  title: Sample API\n  description: A sample API to demonstrate OpenAPI features\n  version: 1.0.0\npaths:\n  /hello:\n    get:\n      summary: Hello endpoint\n      responses:\n        '200':\n          description: Successful response`}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="grid gap-4 mb-6 md:grid-cols-2">
              {/* File Type Selector */}
              <div>
                <label htmlFor="fileType" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Specification Format
                </label>
                <select
                  id="fileType"
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="openapi">OpenAPI/Swagger (JSON/YAML)</option>
                  <option value="postman">Postman Collection</option>
                  <option value="apiblueprint">API Blueprint</option>
                </select>
              </div>

              {/* Model Selector */}
              <div>
                <label htmlFor="model" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  AI Model
                </label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  {AVAILABLE_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} - {m.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Template Selector */}
            <div className="mb-6">
              <label htmlFor="template" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Documentation Template
              </label>
              <select
                id="template"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="minimal">Minimal - Clean, simple documentation</option>
                <option value="developer">Developer Hub - Comprehensive with code examples</option>
                <option value="enterprise">Enterprise - Formal with detailed schemas</option>
                <option value="interactive">Interactive - Playground-focused with live testing</option>
              </select>
            </div>

            {/* Extra Instructions */}
            <div className="mb-6">
              <label htmlFor="instructions" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Additional Instructions (Optional)
              </label>
              <textarea
                id="instructions"
                value={extraInstructions}
                onChange={(e) => setExtraInstructions(e.target.value)}
                rows={3}
                placeholder="Add any specific instructions or preferences for your documentation..."
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 mb-6 rounded-md bg-red-50 dark:bg-red-900/30">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={isLoading || !apiSpec.trim() || !userId}
                className={`inline-flex items-center rounded-md px-6 py-3 text-base font-medium text-white ${
                  isLoading || !apiSpec.trim() || !userId
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="w-5 h-5 mr-3 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Generating Documentation...
                  </>
                ) : (
                  <>
                    Generate Documentation
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 