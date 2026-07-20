"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchBar } from "@/components/books/SearchBar";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { NAV_ITEMS } from "./nav-items";

export function MobileNav() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={t("nav.menu")}>
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80vw] max-w-xs">
        <SheetHeader>
          <SheetTitle className="devanagari">{t("common.brand")}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 px-4 pb-8">
          <SearchBar />
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-base hover:bg-accent"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>
          <LocaleSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );
}
