import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { uploadDocument } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface FileUploadProps {
  isDarkMode: boolean;
  onUploadSuccess: (documentId: string) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FileUpload({ isDarkMode, onUploadSuccess }: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 10MB limit');
      return;
    }

    setIsUploading(true);
    setError('');
    
    try {
      const response = await uploadDocument(file);
      onUploadSuccess(response.data.documentId);
      setUploadProgress(100);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600',
          'dark:hover:border-gray-500 hover:border-gray-400'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <p className="mt-2 text-gray-600 dark:text-gray-300 font-medium">
          Drag & drop your legal documents here, or click to select files
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Supports PDF, DOCX, and TXT (Max size: 10MB)
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {isUploading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">Uploading...</h3>
            <LoadingSpinner size="sm" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {acceptedFiles.length > 0 && !isUploading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Uploaded Files
          </h3>
          {acceptedFiles.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between py-2"
            >
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}