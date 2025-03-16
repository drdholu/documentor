/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import clsx from "clsx";
// import { Summary } from '../components/Summary';
// import { uploadDocument, checkStatus, summarizeDocument } from "../services/api";
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

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600",
          "dark:hover:border-gray-500 hover:border-gray-400"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
        <p className="mt-2 font-medium text-gray-600 dark:text-gray-300">
          Drag & drop your legal documents here, or click to select files
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Supports PDF, DOCX, and TXT <span className="text-red-500">(Max size: 10MB)</span>
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {isUploading && (
        <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
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

      {/* Status Indicator */}
      {status !== "Waiting for upload..." && !isUploading && (
        <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">Status:</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{status}</p>
        </div>
      )}

      {isGeneratingSummary && (
        <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">Generating Summary...</h3>
          <LoadingSpinner size="sm" />
        </div>
      )}

      {/* Summary Output */}
      {summary && (
        <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">📜 Summary:</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{summary}</p>
        </div>
      )}
    </div>
  );
}
