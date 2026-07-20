import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const bodySchema = z.object({
  ids: z.array(z.string().min(1)).max(50),
});

// Returns current book data for the ids in the cart, for DISPLAY only. The
// server independently recomputes prices at /api/checkout — this endpoint is
// never trusted as the source of the charged amount.
export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const { ids } = parsed.data;
  if (ids.length === 0) return NextResponse.json({ items: [] });

  const books = await prisma.book.findMany({
    where: { id: { in: ids }, isActive: true },
    select: {
      id: true,
      slug: true,
      titleEn: true,
      titleMr: true,
      author: true,
      price: true,
      mrp: true,
      coverUrl: true,
      inStock: true,
    },
  });
  return NextResponse.json({ items: books });
}
