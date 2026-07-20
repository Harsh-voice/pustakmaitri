import { describe, it, expect } from "vitest";
import { shippingFor } from "@/config/commerce";
import { computeOrderAmount } from "@/lib/pricing";
import { formatInr } from "@/lib/utils";

describe("shippingFor", () => {
  it("charges flat rate at/below the free threshold", () => {
    expect(shippingFor(0)).toBe(49);
    expect(shippingFor(400)).toBe(49);
    expect(shippingFor(499)).toBe(49);
  });
  it("is free strictly above the threshold", () => {
    expect(shippingFor(500)).toBe(0);
    expect(shippingFor(1200)).toBe(0);
  });
});

describe("computeOrderAmount", () => {
  it("recomputes subtotal, shipping and total from DB prices", () => {
    const r = computeOrderAmount([
      { price: 150, qty: 2 },
      { price: 100, qty: 1 },
    ]);
    expect(r.subtotal).toBe(400);
    expect(r.shipping).toBe(49);
    expect(r.total).toBe(449);
  });
  it("applies free shipping once the subtotal clears the threshold", () => {
    const r = computeOrderAmount([{ price: 300, qty: 2 }]);
    expect(r.subtotal).toBe(600);
    expect(r.shipping).toBe(0);
    expect(r.total).toBe(600);
  });
  it("ignores any client-sent price field (only price/qty are used)", () => {
    const items = [{ price: 200, qty: 1, clientAmount: 1 } as { price: number; qty: number }];
    expect(computeOrderAmount(items).total).toBe(249);
  });
});

describe("formatInr", () => {
  it("uses Latin digits and the rupee sign", () => {
    expect(formatInr(149)).toBe("₹149");
    expect(formatInr(1200)).toBe("₹1,200");
    // No Devanagari digits should ever appear.
    expect(/[०-९]/.test(formatInr(12345))).toBe(false);
  });
});
