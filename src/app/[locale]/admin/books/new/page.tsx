import { prisma } from "@/lib/db";
import { BookForm } from "@/components/admin/BookForm";

export const dynamic = "force-dynamic";

export default async function NewBookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [categories, publishers] = await Promise.all([
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
    prisma.publisher.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">New book</h1>
      <BookForm
        locale={locale}
        book={null}
        categories={categories.map((c) => ({ id: c.id, name: c.nameEn }))}
        publishers={publishers.map((p) => ({ id: p.id, name: p.name }))}
      />
    </div>
  );
}
