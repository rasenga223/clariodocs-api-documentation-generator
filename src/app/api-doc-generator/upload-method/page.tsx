'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FileUploader from '@/components/api-doc-generator/FileUploader';

export default function UploadMethodPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  /**
   * Handle file selection from the FileUploader component
   */
  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  /**
   * Handle method selection and navigation
   */
  const handleContinue = () => {
    if (selectedMethod === 'upload' && file) {
      // Navigate to file upload processing
      router.push('/dashboard/api-doc-generator');
    } else if (selectedMethod === 'url') {
      // Navigate to URL import page
      router.push('/dashboard/api-doc-generator/import-url');
    } else if (selectedMethod === 'template') {
      // Navigate to template selection
      router.push('/dashboard/api-doc-generator/templates');
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold md:text-4xl">API Documentation Generator</h1>
          <Link
            href="/dashboard"
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold">Create Beautiful API Documentation</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Choose how you want to generate your API documentation. Our AI will transform your API specification into
            elegant, interactive documentation that you can customize and deploy.
          </p>

          <div className="mb-10 grid gap-6 md:grid-cols-3">
            {/* Upload File Method */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-6 transition-colors ${
                selectedMethod === 'upload'
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-gray-700'
                  : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-800 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSelectedMethod('upload')}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <svg
                  className="h-6 w-6 text-blue-600 dark:text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium">Upload Specification</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Upload your OpenAPI (Swagger), Postman Collection, or other API specification files.
              </p>
            </div>

            {/* URL Import Method */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-6 transition-colors ${
                selectedMethod === 'url'
                  ? 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-gray-700'
                  : 'border-gray-200 hover:border-green-200 hover:bg-green-50 dark:border-gray-700 dark:hover:border-green-800 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSelectedMethod('url')}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium">Import from URL</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Provide a URL to your API specification and we'll fetch it for you.
              </p>
            </div>

            {/* Template Method */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-6 transition-colors ${
                selectedMethod === 'template'
                  ? 'border-purple-500 bg-purple-50 dark:border-purple-400 dark:bg-gray-700'
                  : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50 dark:border-gray-700 dark:hover:border-purple-800 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSelectedMethod('template')}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <svg
                  className="h-6 w-6 text-purple-600 dark:text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium">Start from Template</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Choose from pre-made templates and customize them to fit your API.
              </p>
            </div>
          </div>

          {/* File Upload Section - only visible when Upload is selected */}
          {selectedMethod === 'upload' && (
            <div className="mb-8 mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-gray-700">
              <h3 className="mb-4 text-xl font-semibold text-blue-800 dark:text-blue-300">Upload API Specification</h3>
              <FileUploader 
                onFileSelect={handleFileSelect}
                selectedFile={file}
                errorMessage=""
                supportedFileTypes={['application/json', 'text/yaml', 'application/yaml', 'text/x-yaml']}
                supportedExtensions={['.json', '.yaml', '.yml', '.postman_collection']}
                maxSizeMB={10}
              />
            </div>
          )}

          {/* How It Works Section */}
          <div className="mb-8 mt-10 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold">How It Works</h3>
            <ol className="ml-6 list-decimal space-y-4">
              <li className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Upload/Import your API specification</span>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  We support OpenAPI/Swagger (JSON/YAML), Postman Collections, and more.
                </p>
              </li>
              <li className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Our AI analyzes your API</span>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  We extract endpoints, parameters, schemas, and examples, then enhance them with AI-generated descriptions.
                </p>
              </li>
              <li className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">We generate MDX components</span>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Your documentation is transformed into flexible MDX components that you can easily customize.
                </p>
              </li>
              <li className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Edit and publish</span>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Use our editor to refine content, add examples, and then publish to your chosen domain.
                </p>
              </li>
            </ol>
          </div>

          {/* Continue Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleContinue}
              disabled={!selectedMethod || (selectedMethod === 'upload' && !file)}
              className={`inline-flex items-center rounded-md px-6 py-3 text-base font-medium text-white ${
                !selectedMethod || (selectedMethod === 'upload' && !file)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : selectedMethod === 'upload'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : selectedMethod === 'url'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              Continue
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 