"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalogParams } from "./use-catalog-params";

export function SortSelect() {
  const t = useTranslations("catalog");
  const { searchParams, setParams } = useCatalogParams();
  const value = searchParams.get("sort") ?? "new";

  return (
    <Select value={value} onValueChange={(v) => setParams({ sort: v })}>
      <SelectTrigger className="w-[190px]" aria-label={t("sort")}>
        <SelectValue placeholder={t("sort")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="new">{t("sortNew")}</SelectItem>
        <SelectItem value="price_asc">{t("sortPriceAsc")}</SelectItem>
        <SelectItem value="price_desc">{t("sortPriceDesc")}</SelectItem>
        <SelectItem value="title">{t("sortTitle")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
