import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrderByNumberAndEmail } from "@/lib/orders";

export const runtime = "nodejs";

const bodySchema = z.object({
  orderNumber: z.string().trim().min(3).max(40),
  email: z.string().trim().email().max(254),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  // Generic response either way — never reveal whether an order/email exists.
  if (!parsed.success) return NextResponse.json({ found: false });

  const order = await getOrderByNumberAndEmail(parsed.data.orderNumber, parsed.data.email);
  if (!order) return NextResponse.json({ found: false });

  return NextResponse.json({
    found: true,
    orderNumber: order.orderNumber,
    status: order.status,
    createdAt: order.createdAt,
    itemCount: order.items.length,
  });
}
