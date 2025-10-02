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

    console.log("Document content length:", document.content.length);
    console.log("Document content preview:", document.content.substring(0, 500));
    
    const parsed = DocumentParser.parseDocumentContent(
      document.id,
      document.title,
      document.content
    );
    
    console.log("Parsed document sections count:", parsed.sections.length);
    console.log("Parsed document chapters count:", parsed.chapters.length);
    console.log("Parsed document parts count:", parsed.parts.length);
    
    // Get detailed statistics
    const stats = DocumentParser.getDocumentStatistics(parsed);
    console.log("Document Statistics:", stats);
    console.log("Section Distribution by Part:", stats.sectionDistribution);
    
    // Validate structure
    const validation = DocumentParser.validateDocumentStructure(parsed);
    console.log("Structure Validation:", validation);
    
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
    // Convenience getters
    chapters: parsedDocument?.chapters || [],
    parts: parsedDocument?.parts || [],
    sections: parsedDocument?.sections || [],
    hierarchy: getSectionHierarchy(),
  };
};
