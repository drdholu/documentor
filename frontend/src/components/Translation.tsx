import React from 'react';
import { Globe2 } from 'lucide-react';

interface TranslationProps {
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
}

export function Translation({ selectedLanguage, setSelectedLanguage }: TranslationProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
      <div className="flex items-center mb-4 space-x-2">
        <Globe2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Translation (dummy feature, doesnt work yet)
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