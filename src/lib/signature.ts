import "server-only";
import crypto from "node:crypto";

// Constant-time hex comparison. Never use === on signatures.
function safeEqualHex(a: string, b: string): boolean {
  const ba = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  if (ba.length !== bb.length || ba.length === 0) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/**
 * Razorpay Checkout callback signature:
 *   HMAC_SHA256(`${order_id}|${payment_id}`, KEY_SECRET) === razorpay_signature
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string,
): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return safeEqualHex(expected, signature);
}

/**
 * Razorpay webhook signature:
 *   HMAC_SHA256(rawBody, WEBHOOK_SECRET) === x-razorpay-signature
 * `rawBody` MUST be the exact received bytes (verify before JSON.parse).
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string,
): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return safeEqualHex(expected, signature);
}
