"use client";

import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  SendHorizontal,
  Link,
} from "lucide-react";
import { DocumentSection } from "@/utils/documentParser";
import { cn } from "@/lib/utils";

interface IDocumentViewerProps {
  selectedSection: DocumentSection | null;
  chapterTitle?: string;
  partTitle?: string;
  currentSectionIndex?: number;
  totalSections?: number;
  previousSectionTitle: string;
  nextSectionTitle: string;
  previousSectionNumber?: number;
  nextSectionNumber?: number;
  onPreviousSection?: () => void;
  onNextSection?: () => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

const DocumentViewer: FC<IDocumentViewerProps> = ({
  selectedSection,
  chapterTitle,
  partTitle,
  previousSectionTitle,
  nextSectionTitle,
  previousSectionNumber = 0,
  nextSectionNumber = 0,
  currentSectionIndex = 0,
  totalSections = 0,
  onPreviousSection,
  onNextSection,
  onSearch,
  searchQuery = "",
  setSearchQuery,
}) => {
  const handleSearch = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  // Helper function to extract section number from section ID
  const getSectionNumber = (sectionId: string): number => {
    const match = sectionId.match(/section-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Get current section number for display
  const currentSectionNumber = selectedSection
    ? getSectionNumber(selectedSection.id)
    : 0;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  if (!selectedSection) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Select a Section
          </h2>
          <p className="text-gray-400">
            Choose a section from the left sidebar to view its content
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        {chapterTitle && (
          <h1 className="text-2xl font-semibold text-white mb-2">
            {chapterTitle}
          </h1>
        )}
        {partTitle && (
          <h2 className="text-lg text-gray-300 mb-4">{partTitle}</h2>
        )}
        <h3 className="text-xl font-bold text-white">
          {selectedSection.title}
        </h3>
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto mb-6">
        <div className="prose prose-invert max-w-none">
          {selectedSection.content ? (
            <div className="space-y-3">
              {selectedSection.content.split("\n").map((paragraph, index) => {
                if (!paragraph.trim()) {
                  // Preserve empty lines for spacing
                  return <div key={index} className="h-2" />;
                }

                // Check for different types of content
                const isSectionTitle = /^\d+\.\s+/.test(paragraph.trim());
                const isSubPointA = /^[A-Z]\.\s+/.test(paragraph.trim());
                const isSubPointB = /^\([a-z]\)\s+/.test(paragraph.trim());
                const isSubPointC = /^\([ivx]+\)\s+/.test(paragraph.trim());
                const isIndented =
                  paragraph.startsWith("    ") || paragraph.startsWith("  ");

                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-1">
                      <p
                        className={`text-white leading-relaxed ${
                          isSectionTitle
                            ? "font-bold text-lg mb-3 text-gray-400"
                            : isSubPointA
                            ? "font-semibold text-base mb-2 ml-4"
                            : isSubPointB
                            ? "text-base mb-1 ml-8"
                            : isSubPointC
                            ? "text-sm mb-1 ml-12"
                            : isIndented
                            ? "text-base ml-4"
                            : "text-base"
                        }`}
                      >
                        {paragraph}
                      </p>
                    </div>
                    <button className="cursor-pointer flex-shrink-0 p-1 hover:bg-lightgrey rounded transition-colors">
                      <Link
                        size={16}
                        className="text-gray-400 hover:text-white"
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">
                No content available for this section
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Section Navigation */}
      <div className="relative border border-lightgrey rounded-xl mb-6 overflow-hidden">
        <div className="relative flex items-stretch justify-between">
          {/* Previous button */}
          <button
            onClick={onPreviousSection}
            disabled={currentSectionIndex === 0}
            className={cn(
              "cursor-pointer flex items-center gap-2 w-1/2 justify-start px-4 h-20 text-gray-300 hover:text-white hover:bg-lightgrey",
              currentSectionIndex === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            <ChevronLeft size={16} className="flex-shrink-0" />
            <div className="text-left leading-tight flex-1">
              <span className="text-sm opacity-50 block">Previous</span>
              <p className="text-sm line-clamp-2">
                Section {previousSectionNumber}: {previousSectionTitle}
              </p>
            </div>
          </button>

          {/* Divider line */}
          <div className="w-px bg-lightgrey self-stretch" />

          {/* Next button */}
          <button
            onClick={onNextSection}
            disabled={currentSectionIndex === totalSections - 1}
            className={cn(
              "cursor-pointer flex items-center gap-2 w-1/2 justify-end px-4 h-20 text-gray-300 hover:text-white hover:bg-lightgrey",
              currentSectionIndex === totalSections - 1 &&
                "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="text-right leading-tight flex-1">
              <span className="text-sm opacity-50 block">Next</span>
              <p className="text-sm line-clamp-2">
                Section {nextSectionNumber}: {nextSectionTitle}
              </p>
            </div>
            <ChevronRight size={16} className="flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="border border-lightgrey rounded-xl bg-dark">
        <div className="p-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for a section, keyword, or citation"
            className="bg-transparent border-none text-white placeholder:text-gray-400 focus:border-none focus:ring-0"
          />
        </div>
        <div className="p-3 flex flex-row items-center justify-between border-t border-lightgrey">
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 hover:bg-lightgrey border border-lightgrey bg-transparent rounded-full"
          >
            <Plus size={20} className="text-gray-400" />
          </Button>

          <Button
            onClick={handleSearch}
            className="group w-10 h-10 border border-green bg-transparent hover:bg-green text-white p-2 rounded-lg"
          >
            <SendHorizontal
              size={20}
              className="text-green group-hover:text-white"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
