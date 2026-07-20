"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { z } from "zod";
import { checkoutSchema } from "@/lib/validation/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatInr } from "@/lib/utils";
import { shippingFor } from "@/config/commerce";
import { useCart } from "@/store/cart";
import { useHydratedCart } from "@/components/cart/useHydratedCart";

const formSchema = checkoutSchema.omit({ items: true });
type FormValues = z.infer<typeof formSchema>;

type Summary = {
  id: string;
  titleEn: string;
  titleMr: string;
  price: number;
};

export function CheckoutForm() {
  const t = useTranslations();
  const router = useRouter();
  const hydrated = useHydratedCart();
  const lines = useCart((s) => s.lines);

  const [summaries, setSummaries] = useState<Record<string, Summary>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const ids = useMemo(() => lines.map((l) => l.bookId), [lines]);

  useEffect(() => {
    if (!hydrated || ids.length === 0) return;
    fetch("/api/cart/summary", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then((r) => r.json())
      .then((data: { items: Summary[] }) => {
        const map: Record<string, Summary> = {};
        for (const it of data.items) map[it.id] = it;
        setSummaries(map);
      })
      .catch(() => {});
  }, [hydrated, ids]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const subtotal = lines.reduce(
    (sum, l) => sum + (summaries[l.bookId]?.price ?? 0) * l.qty,
    0,
  );
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  async function onSubmit(values: FormValues) {
    setFormError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, items: lines }),
      });
      if (res.status === 503) {
        setFormError(t("errors.generic"));
        setSubmitting(false);
        return;
      }
      if (!res.ok) {
        setFormError(t("errors.generic"));
        setSubmitting(false);
        return;
      }
      const data = await res.json();
      if (typeof window === "undefined" || !window.Razorpay || !data.keyId) {
        setFormError(t("errors.generic"));
        setSubmitting(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount * 100,
        currency: data.currency,
        name: "Pustak Maitri",
        description: data.orderNumber,
        order_id: data.razorpayOrderId,
        prefill: data.prefill,
        theme: { color: "#9a4a2f" },
        handler: async (resp) => {
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(resp),
          }).catch(() => {});
          useCart.getState().clear();
          router.push({ pathname: "/order/success", query: { order: data.orderNumber } });
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      });
      rzp.on("payment.failed", () => {
        router.push({ pathname: "/order/failed", query: { order: data.orderNumber } });
      });
      rzp.open();
    } catch {
      setFormError(t("errors.generic"));
      setSubmitting(false);
    }
  }

  if (hydrated && lines.length === 0) {
    return <p className="py-20 text-center text-muted-foreground">{t("checkout.emptyCart")}</p>;
  }

  const err = (name: keyof FormValues) =>
    errors[name] ? t(errors[name]!.message as string) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 text-lg font-semibold">{t("checkout.contactDetails")}</legend>
          <Field id="customerName" label={t("checkout.name")} error={err("customerName")}>
            <Input id="customerName" {...register("customerName")} autoComplete="name" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="email" label={t("checkout.email")} error={err("email")}>
              <Input id="email" type="email" {...register("email")} autoComplete="email" />
            </Field>
            <Field id="phone" label={t("checkout.phone")} error={err("phone")}>
              <Input id="phone" inputMode="numeric" {...register("phone")} autoComplete="tel" />
            </Field>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 text-lg font-semibold">{t("checkout.shippingAddress")}</legend>
          <Field id="addressLine1" label={t("checkout.addressLine1")} error={err("addressLine1")}>
            <Input id="addressLine1" {...register("addressLine1")} autoComplete="address-line1" />
          </Field>
          <Field id="addressLine2" label={t("checkout.addressLine2")} error={err("addressLine2")}>
            <Input id="addressLine2" {...register("addressLine2")} autoComplete="address-line2" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field id="city" label={t("checkout.city")} error={err("city")}>
              <Input id="city" {...register("city")} autoComplete="address-level2" />
            </Field>
            <Field id="state" label={t("checkout.state")} error={err("state")}>
              <Input id="state" {...register("state")} autoComplete="address-level1" />
            </Field>
            <Field id="pincode" label={t("checkout.pincode")} error={err("pincode")}>
              <Input id="pincode" inputMode="numeric" {...register("pincode")} autoComplete="postal-code" />
            </Field>
          </div>
        </fieldset>
      </div>

      {/* Summary + pay */}
      <aside className="h-fit rounded-lg border bg-card p-5 lg:sticky lg:top-20">
        <h2 className="mb-4 text-lg font-semibold">{t("checkout.orderSummary")}</h2>
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t("cart.subtotal")}</dt>
            <dd>{formatInr(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t("cart.shipping")}</dt>
            <dd>{shipping === 0 ? t("cart.free") : formatInr(shipping)}</dd>
          </div>
        </dl>
        <Separator className="my-4" />
        <div className="mb-5 flex justify-between text-base font-semibold">
          <span>{t("cart.total")}</span>
          <span>{formatInr(total)}</span>
        </div>

        {formError && <p className="mb-3 text-sm text-destructive">{formError}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={submitting || !hydrated}>
          {submitting ? t("checkout.processing") : t("checkout.payNow")}
        </Button>

        <div className="mt-4 flex flex-col gap-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="size-3.5 text-primary" /> {t("checkout.securePayment")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-primary" /> {t("checkout.noCod")}
          </span>
        </div>
      </aside>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
