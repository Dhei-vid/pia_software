import { useState, useCallback, useMemo } from "react";
import { Document } from "@/api/documents/document-types";
import {
  DocumentParser,
  // ParsedDocument,
  DocumentSection,
} from "@/utils/documentParser";

export const useDocumentParser = (document: Document | null) => {
  const [selectedSection, setSelectedSection] =
    useState<DocumentSection | null>(null);

  const parsedDocument = useMemo(() => {
    if (!document || !document.content) {
      return null;
    }

    return DocumentParser.parseDocumentContent(
      document.id,
      document.title,
      document.content
    );
  }, [document]);

  const getSectionContent = useCallback(
    (sectionTitle: string): string => {
      if (!document?.content) return "";
      return DocumentParser.extractSectionContent(
        document.content,
        sectionTitle
      );
    },
    [document?.content]
  );

  const getSectionByTitle = useCallback(
    (title: string): DocumentSection | null => {
      if (!parsedDocument) return null;
      return DocumentParser.getSectionByTitle(parsedDocument, title);
    },
    [parsedDocument]
  );

  const getSectionsByType = useCallback(
    (type: "chapter" | "part" | "section"): DocumentSection[] => {
      if (!parsedDocument) return [];
      return DocumentParser.getAllSectionsOfType(parsedDocument, type);
    },
    [parsedDocument]
  );

  const getSectionHierarchy = useCallback((): DocumentSection[] => {
    if (!parsedDocument) return [];
    return DocumentParser.getSectionHierarchy(parsedDocument);
  }, [parsedDocument]);

  const selectSection = useCallback((section: DocumentSection) => {
    setSelectedSection(section);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSection(null);
  }, []);

  return {
    parsedDocument,
    selectedSection,
    selectSection,
    clearSelection,
    getSectionContent,
    getSectionByTitle,
    getSectionsByType,
    getSectionHierarchy,
    // Convenience getters
    chapters: parsedDocument?.chapters || [],
    parts: parsedDocument?.parts || [],
    sections: parsedDocument?.sections || [],
    hierarchy: getSectionHierarchy(),
  };
};
