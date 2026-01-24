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
import { DocumentContent } from "@/api/documents/document-types";
import { DocumentSection } from "@/api/documents/document-types";

interface NewTableOfContentProps {
  onSectionSelect?: (
    section: DocumentSection,
    chapterTitle: string,
    partTitle: string,
    sections: DocumentSection[],
    partId: string
  ) => void;
}

const NewTableOfContent: FC<NewTableOfContentProps> = ({ onSectionSelect }) => {
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

  if (!document) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Document Table of Content Not Found
        </p>
      </div>
    );
  }

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
        {document?.chapters.map((chapter, index) => {
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
        })}
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
  const getSelectedPart = (selectedPart: string, document: DocumentContent) => {
    for (const chapter of document?.chapters ?? []) {
      const found = chapter.parts.find((part) => part.id === selectedPart);
      if (found) {
        return found;
      }
    }
    return null;
  };

  const partSection = getSelectedPart(selectedPart, document);

  // router.push(
  //   `/chat/doc?sectionId=${selectedPart.id}&partId=${partId}&chapterTitle=${encodeURIComponent(chapterTitle)}&partTitle=${encodeURIComponent(partTitle)}&sectionTitle=${encodeURIComponent(section.title)}`
  // );

  return (
    <div className="flex flex-col space-y-3">
      {partSection &&
        partSection.sections.map((section, index) => (
          <button
            key={index}
            onClick={() => router.push(`/chat/doc?sectionId=${section?.id}`)}
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
