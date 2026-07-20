"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";

/**
 * Rehydrates the persisted cart on the client after mount and reports when it's
 * safe to read cart contents. Components should render a stable placeholder
 * (usually nothing) until `hydrated` is true.
 */
export function useHydratedCart() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    useCart.persist.rehydrate();
    setHydrated(true);
  }, []);
  return hydrated;
}
