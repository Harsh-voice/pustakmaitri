import type { Locale } from "@/i18n/routing";
import type { BookWithRelations } from "@/lib/books";
import { BookCard } from "./BookCard";

export function BookGrid({
  books,
  locale,
}: {
  books: BookWithRelations[];
  locale: Locale;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {books.map((book) => (
        <BookCard key={book.id} book={book} locale={locale} />
      ))}
    </div>
  );
}
