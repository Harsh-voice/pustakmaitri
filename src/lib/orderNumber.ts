/** IST-based day key like "20260720" (bookstore ships India-only). */
export function dayKey(now: Date = new Date()): string {
  const ist = new Date(now.getTime() + 5.5 * 3600_000);
  return ist.toISOString().slice(0, 10).replace(/-/g, "");
}

/** Build "PM-YYYYMMDD-NNNN" from a day key and a 1-based sequence. */
export function formatOrderNumber(day: string, seq: number): string {
  return `PM-${day}-${String(seq).padStart(4, "0")}`;
}
