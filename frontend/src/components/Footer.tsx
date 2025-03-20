import React from 'react';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-12 bg-white border-t dark:border-gray-700 dark:bg-gray-800">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} DocuSummarize. All rights reserved.
            </p>
          </div>
          
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Privacy
            </a>
            <a href="#" className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Terms
            </a>
            <a href="#" className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Contact
            </a>
          </div>
          
          <div className="flex mt-4 space-x-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="flex items-center justify-center mt-8 text-sm text-center text-gray-500 dark:text-gray-400">
          <span>Built with</span>
          <Heart className="w-4 h-4 mx-1 text-red-500" />
          <span>for Synapse Hackathon</span>
        </div>
      </div>
    </footer>
  );
}