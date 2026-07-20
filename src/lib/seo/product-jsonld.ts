import { siteConfig } from "@/lib/site-config";
import { priceForSchema } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import type { BookWithRelations } from "@/lib/books";

/** Build a schema.org Product node for a book product page. */
export function buildProductJsonLd(book: BookWithRelations, locale: Locale) {
  const base = siteConfig.baseUrl;
  const url = `${base}/${locale}/books/${book.slug}`;
  const name = locale === "mr" ? book.titleMr : book.titleEn;
  const altName = locale === "mr" ? book.titleEn : book.titleMr;
  const image = book.coverUrl ?? `${base}/api/og/book/${book.slug}`;

  const descParts = [
    `${book.titleMr} (${book.titleEn})`,
    book.author ? `${locale === "mr" ? "लेखक" : "by"} ${book.author}` : null,
    `${locale === "mr" ? "प्रकाशक" : "Publisher"}: ${book.publisher.name}`,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    alternateName: altName,
    image: [image],
    description: descParts.join(" · "),
    category: locale === "mr" ? book.category.nameMr : book.category.nameEn,
    ...(book.author ? { brand: { "@type": "Brand", name: book.author } } : {}),
    sku: book.id,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: priceForSchema(book.price),
      availability: book.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: siteConfig.tradeName },
    },
  };
}
