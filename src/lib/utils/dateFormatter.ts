/**
 * Returns a formatted date string in en-US locale with IST timezone.
 * Used across login alerts, vault creation, and password updates.
 */
export function formatDate(date: Date = new Date()): string {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}
