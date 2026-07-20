import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Truck, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getBookBySlug, getRelatedBooks } from "@/lib/books";
import { siteConfig } from "@/lib/site-config";
import { formatInr } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildProductJsonLd } from "@/lib/seo/product-jsonld";
import { PlaceholderCover } from "@/components/book/PlaceholderCover";
import { ProductJsonLd } from "@/components/seo/JsonLd";
import { Price } from "@/components/common/Price";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { BookGrid } from "@/components/books/BookGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const book = await getBookBySlug(slug);
  if (!book) return { title: "Not found", robots: { index: false } };
  const name = loc === "mr" ? book.titleMr : book.titleEn;
  const title = book.author ? `${name} — ${book.author}` : name;
  const description =
    loc === "mr"
      ? `${book.titleMr} — ${book.author ?? ""} · ${book.publisher.name}. मराठी पुस्तक ऑनलाइन खरेदी करा.`
      : `${book.titleEn} by ${book.author ?? "Unknown"} · ${book.publisher.name}. Buy this Marathi book online.`;
  const image = book.coverUrl ?? `${siteConfig.baseUrl}/api/og/book/${slug}`;
  return buildMetadata({ locale: loc, path: `/books/${slug}`, title, description, images: [image] });
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations();

  const book = await getBookBySlug(slug);
  if (!book || !book.isActive) notFound();

  const related = await getRelatedBooks(book.categoryId, book.id);

  const primary = loc === "mr" ? book.titleMr : book.titleEn;
  const secondary = loc === "mr" ? book.titleEn : book.titleMr;
  const categoryName = loc === "mr" ? book.category.nameMr : book.category.nameEn;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <ProductJsonLd data={buildProductJsonLd(book, loc)} />
      <Link
        href="/books"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t("book.backToBooks")}
      </Link>

      <div className="grid gap-8 md:grid-cols-[minmax(0,320px)_1fr]">
        {/* Cover */}
        <div className="mx-auto w-full max-w-[280px] md:mx-0">
          {book.coverUrl ? (
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-muted shadow-sm">
              <Image
                src={book.coverUrl}
                alt={primary}
                fill
                sizes="320px"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <PlaceholderCover title={book.titleMr} author={book.author} seed={book.slug} />
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <div>
            <Link
              href={{ pathname: "/books", query: { category: book.category.slug } }}
              className="text-sm font-medium text-primary hover:underline"
            >
              {categoryName}
            </Link>
            <h1
              className={
                loc === "mr"
                  ? "devanagari mt-1 text-2xl font-bold leading-snug sm:text-3xl"
                  : "mt-1 text-2xl font-bold leading-snug sm:text-3xl"
              }
            >
              {primary}
            </h1>
            <p className="mt-1 text-base text-muted-foreground">{secondary}</p>
          </div>

          {book.author && (
            <p className="text-sm">
              {t("book.by", { author: book.author })}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Price price={book.price} mrp={book.mrp} size="lg" />
            <Badge variant={book.inStock ? "secondary" : "outline"}>
              {book.inStock ? t("book.inStock") : t("book.outOfStock")}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <AddToCartButton bookId={book.id} disabled={!book.inStock} size="lg" />
          </div>

          <dl className="mt-2 grid grid-cols-1 gap-y-2 text-sm sm:grid-cols-2">
            <div className="flex gap-2">
              <dt className="text-muted-foreground">{t("book.publisher")}:</dt>
              <dd>
                <Link
                  href={{ pathname: "/books", query: { publisher: book.publisher.slug } }}
                  className="hover:underline"
                >
                  {book.publisher.name}
                </Link>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground">{t("book.category")}:</dt>
              <dd>{categoryName}</dd>
            </div>
          </dl>

          <div className="mt-2 flex flex-col gap-2 rounded-lg border bg-muted/30 p-4 text-sm">
            <span className="inline-flex items-center gap-2">
              <Truck className="size-4 text-primary" />
              {t("book.deliveryEstimate", { days: siteConfig.shipping.deliveryEstimateDays })}
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              {t("book.freeDeliveryAbove", {
                amount: formatInr(siteConfig.shipping.freeAboveInr),
              })}
            </span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-xl font-semibold">{t("book.relatedBooks")}</h2>
          <BookGrid books={related} locale={loc} />
        </section>
      )}
    </div>
  );
}
