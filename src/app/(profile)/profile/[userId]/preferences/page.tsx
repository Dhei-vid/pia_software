"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import LoadingSpinner from "@/components/ui/loading";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import SelectComp from "@/components/general/select-component";

const UserPreferencesPage = () => {
  const params = useParams();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const userId = params.userId as string;

  // Check if the current user is viewing their own preferences
  const isOwnPreferences = user?.id === userId;

  const [language, setLanguage] = useState("English");
  const [autoSuggest, setAutoSuggest] = useState(true);
  const [referenceSearch, setReferenceSearch] = useState(true);

  const handleAppearanceChange = (value: string) => {
    const newTheme = value === "dark mode" ? "dark" : "light";
    setTheme(newTheme);
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

  if (!user) {
    return (
      <div className="h-full p-8 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <p className="text-gray-400">Loading user preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-8 space-y-8">
      {/* Header */}
      <div className={" pb-6 border-b border-foreground/30"}>
        <h1 className="text-3xl font-serif text-foreground/70">Preferences</h1>
      </div>

      {/* Appearance Setting */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground/70 mb-2">
              Appearance
            </h3>
            <p className="text-muted-foreground">
              How Wright PIA Software looks on your device
            </p>
          </div>

          <SelectComp
            placeholder={theme === "dark" ? "dark mode" : "light mode"}
            header={"Mode"}
            onValueChange={handleAppearanceChange}
            selectItems={[
              {
                Icon: Moon,
                value: "dark mode",
              },
              {
                Icon: Sun,
                value: "light mode",
              },
            ]}
          />
        </div>
      </div>

      {/* Language Setting */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground/70 mb-2">
              Language
            </h3>
            <p className="text-muted-foreground">Preferred user language</p>
          </div>
          <div className="ml-6">
            <SelectComp
              placeholder={language}
              header={"Language"}
              selectItems={[
                {
                  value: "English",
                },
                {
                  value: "French",
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Auto-suggest Setting */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground/70 mb-2">
              Auto-suggest
            </h3>
            <p className="text-muted-foreground">
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
            <h3 className="text-lg font-semibold text-foreground/70 mb-2">
              Reference Search
            </h3>
            <p className="text-muted-foreground">
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

export default UserPreferencesPage;
