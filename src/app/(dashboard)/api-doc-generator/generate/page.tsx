'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateDocumentation, AVAILABLE_MODELS } from '@/lib/openrouter';
import { createProject, saveMdxFiles, updateProjectStatus, saveAiJob, updateAiJob } from '@/lib/docService';
import { getUser } from '@/lib/supabase';
import FileUploader from '@/components/api-doc-generator/FileUploader';

export default function GenerateDocumentationPage() {
  const router = useRouter();
  
  // Form state
  const [apiSpec, setApiSpec] = useState('');
  const [fileType, setFileType] = useState('openapi');
  const [model, setModel] = useState('anthropic/claude-3.5-sonnet');
  const [template, setTemplate] = useState('minimal');
  const [extraInstructions, setExtraInstructions] = useState('');
  const [title, setTitle] = useState('My API Documentation');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [inputMethod, setInputMethod] = useState<'paste' | 'upload'>('upload');
  
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
   * Handle file selection from FileUploader
   */
  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setUploadError(null);

    if (file) {
      // When a file is selected, read its contents
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setApiSpec(event.target.result);
          
          // Try to determine file type from extension
          if (file.name.endsWith('.json') || file.type === 'application/json') {
            setFileType('openapi'); // Assuming JSON is OpenAPI format
          } else if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
            setFileType('openapi'); // YAML is typically OpenAPI
          } else if (file.name.includes('postman_collection')) {
            setFileType('postman');
          }
        }
      };
      
      reader.onerror = () => {
        setUploadError('Failed to read file. Please try again.');
      };
      
      reader.readAsText(file);
    } else {
      // If file is deselected, clear the API spec
      if (inputMethod === 'upload') {
        setApiSpec('');
      }
    }
  };
  
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
      
      // Store the first MDX file's content for the editor
      sessionStorage.setItem('mdxEditorCode', formattedFiles[0].content);
      
      // Store project ID for the editor
      sessionStorage.setItem('editorProjectId', project.id!);
      
      // Store the filename for reference
      sessionStorage.setItem('editorFilename', formattedFiles[0].filename);
      
      // Store all generated files for later access if needed
      sessionStorage.setItem('generatedDocs', JSON.stringify(formattedFiles));
      console.log('💾 Saved formatted docs to sessionStorage');
      
      // Navigate directly to the editor instead of preview
      router.push('/editor');
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
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border/40">
        <div className="px-6 py-8 mx-auto max-w-7xl md:py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                Generate Documentation
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Transform your API specification into beautiful, interactive documentation
              </p>
            </div>
            <Link
              href="/api-doc-generator/generate"
              className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-12 mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          {/* Left Column - Main Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Project Details Card */}
              <div className="p-6 border shadow-sm rounded-xl border-border/60 bg-card">
                <h2 className="mb-6 text-xl font-semibold">Project Details</h2>
                <div className="grid gap-6">
                  <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium">
                      Project Title
                    </label>
                    <input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 transition-colors border rounded-lg shadow-sm bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block mb-2 text-sm font-medium">
                      Description (Optional)
                    </label>
                    <input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 transition-colors border rounded-lg shadow-sm bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                      placeholder="Brief description of your API documentation"
                    />
                  </div>
                </div>
              </div>

              {/* API Specification Card */}
              <div className="p-6 border shadow-sm rounded-xl border-border/60 bg-card">
                <h2 className="mb-6 text-xl font-semibold">API Specification</h2>
                
                {/* Input Method Tabs */}
                <div className="inline-flex p-1 mb-6 rounded-lg bg-secondary/30">
                  <button
                    type="button"
                    onClick={() => setInputMethod('upload')}
                    className={`relative px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                      inputMethod === 'upload'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground hover:bg-secondary-foreground/10'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span>Upload File</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMethod('paste')}
                    className={`relative px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                      inputMethod === 'paste'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground hover:bg-secondary-foreground/10'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V15a2 2 0 01-2 2z" />
                      </svg>
                      <span>Raw Definition</span>
                    </div>
                  </button>
                </div>
                
                {/* Input Methods */}
                {inputMethod === 'paste' ? (
                  <div className="relative">
                    <div className="absolute flex items-center space-x-2 text-xs top-3 right-3 text-muted-foreground">
                      <span>OpenAPI/Swagger</span>
                      <span className="px-2 py-1 rounded-md bg-secondary/50">YAML/JSON</span>
                    </div>
                    <textarea
                      id="apiSpec"
                      value={apiSpec}
                      onChange={handleApiSpecChange}
                      rows={12}
                      placeholder={`# Example OpenAPI YAML\nopenapi: 3.0.0\ninfo:\n  title: Sample API\n  description: A sample API to demonstrate OpenAPI features\n  version: 1.0.0\npaths:\n  /hello:\n    get:\n      summary: Hello endpoint\n      responses:\n        '200':\n          description: Successful response`}
                      className="w-full px-4 py-3 font-mono text-sm transition-colors border rounded-lg shadow-sm bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                      required
                    />
                  </div>
                ) : (
                  <FileUploader
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                    supportedFileTypes={['application/json', 'text/yaml', 'application/yaml', 'text/x-yaml']}
                    supportedExtensions={['.json', '.yaml', '.yml', '.postman_collection']}
                    maxSizeMB={10}
                    errorMessage={uploadError || ''}
                  />
                )}
              </div>

              {/* Configuration Card */}
              <div className="p-6 border shadow-sm rounded-xl border-border/60 bg-card">
                <h2 className="mb-6 text-xl font-semibold">Generation Settings</h2>
                <div className="grid gap-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* File Type Selector */}
                    <div>
                      <label htmlFor="fileType" className="block mb-2 text-sm font-medium">
                        Specification Format
                      </label>
                      <div className="relative">
                        <select
                          id="fileType"
                          value={fileType}
                          onChange={(e) => setFileType(e.target.value)}
                          className="w-full px-4 py-3 pr-10 transition-colors border rounded-lg shadow-sm appearance-none bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        >
                          <option value="openapi">OpenAPI/Swagger (JSON/YAML)</option>
                          <option value="postman">Postman Collection</option>
                          <option value="apiblueprint">API Blueprint</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-muted-foreground">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        <div className="absolute inset-0 transition-colors rounded-lg pointer-events-none ring-1 ring-border/60 group-focus-within:ring-primary/60" />
                      </div>
                    </div>

                    {/* Model Selector */}
                    <div>
                      <label htmlFor="model" className="block mb-2 text-sm font-medium">
                        AI Model
                      </label>
                      <div className="relative">
                        <select
                          id="model"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          className="w-full px-4 py-3 pr-10 transition-colors border rounded-lg shadow-sm appearance-none bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        >
                          {AVAILABLE_MODELS.map((m) => (
                            <option key={m.id} value={m.id} className="py-2">
                              {m.name} - {m.description}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-muted-foreground">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        <div className="absolute inset-0 transition-colors rounded-lg pointer-events-none ring-1 ring-border/60 group-focus-within:ring-primary/60" />
                      </div>
                    </div>
                  </div>

                  {/* Template Selector */}
                  <div>
                    <label htmlFor="template" className="block mb-2 text-sm font-medium">
                      Documentation Template
                    </label>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {[
                        {
                          id: 'minimal',
                          name: 'Minimal',
                          description: 'Clean, simple documentation',
                          icon: (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                            </svg>
                          ),
                        },
                        {
                          id: 'developer',
                          name: 'Developer Hub',
                          description: 'Comprehensive with code examples',
                          icon: (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                          ),
                        },
                        {
                          id: 'enterprise',
                          name: 'Enterprise',
                          description: 'Formal with detailed schemas',
                          icon: (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          ),
                        },
                        {
                          id: 'interactive',
                          name: 'Interactive',
                          description: 'Playground-focused with live testing',
                          icon: (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ),
                        },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTemplate(t.id)}
                          className={`relative p-4 text-left border rounded-lg transition-all duration-200 ${
                            template === t.id
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-border/60 hover:border-primary/60'
                          }`}
                        >
                          <div className={`mb-3 ${template === t.id ? 'text-primary' : 'text-muted-foreground'}`}>
                            {t.icon}
                          </div>
                          <h3 className="text-sm font-medium">{t.name}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                          {template === t.id && (
                            <div className="absolute top-2 right-2">
                              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Extra Instructions */}
                  <div>
                    <label htmlFor="instructions" className="block mb-2 text-sm font-medium">
                      Additional Instructions (Optional)
                    </label>
                    <textarea
                      id="instructions"
                      value={extraInstructions}
                      onChange={(e) => setExtraInstructions(e.target.value)}
                      rows={3}
                      placeholder="Add any specific instructions or preferences for your documentation..."
                      className="w-full px-4 py-3 transition-colors border rounded-lg shadow-sm bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 border rounded-lg bg-destructive/10 border-destructive/20">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !apiSpec.trim() || !userId}
                  className={`inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                    isLoading || !apiSpec.trim() || !userId
                      ? 'cursor-not-allowed bg-muted text-muted-foreground'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30'
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
                      <span>Generating Documentation...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Documentation</span>
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Help Section */}
          <div className="lg:pl-8">
            <div className="sticky space-y-6 top-8">
              {/* Quick Tips Card */}
              <div className="p-6 border shadow-sm rounded-xl border-border/60 bg-card">
                <h3 className="mb-4 text-lg font-semibold">Quick Tips</h3>
                <ul className="space-y-3">
                  {[
                    'Make sure your API spec is valid and complete',
                    'Choose a template that matches your documentation needs',
                    'Add custom instructions for specific requirements',
                    'Preview and edit the generated docs before publishing',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Links */}
              <div className="p-6 border shadow-sm rounded-xl border-border/60 bg-card">
                <h3 className="mb-4 text-lg font-semibold">Need Help?</h3>
                <div className="space-y-3">
                  {[
                    {
                      title: 'Documentation Guide',
                      description: 'Learn how to structure your API spec',
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      ),
                    },
                    {
                      title: 'API Examples',
                      description: 'View sample API specifications',
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      ),
                    },
                    {
                      title: 'Contact Support',
                      description: 'Get help from our team',
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ),
                    },
                  ].map((link, i) => (
                    <a
                      key={i}
                      href="#"
                      className="flex items-start p-3 transition-colors rounded-lg hover:bg-secondary/40"
                    >
                      <div className="flex-shrink-0 p-1 rounded-md bg-primary/10 text-primary">
                        {link.icon}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium">{link.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{link.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 