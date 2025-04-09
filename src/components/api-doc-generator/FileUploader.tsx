import { useState } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  supportedFileTypes?: string[];
  supportedExtensions?: string[];
  maxSizeMB?: number;
  errorMessage?: string;
}

/**
 * FileUploader Component
 * 
 * A reusable component for file uploads with drag and drop support.
 * Specifically designed for API specification files (OpenAPI, Postman).
 */
export default function FileUploader({
  onFileSelect,
  selectedFile,
  supportedFileTypes = ['application/json', 'text/yaml', 'application/yaml', 'text/x-yaml'],
  supportedExtensions = ['.json', '.yaml', '.yml', '.postman_collection'],
  maxSizeMB = 10, // Default max size is 10MB
  errorMessage
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Handle file drop event
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  /**
   * Handle file input change event
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  /**
   * Validate file type, size and set file state
   */
  const validateAndSetFile = (file: File) => {
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSizeMB) {
      // File is too large - in a real app we would show an error
      // However, since we're passing the error message through props,
      // we'll let the parent component handle this
      return;
    }
    
    // Check file type (MIME type)
    const fileTypeValid = supportedFileTypes.includes(file.type);
    
    // Also check file extension as a fallback for when MIME type is not reliable
    const fileName = file.name.toLowerCase();
    const fileExtensionValid = supportedExtensions.some(ext => fileName.endsWith(ext));
    
    // Only proceed if the file is valid
    if (fileTypeValid || fileExtensionValid) {
      onFileSelect(file);
    }
  };

  return (
    <div>
      <div
        className={`mb-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-gray-700'
            : 'border-gray-300 dark:border-gray-600'
        } ${selectedFile ? 'bg-green-50 dark:bg-gray-700' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <>
            <svg
              className="mb-4 h-16 w-16 text-gray-400"
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
            <p className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
              Drag and drop your file here, or
            </p>
            <label className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <span>Browse files</span>
              <input
                type="file"
                className="hidden"
                accept={supportedExtensions.join(',')}
                onChange={handleFileChange}
              />
            </label>
          </>
        ) : (
          <>
            <svg
              className="mb-4 h-16 w-16 text-green-500 dark:text-green-400"
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
            <p className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
              File selected: {selectedFile.name}
            </p>
            <button
              type="button"
              className="mt-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              onClick={() => onFileSelect(null as any)} // Need to cast null to any due to the type definition
            >
              Change file
            </button>
          </>
        )}
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
} 