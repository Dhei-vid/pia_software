"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const PreferencesPage = () => {
  const [appearance, setAppearance] = useState("Dark Mode");
  const [language, setLanguage] = useState("English");
  const [autoSuggest, setAutoSuggest] = useState(true);
  const [referenceSearch, setReferenceSearch] = useState(true);

  const handleAppearanceChange = (value: string) => {
    setAppearance(value);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleAutoSuggestToggle = () => {
    setAutoSuggest(!autoSuggest);
  };

  const handleReferenceSearchToggle = () => {
    setReferenceSearch(!referenceSearch);
  };

  return (
    <div className="h-full p-8 space-y-8">
      {/* Header */}
      <div className={" pb-6 border-b border-lightgrey"}>
        <h1 className="text-3xl font-serif text-white">Preferences</h1>
      </div>

      {/* Appearance Setting */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              Appearance
            </h3>
            <p className="text-gray-400">
              How Wright PIA Software looks on your device
            </p>
          </div>
          <div className="ml-6">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-[#3a3a3a] min-w-[140px] justify-between"
              onClick={() =>
                handleAppearanceChange(
                  appearance === "Dark Mode" ? "Light Mode" : "Dark Mode"
                )
              }
            >
              <div className="flex items-center space-x-2">
                <Moon className="w-4 h-4" />
                <span>{appearance}</span>
              </div>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Language Setting */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Language</h3>
            <p className="text-gray-400">Preferred user language</p>
          </div>
          <div className="ml-6">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-[#3a3a3a] min-w-[140px] justify-between"
              onClick={() =>
                handleLanguageChange(
                  language === "English" ? "Spanish" : "English"
                )
              }
            >
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>{language}</span>
              </div>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Auto-suggest Setting */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              Auto-suggest
            </h3>
            <p className="text-gray-400">
              Enable dropdown and tab-complete suggestions while typing a query
            </p>
          </div>
          <div className="ml-6">
            <Switch id={"auto-suggest"} />
          </div>
        </div>
      </div>

      {/* Reference Search Setting */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              Reference Search
            </h3>
            <p className="text-gray-400">
              Allow Wright PIA Software reference previous search when answering
              a query.
            </p>
          </div>
          <div className="ml-6">
            <Switch id={"reference-search"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPage;
