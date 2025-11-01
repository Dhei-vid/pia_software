"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import DocumentViewer from "@/components/general/document-viewer";
import LoadingSpinner from "@/components/ui/loading";
import { Document } from "@/api/documents/document-types";
import { DocumentService } from "@/api/documents/document";
import { useDocumentParser } from "@/hooks/useDocumentParser";
import { DocumentSection } from "@/utils/documentParser";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionId = searchParams.get("sectionId");
  const partId = searchParams.get("partId");

  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSection, setSelectedSection] =
    useState<DocumentSection | null>(null);
  const [chapterTitle, setChapterTitle] = useState<string>("");
  const [partTitle, setPartTitle] = useState<string>("");
  const [currentPartSections, setCurrentPartSections] = useState<
    DocumentSection[]
  >([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);

  const {
    parsedDocument,
    chapters: parsedChapters,
    parts: parsedParts,
    getSectionsForPart,
  } = useDocumentParser(document);

  // Fetch document
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        const response = await DocumentService.getAllDocuments();
        const docs = Array.isArray(response.documents)
          ? response.documents
          : [];
        // Use the first document as default
        if (docs.length > 0) {
          setDocument(docs[0]);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, []);

  // Find and set the selected section when sectionId or parsedDocument changes
  useEffect(() => {
    if (!parsedDocument || !sectionId) {
      return;
    }

    // Find the section by ID
    const section = parsedDocument.sections.find((s) => s.id === sectionId);
    if (!section) {
      console.warn("Section not found:", sectionId);
      return;
    }

    setSelectedSection(section);

    // Find the part that contains this section
    let part = null;
    if (partId) {
      // First try to find by partId directly
      part = parsedParts.find((p) => p.id === partId);
      
      // If not found, look for it in chapters
      if (!part) {
        for (const chapter of parsedChapters) {
          const foundPart = chapter.subsections?.find((sub) => sub.id === partId);
          if (foundPart) {
            part = foundPart;
            setChapterTitle(chapter.title);
            break;
          }
        }
      } else {
        // Find the chapter containing this part
        const chapter = parsedChapters.find((ch) =>
          ch.subsections?.some((sub) => sub.id === partId)
        );
        if (chapter) {
          setChapterTitle(chapter.title);
        }
      }
    } else {
      // Fallback: find part by section's parentId
      const foundPart = parsedParts.find((p) => p.id === section.parentId);
      if (foundPart) {
        part = foundPart;
        // Find the chapter containing this part
        const chapter = parsedChapters.find((ch) =>
          ch.subsections?.some((sub) => sub.id === foundPart.id)
        );
        if (chapter) {
          setChapterTitle(chapter.title);
        }
      }
    }

    if (part) {
      const sections = getSectionsForPart(part.id);
      setCurrentPartSections(sections);
      const index = sections.findIndex((s) => s.id === sectionId);
      setCurrentSectionIndex(index >= 0 ? index : 0);
      setPartTitle(part.title);
    } else {
      // Fallback: if part not found, try to find sections with same parentId
      const sections = parsedDocument.sections.filter(
        (s) => s.type === "section" && s.parentId === section.parentId
      );
      setCurrentPartSections(sections);
      const index = sections.findIndex((s) => s.id === sectionId);
      setCurrentSectionIndex(index >= 0 ? index : 0);
      
      // Try to find chapter and part from parentId
      const chapter = parsedChapters.find((ch) => ch.id === section.parentId);
      if (chapter) {
        setChapterTitle(chapter.title);
      } else {
        const foundPart = parsedParts.find((p) => p.id === section.parentId);
        if (foundPart) {
          setPartTitle(foundPart.title);
          const parentChapter = parsedChapters.find((ch) =>
            ch.subsections?.some((sub) => sub.id === foundPart.id)
          );
          if (parentChapter) {
            setChapterTitle(parentChapter.title);
          }
        }
      }
    }
  }, [
    parsedDocument,
    sectionId,
    partId,
    parsedChapters,
    parsedParts,
    getSectionsForPart,
  ]);

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0 && partId) {
      const newIndex = currentSectionIndex - 1;
      const newSection = currentPartSections[newIndex];
      setCurrentSectionIndex(newIndex);
      setSelectedSection(newSection);
      // Update URL
      router.push(`/chat/doc?sectionId=${newSection.id}&partId=${partId}`);
    }
  };

  const handleNextSection = () => {
    if (
      currentSectionIndex < currentPartSections.length - 1 &&
      partId
    ) {
      const newIndex = currentSectionIndex + 1;
      const newSection = currentPartSections[newIndex];
      setCurrentSectionIndex(newIndex);
      setSelectedSection(newSection);
      // Update URL
      router.push(`/chat/doc?sectionId=${newSection.id}&partId=${partId}`);
    }
  };

  // Show loading state while fetching document
  if (isLoading || (sectionId && !parsedDocument)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <p className="text-gray-400">Loading document...</p>
        </div>
      </div>
    );
  }

  // If no section is selected, show the default page
  if (!sectionId) {
    return (
      <>
        {/* Back Button */}
        <button
          onClick={() => router.push("/chat")}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft size={20} />
          <span>Back to Chat</span>
        </button>

        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-3xl font-serif text-white mb-2">
            Documents
          </h1>
          <p className="text-gray-400">View and manage your documents</p>
        </div>

        <div className="space-y-6">
          <div className="bg-dark border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Recent Documents
            </h2>
            <p className="text-gray-400">Your documents will appear here</p>
          </div>
        </div>
      </>
    );
  }

  // If sectionId exists but section not found yet, try to find it directly
  if (sectionId && parsedDocument && !selectedSection) {
    const section = parsedDocument.sections.find((s) => s.id === sectionId);
    if (section) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <p className="text-gray-400">Loading section...</p>
          </div>
        </div>
      );
    } else {
      // Section doesn't exist in document - show error
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-400 mb-2">Section not found: {sectionId}</p>
            <p className="text-xs text-gray-500 mb-4">
              Available sections: {parsedDocument.sections.slice(0, 5).map((s) => s.id).join(", ")}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => router.push("/chat/doc")}
                className="text-blue-400 hover:text-blue-300 mr-4"
              >
                Go back to documents
              </button>
              <button
                onClick={() => router.push("/chat")}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ChevronLeft size={16} />
                <span>Back to Chat</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Show DocumentViewer when a section is selected
  if (!selectedSection) {
    return null;
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => router.push("/chat")}
        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-6"
      >
        <ChevronLeft size={20} />
        <span>Back to Chat</span>
      </button>

      <DocumentViewer
      selectedSection={selectedSection}
      chapterTitle={chapterTitle}
      partTitle={partTitle}
      previousSectionTitle={
        currentSectionIndex > 0
          ? currentPartSections[currentSectionIndex - 1].title
          : ""
      }
      nextSectionTitle={
        currentSectionIndex < currentPartSections.length - 1
          ? currentPartSections[currentSectionIndex + 1].title
          : ""
      }
      previousSectionNumber={
        currentSectionIndex > 0
          ? parseInt(
              currentPartSections[currentSectionIndex - 1].id.replace(
                "section-",
                ""
              )
            )
          : 0
      }
      nextSectionNumber={
        currentSectionIndex < currentPartSections.length - 1
          ? parseInt(
              currentPartSections[currentSectionIndex + 1].id.replace(
                "section-",
                ""
              )
            )
          : 0
      }
      currentSectionIndex={currentSectionIndex}
      totalSections={currentPartSections.length}
      onPreviousSection={handlePreviousSection}
      onNextSection={handleNextSection}
      onSearch={() => {}}
      searchQuery=""
      setSearchQuery={() => {}}
      />
    </div>
  );
}
