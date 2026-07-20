import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPaymentSignature } from "@/lib/signature";
import { getRazorpayServerEnv } from "@/lib/env";

export const runtime = "nodejs";

const bodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const { keySecret } = getRazorpayServerEnv();
  const valid = verifyPaymentSignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    keySecret,
  );
  if (!valid) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  // Idempotent compare-and-swap: only the first observer flips created -> paid.
  // The webhook may win this race; either way the order ends up paid exactly
  // once and this handler never double-processes.
  await prisma.order.updateMany({
    where: { razorpayOrderId: razorpay_order_id, status: "created" },
    data: { status: "paid", razorpayPaymentId: razorpay_payment_id },
  });

  return NextResponse.json({ ok: true });
}
