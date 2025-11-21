"use client";

import Image from "next/image";
import { Input } from "../ui/input";
import { Search, RotateCw, Sun, Moon } from "lucide-react";
import { SetStateAction, Dispatch, FC, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Switch } from "@/components/ui/switch";
import { GenericDrawer } from "@/components/ui/generic-drawer";
import UserProfile from "./user-profile";
import { HistoryData } from "@/api/documents/document-types";

import HistoryList from "../sidebar-items/history";
import TableOfContent from "../sidebar-items/table-of-content";
import { DocumentSection } from "@/utils/documentParser";
import { useTheme } from "@/contexts/ThemeContext";
import { extractErrorMessage } from "@/common/helpers";

// API
import { DocumentService } from "@/api/documents/document";

interface ILeftSideBarProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  onSectionSelect?: (
    section: DocumentSection,
    chapterTitle: string,
    partTitle: string,
    sections: DocumentSection[],
    partId: string
  ) => void;
}

export const LeftSideBar: FC<ILeftSideBarProps> = ({
  searchQuery,
  setSearchQuery,
  onSectionSelect,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [query, setQuery] = useState<HistoryData>();

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await DocumentService.getSearchHistory();
        setQuery(response.data);
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [isHistoryOpen]);

  // const filteredHistory = query?.searches.map((item) => item.query);

  // console.log("Filtered History ", query);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 p-6 space-y-4">
        {/* Logo */}
        <div>
          <Image src={"/logo.png"} alt={"Logo"} width={30} height={30} />
        </div>

        {/* Search Bar */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="New Query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-dark border-lightgrey text-foreground placeholder:text-muted-foreground focus:border-yellow-400"
            />
          </div>

          {/* History */}
          <div>
            <Button
              variant="ghost"
              onClick={() => setIsHistoryOpen(true)}
              className="w-full justify-start text-foreground/70 hover:text-foreground hover:!bg-lightgrey py-6"
            >
              <RotateCw className={"mr-2"} size={8} />
              History
            </Button>
          </div>
        </div>
      </div>

      {/* Table of Content */}
      <TableOfContent />

      {/* Fixed Footer Section */}
      <div className="w-full flex-shrink-0 p-6 border-t border-lightgrey">
        {/* Light Mode Toggle */}
        <div className="flex flex-row items-center justify-between mb-8">
          <div className="flex flex-row items-center justify-start text-foreground/70">
            {theme === "dark" ? (
              <Moon className={"w-4 h-4 mr-3"} />
            ) : (
              <Sun className={"w-4 h-4 mr-3"} />
            )}

            <p className="text-sm">
              {theme === "dark" ? "Dark mode" : "Light mode"}
            </p>
          </div>
          <Switch
            id={"lightmode"}
            checked={theme === "light"}
            onCheckedChange={() => {
              toggleTheme();
            }}
          />
        </div>

        {/* User Profile */}
        <UserProfile />
      </div>

      {/* History Drawer */}
      <GenericDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title="History"
        position="left"
      >
        <HistoryList
          isLoading={isLoading}
          history={query?.searches ?? []}
          error={error}
        />
      </GenericDrawer>
    </div>
  );
};
