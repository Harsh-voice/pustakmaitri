import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";
import { formatInr } from "@/lib/utils";
import { SearchBar } from "@/components/books/SearchBar";
import { CartBadge } from "@/components/cart/CartBadge";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS } from "./nav-items";

export function Header() {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar */}
      <div className="bg-teal text-teal-foreground">
        <div className="mx-auto flex h-8 w-full max-w-7xl items-center justify-center px-4 text-center text-[0.72rem] sm:text-xs">
          {t("book.freeDeliveryAbove", { amount: formatInr(siteConfig.shipping.freeAboveInr) })} · {t("trust.securePayments")}
        </div>
      </div>

      <div className="border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-baseline gap-2">
            <span className="font-display devanagari text-[1.35rem] font-semibold leading-none text-primary">
              {t("common.brand")}
            </span>
          </Link>

          <nav className="ml-3 hidden items-center gap-0.5 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <SearchBar className="hidden w-56 lg:block" />
            <div className="hidden sm:block">
              <LocaleSwitcher />
            </div>
            <CartBadge />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
