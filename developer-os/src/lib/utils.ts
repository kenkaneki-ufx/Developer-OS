import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(date);
}

/**
 * Format minutes to hours and minutes
 */
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Generate initials from name
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get streak color based on count
 */
export function getStreakColor(streak: number): string {    if (streak >= 30) return "text-accentOrange";
  if (streak >= 14) return "text-yellow-500";
  if (streak >= 7) return "text-green-500";
  return "text-muted-foreground";
}

/**
 * Get priority color
 */
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "URGENT":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "HIGH":
      return "bg-accentOrange/10 text-accentOrange border-accentOrange/20";
    case "MEDIUM":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "LOW":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

/**
 * Get status color
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "COMPLETED":
    case "completed":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "IN_PROGRESS":
    case "in_progress":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "TODO":
    case "todo":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case "CANCELLED":
    case "cancelled":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}
