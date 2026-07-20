import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getOrderByNumber } from "@/lib/orders";
import { formatInr } from "@/lib/utils";
import { ClearCart } from "@/components/order/ClearCart";
import { OrderStatusPoller } from "@/components/order/OrderStatusPoller";

export default async function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const { order: orderNumber } = await searchParams;

  const order = orderNumber ? await getOrderByNumber(orderNumber) : null;
  const subtotal = order
    ? order.items.reduce((s, i) => s + i.priceSnapshot * i.qty, 0)
    : 0;
  const shipping = order ? order.amount - subtotal : 0;
  const pending = order?.status === "created";

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <ClearCart />
      {order && pending && <OrderStatusPoller active />}

      <div className="flex flex-col items-center gap-3 text-center">
        {pending ? (
          <Loader2 className="size-12 animate-spin text-primary" />
        ) : (
          <CheckCircle2 className="size-12 text-primary" />
        )}
        <h1 className="text-2xl font-bold">
          {pending ? t("payment.verifying") : t("order.successTitle")}
        </h1>
        <p className="text-muted-foreground">
          {pending ? t("order.confirming") : t("order.successMessage")}
        </p>
      </div>

      {order ? (
        <div className="mt-8 rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t("order.orderNumber")}</span>
            <span className="font-mono font-semibold">{order.orderNumber}</span>
          </div>
          <Separator className="my-4" />
          <ul className="flex flex-col gap-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 text-sm">
                <span className="devanagari min-w-0 flex-1">
                  {item.titleSnapshot}
                  <span className="text-muted-foreground"> × {item.qty}</span>
                </span>
                <span className="shrink-0">{formatInr(item.priceSnapshot * item.qty)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <dl className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("cart.subtotal")}</dt>
              <dd>{formatInr(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("cart.shipping")}</dt>
              <dd>{shipping === 0 ? t("cart.free") : formatInr(shipping)}</dd>
            </div>
            <div className="flex justify-between font-semibold">
              <dt>{t("cart.total")}</dt>
              <dd>{formatInr(order.amount)}</dd>
            </div>
          </dl>
          <Separator className="my-4" />
          <div className="text-sm">
            <p className="mb-1 font-medium">{t("checkout.shippingAddress")}</p>
            <address className="not-italic text-muted-foreground">
              {order.customerName}
              <br />
              {order.addressLine1}
              {order.addressLine2 ? <>, {order.addressLine2}</> : null}
              <br />
              {order.city}, {order.state} — {order.pincode}
            </address>
          </div>
        </div>
      ) : (
        <p className="mt-8 text-center text-muted-foreground">{t("errors.generic")}</p>
      )}

      <div className="mt-8 flex justify-center gap-3">
        <Button asChild variant="outline">
          <Link href="/track">{t("order.trackOrder")}</Link>
        </Button>
        <Button asChild>
          <Link href="/books">{t("order.continueShopping")}</Link>
        </Button>
      </div>
    </div>
  );
}
