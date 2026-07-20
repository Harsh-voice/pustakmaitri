import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { PAGE_SIZE, type BookQuery } from "@/lib/search-params";
import type { Locale } from "@/i18n/routing";

// Row shape used by cards & product pages (book + its category & publisher).
export type BookWithRelations = Prisma.BookGetPayload<{
  include: { category: true; publisher: true };
}>;

function buildWhere(q: BookQuery): Prisma.BookWhereInput {
  const AND: Prisma.BookWhereInput[] = [{ isActive: true }];

  if (q.category) AND.push({ category: { slug: q.category } });
  if (q.publisher) AND.push({ publisher: { slug: q.publisher } });
  if (q.author) AND.push({ author: { contains: q.author, mode: "insensitive" } });
  if (q.inStock) AND.push({ inStock: true });
  if (q.minPrice != null || q.maxPrice != null) {
    AND.push({ price: { gte: q.minPrice ?? undefined, lte: q.maxPrice ?? undefined } });
  }
  if (q.q) {
    AND.push({
      OR: [
        { titleEn: { contains: q.q, mode: "insensitive" } },
        { titleMr: { contains: q.q } }, // Devanagari: case-insensitivity is moot
        { author: { contains: q.q, mode: "insensitive" } },
      ],
    });
  }
  return { AND };
}

function buildOrderBy(
  q: BookQuery,
  locale: Locale,
): Prisma.BookOrderByWithRelationInput | Prisma.BookOrderByWithRelationInput[] {
  switch (q.sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "title":
      return locale === "mr" ? { titleMr: "asc" } : { titleEn: "asc" };
    default:
      // Default view: featured books first, then newest.
      return [{ featured: "desc" }, { featuredRank: "desc" }, { createdAt: "desc" }];
  }
}

export async function getBooks(q: BookQuery, locale: Locale) {
  const where = buildWhere(q);
  const [items, total] = await prisma.$transaction([
    prisma.book.findMany({
      where,
      orderBy: buildOrderBy(q, locale),
      skip: (q.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: true, publisher: true },
    }),
    prisma.book.count({ where }),
  ]);
  return {
    items,
    total,
    page: q.page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export function getBookBySlug(slug: string) {
  return prisma.book.findUnique({
    where: { slug },
    include: { category: true, publisher: true },
  });
}

export function getRelatedBooks(categoryId: string, excludeId: string) {
  return prisma.book.findMany({
    where: { categoryId, id: { not: excludeId }, isActive: true, inStock: true },
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { category: true, publisher: true },
  });
}

export function getNewArrivals(take = 8) {
  return prisma.book.findMany({
    where: { isActive: true },
    take,
    orderBy: { createdAt: "desc" },
    include: { category: true, publisher: true },
  });
}

export function getFeaturedBooks(take = 10) {
  return prisma.book.findMany({
    where: { isActive: true, featured: true },
    take,
    orderBy: [{ featuredRank: "desc" }, { createdAt: "desc" }],
    include: { category: true, publisher: true },
  });
}

export function getCategoriesWithCounts() {
  return prisma.category.findMany({
    orderBy: { nameEn: "asc" },
    include: { _count: { select: { books: true } } },
  });
}

export function getAllPublishers() {
  return prisma.publisher.findMany({ orderBy: { name: "asc" } });
}
