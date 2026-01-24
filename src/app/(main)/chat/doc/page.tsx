"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import DocumentViewer from "@/components/general/document-viewer";
import LoadingSpinner from "@/components/ui/loading";
import { DocumentService } from "@/api/documents/document";
import {
  DocumentContent,
  DocumentChapter,
  DocumentSection,
} from "@/api/documents/document-types";
import useAuth from "@/hooks/useAuth";

/**
 * Resolve a section and its context safely
 */
function resolveSectionContext(
  chapters: DocumentChapter[] | null | undefined,
  sectionId: string | null
): {
  part: DocumentChapter["parts"][number];
  sectionIndex: number;
  totalSections: number;
} | null {
  if (!sectionId || !Array.isArray(chapters)) return null;

  for (const chapter of chapters) {
    if (!Array.isArray(chapter?.parts)) continue;

    for (const part of chapter.parts) {
      if (!Array.isArray(part?.sections)) continue;

      const index = part.sections.findIndex((s) => s?.id === sectionId);

      if (index !== -1) {
        return {
          part,
          sectionIndex: index,
          totalSections: part.sections.length,
        };
      }
    }
  }

  return null;
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionId = searchParams.get("sectionId");
  const { user } = useAuth();

  const [documentContent, setDocumentContent] =
    useState<DocumentContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch document content
   */
  useEffect(() => {
    if (!user?.documentId) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await DocumentService.getAllDocumentContent(
          user.documentId,
          "structured"
        );

        if (isMounted && response.success && response.data?.content) {
          setDocumentContent(response.data.content);
        }
      } catch (error) {
        console.error("Error fetching document content:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user?.documentId]);

  /**
   * Resolve section context
   */
  const resolved = useMemo(
    () => resolveSectionContext(documentContent?.chapters, sectionId),
    [documentContent?.chapters, sectionId]
  );

  console.log("Resolved ", resolved);

  const part = resolved?.part ?? null;
  const currentSectionIndex = resolved?.sectionIndex ?? 0;
  const totalSections = resolved?.totalSections ?? 0;

  /**
   * Previous / next section metadata
   */
  const {
    previousSectionTitle,
    nextSectionTitle,
    previousSectionNumber,
    nextSectionNumber,
  } = useMemo(() => {
    if (!part || !Array.isArray(part.sections)) {
      return {
        previousSectionTitle: "",
        nextSectionTitle: "",
        previousSectionNumber: 0,
        nextSectionNumber: 0,
      };
    }

    const prev =
      currentSectionIndex > 0 ? part.sections[currentSectionIndex - 1] : null;

    const next =
      currentSectionIndex < part.sections.length - 1
        ? part.sections[currentSectionIndex + 1]
        : null;

    return {
      previousSectionTitle: prev?.sectionTitle ?? "",
      nextSectionTitle: next?.sectionTitle ?? "",
      previousSectionNumber: prev?.sectionNumber ?? 0,
      nextSectionNumber: next?.sectionNumber ?? 0,
    };
  }, [part, currentSectionIndex]);

  /**
   * Navigation handlers
   */
  const handlePreviousSection = () => {
    if (!part || currentSectionIndex <= 0) return;

    const target = part.sections[currentSectionIndex - 1];
    if (target?.id) {
      router.push(`/chat/doc?sectionId=${target.id}`);
    }
  };

  const handleNextSection = () => {
    if (!part || currentSectionIndex >= part.sections.length - 1) return;

    const target = part.sections[currentSectionIndex + 1];
    if (target?.id) {
      router.push(`/chat/doc?sectionId=${target.id}`);
    }
  };

  /**
   * Loading state
   */
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
        // chapterTitle={chapterTitle}
        // partTitle={partTitle}
        // sectionTitle={sectionTitle}
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
