import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BookForm } from "@/components/admin/BookForm";

export const dynamic = "force-dynamic";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const [book, categories, publishers] = await Promise.all([
    prisma.book.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
    prisma.publisher.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!book) notFound();

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold">Edit book</h1>
      <p className="mb-6 devanagari text-sm text-muted-foreground">{book.titleMr}</p>
      <BookForm
        locale={locale}
        book={book}
        categories={categories.map((c) => ({ id: c.id, name: c.nameEn }))}
        publishers={publishers.map((p) => ({ id: p.id, name: p.name }))}
      />
    </div>
  );
}
