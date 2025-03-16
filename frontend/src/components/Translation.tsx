/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Globe2, Languages } from 'lucide-react';

interface TranslationProps {
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
}

export function Translation({ selectedLanguage, setSelectedLanguage }: TranslationProps) {
  return (
    <div>
      <div className="flex items-center mb-4 space-x-2">
        <Languages className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        <h3 className="font-bold text-gray-800 dark:text-white">
          Translation
        </h3>
      </div>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        Translate the summary to your preferred language.
      </p>
      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="w-full p-2.5 border rounded-lg text-gray-700 dark:text-gray-200 dark:border-gray-600 dark:bg-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <option value="en">English</option>
        {/* <option value="es">Spanish</option> */}
        <option value="fr">French</option>
        {/* <option value="de">German</option> */}
        {/* <option value="zh">Chinese</option> */}
        {/* <option value="ja">Japanese</option> */}
        {/* <option value="ko">Korean</option> */}
      </select>
      <p className="mt-2 text-xs italic text-gray-500 dark:text-gray-400">
        (Coming soon)
      </p>
    </div>
  );
}