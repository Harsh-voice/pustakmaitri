import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkoutSchema } from "@/lib/validation/checkout";
import { ORDER_LIMITS } from "@/config/commerce";
import { computeOrderAmount } from "@/lib/pricing";
import { dayKey, formatOrderNumber } from "@/lib/orderNumber";
import { getRazorpay } from "@/lib/razorpay";
import { getPublicRazorpayKeyId, isRazorpayConfigured } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const input = parsed.data;

  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "payments_unconfigured" }, { status: 503 });
  }

  // 1. Load books from DB by id — the ONLY source of truth for price.
  const ids = input.items.map((i) => i.bookId);
  const books = await prisma.book.findMany({
    where: { id: { in: ids }, isActive: true, inStock: true },
    select: { id: true, price: true, titleEn: true, titleMr: true },
  });
  const byId = new Map(books.map((b) => [b.id, b]));
  if (input.items.some((i) => !byId.has(i.bookId))) {
    return NextResponse.json({ error: "item_unavailable" }, { status: 400 });
  }

  // 2. Recompute all money server-side (client-sent amounts are never read).
  const itemRows = input.items.map((i) => {
    const book = byId.get(i.bookId)!;
    return {
      bookId: book.id,
      titleSnapshot: `${book.titleMr} · ${book.titleEn}`,
      priceSnapshot: book.price,
      qty: i.qty,
    };
  });
  const { amount } = (() => {
    const { total } = computeOrderAmount(
      itemRows.map((r) => ({ price: r.priceSnapshot, qty: r.qty })),
    );
    return { amount: total };
  })();
  if (amount <= 0 || amount > ORDER_LIMITS.maxAmountRupees) {
    return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
  }

  // 3. Create the Order + items with an atomic per-day sequence. Retry on the
  //    rare orderNumber unique collision (day boundary / race).
  const day = dayKey();
  let order: { id: string; orderNumber: string } | null = null;
  for (let attempt = 0; attempt < 3 && !order; attempt++) {
    try {
      order = await prisma.$transaction(async (tx) => {
        const counter = await tx.orderCounter.upsert({
          where: { day },
          create: { day, seq: 1 },
          update: { seq: { increment: 1 } },
        });
        const orderNumber = formatOrderNumber(day, counter.seq);
        return tx.order.create({
          data: {
            orderNumber,
            status: "created",
            amount,
            currency: "INR",
            customerName: input.customerName,
            email: input.email,
            phone: input.phone,
            addressLine1: input.addressLine1,
            addressLine2: input.addressLine2 || null,
            city: input.city,
            state: input.state,
            pincode: input.pincode,
            items: { create: itemRows },
          },
          select: { id: true, orderNumber: true },
        });
      });
    } catch (e: unknown) {
      if (attempt === 2) throw e;
    }
  }
  if (!order) {
    return NextResponse.json({ error: "order_failed" }, { status: 500 });
  }

  // 4. Create the Razorpay order (amount in paise), then persist its id.
  try {
    const rzpOrder = await getRazorpay().orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: order.orderNumber,
      notes: { orderId: order.id, orderNumber: order.orderNumber },
    });
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: rzpOrder.id },
    });

    // 5. Return the minimal payload the client needs to open Checkout.
    return NextResponse.json({
      razorpayOrderId: rzpOrder.id,
      amount,
      currency: "INR",
      orderNumber: order.orderNumber,
      keyId: getPublicRazorpayKeyId(),
      prefill: {
        name: input.customerName,
        email: input.email,
        contact: input.phone,
      },
    });
  } catch {
    await prisma.order
      .update({ where: { id: order.id }, data: { status: "failed" } })
      .catch(() => {});
    return NextResponse.json({ error: "gateway_error" }, { status: 502 });
  }
}
