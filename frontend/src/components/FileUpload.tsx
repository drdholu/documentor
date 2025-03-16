/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Check, Download } from "lucide-react";
import clsx from "clsx";
import { uploadDocument, summarizeDocument } from "../services/api";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
// import type { Summary as SummaryType } from '../types';

interface FileUploadProps {
  isDarkMode: boolean;
  onUploadSuccess: (documentId: string) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FileUpload({ isDarkMode, onUploadSuccess }: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<string>("Waiting for upload...");
  const [summary, setSummary] = useState<string>("");
  const [documentId, setDocumentId] = useState<string>("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const pollForStatus = async (documentId: string, filePath: string) => {
    setStatus("Processing...");

    const interval = setInterval(async () => {
      try {
        // const response = await checkStatus(documentId);
        // console.log("Status from backend:", response.data.status); // Add this line
        // setStatus(response.data.status);

        // if (response.data.status === "Completed") {
          clearInterval(interval); // Stop polling
          setStatus("Generating summary...");
          setIsGeneratingSummary(true);

          // Request summary from backend
          const summaryRes = await summarizeDocument(filePath);
          setSummary(summaryRes.data.summary);
          setStatus("Completed");
          setIsGeneratingSummary(false);
        // }
      } catch (err) {
        setStatus("Error processing file.");
        clearInterval(interval);
        setIsGeneratingSummary(false);
      }
    }, 2000); // Poll every 2 seconds
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 10MB limit");
      return;
    }

    setIsUploading(true);
    setError("");
    setStatus("Uploading...");

    try {
      const response = await uploadDocument(file);
      setDocumentId(response.data.document_id);
      setUploadProgress(100);
      onUploadSuccess(response.data.document_id);

      
      // Start polling for processing status
      await pollForStatus(response.data.document_id, response.data.file_path);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  // Add this function to handle the download
  const handleDownloadSummary = () => {
    if (summary) {
      // Create a blob with the summary text
      const blob = new Blob([summary], { type: 'text/plain' });
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create an anchor element and set its properties
      const a = document.createElement('a');
      a.href = url;
      a.download = `summary-${documentId || 'document'}.txt`; // Use document ID in filename if available
      
      // Append to the body, click, and clean up
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Release the blob URL
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 hover:shadow-md",
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600",
          "dark:hover:border-gray-400 hover:border-gray-400"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/30">
            <Upload className="w-10 h-10 text-blue-500 dark:text-blue-400" />
          </div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Drag & drop your document here
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            or <span className="font-medium text-blue-500 dark:text-blue-400">browse files</span>
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Supports PDF, DOCX, and TXT <span className="text-red-500">(Max size: 10MB)</span>
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {isUploading && (
        <div className="p-5 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800/70 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
              <FileText className="w-4 h-4" /> Uploading document...
            </h3>
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

      {/* Status Indicator */}
      {status !== "Waiting for upload..." && !isUploading && (
        <div className="p-5 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800/70 dark:border-gray-700">
          <h3 className="flex items-center gap-2 mb-2 font-semibold text-gray-900 dark:text-white">
            <Check className="w-4 h-4 text-green-500" /> Status:
          </h3>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{status}</p>
        </div>
      )}

      {isGeneratingSummary && (
        <div className="p-5 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800/70 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Generating Summary...</h3>
            <LoadingSpinner size="sm" />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Our AI is analyzing your document and creating a concise summary.</p>
        </div>
      )}

      {/* Summary Output */}
      {summary && (
        <div className="p-5 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800/70 dark:border-gray-700">
          <h3 className="flex items-center gap-2 mb-3 text-lg font-bold text-gray-900 dark:text-white">
            <Check className="w-5 h-5 text-green-500" /> Summary
          </h3>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30">
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">{summary}</p>
          </div>
          <div className="flex justify-end mt-3">
            <button 
              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1.5"
              onClick={handleDownloadSummary}
            >
              <Download className="w-4 h-4" />
              Download Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
