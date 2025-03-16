import React from 'react';
import { Globe2 } from 'lucide-react';

interface TranslationProps {
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
}

export function Translation({ selectedLanguage, setSelectedLanguage }: TranslationProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Globe2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Translation
        </h3>
      </div>
      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="w-full p-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
      </select>
    </div>
  );
}