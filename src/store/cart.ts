"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartLine = { bookId: string; qty: number };

type CartState = {
  lines: CartLine[];
  add: (bookId: string, qty?: number) => void;
  setQty: (bookId: string, qty: number) => void;
  remove: (bookId: string) => void;
  clear: () => void;
  totalQty: () => number;
};

const MAX_QTY = 99;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (bookId, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.bookId === bookId);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.bookId === bookId
                  ? { ...l, qty: Math.min(l.qty + qty, MAX_QTY) }
                  : l,
              ),
            };
          }
          return { lines: [...s.lines, { bookId, qty: Math.max(1, qty) }] };
        }),
      setQty: (bookId, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.bookId !== bookId)
              : s.lines.map((l) =>
                  l.bookId === bookId ? { ...l, qty: Math.min(qty, MAX_QTY) } : l,
                ),
        })),
      remove: (bookId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.bookId !== bookId) })),
      clear: () => set({ lines: [] }),
      totalQty: () => get().lines.reduce((n, l) => n + l.qty, 0),
    }),
    {
      name: "pm-cart",
      storage: createJSONStorage(() => localStorage),
      // Server render and first client render are identical (empty) — we
      // rehydrate manually in an effect (see useHydratedCart) to avoid the
      // "hydration mismatch" warning that a persisted store would otherwise
      // trigger.
      skipHydration: true,
    },
  ),
);
