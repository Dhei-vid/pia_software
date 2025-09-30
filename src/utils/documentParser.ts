export interface DocumentSection {
  id: string;
  title: string;
  type: "chapter" | "part" | "section";
  level: number;
  content?: string;
  subsections?: DocumentSection[];
  parentId?: string;
  description?: string;
  isExpanded?: boolean;
  isSelected?: boolean;
}

export interface ParsedDocument {
  id: string;
  title: string;
  sections: DocumentSection[];
  chapters: DocumentSection[];
  parts: DocumentSection[];
}

export class DocumentParser {
  private static parseChapterAndPartPattern =
    /^(CHAPTER\s+\d+[—\-]\w+.*?|PART\s+[IVX]+[—\-].*?)$/gim;
  private static parseSectionPattern = /^(\d+\.\s+.*?)$/gim;

  static parseDocumentContent(
    documentId: string,
    title: string,
    content: string
  ): ParsedDocument {
    const lines = content.split("\n");
    const sections: DocumentSection[] = [];
    const chapters: DocumentSection[] = [];
    const parts: DocumentSection[] = [];

    let currentChapter: DocumentSection | null = null;
    let currentPart: DocumentSection | null = null;
    let sectionCounter = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue;

      // Parse CHAPTER
      if (line.match(/^CHAPTER\s+\d+[—\-]/i)) {
        const chapterId = `chapter-${chapters.length + 1}`;
        const chapterNumber = chapters.length + 1;
        const chapterTitle = line.replace(/^CHAPTER\s+\d+[—\-]\s*/i, "");
        currentChapter = {
          id: chapterId,
          title: `Chapter ${chapterNumber}`,
          type: "chapter",
          level: 1,
          content: line,
          subsections: [],
          parentId: undefined,
          description: chapterTitle, // Use the actual chapter title as description
          isExpanded: false,
          isSelected: false,
        };
        chapters.push(currentChapter);
        sections.push(currentChapter);
        currentPart = null; // Reset current part when new chapter starts
      }

      // Parse PART
      else if (line.match(/^PART\s+[IVX]+[—\-]/i)) {
        const partId = `part-${parts.length + 1}`;
        const partTitle = line.replace(/^PART\s+[IVX]+[—\-]\s*/i, "");
        currentPart = {
          id: partId,
          title: line,
          type: "part",
          level: 2,
          content: line,
          subsections: [],
          parentId: currentChapter?.id,
          description: `Part provisions and regulations`,
          isExpanded: false,
          isSelected: false,
        };
        parts.push(currentPart);
        sections.push(currentPart);

        // Add to current chapter's subsections if exists
        if (currentChapter) {
          currentChapter.subsections = currentChapter.subsections || [];
          currentChapter.subsections.push(currentPart);
        }
      }

      // Parse SECTION (numbered sections like "1. Vesting of Petroleum.")
      // Note: We're not adding numbered sections to the navigation structure
      // They will only be used for content extraction when needed
      else if (line.match(/^\d+\.\s+/)) {
        sectionCounter++;
        const sectionId = `section-${sectionCounter}`;
        const section: DocumentSection = {
          id: sectionId,
          title: line.replace(/^\d+\.\s+/, ""),
          type: "section",
          level: 3,
          content: line,
          subsections: [],
          parentId: currentPart?.id || currentChapter?.id,
        };
        sections.push(section);

        // Don't add numbered sections to chapter/part subsections for navigation
        // They will be available for content search but not shown in the sidebar
      }
    }

    return {
      id: documentId,
      title,
      sections,
      chapters,
      parts,
    };
  }

  static extractSectionContent(content: string, sectionTitle: string): string {
    const lines = content.split("\n");
    let inSection = false;
    const sectionContent: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Check if we're entering the target section
      if (trimmedLine.includes(sectionTitle)) {
        inSection = true;
        sectionContent.push(line);
        continue;
      }

      // Check if we're exiting the section (hit another section/chapter/part)
      if (
        inSection &&
        (trimmedLine.match(/^CHAPTER\s+\d+[—\-]/i) ||
          trimmedLine.match(/^PART\s+[IVX]+[—\-]/i) ||
          trimmedLine.match(/^\d+\.\s+/) ||
          trimmedLine.match(/^ARRANGEMENT OF SECTIONS/i))
      ) {
        break;
      }

      if (inSection) {
        sectionContent.push(line);
      }
    }

    return sectionContent.join("\n");
  }

  static getSectionByTitle(
    parsedDocument: ParsedDocument,
    title: string
  ): DocumentSection | null {
    return (
      parsedDocument.sections.find(
        (section) =>
          section.title.toLowerCase().includes(title.toLowerCase()) ||
          section.content?.toLowerCase().includes(title.toLowerCase())
      ) || null
    );
  }

  static getAllSectionsOfType(
    parsedDocument: ParsedDocument,
    type: "chapter" | "part" | "section"
  ): DocumentSection[] {
    return parsedDocument.sections.filter((section) => section.type === type);
  }

  static getSectionHierarchy(
    parsedDocument: ParsedDocument
  ): DocumentSection[] {
    // Return only top-level sections (chapters) with their nested structure
    return parsedDocument.chapters;
  }
}
