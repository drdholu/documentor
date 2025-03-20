/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { Translation } from './components/Translation';
import { Footer } from './components/Footer';
import type { Summary as SummaryType, ProcessingStatus } from './types';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [summary, setSummary] = useState<SummaryType | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null);

  // Load theme preference from localStorage when the App mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme'); // 'dark' or 'light'
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    // ...removed socket code...
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleUploadSuccess = (documentId: string) => {
    setIsLoading(true);
    setError('');
    setSummary(undefined);
  };

  return (
    <div className={clsx(
      'min-h-screen transition-colors duration-200',
      isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    )}>
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <main className="container max-w-6xl px-4 py-12 mx-auto">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
            Smart Document Summarizer
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            Upload your document and get an instant AI-powered summary. Perfect for legal documents, research papers, and more.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column (File Upload) - Wider */}
          <div className="col-span-2 space-y-6">
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800/50 dark:border-gray-700">
              <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Upload Document</h3>
              <FileUpload
                isDarkMode={isDarkMode}
                onUploadSuccess={handleUploadSuccess}
              />
            </div>
          </div>

          {/* Right Column (Translation) */}
          <div className="space-y-6">
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800/50 dark:border-gray-700">
              <Translation
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
              />
            </div>
            
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800/50 dark:border-gray-700">
              <h3 className="mb-3 font-bold text-gray-800 dark:text-white">How It Works</h3>
              <ol className="ml-5 space-y-2 text-sm text-gray-600 list-decimal dark:text-gray-400">
                <li>Upload your document (PDF, DOCX, or TXT format)</li>
                <li>Our AI analyzes the content</li>
                <li>View the generated summary</li>
                <li>Optionally translate to another language</li>
              </ol>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;