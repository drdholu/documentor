import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { socket } from './services/api';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { Summary } from './components/Summary';
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
    socket.on('processing_status', (status: ProcessingStatus) => {
      setProcessingStatus(status);
      if (status.status === 'error') {
        setError(status.message || 'An error occurred while processing the document');
        setIsLoading(false);
      } else if (status.status === 'completed') {
        setIsLoading(false);
      }
    });

    socket.on('summary_ready', (data: SummaryType) => {
      setSummary(data);
      setIsLoading(false);
    });

    return () => {
      socket.off('processing_status');
      socket.off('summary_ready');
    };
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

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <FileUpload
              isDarkMode={isDarkMode}
              onUploadSuccess={handleUploadSuccess}
            />
            <Summary
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              summary={summary}
              isLoading={isLoading}
              error={error}
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