"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlaceholderCover } from "@/components/book/PlaceholderCover";
import { formatInr } from "@/lib/utils";
import { shippingFor, SHIPPING } from "@/config/commerce";
import { useCart } from "@/store/cart";
import { useHydratedCart } from "./useHydratedCart";

type Summary = {
  id: string;
  slug: string;
  titleEn: string;
  titleMr: string;
  author: string | null;
  price: number;
  mrp: number;
  coverUrl: string | null;
  inStock: boolean;
};

export function CartView() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const hydrated = useHydratedCart();
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  const [summaries, setSummaries] = useState<Record<string, Summary>>({});
  const ids = useMemo(() => lines.map((l) => l.bookId), [lines]);

  useEffect(() => {
    if (!hydrated || ids.length === 0) return;
    let cancelled = false;
    fetch("/api/cart/summary", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then((r) => r.json())
      .then((data: { items: Summary[] }) => {
        if (cancelled) return;
        const map: Record<string, Summary> = {};
        for (const it of data.items) map[it.id] = it;
        setSummaries(map);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [hydrated, ids]);

  if (!hydrated) {
    return <div className="py-20 text-center text-muted-foreground">{t("common.loading")}</div>;
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <ShoppingBag className="size-10 text-muted-foreground" />
        <p className="text-muted-foreground">{t("cart.empty")}</p>
        <Button asChild>
          <Link href="/books">{t("cart.emptyCta")}</Link>
        </Button>
      </div>
    );
  }

  const priced = lines
    .map((l) => ({ line: l, book: summaries[l.bookId] }))
    .filter((x) => x.book);
  const subtotal = priced.reduce((sum, x) => sum + x.book!.price * x.line.qty, 0);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {/* Lines */}
      <ul className="flex flex-col divide-y">
        {lines.map((line) => {
          const book = summaries[line.bookId];
          const title = book ? (locale === "mr" ? book.titleMr : book.titleEn) : "…";
          return (
            <li key={line.bookId} className="flex gap-4 py-4">
              <Link
                href={book ? `/books/${book.slug}` : "/cart"}
                className="relative block w-16 shrink-0"
              >
                {book?.coverUrl ? (
                  <div className="relative aspect-[2/3] overflow-hidden rounded bg-muted">
                    <Image src={book.coverUrl} alt={title} fill sizes="64px" className="object-cover" />
                  </div>
                ) : book ? (
                  <PlaceholderCover title={book.titleMr} author={book.author} seed={book.slug} />
                ) : (
                  <div className="aspect-[2/3] rounded bg-muted" />
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className={locale === "mr" ? "devanagari line-clamp-2 text-sm font-medium" : "line-clamp-2 text-sm font-medium"}>
                  {title}
                </p>
                {book && <p className="text-sm text-muted-foreground">{formatInr(book.price)}</p>}
                {book && !book.inStock && (
                  <p className="text-xs text-destructive">{t("book.outOfStock")}</p>
                )}
                <div className="mt-auto flex items-center gap-3 pt-2">
                  <div className="flex items-center rounded-md border">
                    <button
                      className="flex size-8 items-center justify-center hover:bg-accent"
                      onClick={() => setQty(line.bookId, line.qty - 1)}
                      aria-label="decrease"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">{line.qty}</span>
                    <button
                      className="flex size-8 items-center justify-center hover:bg-accent"
                      onClick={() => setQty(line.bookId, line.qty + 1)}
                      aria-label="increase"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <button
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => remove(line.bookId)}
                  >
                    <Trash2 className="size-3.5" />
                    {t("cart.remove")}
                  </button>
                </div>
              </div>

              {book && (
                <div className="text-right text-sm font-medium">
                  {formatInr(book.price * line.qty)}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Summary */}
      <aside className="h-fit rounded-lg border bg-card p-5 lg:sticky lg:top-20">
        <h2 className="mb-4 text-lg font-semibold">{t("cart.title")}</h2>
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t("cart.subtotal")}</dt>
            <dd>{formatInr(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t("cart.shipping")}</dt>
            <dd>{shipping === 0 ? t("cart.free") : formatInr(shipping)}</dd>
          </div>
          {shipping > 0 && (
            <p className="text-xs text-muted-foreground">
              {t("book.freeDeliveryAbove", { amount: formatInr(SHIPPING.freeAboveRupees) })}
            </p>
          )}
        </dl>
        <Separator className="my-4" />
        <div className="flex justify-between text-base font-semibold">
          <span>{t("cart.total")}</span>
          <span>{formatInr(total)}</span>
        </div>
        <Button asChild size="lg" className="mt-5 w-full">
          <Link href="/checkout">{t("cart.checkout")}</Link>
        </Button>
        <Button asChild variant="ghost" className="mt-2 w-full">
          <Link href="/books">{t("cart.continueShopping")}</Link>
        </Button>
      </aside>
    </div>
  );
}
