import { shippingFor } from "@/config/commerce";

/**
 * The single, authoritative order-amount computation. Callers pass prices that
 * came from the DB (never from the client). Returns rupee amounts.
 */
export function computeOrderAmount(items: { price: number; qty: number }[]) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = shippingFor(subtotal);
  return { subtotal, shipping, total: subtotal + shipping };
}
