import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, ShieldCheck, Truck, BookOpen, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/books/SearchBar";
import { BookGrid } from "@/components/books/BookGrid";
import { getCategoriesWithCounts, getNewArrivals, getFeaturedBooks } from "@/lib/books";

function SectionHead({
  title,
  href,
  cta,
  mr,
}: {
  title: string;
  href?: object | string;
  cta?: string;
  mr: boolean;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className={cn("font-display text-2xl font-semibold sm:text-[1.7rem]", mr && "devanagari")}>{title}</h2>
        <div className="rule-gold mt-2.5" />
      </div>
      {href && cta && (
        <Link
          href={href as never}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary"
        >
          {cta}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale: locale as Locale,
    path: "/",
    title: t("homeTitle"),
    description: t("homeDescription"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const mr = loc === "mr";
  const t = await getTranslations();

  const [categories, newArrivals, featured] = await Promise.all([
    getCategoriesWithCounts(),
    getNewArrivals(10),
    getFeaturedBooks(10),
  ]);

  const active = categories.filter((c) => c._count.books > 0);
  const total = active.reduce((s, c) => s + c._count.books, 0);
  const topCategories = active.slice().sort((a, b) => b._count.books - a._count.books).slice(0, 12);

  const trust = [
    { icon: Truck, label: t("trust.delivery") },
    { icon: ShieldCheck, label: t("trust.securePayments") },
    { icon: BookOpen, label: t("trust.genuineBooks") },
    { icon: MapPin, label: mr ? "संपूर्ण भारतात" : "Across India" },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <OrganizationJsonLd />
      <WebSiteJsonLd locale={loc} />

      {/* Hero */}
      <section className="relative my-6 overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-secondary/70 via-background to-background px-6 py-14 sm:px-10 md:py-20">
        <span
          className="devanagari pointer-events-none absolute -right-6 -top-10 select-none text-[13rem] font-bold leading-none text-primary/[0.05] md:text-[20rem]"
          aria-hidden="true"
        >
          ग्रं
        </span>
        <div className="relative max-w-2xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-teal">
            {mr ? "मराठी पुस्तकांचे घर" : "Home of Marathi books"}
          </p>
          <h1
            className={cn(
              "font-display text-4xl font-semibold leading-[1.08] sm:text-5xl md:text-6xl",
              mr && "devanagari",
            )}
            style={{ textWrap: "balance" }}
          >
            {t("home.heroTitle")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("home.heroSubtitle")}
          </p>
          <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <SearchBar className="w-full" />
            <Button asChild size="lg" className="shrink-0">
              <Link href="/books">
                {t("home.heroCta")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            <span className="tnum font-semibold text-foreground">{total.toLocaleString("en-IN")}</span>{" "}
            {mr ? `पुस्तके · ${active.length} विभाग` : `books · ${active.length} categories`}
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {trust.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-card px-4 py-3 text-sm"
          >
            <item.icon className="size-4 shrink-0 text-teal" />
            <span className="text-foreground/80">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-10">
          <SectionHead title={t("home.featured")} mr={mr} />
          <BookGrid books={featured} locale={loc} />
        </section>
      )}

      {/* Categories */}
      <section className="py-10">
        <SectionHead
          title={t("home.shopByCategory")}
          href="/books"
          cta={t("common.viewAll")}
          mr={mr}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {topCategories.map((c) => (
            <Link
              key={c.slug}
              href={{ pathname: "/books", query: { category: c.slug } }}
              className="group flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-sm"
            >
              <span className={cn("font-medium", mr && "devanagari")}>{mr ? c.nameMr : c.nameEn}</span>
              <span className="tnum rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                {c._count.books}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="pb-4 pt-6">
        <SectionHead
          title={t("home.newArrivals")}
          href={{ pathname: "/books", query: { sort: "new" } }}
          cta={t("common.viewAll")}
          mr={mr}
        />
        <BookGrid books={newArrivals} locale={loc} />
      </section>
    </div>
  );
}
