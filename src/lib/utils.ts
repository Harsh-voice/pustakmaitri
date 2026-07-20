import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an integer number of rupees as ₹ with Latin (0-9) digits, so the
 * displayed price always matches the amount sent to Razorpay and the JSON-LD
 * `offers.price` — even under the Marathi (`mr`) locale, which would otherwise
 * render Devanagari numerals.
 */
export function formatInr(rupees: number): string {
  const n = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(rupees));
  return `₹${n}`;
}

/** Plain number string for structured data (e.g. "149"). No symbol/separators. */
export function priceForSchema(rupees: number): string {
  return String(Math.round(rupees));
}

/** kebab-case slug from arbitrary (incl. Devanagari) text; keeps a-z0-9. */
export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip Latin diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  return base || "book";
}
