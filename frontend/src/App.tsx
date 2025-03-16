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

  useEffect(() => {
    // ...removed socket code...
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
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

      <main className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <FileUpload
              isDarkMode={isDarkMode}
              onUploadSuccess={handleUploadSuccess}
            />
            
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Translation
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;