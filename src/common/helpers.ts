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
