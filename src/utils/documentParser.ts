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
    let globalSectionCounter = 0;

    // Debug: Find document body markers
    console.log("Looking for document body markers...");
    for (let i = 0; i < Math.min(50, lines.length); i++) {
      const line = lines[i].trim();
      if (
        line.match(/^PETROLEUM INDUSTRY ACT, 2021/i) ||
        line.match(/^ACT No\. 6/i) ||
        line.match(/^AN ACT TO PROVIDE/i) ||
        line.match(/^\[16th Day of August, 2021\]/i) ||
        line.match(/^ENACTED by the National Assembly/i) ||
        line.match(/^CHAPTER 1—GOVERNANCE AND INSTITUTIONS/i)
      ) {
        console.log(`Found document body marker at line ${i}: ${line}`);
      }
    }

    // First pass: Identify all structural elements and their relationships
    const structuralElements: Array<{
      type: "chapter" | "part" | "section";
      lineIndex: number;
      line: string;
      level: number;
      sectionNumber?: number; // For sections, store the actual section number
    }> = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Identify CHAPTER
      if (line.match(/^CHAPTER\s+\d+[—\-]/i)) {
        structuralElements.push({
          type: "chapter",
          lineIndex: i,
          line,
          level: 1,
        });
      }
      // Identify PART
      else if (line.match(/^PART\s+[IVX]+[—\-]/i)) {
        structuralElements.push({
          type: "part",
          lineIndex: i,
          line,
          level: 2,
        });
      }
      // Identify SECTION (numbered sections) - extract the actual section number
      else if (line.match(/^\d+\.\s+/)) {
        const sectionNumberMatch = line.match(/^(\d+)\.\s+/);
        const sectionNumber = sectionNumberMatch
          ? parseInt(sectionNumberMatch[1])
          : 0;

        structuralElements.push({
          type: "section",
          lineIndex: i,
          line,
          level: 3,
          sectionNumber,
        });
      }
    }

    // Second pass: Build the hierarchy with proper section grouping
    for (let i = 0; i < structuralElements.length; i++) {
      const element = structuralElements[i];
      const lineIndex = element.lineIndex;
      const line = element.line;

      if (element.type === "chapter") {
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
          description: chapterTitle,
          isExpanded: false,
          isSelected: false,
        };
        chapters.push(currentChapter);
        sections.push(currentChapter);
        currentPart = null; // Reset current part when new chapter starts
      } else if (element.type === "part") {
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
          description: partTitle,
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
      } else if (element.type === "section") {
        globalSectionCounter++;
        const sectionNumber = element.sectionNumber || globalSectionCounter;
        const sectionId = `section-${sectionNumber}`;
        const sectionTitle = line.replace(/^\d+\.\s+/, "");

        // Extract the full content for this section
        const rawSectionContent = this.extractSectionContentFromLines(
          lines,
          lineIndex
        );

        // If content is just the title or very short, try to find the actual content in the document body
        let actualContent = rawSectionContent;
        const contentLength = rawSectionContent.trim().length;
        const titleLength = line.trim().length;
        
        if (contentLength <= titleLength + 50) { // Allow some extra characters for formatting
          console.log(
            `Content is too short for section ${sectionNumber} (${contentLength} chars), looking in document body...`
          );
          const documentBodyContent = this.findSectionContentInDocument(
            lines,
            sectionTitle
          );
          if (
            documentBodyContent &&
            documentBodyContent.trim().length > titleLength + 50
          ) {
            actualContent = documentBodyContent;
            console.log(
              `Found actual content in document body: ${actualContent.substring(
                0,
                100
              )}...`
            );
          } else {
            console.log(
              `No substantial content found in document body for section ${sectionNumber}`
            );
          }
        }

        const formattedContent = this.formatSectionContent(actualContent);

        const section: DocumentSection = {
          id: sectionId,
          title: sectionTitle,
          type: "section",
          level: 3,
          content: formattedContent,
          subsections: [],
          parentId: currentPart?.id || currentChapter?.id,
        };

        // Add sections to the current part's subsections for navigation
        if (currentPart) {
          currentPart.subsections = currentPart.subsections || [];
          currentPart.subsections.push(section);
        } else if (currentChapter) {
          // If no current part, add to chapter
          currentChapter.subsections = currentChapter.subsections || [];
          currentChapter.subsections.push(section);
        }

        // Also add to main sections array for easy access
        sections.push(section);
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

  static extractSectionContentFromLines(
    lines: string[],
    startIndex: number
  ): string {
    const sectionContent: string[] = [];
    let i = startIndex;

    // Add the section title line
    sectionContent.push(lines[i]);
    i++;

    console.log(
      `Extracting content for section starting at line ${startIndex}: ${lines[startIndex]}`
    );

    // Continue reading until we hit another structural element or end of document
    while (i < lines.length) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Stop if we hit another major structural element (but allow subsections and content)
      if (
        trimmedLine.match(/^CHAPTER\s+\d+[—\-]/i) ||
        trimmedLine.match(/^PART\s+[IVX]+[—\-]/i) ||
        trimmedLine.match(/^ARRANGEMENT OF SECTIONS/i) ||
        trimmedLine.match(/^SCHEDULE/i) ||
        trimmedLine.match(/^APPENDIX/i) ||
        trimmedLine.match(/^SCHEDULE\s+\d+/i) ||
        trimmedLine.match(/^APPENDIX\s+\d+/i)
      ) {
        console.log(`Stopping at major structural element line ${i}: ${trimmedLine}`);
        break;
      }

      // Stop if we hit another main section (numbered sections like "1.", "2.", etc.)
      // But only if it's not a subsection within the current section
      if (trimmedLine.match(/^\d+\.\s+/) && i !== startIndex) {
        // Check if this is a main section (not a subsection)
        // Main sections typically start at the beginning of a line without indentation
        // and are followed by substantial content
        const isMainSection = !line.startsWith(' ') && !line.startsWith('\t');
        
        if (isMainSection) {
          console.log(`Stopping at main section line ${i}: ${trimmedLine}`);
          break;
        }
      }

      // Add the line to content (including empty lines for formatting)
      sectionContent.push(line);
      i++;
    }

    const content = sectionContent.join("\n");
    console.log(
      `Extracted content (${content.length} chars):`,
      content.substring(0, 500) + "..."
    );
    console.log(`Full extracted content:`, content);

    return content;
  }

  static findSectionContentInDocument(
    lines: string[],
    sectionTitle: string
  ): string {
    console.log(`Looking for content for section: ${sectionTitle}`);

    // Look for the section in the document body (after ARRANGEMENT OF SECTIONS)
    let inDocumentBody = false;
    let foundSection = false;
    const sectionContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Check if we've reached the document body - look for more specific markers
      if (
        trimmedLine.match(/^PETROLEUM INDUSTRY ACT, 2021/i) ||
        trimmedLine.match(/^ACT No\. 6/i) ||
        trimmedLine.match(/^AN ACT TO PROVIDE/i) ||
        trimmedLine.match(/^\[16th Day of August, 2021\]/i) ||
        trimmedLine.match(/^ENACTED by the National Assembly/i) ||
        trimmedLine.match(/^CHAPTER 1—GOVERNANCE AND INSTITUTIONS/i)
      ) {
        inDocumentBody = true;
        console.log(`Found document body at line ${i}: ${trimmedLine}`);
        continue;
      }

      if (!inDocumentBody) continue;

      // Look for the section title with more specific matching
      if (
        trimmedLine.match(/^\d+\.\s+/) &&
        trimmedLine.includes(sectionTitle)
      ) {
        foundSection = true;
        sectionContent.push(line);
        console.log(`Found section at line ${i}: ${line}`);
        i++; // Move to next line

        // Extract content until next section or structural element
        while (i < lines.length) {
          const contentLine = lines[i];
          const contentTrimmed = contentLine.trim();

          // Stop if we hit another main section or structural element
          if (
            contentTrimmed.match(/^CHAPTER\s+\d+[—\-]/i) ||
            contentTrimmed.match(/^PART\s+[IVX]+[—\-]/i) ||
            contentTrimmed.match(/^SCHEDULE/i) ||
            contentTrimmed.match(/^APPENDIX/i)
          ) {
            break;
          }

          // Stop if we hit another main section (numbered sections like "1.", "2.", etc.)
          // But only if it's not a subsection within the current section
          if (contentTrimmed.match(/^\d+\.\s+/)) {
            // Check if this is a main section (not a subsection)
            const isMainSection = !contentLine.startsWith(' ') && !contentLine.startsWith('\t');
            
            if (isMainSection) {
              break;
            }
          }

          sectionContent.push(contentLine);
          i++;
        }
        break;
      }
    }

    const content = sectionContent.join("\n");
    console.log(
      `Found section content (${content.length} chars):`,
      content.substring(0, 200) + "..."
    );

    return content;
  }

  static formatSectionContent(content: string): string {
    if (!content) return "";

    const lines = content.split("\n");
    const formattedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        // Preserve empty lines for formatting
        formattedLines.push("");
        continue;
      }

      // Handle different types of content
      if (trimmedLine.match(/^\d+\.\s+/)) {
        // Section title - keep as is
        formattedLines.push(line);
      } else if (trimmedLine.match(/^\([a-z]\)\s+/)) {
        // Sub-points like (a), (b), (c) - indent
        formattedLines.push(`    ${line}`);
      } else if (trimmedLine.match(/^\([ivx]+\)\s+/)) {
        // Roman numeral sub-points like (i), (ii), (iii) - more indent
        formattedLines.push(`        ${line}`);
      } else if (trimmedLine.match(/^[A-Z]\.\s+/)) {
        // Letter sub-points like A., B., C. - indent
        formattedLines.push(`  ${line}`);
      } else {
        // Regular content
        formattedLines.push(line);
      }
    }

    return formattedLines.join("\n");
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
    // Find the part and return its subsections (which should be sections)
    const part = parsedDocument.parts.find((p) => p.id === partId);
    if (part && part.subsections) {
      return part.subsections.filter((section) => section.type === "section");
    }

    // Fallback: look for sections with parentId === partId
    return parsedDocument.sections.filter(
      (section) => section.type === "section" && section.parentId === partId
    );
  }

  static validateDocumentStructure(parsedDocument: ParsedDocument): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check if chapters have parts
    for (const chapter of parsedDocument.chapters) {
      if (!chapter.subsections || chapter.subsections.length === 0) {
        issues.push(`Chapter "${chapter.title}" has no parts or sections`);
      }
    }

    // Check if parts have sections
    for (const part of parsedDocument.parts) {
      if (!part.subsections || part.subsections.length === 0) {
        issues.push(`Part "${part.title}" has no sections`);
      }
    }

    // Check for orphaned sections
    const orphanedSections = parsedDocument.sections.filter(
      (section) => section.type === "section" && !section.parentId
    );
    if (orphanedSections.length > 0) {
      issues.push(
        `Found ${orphanedSections.length} orphaned sections without parent part or chapter`
      );
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  static getDocumentStatistics(parsedDocument: ParsedDocument): {
    totalChapters: number;
    totalParts: number;
    totalSections: number;
    averageSectionsPerPart: number;
    structure: Array<{
      chapter: string;
      parts: number;
      sections: number;
      sectionRange?: string;
    }>;
    sectionDistribution: Array<{
      part: string;
      sectionNumbers: number[];
      sectionRange: string;
    }>;
  } {
    const structure = parsedDocument.chapters.map((chapter) => {
      const chapterParts =
        chapter.subsections?.filter((sub) => sub.type === "part") || [];
      const chapterSections = chapterParts.reduce(
        (total, part) =>
          total +
          (part.subsections?.filter((sub) => sub.type === "section").length ||
            0),
        0
      );

      // Get section numbers for this chapter
      const sectionNumbers: number[] = [];
      chapterParts.forEach((part) => {
        part.subsections
          ?.filter((sub) => sub.type === "section")
          .forEach((section) => {
            const sectionNum = parseInt(section.id.replace("section-", ""));
            if (!isNaN(sectionNum)) sectionNumbers.push(sectionNum);
          });
      });

      const sectionRange =
        sectionNumbers.length > 0
          ? `${Math.min(...sectionNumbers)}-${Math.max(...sectionNumbers)}`
          : "None";

      return {
        chapter: chapter.title,
        parts: chapterParts.length,
        sections: chapterSections,
        sectionRange,
      };
    });

    // Get section distribution by part
    const sectionDistribution = parsedDocument.parts.map((part) => {
      const partSections =
        part.subsections?.filter((sub) => sub.type === "section") || [];
      const sectionNumbers = partSections
        .map((section) => {
          const sectionNum = parseInt(section.id.replace("section-", ""));
          return isNaN(sectionNum) ? 0 : sectionNum;
        })
        .sort((a, b) => a - b);

      const sectionRange =
        sectionNumbers.length > 0
          ? `${Math.min(...sectionNumbers)}-${Math.max(...sectionNumbers)}`
          : "None";

      return {
        part: part.title,
        sectionNumbers,
        sectionRange,
      };
    });

    const totalSections = parsedDocument.sections.filter(
      (s) => s.type === "section"
    ).length;
    const totalParts = parsedDocument.parts.length;
    const averageSectionsPerPart =
      totalParts > 0 ? totalSections / totalParts : 0;

    return {
      totalChapters: parsedDocument.chapters.length,
      totalParts,
      totalSections,
      averageSectionsPerPart: Math.round(averageSectionsPerPart * 100) / 100,
      structure,
      sectionDistribution,
    };
  }
}
