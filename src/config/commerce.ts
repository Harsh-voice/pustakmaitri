import { siteConfig } from "@/lib/site-config";

// Shipping numbers live in site-config (single file the client edits). This
// module is the authoritative computation used by BOTH the cart UI (display)
// and the server (charged amount).
export const SHIPPING = {
  flatRateRupees: siteConfig.shipping.flatRateInr,
  freeAboveRupees: siteConfig.shipping.freeAboveInr,
  currency: "INR" as const,
};

/** Shipping charge (rupees) for a given item subtotal. Free strictly above the
 *  threshold; e.g. 499 -> 49, 500 -> 0. */
export function shippingFor(subtotalRupees: number): number {
  return subtotalRupees > SHIPPING.freeAboveRupees ? 0 : SHIPPING.flatRateRupees;
}

// Guard rails for a single order (defensive limits used server-side).
export const ORDER_LIMITS = {
  maxItems: 50,
  maxQtyPerItem: 99,
  maxAmountRupees: 500000,
};
