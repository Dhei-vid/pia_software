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
      else if (line.match(/^\d+\.\s+/)) {
        sectionCounter++;
        const sectionId = `section-${sectionCounter}`;
        const sectionTitle = line.replace(/^\d+\.\s+/, "");
        
        // Extract the full content for this section
        const sectionContent = this.extractSectionContentFromLines(lines, i);
        
        const section: DocumentSection = {
          id: sectionId,
          title: sectionTitle,
          type: "section",
          level: 3,
          content: sectionContent,
          subsections: [],
          parentId: currentPart?.id || currentChapter?.id,
        };
        sections.push(section);

        // Add sections to the current part's subsections for navigation
        if (currentPart) {
          currentPart.subsections = currentPart.subsections || [];
          currentPart.subsections.push(section);
        } else if (currentChapter) {
          // If no current part, add to chapter
          currentChapter.subsections = currentChapter.subsections || [];
          currentChapter.subsections.push(section);
        }
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

  static extractSectionContentFromLines(lines: string[], startIndex: number): string {
    const sectionContent: string[] = [];
    let i = startIndex;
    
    // Add the section title line
    sectionContent.push(lines[i]);
    i++;
    
    console.log(`Extracting content for section starting at line ${startIndex}: ${lines[startIndex]}`);
    
    // Continue reading until we hit another section, chapter, part, or end of document
    while (i < lines.length) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Stop if we hit another section, chapter, or part
      if (
        trimmedLine.match(/^CHAPTER\s+\d+[—\-]/i) ||
        trimmedLine.match(/^PART\s+[IVX]+[—\-]/i) ||
        (trimmedLine.match(/^\d+\.\s+/) && i !== startIndex) || // Don't stop on the current section
        trimmedLine.match(/^ARRANGEMENT OF SECTIONS/i) ||
        trimmedLine.match(/^SCHEDULE/i) ||
        trimmedLine.match(/^APPENDIX/i)
      ) {
        console.log(`Stopping at line ${i}: ${trimmedLine}`);
        break;
      }
      
      // Add the line to content (including empty lines for formatting)
      sectionContent.push(line);
      i++;
    }
    
    const content = sectionContent.join("\n");
    console.log(`Extracted content (${content.length} chars):`, content.substring(0, 200) + "...");
    
    return content;
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

  static getSectionsForPart(
    parsedDocument: ParsedDocument,
    partId: string
  ): DocumentSection[] {
    return parsedDocument.sections.filter(
      (section) => section.type === "section" && section.parentId === partId
    );
  }
}
