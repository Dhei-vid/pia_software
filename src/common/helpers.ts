import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function formatTimeAgo(date: string | Date) {
  const now = dayjs();
  const postDate = dayjs(date);

  const diffInSeconds = now.diff(postDate, "second");
  const diffInMinutes = now.diff(postDate, "minute");
  const diffInHours = now.diff(postDate, "hour");
  const diffInDays = now.diff(postDate, "day");
  const diffInWeeks = now.diff(postDate, "week");
  const diffInMonths = now.diff(postDate, "month");
  const diffInYears = now.diff(postDate, "year");

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInWeeks < 5) return `${diffInWeeks}w ago`;
  if (diffInMonths < 12) return `${diffInMonths}m ago`;
  return `${diffInYears}y ago`;
}

// Extract error message
export const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object") {
    const errorObj = error as Record<string, unknown>;

    // Check for axios-style error structure
    if (errorObj.response && typeof errorObj.response === "object") {
      const response = errorObj.response as Record<string, unknown>;
      if (response.data && typeof response.data === "object") {
        const data = response.data as Record<string, unknown>;
        if (typeof data.message === "string") return data.message;
        if (typeof data.error === "string") return data.error;
      }
    }

    // Check for standard error message
    if (typeof errorObj.message === "string") {
      return errorObj.message;
    }
  }

  return "An unexpected error occurred";
};


// Extract chapter, part, and section numbers from string like "ch1-pt2-s3"
export function extractCPS(input: string) {
  const regex = /ch(\d+)-pt(\d+)-s(\d+)/i;
  const match = input.match(regex);

  if (!match) {
    throw new Error("Invalid format");
  }

  const [, chapter, part, section] = match;

  return {
    chapterNumber: Number(chapter),
    partNumber: Number(part),
    sectionNumber: Number(section),
  };
}

/**
 * Formats description text by adding newlines before list items.
 * Handles:
 * - Single letter lists: (a), (b), (c), etc.
 * - Double letter lists: (aa), (bb), (cc), etc.
 * - Roman numerals: (i), (ii), (iii), (iv), (v), etc.
 * - Both lowercase and uppercase variants
 */
export function formatDescriptionWithLists(text: string): string {
  if (!text) return "";

  // Pattern to match list items:
  // - Single letter: (a), (b), (c), etc. (case insensitive)
  // - Double letter: (aa), (bb), (cc), etc. (case insensitive)
  // - Roman numerals: (i), (ii), (iii), (iv), (v), (vi), (vii), (viii), (ix), (x), etc. (case insensitive)
  const listPattern = /\(([a-z]{1,2}|[ivxlcdm]+)\)/gi;

  // Process text to add newlines before list items
  // We'll process in reverse to maintain correct string positions
  const matches: Array<{ match: string; index: number }> = [];
  let match;
  
  // Reset regex lastIndex to ensure we get all matches
  listPattern.lastIndex = 0;
  
  // Collect all matches
  while ((match = listPattern.exec(text)) !== null) {
    matches.push({
      match: match[0],
      index: match.index,
    });
  }
  
  // Build formatted string by processing matches in reverse order
  let formatted = text;
  for (let i = matches.length - 1; i >= 0; i--) {
    const { match: listItem, index } = matches[i];
    
    // Skip if at the start of the string
    if (index === 0) continue;
    
    // Check the character before the match
    const charBefore = text[index - 1];
    
    // If there's already a newline, skip
    if (charBefore === '\n') continue;
    
    // If there's a space before, check preceding context
    if (charBefore === ' ') {
      // Look backwards through whitespace to find if there's already a newline
      let j = index - 1;
      while (j >= 0 && (text[j] === ' ' || text[j] === '\t')) {
        j--;
      }
      if (j >= 0 && text[j] === '\n') continue;
    }
    
    // Insert newline before the list item
    formatted = formatted.slice(0, index) + '\n' + formatted.slice(index);
  }

  // Clean up multiple consecutive newlines (more than 2) to max 2
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  // Trim leading/trailing whitespace but preserve intentional formatting
  return formatted.trim();
}
