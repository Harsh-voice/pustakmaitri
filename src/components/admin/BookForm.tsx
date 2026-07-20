import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CoverUploader } from "./CoverUploader";
import { upsertBook } from "@/app/[locale]/admin/actions";

type Option = { id: string; name: string };
type BookValues = {
  id: string;
  titleEn: string;
  titleMr: string;
  author: string | null;
  mrp: number;
  price: number;
  stockQty: number;
  inStock: boolean;
  isActive: boolean;
  coverUrl: string | null;
  categoryId: string;
  publisherId: string;
} | null;

export function BookForm({
  locale,
  book,
  categories,
  publishers,
}: {
  locale: string;
  book: BookValues;
  categories: Option[];
  publishers: Option[];
}) {
  const action = upsertBook.bind(null, locale, book?.id ?? null);

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="titleMr">Title (Marathi)</Label>
          <Input id="titleMr" name="titleMr" defaultValue={book?.titleMr} required className="devanagari" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="titleEn">Title (English)</Label>
          <Input id="titleEn" name="titleEn" defaultValue={book?.titleEn} required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="author">Author</Label>
        <Input id="author" name="author" defaultValue={book?.author ?? ""} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="mrp">MRP (₹)</Label>
          <Input id="mrp" name="mrp" type="number" min={0} defaultValue={book?.mrp ?? 0} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">Price (₹)</Label>
          <Input id="price" name="price" type="number" min={0} defaultValue={book?.price ?? 0} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stockQty">Stock qty</Label>
          <Input id="stockQty" name="stockQty" type="number" min={0} defaultValue={book?.stockQty ?? 5} required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="categoryId">Category</Label>
          <select id="categoryId" name="categoryId" defaultValue={book?.categoryId} required className="h-9 rounded-md border bg-background px-3 text-sm">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="publisherId">Publisher</Label>
          <select id="publisherId" name="publisherId" defaultValue={book?.publisherId} required className="h-9 rounded-md border bg-background px-3 text-sm">
            {publishers.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <CoverUploader defaultUrl={book?.coverUrl} />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="inStock" defaultChecked={book ? book.inStock : true} className="size-4 accent-primary" />
          In stock
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={book ? book.isActive : true} className="size-4 accent-primary" />
          Active (visible in store)
        </label>
      </div>

      <div>
        <Button type="submit">{book ? "Save changes" : "Create book"}</Button>
      </div>
    </form>
  );
}
