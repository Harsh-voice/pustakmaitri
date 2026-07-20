"use client";

import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/store/cart";
import { useHydratedCart } from "./useHydratedCart";

export function CartBadge() {
  const t = useTranslations("nav");
  const hydrated = useHydratedCart();
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));

  return (
    <Link
      href="/cart"
      className="relative inline-flex size-9 items-center justify-center rounded-md hover:bg-accent"
      aria-label={t("cart")}
    >
      <ShoppingCart className="size-5" />
      {hydrated && count > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
