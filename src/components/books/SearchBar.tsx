"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { useCatalogParams } from "./use-catalog-params";

export function SearchBar({ className }: { className?: string }) {
  const t = useTranslations("catalog");
  const { searchParams, setParams } = useCatalogParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        setParams({ q: value.trim() || null });
      }}
      role="search"
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="pl-9"
          aria-label={t("searchPlaceholder")}
        />
      </div>
    </form>
  );
}
