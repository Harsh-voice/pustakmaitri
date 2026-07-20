import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import { getLegalDoc, type LegalSlug } from "@/content/legal";
import { LegalDoc } from "./LegalDoc";

type Params = Promise<{ locale: string }>;

export async function legalMetadata(slug: LegalSlug, params: Params): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const doc = getLegalDoc(slug, loc);
  return buildMetadata({
    locale: loc,
    path: `/${slug}`,
    title: doc.title,
    description: doc.intro ?? doc.title,
  });
}

export async function LegalPageContent({ slug, params }: { slug: LegalSlug; params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = getLegalDoc(slug, locale as Locale);
  return <LegalDoc doc={doc} locale={locale} />;
}
