"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import DocumentViewer from "@/components/general/document-viewer";
import LoadingSpinner from "@/components/ui/loading";
import { DocumentService } from "@/api/documents/document";
import { DocumentContent } from "@/api/documents/document-types";
import useAuth from "@/hooks/useAuth";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionId = searchParams.get("sectionId");
  const partId = searchParams.get("partId");
  const chapterTitle = searchParams.get("chapterTitle");
  const partTitle = searchParams.get("partTitle");
  const sectionTitle = searchParams.get("sectionTitle");
  const { user } = useAuth();

  const [documentContent, setDocumentContent] =
    useState<DocumentContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch document content
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.documentId) return;

      try {
        setIsLoading(true);
        const contentResponse = await DocumentService.getAllDocumentContent(
          user.documentId,
          "structured"
        );

        if (contentResponse.success && contentResponse.data?.content) {
          setDocumentContent(contentResponse.data.content);
        }
      } catch (error) {
        console.error("Error fetching document content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.documentId]);

  // Find the selected section, chapter, and part from document content
  const { part, currentSectionIndex, totalSections } = useMemo(() => {
    if (!documentContent || !sectionId) {
      return {
        part: null,
        currentSectionIndex: 0,
        totalSections: 0,
      };
    }

    // Search through chapters -> parts -> sections
    for (const chapterItem of documentContent.chapters) {
      for (const partItem of chapterItem.parts) {
        if (partId && partItem.id !== partId) continue;

        const section = partItem.sections.find((s) => s.id === sectionId);
        if (section) {
          const index = partItem.sections.findIndex((s) => s.id === sectionId);
          return {
            part: partItem,
            currentSectionIndex: index >= 0 ? index : 0,
            totalSections: partItem.sections.length,
          };
        }
      }
    }

    return {
      part: null,
      currentSectionIndex: 0,
      totalSections: 0,
    };
  }, [documentContent, sectionId, partId]);

  // Get previous and next section info
  const {
    previousSectionTitle,
    nextSectionTitle,
    previousSectionNumber,
    nextSectionNumber,
  } = useMemo(() => {
    if (!part || part.sections.length === 0) {
      return {
        previousSectionTitle: "",
        nextSectionTitle: "",
        previousSectionNumber: 0,
        nextSectionNumber: 0,
      };
    }

    const previousSection =
      currentSectionIndex > 0 ? part.sections[currentSectionIndex - 1] : null;
    const nextSection =
      currentSectionIndex < part.sections.length - 1
        ? part.sections[currentSectionIndex + 1]
        : null;

    return {
      previousSectionTitle: previousSection?.sectionTitle || "",
      nextSectionTitle: nextSection?.sectionTitle || "",
      previousSectionNumber: previousSection?.sectionNumber || 0,
      nextSectionNumber: nextSection?.sectionNumber || 0,
    };
  }, [part, currentSectionIndex]);

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0 && partId && part) {
      const newSection = part.sections[currentSectionIndex - 1];
      router.push(`/chat/doc?sectionId=${newSection.id}&partId=${partId}`);
    }
  };

  const handleNextSection = () => {
    if (currentSectionIndex < part!.sections.length - 1 && partId && part) {
      const newSection = part.sections[currentSectionIndex + 1];
      router.push(`/chat/doc?sectionId=${newSection.id}&partId=${partId}`);
    }
  };

  // Show loading state while fetching document
  if (isLoading || (sectionId && !documentContent)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <p className="text-gray-400">Loading document...</p>
        </div>
      </div>
    );
  }


  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => router.push("/chat")}
        className="cursor-pointer flex items-center text-sm space-x-2 text-gray-300 hover:text-white transition-colors mb-6 rounded-md border p-2"
      >
        <ChevronLeft size={18} />
        <span>Back to Chat</span>
      </button>

      <DocumentViewer
        documentContent={documentContent}
        sectionId={sectionId}
        partId={partId}
        chapterTitle={chapterTitle}
        partTitle={partTitle}
        sectionTitle={sectionTitle}
        previousSectionTitle={previousSectionTitle}
        nextSectionTitle={nextSectionTitle}
        previousSectionNumber={previousSectionNumber}
        nextSectionNumber={nextSectionNumber}
        currentSectionIndex={currentSectionIndex}
        totalSections={totalSections}
        onPreviousSection={handlePreviousSection}
        onNextSection={handleNextSection}
        onSearch={() => {}}
        searchQuery=""
        setSearchQuery={() => {}}
      />
    </div>
  );
}
