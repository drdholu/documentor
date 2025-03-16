import React from 'react';

export function Footer() {
  return (
    <footer className="border-t dark:border-gray-700 mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
          <a href="#" className="hover:text-gray-900 dark:hover:text-white">
            About
          </a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white">
            Contact
          </a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}