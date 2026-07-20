"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCatalogParams } from "./use-catalog-params";

export function PaginationBar({
  page,
  pageCount,
}: {
  page: number;
  pageCount: number;
}) {
  const t = useTranslations("catalog");
  const { setParams } = useCatalogParams();
  if (pageCount <= 1) return null;

  const go = (p: number) => setParams({ page: String(p) });

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-4"
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        <ChevronLeft className="size-4" />
        {t("previous")}
      </Button>
      <span className="text-sm text-muted-foreground">
        {t("pageOf", { page, total: pageCount })}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= pageCount}
        onClick={() => go(page + 1)}
      >
        {t("next")}
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}
