"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = { mr: "मराठी", en: "English" };

export function LocaleSwitcher() {
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function switchTo(locale: string) {
    if (locale === active) return;
    const query = Object.fromEntries(searchParams.entries());
    // Stay on the current page, preserving query params.
    router.replace({ pathname, query }, { locale });
  }

  return (
    <div
      className="inline-flex items-center rounded-md border p-0.5 text-xs"
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          aria-pressed={loc === active}
          className={cn(
            "rounded px-2 py-1 transition-colors",
            loc === active
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {LABELS[loc] ?? loc}
        </button>
      ))}
    </div>
  );
}
