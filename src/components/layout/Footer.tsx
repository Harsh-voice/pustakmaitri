import { ShieldCheck, Lock, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const t = useTranslations();
  const year = 2026;

  const quickLinks = [
    { key: "nav.home", href: "/" },
    { key: "nav.books", href: "/books" },
    { key: "footer.about", href: "/about" },
    { key: "footer.track", href: "/track" },
  ];
  const policies = [
    { key: "footer.terms", href: "/terms" },
    { key: "footer.privacy", href: "/privacy" },
    { key: "footer.refund", href: "/refund-policy" },
    { key: "footer.shipping", href: "/shipping-policy" },
    { key: "footer.contact", href: "/contact" },
  ];

  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <span className="devanagari text-lg font-bold text-primary">
            {t("common.brand")}
          </span>
          <p className="mt-2 text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{t("footer.quickLinks")}</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-foreground">
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{t("footer.policies")}</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            {policies.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-foreground">
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{t("footer.contactUs")}</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-foreground">
                {siteConfig.contact.email}
              </a>
            </li>
          </ul>
          <div className="mt-4 flex flex-col gap-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" /> {t("trust.securePayments")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="size-3.5 text-primary" /> {t("trust.sslEncrypted")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="size-3.5 text-primary" /> {t("trust.genuineBooks")}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>
            © {year} {t("common.brand")}. {t("footer.rights")}
          </span>
          <span>
            {t("footer.securePayments")} · {t("footer.proprietor")}
          </span>
        </div>
      </div>
    </footer>
  );
}
