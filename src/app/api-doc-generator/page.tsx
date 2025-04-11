'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import FileUploader from '@/components/api-doc-generator/FileUploader';
import { apiDocumentationService } from '@/services/apiDocumentationService';

export default function ApiDocGenerator() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // Comment out the redirect for demonstration purposes
  /*
  if (!loading && !user) {
    router.push('/login');
    return null;
  }
  */

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500"></div>
      </div>
    );
  }
  
  /**
   * Handle file selection from the FileUploader component
   */
  const handleFileSelect = (selectedFile: File | null) => {
    // Reset status
    setErrorMessage('');
    setUploadStatus('idle');
    setFile(selectedFile);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setErrorMessage('Please select a file to upload');
      return;
    }

    setUploadStatus('uploading');
    
    try {
      // Detect file type (OpenAPI or Postman)
      const fileType = await apiDocumentationService.detectFileType(file);
      
      if (!fileType) {
        setErrorMessage('Could not determine file type. Please upload a valid OpenAPI or Postman collection file.');
        setUploadStatus('error');
        return;
      }

      // In a real implementation, we would upload the file to Supabase storage
      // and create the necessary database records. For now, we'll simulate success.
      
      // Simulate file upload and record creation
      // Note: In a production app, this would call the actual service methods
      
      // For demonstration, we'll use a timeout to simulate async processing
      setTimeout(() => {
        // Simulate success - in a real app we'd use actual projectId from DB
        const projectId = 'demo-project';
        
        setUploadStatus('success');
        // Navigate to the processing page with the project ID
        router.push(`/dashboard/api-doc-generator/processing?projectId=${projectId}`);
      }, 2000);
      
      // The actual implementation would look like this:
      /*
      // Upload file to storage
      const uploadResult = await apiDocumentationService.uploadSpecFile(file, user.id);
      
      if (!uploadResult) {
        setErrorMessage('Failed to upload file. Please try again.');
        setUploadStatus('error');
        return;
      }
      
      // Create project records
      const projectCreated = await apiDocumentationService.createProject(
        user.id,
        uploadResult.projectId,
        uploadResult.filePath,
        file,
        {
          title: file.name.split('.')[0], // Use filename as title
          description: 'API documentation generated from uploaded specification',
          file_type: fileType
        }
      );
      
      if (!projectCreated) {
        setErrorMessage('Failed to create project. Please try again.');
        setUploadStatus('error');
        return;
      }
      
      setUploadStatus('success');
      
      // Navigate to the processing page
      router.push(`/dashboard/api-doc-generator/processing?projectId=${uploadResult.projectId}`);
      */
    } catch (error) {
      console.error('Error processing file:', error);
      setErrorMessage('An error occurred while processing your file. Please try again.');
      setUploadStatus('error');
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
          <h2 className="mb-4 text-2xl font-bold">Upload Your API Specification</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Upload your OpenAPI Specification (JSON/YAML) or Postman Collection to generate beautiful, AI-powered documentation.
          </p>

          {/* File Upload Section */}
          <form onSubmit={handleSubmit}>
            <FileUploader 
              onFileSelect={handleFileSelect}
              selectedFile={file}
              errorMessage={errorMessage}
              supportedFileTypes={['application/json', 'text/yaml', 'application/yaml', 'text/x-yaml']}
              supportedExtensions={['.json', '.yaml', '.yml', '.postman_collection']}
              maxSizeMB={10}
            />

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!file || uploadStatus === 'uploading'}
                className={`inline-flex items-center rounded-md px-6 py-3 text-base font-medium text-white ${
                  !file || uploadStatus === 'uploading'
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {uploadStatus === 'uploading' ? (
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
                    Uploading...
                  </>
                ) : (
                  'Generate Documentation'
                )}
              </button>
            </div>
          </form>

          {/* Support Notes */}
          <div className="mt-8 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <h3 className="mb-2 text-lg font-medium">Supported File Types:</h3>
            <ul className="ml-5 list-disc space-y-1 text-gray-600 dark:text-gray-300">
              <li>OpenAPI Specification (JSON)</li>
              <li>OpenAPI Specification (YAML)</li>
              <li>Postman Collection (JSON)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 