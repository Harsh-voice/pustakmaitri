import { describe, it, expect } from "vitest";
import crypto from "node:crypto";
import { verifyPaymentSignature, verifyWebhookSignature } from "@/lib/signature";

const SECRET = "thisisasecret";

describe("verifyPaymentSignature", () => {
  const orderId = "order_TEST123";
  const paymentId = "pay_TEST123";
  const good = crypto
    .createHmac("sha256", SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  it("accepts a correct signature", () => {
    expect(verifyPaymentSignature(orderId, paymentId, good, SECRET)).toBe(true);
  });
  it("rejects a tampered signature", () => {
    const bad = good.slice(0, -1) + (good.endsWith("0") ? "1" : "0");
    expect(verifyPaymentSignature(orderId, paymentId, bad, SECRET)).toBe(false);
  });
  it("rejects a valid-format signature for different data", () => {
    expect(verifyPaymentSignature(orderId, "pay_OTHER", good, SECRET)).toBe(false);
  });
  it("rejects non-hex / empty signatures", () => {
    expect(verifyPaymentSignature(orderId, paymentId, "", SECRET)).toBe(false);
  });
});

describe("verifyWebhookSignature", () => {
  const body = JSON.stringify({ event: "payment.captured", payload: {} });
  const good = crypto.createHmac("sha256", SECRET).update(body).digest("hex");

  it("accepts a correct raw-body signature", () => {
    expect(verifyWebhookSignature(body, good, SECRET)).toBe(true);
  });
  it("rejects when the body is altered", () => {
    expect(verifyWebhookSignature(body + " ", good, SECRET)).toBe(false);
  });
});
