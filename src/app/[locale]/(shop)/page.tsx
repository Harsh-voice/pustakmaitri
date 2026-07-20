import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/books/SearchBar";
import { BookGrid } from "@/components/books/BookGrid";
import { getCategoriesWithCounts, getNewArrivals } from "@/lib/books";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations();

  const [categories, newArrivals] = await Promise.all([
    getCategoriesWithCounts(),
    getNewArrivals(10),
  ]);

  const topCategories = categories
    .filter((c) => c._count.books > 0)
    .sort((a, b) => b._count.books - a._count.books)
    .slice(0, 12);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      {/* Hero */}
      <section className="flex flex-col items-start gap-5 py-12 md:py-20">
        <h1 className="devanagari max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {t("home.heroTitle")}
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          {t("home.heroSubtitle")}
        </p>
        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <SearchBar className="w-full" />
          <Button asChild size="lg" className="shrink-0">
            <Link href="/books">
              {t("home.heroCta")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("home.shopByCategory")}</h2>
          <Link
            href="/books"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            {t("common.viewAll")} <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {topCategories.map((c) => (
            <Link
              key={c.slug}
              href={{ pathname: "/books", query: { category: c.slug } }}
              className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 transition-colors hover:border-primary hover:bg-accent/40"
            >
              <span className={loc === "mr" ? "devanagari font-medium" : "font-medium"}>
                {loc === "mr" ? c.nameMr : c.nameEn}
              </span>
              <span className="text-xs text-muted-foreground">{c._count.books}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="py-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("home.newArrivals")}</h2>
          <Link
            href={{ pathname: "/books", query: { sort: "new" } }}
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            {t("common.viewAll")} <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <BookGrid books={newArrivals} locale={loc} />
      </section>
    </div>
  );
}
