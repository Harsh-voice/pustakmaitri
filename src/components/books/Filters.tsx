"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCatalogParams } from "./use-catalog-params";

export type FilterOption = { slug: string; name: string };
const ALL = "__all__";

function FiltersPanel({
  categories,
  publishers,
}: {
  categories: FilterOption[];
  publishers: FilterOption[];
}) {
  const t = useTranslations("catalog");
  const { searchParams, setParams } = useCatalogParams();

  const [author, setAuthor] = useState(searchParams.get("author") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const category = searchParams.get("category") ?? ALL;
  const publisher = searchParams.get("publisher") ?? ALL;
  const inStock = searchParams.get("inStock") === "true";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>{t("category")}</Label>
        <Select
          value={category}
          onValueChange={(v) => setParams({ category: v === ALL ? null : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("allCategories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("allCategories")}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t("publisher")}</Label>
        <Select
          value={publisher}
          onValueChange={(v) => setParams({ publisher: v === ALL ? null : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("allPublishers")} />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value={ALL}>{t("allPublishers")}</SelectItem>
            {publishers.map((p) => (
              <SelectItem key={p.slug} value={p.slug}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setParams({
            author: author.trim() || null,
            minPrice: minPrice || null,
            maxPrice: maxPrice || null,
          });
        }}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="f-author">{t("author")}</Label>
          <Input
            id="f-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={t("authorPlaceholder")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>{t("priceRange")}</Label>
          <div className="flex items-center gap-2">
            <Input
              inputMode="numeric"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ""))}
              placeholder={t("minPrice")}
              aria-label={t("minPrice")}
            />
            <span className="text-muted-foreground">–</span>
            <Input
              inputMode="numeric"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))}
              placeholder={t("maxPrice")}
              aria-label={t("maxPrice")}
            />
          </div>
        </div>
        <Button type="submit" variant="secondary">
          {t("apply")}
        </Button>
      </form>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="size-4 accent-primary"
          checked={inStock}
          onChange={(e) => setParams({ inStock: e.target.checked ? "true" : null })}
        />
        {t("inStockOnly")}
      </label>

      <Button
        variant="ghost"
        className="justify-start px-0 text-muted-foreground"
        onClick={() =>
          setParams({
            category: null,
            publisher: null,
            author: null,
            minPrice: null,
            maxPrice: null,
            inStock: null,
            q: null,
          })
        }
      >
        {t("clearFilters")}
      </Button>
    </div>
  );
}

export function DesktopFilters(props: {
  categories: FilterOption[];
  publishers: FilterOption[];
}) {
  const t = useTranslations("catalog");
  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {t("filters")}
      </h2>
      <FiltersPanel {...props} />
    </aside>
  );
}

export function MobileFilters(props: {
  categories: FilterOption[];
  publishers: FilterOption[];
}) {
  const t = useTranslations("catalog");
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="size-4" />
          {t("filters")}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("filters")}</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-8">
          <FiltersPanel {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
