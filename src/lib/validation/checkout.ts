import { z } from "zod";
import { ORDER_LIMITS } from "@/config/commerce";

// Shared client/server checkout schema. The server RE-VALIDATES this — the
// client is never trusted. Note: prices are NOT accepted from the client; only
// bookId + qty. The server derives all money from the DB.
export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "checkout.validation.name").max(120),
  email: z.string().trim().email("checkout.validation.email").max(254),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "checkout.validation.phone"),
  addressLine1: z.string().trim().min(3, "checkout.validation.addressLine1").max(200),
  addressLine2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(2, "checkout.validation.city").max(80),
  state: z.string().trim().min(2, "checkout.validation.state").max(80),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "checkout.validation.pincode"),
  items: z
    .array(
      z.object({
        bookId: z.string().min(1),
        qty: z.number().int().min(1).max(ORDER_LIMITS.maxQtyPerItem),
      }),
    )
    .min(1)
    .max(ORDER_LIMITS.maxItems),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
