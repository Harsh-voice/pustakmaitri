import { z } from "zod";

export const PAGE_SIZE = 24;

// Whitelist + coerce the catalog query string. Anything invalid falls back to a
// safe default rather than throwing, so a hand-edited URL never 500s.
export const bookQuerySchema = z.object({
  q: z.string().trim().max(80).optional(),
  category: z.string().trim().max(60).optional(),
  publisher: z.string().trim().max(80).optional(),
  author: z.string().trim().max(80).optional(),
  minPrice: z.coerce.number().int().min(0).max(100000).optional(),
  maxPrice: z.coerce.number().int().min(0).max(100000).optional(),
  inStock: z
    .union([z.literal("true"), z.literal("1"), z.literal("on")])
    .optional()
    .transform((v) => v != null),
  sort: z.enum(["new", "price_asc", "price_desc", "title"]).catch("new"),
  page: z.coerce.number().int().min(1).catch(1),
});

export type BookQuery = z.infer<typeof bookQuerySchema>;

/** Parse a Next.js `searchParams` object (values may be string | string[]). */
export function parseBookQuery(
  sp: Record<string, string | string[] | undefined>,
): BookQuery {
  const flat: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(sp)) {
    flat[k] = Array.isArray(v) ? v[0] : v;
  }
  return bookQuerySchema.parse(flat);
}
