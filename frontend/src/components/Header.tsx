import React from 'react';
import { Sun, Moon, BookOpen } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export function Header({ isDarkMode, toggleTheme }: HeaderProps) {
  return (
    <header className="bg-white border-b shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="container px-4 py-4 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="text-blue-600 w-7 h-7 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              DocuSummarize
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden space-x-6 md:flex">
              <a href="#" className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Home
              </a>
              {/* <a href="#" className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Features
              </a>
              <a href="#" className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                About
              </a> */}
            </nav>
            <button
              onClick={toggleTheme}
              className="p-2 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-100" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}