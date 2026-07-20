"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

// Mark a paid order as shipped (guarded: only paid -> shipped).
export async function markShipped(locale: string, orderId: string) {
  await prisma.order.updateMany({
    where: { id: orderId, status: "paid" },
    data: { status: "shipped" },
  });
  revalidatePath(`/${locale}/admin`);
  revalidatePath(`/${locale}/admin/orders/${orderId}`);
}

const bookSchema = z.object({
  titleEn: z.string().trim().min(1).max(300),
  titleMr: z.string().trim().min(1).max(300),
  author: z.string().trim().max(200).optional().or(z.literal("")),
  mrp: z.coerce.number().int().min(0).max(100000),
  price: z.coerce.number().int().min(0).max(100000),
  categoryId: z.string().min(1),
  publisherId: z.string().min(1),
  stockQty: z.coerce.number().int().min(0).max(100000),
  featuredRank: z.coerce.number().int().min(0).max(9999),
  coverUrl: z.string().trim().url().optional().or(z.literal("")),
});

function parseCheckbox(v: FormDataEntryValue | null): boolean {
  return v === "on" || v === "true";
}

export async function upsertBook(locale: string, id: string | null, formData: FormData) {
  const parsed = bookSchema.parse({
    titleEn: formData.get("titleEn"),
    titleMr: formData.get("titleMr"),
    author: formData.get("author") ?? "",
    mrp: formData.get("mrp"),
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
    publisherId: formData.get("publisherId"),
    stockQty: formData.get("stockQty"),
    featuredRank: formData.get("featuredRank") ?? 0,
    coverUrl: formData.get("coverUrl") ?? "",
  });
  const inStock = parseCheckbox(formData.get("inStock"));
  const isActive = parseCheckbox(formData.get("isActive"));
  const featured = parseCheckbox(formData.get("featured"));

  const data = {
    titleEn: parsed.titleEn,
    titleMr: parsed.titleMr,
    author: parsed.author || null,
    mrp: parsed.mrp,
    price: parsed.price,
    stockQty: parsed.stockQty,
    coverUrl: parsed.coverUrl || null,
    inStock,
    isActive,
    featured,
    featuredRank: parsed.featuredRank,
    categoryId: parsed.categoryId,
    publisherId: parsed.publisherId,
  };

  if (id) {
    await prisma.book.update({ where: { id }, data });
  } else {
    const slug = `${slugify(parsed.titleEn)}-${Math.random().toString(36).slice(2, 8)}`;
    await prisma.book.create({ data: { ...data, slug } });
  }
  revalidatePath(`/${locale}/admin/books`);
  redirect(`/${locale}/admin/books`);
}
