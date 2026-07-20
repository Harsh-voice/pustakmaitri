import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatInr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminBooksPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;

  const books = await prisma.book.findMany({
    where: q
      ? {
          OR: [
            { titleEn: { contains: q, mode: "insensitive" } },
            { titleMr: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { category: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Books</h1>
        <div className="flex items-center gap-2">
          <form>
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search…"
              className="h-9 rounded-md border bg-background px-3 text-sm"
            />
          </form>
          <Button asChild>
            <Link href={`/${locale}/admin/books/new`}>New book</Link>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title (Mr / En)</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Active</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <span className="devanagari">{b.titleMr}</span>
                  <div className="text-xs text-muted-foreground">{b.titleEn}</div>
                </TableCell>
                <TableCell className="text-sm">{b.category.nameEn}</TableCell>
                <TableCell>{formatInr(b.price)}</TableCell>
                <TableCell>{b.inStock ? b.stockQty : "—"}</TableCell>
                <TableCell>{b.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Link href={`/${locale}/admin/books/${b.id}/edit`} className="text-sm text-primary hover:underline">
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Showing latest 50. Use search to find a specific title.</p>
    </div>
  );
}
