import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SearchBar } from "@/components/books/SearchBar";
import { CartBadge } from "@/components/cart/CartBadge";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS } from "./nav-items";

export function Header() {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 flex-col leading-none">
          <span className="devanagari text-lg font-bold text-primary">
            {t("common.brand")}
          </span>
          <span className="hidden text-[0.65rem] text-muted-foreground sm:block">
            {t("common.tagline")}
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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
    </header>
  );
}
