import { getTranslations, setRequestLocale } from "next-intl/server";
import { XCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function OrderFailedPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const { order } = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6">
      <XCircle className="size-12 text-destructive" />
      <h1 className="font-display text-3xl font-semibold">{t("order.failedTitle")}</h1>
      <p className="text-muted-foreground">{t("order.failedMessage")}</p>
      {order && (
        <p className="text-sm text-muted-foreground">
          {t("order.orderNumber")}: <span className="font-mono">{order}</span>
        </p>
      )}
      <div className="mt-4 flex gap-3">
        <Button asChild>
          <Link href="/checkout">{t("order.tryAgain")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/books">{t("order.continueShopping")}</Link>
        </Button>
      </div>
    </div>
  );
}
