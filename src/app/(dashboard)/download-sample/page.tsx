'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, ArrowLeft, Info, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col h-full p-6">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">
            Sample API Files
          </h1>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">1Forge Finance API Swagger</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground">
              This is a sample Swagger JSON file from the 1Forge Finance API. You can download it and use it for testing 
              with our API documentation generator.
            </p>

            <div className="mb-8">
              <Button
                onClick={handleDownload}
                variant="default"
                className="gap-2 transition-colors duration-200 bg-primary/90 hover:bg-primary"
              >
                <FileDown className="w-5 h-5" />
                Download Swagger JSON
              </Button>
              
              {downloadStatus && (
                <div className="p-4 mt-4 text-green-500 border border-green-200 rounded-md bg-green-500/10 dark:bg-green-500/20 dark:text-green-400 dark:border-green-900/50">
                  <p>{downloadStatus}</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="mb-2 text-xl font-semibold text-foreground">Next Steps</h3>
              <p className="mb-4 text-muted-foreground">
                After downloading the file, you can:
              </p>
              <ol className="ml-6 space-y-2 list-decimal text-muted-foreground">
                <li>Go to the <Link href="/api-doc-generator/generate" className="text-primary hover:text-primary/80 hover:underline">API Documentation Generator</Link></li>
                <li>Upload the downloaded Swagger JSON file</li>
                <li>Generate beautiful documentation with AI</li>
              </ol>
            </div>

            <div className="p-4 mt-8 border rounded-lg border-border/50 bg-secondary/50">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground">About this API</h3>
              </div>
              <div className="space-y-2 text-muted-foreground">
                <p><span className="font-medium">Title:</span> {sampleSwaggerJSON.info.title}</p>
                <p><span className="font-medium">Description:</span> {sampleSwaggerJSON.info.description}</p>
                <p><span className="font-medium">Version:</span> {sampleSwaggerJSON.info.version}</p>
                <p>
                  <span className="font-medium">Contact:</span>{" "}
                  <a 
                    href={`mailto:${sampleSwaggerJSON.info.contact.email}`} 
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 hover:underline"
                  >
                    {sampleSwaggerJSON.info.contact.email}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-4 border-t border-border/30">
            <Link href="/api-doc-generator/generate">
              <Button variant="default" className="gap-2 transition-colors duration-200 bg-primary/90 hover:bg-primary">
                Generate Documentation
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 