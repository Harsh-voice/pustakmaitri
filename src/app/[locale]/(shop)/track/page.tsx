import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import { TrackForm } from "@/components/track/TrackForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale: locale as Locale,
    path: "/track",
    title: t("trackTitle"),
    description: t("trackDescription"),
  });
}

export default async function TrackPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("track");

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      <TrackForm />
    </div>
  );
}
