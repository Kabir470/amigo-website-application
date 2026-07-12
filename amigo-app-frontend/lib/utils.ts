import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(ts: any): string {
  if (!ts) return "—";
  // Handle ISO string from API
  if (typeof ts === "string") {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  // Handle Firebase TimestampLike
  if (ts?.toDate) {
    return ts.toDate().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return "—";
}

export function batteryColor(level: number): string {
  if (level > 50) return "#10b981";
  if (level > 20) return "#f59e0b";
  return "#ef4444";
}
