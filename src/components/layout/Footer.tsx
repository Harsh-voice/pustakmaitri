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
    <footer className="mt-20 border-t border-border/70 bg-secondary/40">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <span className="font-display devanagari text-2xl font-semibold text-primary">
            {t("common.brand")}
          </span>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("footer.tagline")}</p>
          <div className="mt-5 flex flex-col gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-teal" /> {t("trust.securePayments")}
            </span>
            <span className="inline-flex items-center gap-2">
              <Lock className="size-3.5 text-teal" /> {t("trust.sslEncrypted")}
            </span>
            <span className="inline-flex items-center gap-2">
              <BookOpen className="size-3.5 text-teal" /> {t("trust.genuineBooks")}
            </span>
          </div>
        </div>

        <FooterCol title={t("footer.quickLinks")} links={quickLinks} t={t} />
        <FooterCol title={t("footer.policies")} links={policies} t={t} />

        <div>
          <h4 className="mb-3.5 text-xs font-semibold uppercase tracking-wider text-foreground/70">
            {t("footer.contactUs")}
          </h4>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="text-sm text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
          >
            {siteConfig.contact.email}
          </a>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1.5 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {year} {t("common.brand")}. {t("footer.rights")}</span>
          <span>{t("footer.securePayments")} · {t("footer.proprietor")}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  t,
}: {
  title: string;
  links: { key: string; href: string }[];
  t: (k: string) => string;
}) {
  return (
    <div>
      <h4 className="mb-3.5 text-xs font-semibold uppercase tracking-wider text-foreground/70">{title}</h4>
      <ul className="flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
              {t(l.key)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
