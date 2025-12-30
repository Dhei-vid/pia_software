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
