import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import { parseBookQuery } from "@/lib/search-params";
import {
  getBooks,
  getCategoriesWithCounts,
  getAllPublishers,
} from "@/lib/books";
import { BookGrid } from "@/components/books/BookGrid";
import { SortSelect } from "@/components/books/SortSelect";
import { PaginationBar } from "@/components/books/PaginationBar";
import {
  DesktopFilters,
  MobileFilters,
  type FilterOption,
} from "@/components/books/Filters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale: locale as Locale,
    path: "/books",
    title: t("booksTitle"),
    description: t("booksDescription"),
  });
}

export default async function BooksPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations("catalog");

  const query = parseBookQuery(await searchParams);

  const [{ items, total, page, pageCount }, categories, publishers] =
    await Promise.all([
      getBooks(query, loc),
      getCategoriesWithCounts(),
      getAllPublishers(),
    ]);

  const categoryOptions: FilterOption[] = categories
    .filter((c) => c._count.books > 0)
    .map((c) => ({ slug: c.slug, name: loc === "mr" ? c.nameMr : c.nameEn }));
  const publisherOptions: FilterOption[] = publishers.map((p) => ({
    slug: p.slug,
    name: p.name,
  }));

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className={`font-display text-3xl font-semibold ${loc === "mr" ? "devanagari" : ""}`}>
            {t("title")}
          </h1>
          <p className="tnum mt-1 text-sm text-muted-foreground">{t("results", { count: total })}</p>
        </div>
        <div className="flex items-center gap-2">
          <MobileFilters categories={categoryOptions} publishers={publisherOptions} />
          <SortSelect />
        </div>
      </div>

      <div className="flex gap-8">
        <DesktopFilters categories={categoryOptions} publishers={publisherOptions} />

        <div className="min-w-0 flex-1">
          {items.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">{t("noResults")}</p>
          ) : (
            <>
              <BookGrid books={items} locale={loc} />
              <PaginationBar page={page} pageCount={pageCount} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
