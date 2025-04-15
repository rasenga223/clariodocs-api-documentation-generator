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
 * A modern, interactive file upload component with drag and drop support.
 * Designed specifically for API specification files with visual feedback.
 */
export default function FileUploader({
  onFileSelect,
  selectedFile,
  supportedFileTypes = ['application/json', 'text/yaml', 'application/yaml', 'text/x-yaml'],
  supportedExtensions = ['.json', '.yaml', '.yml', '.postman_collection'],
  maxSizeMB = 10,
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
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSizeMB) {
      return;
    }
    
    const fileTypeValid = supportedFileTypes.includes(file.type);
    const fileName = file.name.toLowerCase();
    const fileExtensionValid = supportedExtensions.some(ext => fileName.endsWith(ext));
    
    if (fileTypeValid || fileExtensionValid) {
      onFileSelect(file);
    }
  };

  return (
    <div className="relative">
      <div
        className={`group relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl transition-all duration-200 ${
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : selectedFile
            ? 'border-primary/40 bg-primary/5'
            : 'border-border/60 hover:border-primary/40 hover:bg-secondary/40'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>

        {!selectedFile ? (
          <>
            {/* Upload Icon */}
            <div className={`mb-6 p-4 rounded-full transition-all duration-200 ${
              isDragging ? 'bg-primary/20 scale-110' : 'bg-secondary group-hover:bg-primary/10'
            }`}>
              <svg
                className={`w-10 h-10 transition-colors duration-200 ${
                  isDragging ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
            </div>

            {/* Upload Text */}
            <div className="space-y-2 text-center">
              <p className="text-lg font-medium">
                Drop your API specification here
              </p>
              <p className="text-sm text-muted-foreground">
                or
              </p>
              <label className="inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Choose File</span>
                <input
                  type="file"
                  className="hidden"
                  accept={supportedExtensions.join(',')}
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Supported Formats */}
            <div className="flex items-center mt-6 space-x-2 text-xs text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Supports {supportedExtensions.join(', ')} • Max {maxSizeMB}MB</span>
            </div>
          </>
        ) : (
          <>
            {/* Selected File State */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              
              <div className="mb-6 space-y-1">
                <p className="text-lg font-medium break-all">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <button
                type="button"
                onClick={() => onFileSelect(null as any)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Change File
              </button>
            </div>
          </>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 mt-4 border rounded-lg bg-destructive/10 border-destructive/20">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-destructive" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="ml-3 text-sm text-destructive">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
} 