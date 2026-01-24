"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

import useAuth from "@/hooks/useAuth";
// import { TOC } from "@/api/documents/document-types";
import { GenericDrawer } from "@/components/ui/generic-drawer";
import { keepLettersAndSpaces } from "@/common/helpers";

import { DocumentService } from "@/api/documents/document";
import { DocumentContent, DocumentChapter } from "@/api/documents/document-types";
import { DocumentSection } from "@/api/documents/document-types";

interface NewTableOfContentProps {
  searchQuery?: string;
  onSectionSelect?: (
    section: DocumentSection,
    chapterTitle: string,
    partTitle: string,
    sections: DocumentSection[],
    partId: string
  ) => void;
}

const NewTableOfContent: FC<NewTableOfContentProps> = ({ searchQuery = "", onSectionSelect }) => {
  const { user } = useAuth();
  const [document, setDocument] = useState<DocumentContent | null>(null);

  const [selectedPart, setSelectedPart] = useState<string>("");
  const [isSectionsDrawerOpen, setIsSectionsDrawerOpen] =
    useState<boolean>(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  );
  const [selectedPartForDrawer, setSelectedPartForDrawer] = useState<{
    id: string;
    title: string;
    number: number;
  } | null>(null);

  // Calling the TOC
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const response = await DocumentService.getAllDocumentContent(
        user?.documentId,
        "structured"
      );
      setDocument(response.data.content);
    };

    fetchData();
  }, [user]);

  // Handle chapter toggle
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

  // Handle parts click
  const handlePartClick = (
    partId: string,
    partTitle: string,
    partNumber: number
  ) => {
    setSelectedPart(partId);
    setSelectedPartForDrawer({
      id: partId,
      title: partTitle,
      number: partNumber,
    });
    setIsSectionsDrawerOpen(true);
  };

  // Filter chapters and parts based on search query
  const filterChapters = (): DocumentChapter[] => {
    if (!document?.chapters) return [];
    
    const query = searchQuery.toLowerCase().trim();
    if (!query) return document.chapters;

    // Extract chapter/part number from query if it's a specific search
    const chapterMatch = query.match(/^chapter\s*(\d+)$/);
    const partMatch = query.match(/^part\s*(\d+)$/);
    const targetChapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : null;
    const targetPartNumber = partMatch ? parseInt(partMatch[1], 10) : null;

    const filtered: DocumentChapter[] = [];
    
    document.chapters.forEach((chapter) => {
      // Check chapter matching: title, number, and formatted display string "chapter {number} - {title}"
      const chapterTitleMatch = chapter.chapterTitle.toLowerCase().includes(query);
      const chapterNumberStr = chapter.chapterNumber.toString();
      
      // If query is specifically "chapter X", only match exact number
      let chapterNumberMatch = false;
      if (targetChapterNumber !== null) {
        chapterNumberMatch = chapter.chapterNumber === targetChapterNumber;
      } else {
        // For other queries, check if it's just a number or contains the number
        chapterNumberMatch = chapterNumberStr === query;
      }
      
      // Check formatted string like "chapter 1 - Title" (case-insensitive)
      const formattedChapterString = `chapter ${chapter.chapterNumber} - ${chapter.chapterTitle}`.toLowerCase();
      const formattedChapterStringMatch = formattedChapterString.includes(query);
      // Also check if query is just "chapter 1" or "chapter1"
      const chapterQueryMatch = query === `chapter ${chapterNumberStr}` || query === `chapter${chapterNumberStr}`;
      
      const chapterMatches = chapterTitleMatch || chapterNumberMatch || formattedChapterStringMatch || chapterQueryMatch;
      
      // Filter parts that match the query
      // Check: part title, part number, and formatted display string "PART {number} - {title}"
      const matchingParts = chapter.parts.filter((part) => {
        const partTitleMatch = part.partTitle.toLowerCase().includes(query);
        const partNumberStr = part.partNumber.toString();
        
        // If query is specifically "part X", only match exact number
        let partNumberMatch = false;
        if (targetPartNumber !== null) {
          partNumberMatch = part.partNumber === targetPartNumber;
        } else {
          // For other queries, check if it's just a number
          partNumberMatch = partNumberStr === query;
        }
        
        // Check formatted string like "PART 2 - Title" (case-insensitive)
        const formattedPartString = `part ${part.partNumber} - ${part.partTitle}`.toLowerCase();
        const formattedPartStringMatch = formattedPartString.includes(query);
        // Also check if query is just "part 2" or "part2"
        const partQueryMatch = query === `part ${partNumberStr}` || query === `part${partNumberStr}`;
        
        return partTitleMatch || partNumberMatch || formattedPartStringMatch || partQueryMatch;
      });

      // Show chapter if chapter matches or if any part matches
      if (chapterMatches || matchingParts.length > 0) {
        filtered.push({
          ...chapter,
          parts: chapterMatches ? chapter.parts : matchingParts,
        });
      }
    });
    
    return filtered;
  };

  // Auto-expand chapters that have matching parts when searching
  useEffect(() => {
    if (searchQuery.trim() && document) {
      const query = searchQuery.toLowerCase().trim();
      const chaptersToExpand = new Set<string>();
      
      // Extract chapter/part number from query if it's a specific search
      const chapterMatch = query.match(/^chapter\s*(\d+)$/);
      const partMatch = query.match(/^part\s*(\d+)$/);
      const targetChapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : null;
      const targetPartNumber = partMatch ? parseInt(partMatch[1], 10) : null;
      
      document.chapters.forEach((chapter) => {
        // Check if chapter matches
        const chapterTitleMatch = chapter.chapterTitle.toLowerCase().includes(query);
        const chapterNumberStr = chapter.chapterNumber.toString();
        
        let chapterNumberMatch = false;
        if (targetChapterNumber !== null) {
          chapterNumberMatch = chapter.chapterNumber === targetChapterNumber;
        } else {
          chapterNumberMatch = chapterNumberStr === query;
        }
        
        const formattedChapterString = `chapter ${chapter.chapterNumber} - ${chapter.chapterTitle}`.toLowerCase();
        const formattedChapterStringMatch = formattedChapterString.includes(query);
        const chapterQueryMatch = query === `chapter ${chapterNumberStr}` || query === `chapter${chapterNumberStr}`;
        const chapterMatches = chapterTitleMatch || chapterNumberMatch || formattedChapterStringMatch || chapterQueryMatch;
        
        // Check if any part matches
        const hasMatchingPart = chapter.parts.some((part) => {
          const partTitleMatch = part.partTitle.toLowerCase().includes(query);
          const partNumberStr = part.partNumber.toString();
          
          let partNumberMatch = false;
          if (targetPartNumber !== null) {
            partNumberMatch = part.partNumber === targetPartNumber;
          } else {
            partNumberMatch = partNumberStr === query;
          }
          
          const formattedPartString = `part ${part.partNumber} - ${part.partTitle}`.toLowerCase();
          const formattedPartStringMatch = formattedPartString.includes(query);
          const partQueryMatch = query === `part ${partNumberStr}` || query === `part${partNumberStr}`;
          
          return partTitleMatch || partNumberMatch || formattedPartStringMatch || partQueryMatch;
        });
        
        if (chapterMatches || hasMatchingPart) {
          chaptersToExpand.add(chapter.id);
        }
      });
      
      setExpandedChapters(chaptersToExpand);
    } else if (!searchQuery.trim()) {
      // Reset to no expanded chapters when search is cleared
      setExpandedChapters(new Set());
    }
  }, [searchQuery, document]);

  if (!document) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Document Table of Content Not Found
        </p>
      </div>
    );
  }

  const filteredChapters = filterChapters();

  return (
    <div className="space-y-2 flex-1 px-6 pb-6 overflow-y-auto scrollbar-width">
      {/* Table of Content Title */}
      <div className="px-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
          {document?.title}
        </p>
      </div>
      {/* Document TOC */}
      <div className="space-y-1">
        {filteredChapters.length > 0 ? (
          filteredChapters.map((chapter, index) => {
          return (
            <div key={index} className="space-y-1">
              <button
                onClick={() => {
                  handleChapterClick(chapter?.id);
                }}
                className={cn(
                  expandedChapters.has(chapter.id) ? "bg-lightgrey" : "",
                  "flex flex-row items-center w-full justify-between text-foreground/70 hover:text-foreground hover:bg-lightgrey text-left rounded-md cursor-pointer p-2 group"
                )}
              >
                <div className="flex flex-col w-[13rem]">
                  <span className="uppercase text-sm text-foreground truncate">
                    chapter {chapter?.chapterNumber}
                  </span>
                  <span className="text-xs font-light truncate capitalize">
                    {chapter?.chapterTitle}
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

              {/* expanded parts */}
              {expandedChapters.has(chapter.id) && (
                <div className="ml-3 space-y-1">
                  {chapter?.parts.map((part, index) => {
                    return (
                      <div key={index}>
                        <button
                          onClick={() =>
                            handlePartClick(
                              part.id,
                              part.partTitle,
                              part.partNumber
                            )
                          }
                          className={cn(
                            selectedPart === part.id
                              ? "bg-dark border border-lightgrey"
                              : "hover:bg-dark",
                            "rounded-md cursor-pointer py-3 p-2 transition-colors text-xs text-left text-muted-foreground w-full"
                          )}
                        >
                          PART {part.partNumber} - {part.partTitle}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })) : (
          <div className="px-2 py-4">
            <p className="text-xs text-muted-foreground text-center">
              No chapters or parts found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>
      {/* Document sections Drawer */}
      <GenericDrawer
        isOpen={isSectionsDrawerOpen}
        onClose={() => {
          setIsSectionsDrawerOpen(false);
          setSelectedPartForDrawer(null);
        }}
        headerStyle="text-xs"
        isHeaderArrow={true}
        title={`Part ${selectedPartForDrawer?.number} - ${
          selectedPartForDrawer?.title || "Sections"
        }`}
        position="left"
      >
        <DocumentPart selectedPart={selectedPart} document={document} />
      </GenericDrawer>
    </div>
  );
};

export default NewTableOfContent;

interface IDocumentPart {
  selectedPart: string;
  document: DocumentContent;
}

const DocumentPart: FC<IDocumentPart> = ({ selectedPart, document }) => {
  const router = useRouter();

  const getSelectedPartWithChapter = (selectedPart: string, document: DocumentContent) => {
    for (const chapter of document?.chapters ?? []) {
      const found = chapter.parts.find((part) => part.id === selectedPart);
      if (found) {
        return {
          part: found,
          chapter: chapter,
        };
      }
    }
    return null;
  };

  const partData = getSelectedPartWithChapter(selectedPart, document);

  return (
    <div className="flex flex-col space-y-3">
      {partData &&
        partData.part.sections.map((section, index) => (
          <button
            key={index}
            onClick={() => router.push(`/chat/doc?sectionId=${section?.id}&partTitle=${encodeURIComponent(partData.part.partTitle)}&chapterTitle=${encodeURIComponent(partData.chapter.chapterTitle)}`)}
            className="cursor-pointer text-left hover:bg-lightgrey w-full space-y-1 p-2 rounded-md transition-colors"
          >
            <p className="text-xs text-muted-foreground">
              Section {section?.sectionNumber}
            </p>
            <p className="text-xs text-foreground line-clamp-1">
              {keepLettersAndSpaces(section?.sectionTitle)}
            </p>
          </button>
        ))}
    </div>
  );
};
