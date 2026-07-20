"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";

/** Belt-and-suspenders: clears the cart once when the success page mounts. */
export function ClearCart() {
  useEffect(() => {
    useCart.persist.rehydrate();
    useCart.getState().clear();
  }, []);
  return null;
}
