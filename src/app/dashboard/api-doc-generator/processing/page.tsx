'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { apiDocumentationService } from '@/services/apiDocumentationService';

// Processing stages
const PROCESSING_STAGES = [
  { id: 'parsing', label: 'Parsing API specification', percentage: 25 },
  { id: 'analyzing', label: 'Analyzing endpoints and schemas', percentage: 50 },
  { id: 'generating', label: 'Generating documentation with AI', percentage: 75 },
  { id: 'finalizing', label: 'Finalizing and preparing preview', percentage: 90 },
  { id: 'complete', label: 'Documentation ready!', percentage: 100 }
];

export default function ProcessingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId') || 'demo-project'; // In a real app this would come from the URL or context
  
  const [currentStage, setCurrentStage] = useState(0);
  const [processingError, setProcessingError] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // This useEffect fetches the status from the service and updates the UI accordingly
  useEffect(() => {
    if (isComplete) return;

    // In a real app, we would fetch the project status from the API
    // and update the UI based on the response
    const checkStatus = async () => {
      try {
        // For demonstration, we're using a simulated function
        // In a real app, this would poll an API endpoint for status updates
        apiDocumentationService.simulateProcessing(projectId, (status) => {
          if (status === 'ready') {
            // Update to final stage
            setCurrentStage(PROCESSING_STAGES.length - 1);
            setIsComplete(true);
          } else {
            // Progress through stages
            const newStage = Math.min(currentStage + 1, PROCESSING_STAGES.length - 2);
            setCurrentStage(newStage);
          }
        });

        // In a production app, we would use code like this:
        /*
        // Poll for status updates
        const interval = setInterval(async () => {
          const status = await apiDocumentationService.getProjectStatus(projectId);
          
          if (status === 'ready') {
            setCurrentStage(PROCESSING_STAGES.length - 1);
            setIsComplete(true);
            clearInterval(interval);
          } else if (status === 'failed') {
            setProcessingError('Processing failed. Please try again.');
            clearInterval(interval);
          } else if (status === 'processing') {
            // Progress through stages while in processing state
            const newStage = Math.min(currentStage + 1, PROCESSING_STAGES.length - 2);
            setCurrentStage(newStage);
          }
        }, 2000);
        
        return () => clearInterval(interval);
        */
      } catch (error) {
        console.error('Error checking project status:', error);
        setProcessingError('An error occurred while checking processing status.');
      }
    };

    checkStatus();
  }, [projectId, isComplete, currentStage]);

  // Redirect to preview when complete
  useEffect(() => {
    if (isComplete) {
      // In a real app, we would wait for a success response before redirecting
      const redirectTimer = setTimeout(() => {
        router.push(`/dashboard/api-doc-generator/preview?projectId=${projectId}`);
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [isComplete, router, projectId]);

  // Comment out the auth check for demonstration
  /*
  // If not logged in, redirect to login page
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

  // Current processing stage
  const stage = PROCESSING_STAGES[currentStage];

  // Cancel or error event handler
  const handleCancel = () => {
    // In a real app, this would call an API to cancel the processing
    router.push('/dashboard/api-doc-generator');
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold md:text-4xl">Processing Your API Documentation</h1>
          {!isComplete && (
            <button
              onClick={handleCancel}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
          {processingError ? (
            <div className="text-center">
              <svg
                className="mx-auto mb-4 h-16 w-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              <h2 className="mb-4 text-2xl font-bold text-red-600 dark:text-red-400">Processing Error</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">{processingError}</p>
              <Link
                href="/dashboard/api-doc-generator"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Try Again
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-8 text-center">
                <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-blue-100 p-4 dark:bg-blue-900/30">
                  {isComplete ? (
                    <svg
                      className="h-16 w-16 text-green-500 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="h-16 w-16 animate-spin text-blue-600 dark:text-blue-400"
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
                  )}
                </div>
                <h2 className="mb-2 text-2xl font-bold">
                  {isComplete ? 'Processing Complete!' : 'Processing Your API Specification'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {isComplete
                    ? 'Your beautiful documentation is ready to view.'
                    : 'Please wait while our AI enhances your documentation.'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stage.label}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stage.percentage}%
                  </span>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out"
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Processing Stages */}
              <div className="space-y-4">
                {PROCESSING_STAGES.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        index < currentStage
                          ? 'border-green-500 bg-green-500 text-white dark:border-green-400 dark:bg-green-400'
                          : index === currentStage
                          ? 'border-blue-500 bg-blue-500 text-white dark:border-blue-400 dark:bg-blue-400'
                          : 'border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-700'
                      }`}
                    >
                      {index < currentStage ? (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`ml-3 text-sm font-medium ${
                        index <= currentStage
                          ? 'text-gray-900 dark:text-gray-100'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              {isComplete && (
                <div className="mt-8 text-center">
                  <Link
                    href={`/dashboard/api-doc-generator/preview?projectId=${projectId}`}
                    className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
                  >
                    View Documentation
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 