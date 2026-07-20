import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatInr } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { markShipped } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetail({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  const subtotal = order.items.reduce((s, i) => s + i.priceSnapshot * i.qty, 0);
  const shipping = order.amount - subtotal;

  return (
    <div className="mx-auto max-w-2xl">
      <Link href={`/${locale}/admin`} className="text-sm text-muted-foreground hover:text-foreground">
        ← All orders
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-mono text-xl font-semibold">{order.orderNumber}</h1>
        <Badge variant={order.status === "paid" ? "default" : "secondary"}>{order.status}</Badge>
      </div>

      <div className="mt-6 rounded-lg border bg-background p-6">
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Customer</h2>
        <p>{order.customerName}</p>
        <p className="text-sm text-muted-foreground">{order.email} · {order.phone}</p>
        <address className="mt-2 not-italic text-sm text-muted-foreground">
          {order.addressLine1}
          {order.addressLine2 ? `, ${order.addressLine2}` : ""}
          <br />
          {order.city}, {order.state} — {order.pincode}
        </address>

        <Separator className="my-4" />

        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Items</h2>
        <ul className="flex flex-col gap-2">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between gap-4 text-sm">
              <span className="devanagari">{i.titleSnapshot} × {i.qty}</span>
              <span>{formatInr(i.priceSnapshot * i.qty)}</span>
            </li>
          ))}
        </ul>

        <Separator className="my-4" />
        <dl className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatInr(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Free" : formatInr(shipping)}</dd></div>
          <div className="flex justify-between font-semibold"><dt>Total</dt><dd>{formatInr(order.amount)}</dd></div>
        </dl>

        {order.razorpayPaymentId && (
          <p className="mt-3 text-xs text-muted-foreground">Razorpay payment: {order.razorpayPaymentId}</p>
        )}

        {order.status === "paid" && (
          <form
            action={async () => {
              "use server";
              await markShipped(locale, order.id);
            }}
            className="mt-5"
          >
            <Button type="submit">Mark as shipped</Button>
          </form>
        )}
      </div>
    </div>
  );
}
