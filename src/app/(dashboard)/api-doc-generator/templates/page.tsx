'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Template options
const templates = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, simple documentation for small to medium APIs.',
    image: '/templates/minimal.png',
    color: 'blue'
  },
  {
    id: 'developer',
    name: 'Developer Hub',
    description: 'Comprehensive documentation with code examples and guides.',
    image: '/templates/developer.png',
    color: 'purple'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Formal documentation with detailed schemas and security sections.',
    image: '/templates/enterprise.png',
    color: 'gray'
  },
  {
    id: 'interactive',
    name: 'Interactive',
    description: 'Playground-focused documentation with live API testing.',
    image: '/templates/interactive.png',
    color: 'green'
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handle template selection
   */
  const handleContinue = async () => {
    if (!selectedTemplate) return;

    setLoading(true);
    
    // Simulate loading for demo purposes
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to processing with template info
    router.push(`/dashboard/api-doc-generator/processing?projectId=demo-project&source=template&template=${selectedTemplate}`);
  };

  // We should use real template images, but for now we'll use placeholder colors
  const getPlaceholderStyle = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      gray: 'bg-gray-500',
      green: 'bg-green-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">Choose a Template</h1>
          <Link
            href="/api-doc-generator/generate"
            className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Back
          </Link>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold">Select a Documentation Template</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Choose a starting point for your API documentation. Our AI will customize the template based on your needs.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`cursor-pointer overflow-hidden rounded-lg border-2 shadow-sm transition-all ${
                  selectedTemplate === template.id
                    ? `border-${template.color}-500 shadow-md`
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className={`h-40 ${getPlaceholderStyle(template.color)} flex items-center justify-center`}>
                  {/* We'll replace this with an actual image when available */}
                  <span className="text-lg font-bold text-white">{template.name} Preview</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`template-${template.id}`}
                      name="template"
                      value={template.id}
                      checked={selectedTemplate === template.id}
                      onChange={() => setSelectedTemplate(template.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-600"
                    />
                    <label
                      htmlFor={`template-${template.id}`}
                      className="block ml-2 text-lg font-medium text-gray-900 dark:text-white"
                    >
                      {template.name}
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{template.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Template Information */}
          {selectedTemplate && (
            <div className="p-6 mt-8 border border-gray-200 rounded-lg bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-semibold">Template Features</h3>
              
              {/* Static features based on selection */}
              {selectedTemplate === 'minimal' && (
                <ul className="ml-6 space-y-2 text-gray-700 list-disc dark:text-gray-300">
                  <li>Clean, distraction-free layout</li>
                  <li>Fast loading and performance</li>
                  <li>Mobile-optimized responsive design</li>
                  <li>Quick navigation with auto-generated table of contents</li>
                  <li>Syntax highlighting for code examples</li>
                </ul>
              )}
              
              {selectedTemplate === 'developer' && (
                <ul className="ml-6 space-y-2 text-gray-700 list-disc dark:text-gray-300">
                  <li>Multiple code examples in different languages</li>
                  <li>Interactive request builder</li>
                  <li>SDK integration guides</li>
                  <li>Authentication walkthroughs</li>
                  <li>Dark mode support</li>
                </ul>
              )}
              
              {selectedTemplate === 'enterprise' && (
                <ul className="ml-6 space-y-2 text-gray-700 list-disc dark:text-gray-300">
                  <li>Detailed schema documentation</li>
                  <li>Versioning support</li>
                  <li>Advanced search capabilities</li>
                  <li>Security and compliance sections</li>
                  <li>PDF export functionality</li>
                </ul>
              )}
              
              {selectedTemplate === 'interactive' && (
                <ul className="ml-6 space-y-2 text-gray-700 list-disc dark:text-gray-300">
                  <li>Live API console</li>
                  <li>Request/response visualization</li>
                  <li>Authentication token management</li>
                  <li>Sample data generator</li>
                  <li>Customizable request parameters</li>
                </ul>
              )}
            </div>
          )}

          {/* Continue Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleContinue}
              disabled={!selectedTemplate || loading}
              className={`inline-flex items-center rounded-md px-6 py-3 text-base font-medium text-white ${
                !selectedTemplate || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {loading ? (
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
                  Creating Template...
                </>
              ) : (
                <>
                  Continue with {selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.name : 'Template'}
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
        </div>
      </div>
    </div>
  );
} 