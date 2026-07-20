import "server-only";
import Razorpay from "razorpay";
import { getRazorpayServerEnv } from "@/lib/env";

let client: Razorpay | null = null;

/** Lazily-constructed Razorpay client. Throws if keys are not configured. */
export function getRazorpay(): Razorpay {
  if (!client) {
    const { keyId, keySecret } = getRazorpayServerEnv();
    client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return client;
}
