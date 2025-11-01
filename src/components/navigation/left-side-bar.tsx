"use client";

import Image from "next/image";
import { Input } from "../ui/input";
import { Search, RotateCw, ChevronRight, ChevronDown, Sun } from "lucide-react";
import { SetStateAction, Dispatch, FC, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Switch } from "@/components/ui/switch";
import { GenericDrawer } from "@/components/ui/generic-drawer";
import UserProfile from "./user-profile";
import { cn } from "@/lib/utils";

import { Document } from "@/api/documents/document-types";
import { DocumentService } from "@/api/documents/document";
import { useDocumentParser } from "@/hooks/useDocumentParser";
import { DocumentSection } from "@/utils/documentParser";
import { AIService } from "@/api/ai/ai";
import { useTheme } from "@/contexts/ThemeContext";

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
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  ); // Start with no chapters expanded
  const [selectedPart, setSelectedPart] = useState<string>(""); // Start with no part selected
  const [isSectionsDrawerOpen, setIsSectionsDrawerOpen] = useState(false);
  const [selectedPartForDrawer, setSelectedPartForDrawer] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  // Get document
  useEffect(() => {
    const fetchDocument = async () => {
      const response = await DocumentService.getAllDocuments();
      const docs = Array.isArray(response.documents) ? response.documents : [];
      setDocuments(docs);

      // Set the first document as selected by default
      if (docs.length > 0) {
        setSelectedDocument(docs[0]);
      }
    };

    fetchDocument();
  }, []);

  // Use document parser for the selected document
  const {
    parsedDocument,
    chapters: parsedChapters,
    getSectionsForPart,
  } = useDocumentParser(selectedDocument);

  // Keep all chapters closed by default - no auto-expansion

  // Sample history data
  const historyData = [
    {
      id: "1",
      query: "What are the rules about obtain...",
      timestamp: "2 hours ago",
      type: "query",
    },
    {
      id: "2",
      query: "Penalties for gas flaring",
      timestamp: "1 day ago",
      type: "query",
    },
    {
      id: "3",
      query: "S.104",
      timestamp: "3 days ago",
      type: "section",
    },
  ];

  const filteredHistory = historyData.filter((item) =>
    item.query.toLowerCase().includes(historySearchQuery.toLowerCase())
  );

  const handleChapterClick = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const handlePartClick = (partId: string, partTitle: string) => {
    setSelectedPart(partId);
    setSelectedPartForDrawer({ id: partId, title: partTitle });
    setIsSectionsDrawerOpen(true);
  };

  // Use only parsed chapters from the API
  const displayChapters = parsedChapters;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 p-6 space-y-4">
        {/* Logo */}
        <div>
          <Image src={"/logo.png"} alt={"Logo"} width={40} height={40} />
        </div>

        {/* Search Bar */}
        <div className="space-y-3">
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
              className="w-full justify-start text-foreground/70 hover:text-foreground hover:!bg-lightgrey"
            >
              <RotateCw className="w-4 h-4 mr-3" />
              History
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section - Scrollable */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto scrollbar-width">
        {/* Document Selector */}
        {documents.length > 1 && (
          <div className="mb-6">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              Select Document
            </label>
            <select
              value={selectedDocument?.id || ""}
              onChange={(e) => {
                const doc = documents.find((d) => d.id === e.target.value);
                setSelectedDocument(doc || null);
              }}
              className="w-full bg-dark border border-lightgrey text-foreground rounded-md px-3 py-2 text-sm focus:border-yellow-400 focus:outline-none"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Document Structure */}
        <div className="mb-8 pt-6 border-t border-lightgrey">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
            {selectedDocument
              ? `${selectedDocument.title}`
              : "Document Structure"}
          </h3>
          <div className="space-y-2 w-full">
            {displayChapters.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">
                  {!selectedDocument
                    ? "No document selected"
                    : "No chapters found in this document"}
                </p>
              </div>
            ) : (
              displayChapters.map((chapter) => (
                <div key={chapter.id} className="space-y-1">
                  {/* Chapter Header */}
                  <button
                    onClick={() => handleChapterClick(chapter.id)}
                    className={cn(
                      expandedChapters.has(chapter.id) &&
                        "bg-dark border border-lightgrey",
                      "flex flex-row items-center w-full justify-between text-foreground/70 hover:text-foreground hover:bg-lightgrey text-left rounded-md cursor-pointer p-2 group"
                    )}
                  >
                    <div className="flex flex-col w-[13rem]">
                      <span className="text-base text-foreground truncate">
                        {chapter.title}
                      </span>
                      <span className="text-xs font-light truncate capitalize!">
                        {chapter.description}
                      </span>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {expandedChapters.has(chapter.id) ? (
                        <ChevronDown
                          size={16}
                          className="text-muted-foreground group-hover:text-foreground"
                        />
                      ) : (
                        <ChevronRight
                          size={16}
                          className="text-muted-foreground group-hover:text-foreground"
                        />
                      )}
                    </div>
                  </button>

                  {/* Chapter Parts - Only show when expanded */}
                  {expandedChapters.has(chapter.id) && (
                    <div className="ml-3 space-y-1">
                      {chapter.subsections?.map((part) => (
                        <button
                          key={part.id}
                          onClick={() => handlePartClick(part.id, part.title)}
                          className={`flex flex-row items-center w-full justify-between text-left rounded-md cursor-pointer p-2 transition-colors ${
                            selectedPart === part.id
                              ? "bg-dark text-foreground border border-lightgrey"
                              : "text-muted-foreground hover:text-foreground hover:bg-dark"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate">{part.title}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Fixed Footer Section */}
      <div className="w-full flex-shrink-0 p-6 border-t border-lightgrey">
        {/* Light Mode Toggle */}
        <div className="flex flex-row items-center justify-between mb-8">
          <div className="flex flex-row items-center justify-start text-foreground/70 hover:text-foreground hover:bg-lightgrey">
            <Sun className="w-4 h-4 mr-3" />
            <p>Light mode</p>
          </div>
          <Switch
            id={"lightmode"}
            checked={theme === "light"}
            onCheckedChange={(checked) => {
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
        <div className="space-y-6">
          {/* Search Bar */}
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search history..."
              value={historySearchQuery}
              onChange={(e) => setHistorySearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#3a3a3a] border border-[#4a4a4a] rounded-md text-white placeholder:text-gray-400 focus:border-yellow-400 focus:outline-none"
            />
          </div> */}

          {/* History List */}
          <div className="space-y-2">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between p-3 rounded-md hover:bg-lightgrey cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">
                        {item.query}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  {historySearchQuery
                    ? "No matching history found"
                    : "No history yet"}
                </p>
              </div>
            )}
          </div>

          {/* Clear History Button */}
          {filteredHistory.length > 0 && (
            <div className="pt-4 border-t border-lightgrey">
              <button className="cursor-pointer w-full py-2 px-4 text-sm text-gray-400 hover:text-white hover:bg-[#3a3a3a] rounded-md transition-colors">
                Clear All History
              </button>
            </div>
          )}
        </div>
      </GenericDrawer>

      {/* Sections Drawer */}
      <GenericDrawer
        isOpen={isSectionsDrawerOpen}
        onClose={() => {
          setIsSectionsDrawerOpen(false);
          setSelectedPartForDrawer(null);
        }}
        headerStyle="text-sm opacity-50"
        isHeaderArrow={false}
        title={selectedPartForDrawer?.title || "Sections"}
        position="left"
      >
        <div className="space-y-2">
          {selectedPartForDrawer ? (
            getSectionsForPart(selectedPartForDrawer.id).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">
                  No sections found for this part
                </p>
              </div>
            ) : (
              getSectionsForPart(selectedPartForDrawer.id).map(
                (section, index) => {
                  // Extract section number from the section ID (e.g., "section-1" -> "1")
                  const sectionNumberMatch = section.id.match(/section-(\d+)/);
                  const sectionNumber = sectionNumberMatch
                    ? sectionNumberMatch[1]
                    : (index + 1).toString();
                  const sectionTitle = section.title;

                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        if (onSectionSelect && selectedPartForDrawer) {
                          // Find the chapter and part titles
                          const chapter = parsedChapters.find((ch) =>
                            ch.subsections?.some(
                              (sub) => sub.id === selectedPartForDrawer.id
                            )
                          );
                          const part = chapter?.subsections?.find(
                            (sub) => sub.id === selectedPartForDrawer.id
                          );

                          if (chapter && part) {
                            const sections = getSectionsForPart(
                              selectedPartForDrawer.id
                            );
                            onSectionSelect(
                              section,
                              chapter.title,
                              part.title,
                              sections,
                              selectedPartForDrawer.id
                            );
                          }
                        }
                      }}
                      className={cn(
                        "cursor-pointer w-full flex items-center justify-between p-3 rounded-md transition-colors",
                        "text-left hover:bg-lightgrey hover:text-white",
                        "text-gray-300 group"
                      )}
                    >
                      <div className="flex-1 min-w-0 text-sm font-medium">
                        <p className="opacity-50">Section {sectionNumber}</p>
                        <p className="line-clamp-2">{sectionTitle}</p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-gray-400 group-hover:text-white flex-shrink-0 ml-2"
                      />
                    </button>
                  );
                }
              )
            )
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No part selected</p>
            </div>
          )}
        </div>
      </GenericDrawer>
    </div>
  );
};
