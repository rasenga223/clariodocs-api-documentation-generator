'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateDocumentation, AVAILABLE_MODELS } from '@/lib/openrouter';

export default function GenerateDocumentationPage() {
  const router = useRouter();
  
  // Form state
  const [apiSpec, setApiSpec] = useState('');
  const [fileType, setFileType] = useState('openapi');
  const [model, setModel] = useState('anthropic/claude-3-sonnet');
  const [template, setTemplate] = useState('minimal');
  const [extraInstructions, setExtraInstructions] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Handle form submission to generate documentation
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!apiSpec.trim()) {
      setError('API specification is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Store the API specification in sessionStorage for access in the preview page
      sessionStorage.setItem('apiSpec', apiSpec);
      sessionStorage.setItem('fileType', fileType);
      sessionStorage.setItem('model', model);
      sessionStorage.setItem('template', template);
      
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
        throw new Error('No documentation content was generated. Please try again or check your API specification.');
      }
      
      // Store generated MDX files in sessionStorage
      sessionStorage.setItem('generatedDocs', JSON.stringify(formattedFiles));
      console.log('💾 Saved formatted docs to sessionStorage');
      
      // Navigate to preview page
      router.push('/dashboard/api-doc-generator/preview');
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
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold md:text-4xl">Generate API Documentation</h1>
          <Link
            href="/dashboard/api-doc-generator/upload-method"
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Back
          </Link>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold">API Specification</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Enter your API specification in OpenAPI/Swagger JSON, YAML, or Postman Collection format. 
            Our AI will analyze it and generate beautiful documentation.
          </p>

          <form onSubmit={handleSubmit}>
            {/* API Specification Input */}
            <div className="mb-6">
              <label htmlFor="apiSpec" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Paste your API specification here
              </label>
              <textarea
                id="apiSpec"
                value={apiSpec}
                onChange={handleApiSpecChange}
                rows={12}
                placeholder={`# Example OpenAPI YAML\nopenapi: 3.0.0\ninfo:\n  title: Sample API\n  description: A sample API to demonstrate OpenAPI features\n  version: 1.0.0\npaths:\n  /hello:\n    get:\n      summary: Hello endpoint\n      responses:\n        '200':\n          description: Successful response`}
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-2">
              {/* File Type Selector */}
              <div>
                <label htmlFor="fileType" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Specification Format
                </label>
                <select
                  id="fileType"
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="openapi">OpenAPI/Swagger (JSON/YAML)</option>
                  <option value="postman">Postman Collection</option>
                  <option value="apiblueprint">API Blueprint</option>
                </select>
              </div>

              {/* Model Selector */}
              <div>
                <label htmlFor="model" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  AI Model
                </label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
              <label htmlFor="template" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Documentation Template
              </label>
              <select
                id="template"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="minimal">Minimal - Clean, simple documentation</option>
                <option value="developer">Developer Hub - Comprehensive with code examples</option>
                <option value="enterprise">Enterprise - Formal with detailed schemas</option>
                <option value="interactive">Interactive - Playground-focused with live testing</option>
              </select>
            </div>

            {/* Extra Instructions */}
            <div className="mb-6">
              <label htmlFor="instructions" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Additional Instructions (Optional)
              </label>
              <textarea
                id="instructions"
                value={extraInstructions}
                onChange={(e) => setExtraInstructions(e.target.value)}
                rows={3}
                placeholder="Add any specific instructions or preferences for your documentation..."
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
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
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !apiSpec.trim()}
                className={`inline-flex items-center rounded-md px-6 py-3 text-base font-medium text-white ${
                  isLoading || !apiSpec.trim()
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="mr-3 h-5 w-5 animate-spin"
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
                      className="ml-2 h-5 w-5"
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