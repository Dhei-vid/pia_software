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
import HistoryList from "../sidebar-items/history";

import { Document, HistoryData } from "@/api/documents/document-types";
import { DocumentService } from "@/api/documents/document";
import { useDocumentParser } from "@/hooks/useDocumentParser";
import { DocumentSection } from "@/utils/documentParser";
import { useTheme } from "@/contexts/ThemeContext";
import useAuth from "@/hooks/useAuth";
import { extractErrorMessage } from "@/common/helpers";

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
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  ); // Start with no chapters expanded
  const [selectedPart, setSelectedPart] = useState<string>(""); // Start with no part selected
  const [isSectionsDrawerOpen, setIsSectionsDrawerOpen] = useState(false);
  const [selectedPartForDrawer, setSelectedPartForDrawer] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [query, setQuery] = useState<HistoryData>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  // Get document
  useEffect(() => {
    const fetchDocument = async () => {
      if (!user) return;

      const [documentData] = await Promise.all([
        DocumentService.getAllDocuments(),
      ]);

      // Checking Document validity
      const docs = Array.isArray(documentData.documents)
        ? documentData.documents
        : [];

      setDocuments(docs);

      // Set the first document as selected by default
      if (docs.length > 0) {
        setSelectedDocument(docs[0]);
      }
    };

    fetchDocument();
  }, [user]);

  // Fetch history when drawer opens
  useEffect(() => {
    const fetchHistory = async () => {
      if (!isHistoryOpen) return;

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

  // Use document parser for the selected document
  const {
    chapters: parsedChapters,
    getSectionsForPart,
    getSectionByTitle,
  } = useDocumentParser(selectedDocument);

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

  // Use only parsed chapters from the parser
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
                      {chapter.subsections?.map((part, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            handlePartClick(part.id, part.title);
                          }}
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

      {/* Sections Drawer */}
      <GenericDrawer
        isOpen={isSectionsDrawerOpen}
        onClose={() => {
          setIsSectionsDrawerOpen(false);
          setSelectedPartForDrawer(null);
        }}
        headerStyle="text-sm"
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
                  // Extract section number from the section ID (e.g., "ch1-pt1-s1" -> "1")
                  const sectionNumberMatch = section.id.match(/s(\d+)$/);
                  const sectionNumber = sectionNumberMatch
                    ? sectionNumberMatch[1]
                    : (index + 1).toString();
                  const sectionTitle = section.title;

                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        if (onSectionSelect && selectedPartForDrawer) {
                          // Find the chapter and part titles from parsed chapters
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

                            console.log("Section ", section);
                            onSectionSelect(
                              section,
                              chapter!.description ?? "",
                              part!.description ?? "",
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
                        <p className="opacity-50 text-muted-foreground">
                          Section {sectionNumber}
                        </p>
                        <p className="line-clamp-2 text-foreground">
                          {sectionTitle}
                        </p>
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
