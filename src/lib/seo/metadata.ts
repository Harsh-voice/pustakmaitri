import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { routing, type Locale } from "@/i18n/routing";

const OG_LOCALE: Record<Locale, string> = { mr: "mr_IN", en: "en_IN" };

function localizedPath(locale: string, path: string): string {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}

/**
 * Build per-route Metadata with a self-referencing canonical, reciprocal
 * hreflang alternates (mr/en/x-default) and Open Graph. `path` is the route
 * WITHOUT the locale prefix (e.g. "/", "/books", "/about").
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  images,
}: {
  locale: Locale;
  path: string;
  title: string;
  description?: string;
  images?: string[];
}): Metadata {
  const base = siteConfig.baseUrl;
  const canonical = `${base}${localizedPath(locale, path)}`;

  const languages: Record<string, string> = {
    "x-default": `${base}${localizedPath(routing.defaultLocale, path)}`,
  };
  for (const loc of routing.locales) {
    languages[loc] = `${base}${localizedPath(loc, path)}`;
  }

  const ogImages = images ?? [`${base}/api/og`];

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.tradeName,
      locale: OG_LOCALE[locale],
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
  };
}
