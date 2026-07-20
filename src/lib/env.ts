import "server-only";

/**
 * Server-only environment access. Razorpay secrets are validated lazily (only
 * when a payment route needs them) so the app still boots in dev with blank
 * keys, while any payment attempt fails fast with a clear error.
 *
 * GUARDRAIL: RAZORPAY_KEY_SECRET / RAZORPAY_WEBHOOK_SECRET must never be exposed
 * to the client. They are read here (server module) and never returned to a
 * client component or API response.
 */

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export function getRazorpayServerEnv() {
  return {
    keyId: required("RAZORPAY_KEY_ID"),
    keySecret: required("RAZORPAY_KEY_SECRET"),
  };
}

export function getRazorpayWebhookSecret(): string {
  return required("RAZORPAY_WEBHOOK_SECRET");
}

/** The public key id, safe to send to the client. */
export function getPublicRazorpayKeyId(): string | null {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || null;
}

/** Whether payments are configured (used to gate the checkout UI gracefully). */
export function isRazorpayConfigured(): boolean {
  return Boolean(
    process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  );
}
