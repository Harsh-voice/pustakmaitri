import { prisma } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/signature";
import { getRazorpayWebhookSecret } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Razorpay webhook — the source of truth when the browser closes before the
// verify call. Verify the signature over the RAW body before parsing.
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  let secret: string;
  try {
    secret = getRazorpayWebhookSecret();
  } catch {
    return new Response("not_configured", { status: 503 });
  }

  if (!verifyWebhookSignature(raw, signature, secret)) {
    return new Response("invalid_signature", { status: 400 });
  }

  const eventId = req.headers.get("x-razorpay-event-id") ?? "";
  let event: {
    event?: string;
    payload?: { payment?: { entity?: { id?: string; order_id?: string } } };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("bad_json", { status: 400 });
  }

  // Idempotency: a unique insert on the event id. If we've seen it, no-op 200.
  if (eventId) {
    try {
      await prisma.webhookEvent.create({
        data: { id: eventId, type: event.event ?? "unknown", payload: event },
      });
    } catch {
      return new Response("ok", { status: 200 }); // duplicate delivery
    }
  }

  const entity = event.payload?.payment?.entity;
  const rzpOrderId = entity?.order_id;
  const paymentId = entity?.id;

  if (rzpOrderId) {
    if (event.event === "payment.captured") {
      await prisma.order.updateMany({
        where: { razorpayOrderId: rzpOrderId, status: "created" },
        data: { status: "paid", razorpayPaymentId: paymentId ?? null },
      });
    } else if (event.event === "payment.failed") {
      await prisma.order.updateMany({
        where: { razorpayOrderId: rzpOrderId, status: "created" },
        data: { status: "failed", razorpayPaymentId: paymentId ?? null },
      });
    }
  }

  return new Response("ok", { status: 200 });
}
