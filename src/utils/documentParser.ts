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


    // First pass: Identify all structural elements from TOC
    const structuralElements: Array<{
      type: "chapter" | "part" | "section";
      lineIndex: number;
      line: string;
      level: number;
      sectionNumber?: number;
    }> = [];

    let inTOC = false;
    let tocEndLine = -1;

    // Find the TOC section
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Start of TOC
      if (line.match(/^ARRANGEMENT OF SECTIONS/i) || line.match(/^TABLE OF CONTENTS/i)) {
        inTOC = true;
        continue;
      }
      
      // End of TOC (document body starts)
      if (inTOC && (
        line.match(/^PETROLEUM INDUSTRY ACT, 2021/i) ||
        line.match(/^ACT No\. 6/i) ||
        line.match(/^ENACTED by the National Assembly/i) ||
        line.match(/^COMMENCEMENT/i)
      )) {
        tocEndLine = i;
        break;
      }

      // Collect structural elements from TOC
      if (inTOC) {
        if (line.match(/^CHAPTER\s+\d+[—\-]/i)) {
          structuralElements.push({
            type: "chapter",
            lineIndex: i,
            line,
            level: 1,
          });
        }
        else if (line.match(/^PART\s+[IVX]+[—\-]/i)) {
          structuralElements.push({
            type: "part",
            lineIndex: i,
            line,
            level: 2,
          });
        }
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
        // Pass the current chapter and part context to find the right section
        const sectionContent = this.extractSectionContentWithContext(
          lines,
          lineIndex,
          sectionNumber.toString(),
          currentChapter?.title || "",
          currentPart?.title || ""
        );

        const formattedContent = this.formatSectionContent(sectionContent);

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

  static extractSectionContentWithContext(
    lines: string[],
    startIndex: number,
    sectionNumber: string,
    chapterTitle: string,
    partTitle: string
  ): string {
    // Always search in document body with chapter and part context
    // This ensures we find the right section under the correct CHAPTER and PART
    return this.findSectionContentByContext(
      lines,
      sectionNumber,
      chapterTitle,
      partTitle
    );
  }

  static findSectionContentByContext(
    lines: string[],
    sectionNumber: string,
    chapterTitle: string,
    partTitle: string
  ): string {
    const sectionPattern = new RegExp(`^${sectionNumber}\\.\\s+`, "i");
    let currentChapterMatch = false;
    let currentPartMatch = false;
    let foundMatches: Array<{line: number, content: string}> = [];

    // Extract part number for matching
    const partTitleNumberMatch = partTitle.match(/PART\s+([IVX]+)/i);
    const searchPartNumber = partTitleNumberMatch ? partTitleNumberMatch[1] : "";

    // Find all potential matches - SKIP TOC AREA (before line 942)
    for (let i = 943; i < lines.length; i++) { // Start AFTER TOC ends
      const trimmedLine = lines[i].trim();

      // Track current chapter
      if (trimmedLine.match(/^CHAPTER\s+\d+[—\-]/i)) {
        const chapterNumberMatch = trimmedLine.match(/^CHAPTER\s+(\d+)/i);
        const chapterNumber = chapterNumberMatch ? chapterNumberMatch[1] : "";
        currentChapterMatch = chapterTitle.includes(`Chapter ${chapterNumber}`);
        currentPartMatch = false;
      }

      // Track current part
      if (trimmedLine.match(/^PART\s+[IVX]+[—\-]/i) && currentChapterMatch) {
        const partNumberMatch = trimmedLine.match(/^PART\s+([IVX]+)/i);
        const partNumber = partNumberMatch ? partNumberMatch[1] : "";
        currentPartMatch = partNumber.toUpperCase() === searchPartNumber.toUpperCase();
      }

      // Collect all matches in the right context
      if (currentChapterMatch && currentPartMatch && sectionPattern.test(trimmedLine)) {
        foundMatches.push({line: i, content: trimmedLine});
      }
    }

    // Use the LAST match (body content, not TOC)
    if (foundMatches.length === 0) {
      // Fallback: search under chapter only (some parts don't exist in body)
      return this.findSectionContentByChapter(lines, sectionNumber, chapterTitle);
    }

    const bestMatch = foundMatches[foundMatches.length - 1];
    
    // Extract content
    const sectionContent: string[] = [lines[bestMatch.line].trim()];
    let i = bestMatch.line + 1;

    while (i < lines.length) {
      const contentTrimmed = lines[i].trim();

      if (
        contentTrimmed.match(/^CHAPTER\s+\d+[—\-]/i) ||
        contentTrimmed.match(/^PART\s+[IVX]+[—\-]/i) ||
        contentTrimmed.match(/^SCHEDULE/i) ||
        contentTrimmed.match(/^APPENDIX/i) ||
        (contentTrimmed.match(/^\d+\.\s+/) && !lines[i].startsWith(" ") && !lines[i].startsWith("\t"))
      ) {
        break;
      }

      sectionContent.push(lines[i]);
      i++;
    }

    return sectionContent.join("\n");
  }

  static findSectionContentByChapter(
    lines: string[],
    sectionNumber: string,
    chapterTitle: string
  ): string {
    const sectionPattern = new RegExp(`^${sectionNumber}\\.\\s+`, "i");
    let currentChapterMatch = false;
    let inChapterBody = false;
    let foundMatches: Array<{line: number, content: string}> = [];

    // Find matches under chapter body but BEFORE any PART (content directly under chapter)
    for (let i = 0; i < lines.length; i++) {
      const trimmedLine = lines[i].trim();

      // Track current chapter
      if (trimmedLine.match(/^CHAPTER\s+\d+[—\-]/i)) {
        const chapterNumberMatch = trimmedLine.match(/^CHAPTER\s+(\d+)/i);
        const chapterNumber = chapterNumberMatch ? chapterNumberMatch[1] : "";
        currentChapterMatch = chapterTitle.includes(`Chapter ${chapterNumber}`);
        // Start chapter body when we find the matching chapter in body (after TOC)
        if (currentChapterMatch && i > 942) {
          inChapterBody = true;
        }
      }

      // If we're in chapter body and hit a PART, we exit chapter-only content
      if (inChapterBody && trimmedLine.match(/^PART\s+[IVX]+[—\-]/i)) {
        inChapterBody = false;
      }

      // Collect matches that are directly under chapter (between CHAPTER and first PART)
      if (inChapterBody && sectionPattern.test(trimmedLine)) {
        foundMatches.push({line: i, content: trimmedLine});
      }
    }

    if (foundMatches.length === 0) {
      return "";
    }

    // Use LAST match
    const bestMatch = foundMatches[foundMatches.length - 1];

    // Extract content
    const sectionContent: string[] = [lines[bestMatch.line].trim()];
    let i = bestMatch.line + 1;

    while (i < lines.length) {
      const contentTrimmed = lines[i].trim();

      if (
        contentTrimmed.match(/^CHAPTER\s+\d+[—\-]/i) ||
        contentTrimmed.match(/^PART\s+[IVX]+[—\-]/i) ||
        contentTrimmed.match(/^SCHEDULE/i) ||
        contentTrimmed.match(/^APPENDIX/i) ||
        (contentTrimmed.match(/^\d+\.\s+/) && !lines[i].startsWith(" ") && !lines[i].startsWith("\t"))
      ) {
        break;
      }

      sectionContent.push(lines[i]);
      i++;
    }

    return sectionContent.join("\n");
  }

  static findSectionContentByNumber(
    lines: string[],
    sectionNumber: string
  ): string {
    const sectionPattern = new RegExp(`^${sectionNumber}\\.\\s+`, "i");
    let foundSection = false;
    const sectionContent: string[] = [];
    let inDocumentBody = false;
    let possibleMatches: Array<{lineIndex: number, line: string, nextContent: string}> = [];

    // First pass: find all lines that match the section number
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Check if we've reached the document body
      if (
        trimmedLine.match(/^PETROLEUM INDUSTRY ACT, 2021/i) ||
        trimmedLine.match(/^ACT No\. 6/i) ||
        trimmedLine.match(/^ENACTED by the National Assembly/i) ||
        trimmedLine.match(/^CHAPTER\s+\d+[—\-]/i) ||
        trimmedLine.match(/^PART\s+[IVX]+[—\-]/i)
      ) {
        inDocumentBody = true;
      }

      if (!inDocumentBody) continue;

      // Look for our specific section number
      if (sectionPattern.test(trimmedLine)) {
        // Get the next non-empty line to check if this is TOC or actual content
        let nextContent = "";
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const nextLine = lines[j].trim();
          if (nextLine && !nextLine.match(/^\d+\./)) {
            nextContent = nextLine;
            break;
          }
        }
        
        possibleMatches.push({
          lineIndex: i,
          line: trimmedLine,
          nextContent: nextContent
        });
      }
    }

    // Find the match with substantial content (not TOC)
    // TOC entries will have another numbered section immediately after
    // Real content will have actual text
    let bestMatch = possibleMatches.find(match => 
      match.nextContent.length > 50 && 
      !match.line.toLowerCase().includes("vesting of petroleum.")
    ) || possibleMatches[possibleMatches.length - 1]; // Default to last match

    if (!bestMatch) {
      return "";
    }

    // Extract content from the best match
    let i = bestMatch.lineIndex;
    sectionContent.push(lines[i].trim());
    i++;

    // Extract content until next section or structural element
    while (i < lines.length) {
      const contentLine = lines[i];
      const contentTrimmed = contentLine.trim();

      // Stop at major structural elements
      if (
        contentTrimmed.match(/^CHAPTER\s+\d+[—\-]/i) ||
        contentTrimmed.match(/^PART\s+[IVX]+[—\-]/i) ||
        contentTrimmed.match(/^SCHEDULE/i) ||
        contentTrimmed.match(/^APPENDIX/i)
      ) {
        break;
      }

      // Stop at next main section (unindented numbered section)
      if (
        contentTrimmed.match(/^\d+\.\s+/) &&
        !contentLine.startsWith(" ") &&
        !contentLine.startsWith("\t")
      ) {
        break;
      }

      // Include all content lines (including those with escape sequences)
      sectionContent.push(contentLine);
      i++;
    }

    return sectionContent.join("\n");
  }

  static findSectionContentInDocument(
    lines: string[],
    sectionTitle: string
  ): string {
    let inDocumentBody = false;
    let foundSection = false;
    const sectionContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Check if we've reached the document body
      if (
        trimmedLine.match(/^PETROLEUM INDUSTRY ACT, 2021/i) ||
        trimmedLine.match(/^ACT No\. 6/i) ||
        trimmedLine.match(/^AN ACT TO PROVIDE/i) ||
        trimmedLine.match(/^\[16th Day of August, 2021\]/i) ||
        trimmedLine.match(/^ENACTED by the National Assembly/i) ||
        trimmedLine.match(/^CHAPTER 1—GOVERNANCE AND INSTITUTIONS/i)
      ) {
        inDocumentBody = true;
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
        i++;

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

          // Stop if we hit another main section
          if (contentTrimmed.match(/^\d+\.\s+/)) {
            const isMainSection =
              !contentLine.startsWith(" ") && !contentLine.startsWith("\t");

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

    return sectionContent.join("\n");
  }

  static formatSectionContent(content: string): string {
    if (!content) {
      return "";
    }

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
      return part.subsections.filter(
        (section) => section.type === "section"
      );
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
