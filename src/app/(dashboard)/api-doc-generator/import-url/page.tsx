'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ImportUrlPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [urlType, setUrlType] = useState('openapi');

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url); // Will throw if invalid
      setError('');
    } catch (err) {
      setError('Please enter a valid URL');
      return;
    }

    setIsValidating(true);

    try {
      // In a real app, we would make an API call to validate/fetch the URL
      // For now, we'll simulate the process
      
      // Simulate API call/validation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to processing page with the URL as a query parameter
      router.push(`/dashboard/api-doc-generator/processing?projectId=demo-project&source=url&url=${encodeURIComponent(url)}`);
    } catch (err) {
      setError('Failed to validate URL. Please check the URL and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">Import from URL</h1>
          <Link
            href="/api-doc-generator/generate"
            className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Back
          </Link>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold">Import API Specification</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Enter the URL of your API specification file. We support OpenAPI/Swagger JSON/YAML, Postman Collections, and more.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="specType" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Specification Type
              </label>
              <select
                id="specType"
                value={urlType}
                onChange={(e) => setUrlType(e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="openapi">OpenAPI/Swagger</option>
                <option value="postman">Postman Collection</option>
                <option value="apiblueprint">API Blueprint</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="url" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                URL
              </label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/api-spec.json"
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={isValidating}
                className={`inline-flex items-center rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white ${
                  isValidating ? 'cursor-not-allowed opacity-70' : 'hover:bg-green-700'
                }`}
              >
                {isValidating ? (
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
                    Validating...
                  </>
                ) : (
                  <>
                    Import & Generate
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

          {/* Tips Section */}
          <div className="p-6 mt-10 border border-gray-200 rounded-lg bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold">Tips for Importing</h3>
            <ul className="ml-6 space-y-2 text-gray-700 list-disc dark:text-gray-300">
              <li>
                Make sure your API specification URL is publicly accessible.
              </li>
              <li>
                For private APIs, you might need to upload the file directly instead.
              </li>
              <li>
                The URL should point directly to a raw JSON/YAML file, not an HTML page.
              </li>
              <li>
                GitHub and GitLab raw file URLs typically work well.
              </li>
            </ul>
          </div>

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <p>
              Example URLs:
            </p>
            <ul className="mt-2 ml-6 list-disc">
              <li className="mt-1">
                <code className="px-2 py-1 font-mono text-sm bg-gray-100 rounded dark:bg-gray-700">
                  https://petstore.swagger.io/v2/swagger.json
                </code>
              </li>
              <li className="mt-1">
                <code className="px-2 py-1 font-mono text-sm bg-gray-100 rounded dark:bg-gray-700">
                  https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/examples/v3.0/petstore.yaml
                </code>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 