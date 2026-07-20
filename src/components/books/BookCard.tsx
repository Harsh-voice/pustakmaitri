import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { BookWithRelations } from "@/lib/books";
import { PlaceholderCover } from "@/components/book/PlaceholderCover";
import { Price } from "@/components/common/Price";
import { cn } from "@/lib/utils";

export function BookCard({
  book,
  locale,
}: {
  book: BookWithRelations;
  locale: Locale;
}) {
  const primary = locale === "mr" ? book.titleMr : book.titleEn;
  const secondary = locale === "mr" ? book.titleEn : book.titleMr;

  return (
    <Link
      href={`/books/${book.slug}`}
      className="group flex flex-col gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative overflow-hidden rounded-md transition-transform group-hover:-translate-y-0.5">
        {book.coverUrl ? (
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-muted">
            <Image
              src={book.coverUrl}
              alt={primary}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 200px"
              className="object-cover"
            />
          </div>
        ) : (
          <PlaceholderCover title={book.titleMr} author={book.author} seed={book.slug} />
        )}
        {!book.inStock && (
          <span className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[0.65rem] font-medium text-white">
            {locale === "mr" ? "उपलब्ध नाही" : "Out of stock"}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3
          className={cn(
            "line-clamp-2 text-sm font-medium leading-snug",
            locale === "mr" && "devanagari",
          )}
        >
          {primary}
        </h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">{secondary}</p>
        {book.author && (
          <p className="line-clamp-1 text-xs text-muted-foreground">{book.author}</p>
        )}
        <Price price={book.price} mrp={book.mrp} size="sm" className="mt-1" />
      </div>
    </Link>
  );
}
