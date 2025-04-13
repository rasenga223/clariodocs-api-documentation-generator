'use client';

import { useState } from 'react';
import Link from 'next/link';

// Sample Swagger JSON from 1Forge Finance API
const sampleSwaggerJSON = {
  "swagger": "2.0", 
  "schemes": ["https", "http"], 
  "host": "1forge.com", 
  "basePath": "/forex-quotes", 
  "info": { 
    "contact": { 
      "email": "contact@1forge.com", 
      "name": "1Forge", 
      "url": "http://1forge.com" 
    }, 
    "description": "Stock and Forex Data and Realtime Quotes", 
    "title": "1Forge Finance APIs", 
    "version": "0.0.1", 
    "x-apisguru-categories": ["financial"], 
    "x-logo": { 
      "backgroundColor": "#24292e", 
      "url": "https://api.apis.guru/v2/cache/logo/https_1forge.com_assets_images_f-blue.svg" 
    }, 
    "x-origin": [{ 
      "format": "swagger", 
      "url": "http://1forge.com/openapi.json", 
      "version": "2.0" 
    }], 
    "x-providerName": "1forge.com" 
  }, 
  "produces": ["application/json"], 
  "paths": { 
    "/quotes": { 
      "get": { 
        "description": "Get quotes", 
        "externalDocs": { 
          "description": "Find out more", 
          "url": "http://1forge.com/forex-data-api" 
        }, 
        "responses": { 
          "200": { 
            "description": "A list of quotes" 
          } 
        }, 
        "summary": "Get quotes for all symbols", 
        "tags": ["forex", "finance", "quotes"] 
      } 
    }, 
    "/symbols": { 
      "get": { 
        "description": "Symbol List", 
        "externalDocs": { 
          "description": "Find out more", 
          "url": "http://1forge.com/forex-data-api" 
        }, 
        "responses": { 
          "200": { 
            "description": "A list of symbols", 
            "schema": { 
              "example": ["EURUSD", "GBPJPY", "AUDUSD"], 
              "items": { 
                "type": "string" 
              }, 
              "type": "array" 
            } 
          } 
        }, 
        "summary": "Get a list of symbols for which we provide real-time quotes", 
        "tags": ["forex", "finance", "quotes"] 
      } 
    } 
  } 
};

export default function DownloadSamplePage() {
  const [downloadStatus, setDownloadStatus] = useState('');

  /**
   * Handle the download of the sample Swagger JSON file
   */
  const handleDownload = () => {
    try {
      // Convert the JSON object to a string
      const jsonString = JSON.stringify(sampleSwaggerJSON, null, 2);
      
      // Create a blob with the data
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element
      const link = document.createElement('a');
      
      // Set link attributes
      link.href = url;
      link.download = '1forge-swagger.json';
      
      // Append to document
      document.body.appendChild(link);
      
      // Trigger click event
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      setDownloadStatus('File downloaded successfully!');
      
      setTimeout(() => {
        setDownloadStatus('');
      }, 3000);
    } catch (error) {
      console.error('Error downloading file:', error);
      setDownloadStatus('Error downloading file. Please try again.');
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold md:text-4xl">Sample API Spec</h1>
          <Link
            href="/dashboard"
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold">1Forge Finance API Swagger</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            This is a sample Swagger JSON file from the 1Forge Finance API. You can download it and use it for testing 
            with our API documentation generator.
          </p>

          <div className="mb-8">
            <button
              onClick={handleDownload}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                ></path>
              </svg>
              Download Swagger JSON
            </button>
            
            {downloadStatus && (
              <div className="mt-4 rounded-md bg-green-50 p-4 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <p>{downloadStatus}</p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="mb-2 text-xl font-semibold">Next Steps</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              After downloading the file, you can:
            </p>
            <ol className="ml-6 list-decimal space-y-2 text-gray-600 dark:text-gray-300">
              <li>Go to the <Link href="/dashboard/api-doc-generator" className="text-blue-600 hover:underline dark:text-blue-400">API Documentation Generator</Link></li>
              <li>Upload the downloaded Swagger JSON file</li>
              <li>Generate beautiful documentation with AI</li>
            </ol>
          </div>

          <div className="mt-8 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <h3 className="mb-2 text-lg font-medium">About this API</h3>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Title:</strong> {sampleSwaggerJSON.info.title}<br />
              <strong>Description:</strong> {sampleSwaggerJSON.info.description}<br />
              <strong>Version:</strong> {sampleSwaggerJSON.info.version}<br />
              <strong>Contact:</strong> <a href={`mailto:${sampleSwaggerJSON.info.contact.email}`} className="text-blue-600 hover:underline dark:text-blue-400">{sampleSwaggerJSON.info.contact.email}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 