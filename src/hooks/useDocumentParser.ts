import { useState, useCallback, useMemo } from "react";
import { Document } from "@/api/documents/document-types";
import { DocumentParser, DocumentSection } from "@/utils/documentParser";

export const useDocumentParser = (document: Document | null) => {
  const [selectedSection, setSelectedSection] =
    useState<DocumentSection | null>(null);

  const parsedDocument = useMemo(() => {
    if (!document || !document.content) {
      return null;
    }

    const parsed = DocumentParser.parseDocumentContent(
      document.id,
      document.title,
      document.content
    );

    return parsed;
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

  const getSectionsForPart = useCallback(
    (partId: string): DocumentSection[] => {
      if (!parsedDocument) return [];
      return DocumentParser.getSectionsForPart(parsedDocument, partId);
    },
    [parsedDocument]
  );

  const validateStructure = useCallback(() => {
    if (!parsedDocument) return { isValid: true, issues: [] };
    return DocumentParser.validateDocumentStructure(parsedDocument);
  }, [parsedDocument]);

  const getDocumentStatistics = useCallback(() => {
    if (!parsedDocument) return null;
    return DocumentParser.getDocumentStatistics(parsedDocument);
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
    getSectionsForPart,
    validateStructure,
    getDocumentStatistics,
    chapters: parsedDocument?.chapters || [],
    parts: parsedDocument?.parts || [],
    sections: parsedDocument?.sections || [],
    hierarchy: getSectionHierarchy(),
  };
};
