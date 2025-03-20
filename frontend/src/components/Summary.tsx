import React, { useState } from 'react';
import { Copy, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import type { Summary as SummaryType } from '../types';

interface SummaryProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  summary?: SummaryType;
  isLoading: boolean;
  error?: string;
}

export function Summary({ isCollapsed, setIsCollapsed, summary, isLoading, error }: SummaryProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    if (summary?.text) {
      await navigator.clipboard.writeText(summary.text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDownload = () => {
    if (summary?.text) {
      const blob = new Blob([summary.text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'summary.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Document Summary
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            disabled={!summary?.text}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            title={copySuccess ? 'Copied!' : 'Copy to clipboard'}
          >
            <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={handleDownload}
            disabled={!summary?.text}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <div className="p-4">
          {isLoading && (
            <div className="py-8">
              <LoadingSpinner />
              <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
                Processing document...
              </p>
            </div>
          )}

          {error && <ErrorMessage message={error} />}

          {!isLoading && !error && !summary && (
            <p className="py-8 text-center text-gray-600 dark:text-gray-300">
              Upload a document to see its summary here...
            </p>
          )}

          {summary && (
            <div className="space-y-4">
              <p className="leading-relaxed text-gray-800 dark:text-gray-200">
                {summary.text}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}