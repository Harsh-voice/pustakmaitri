import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatInr } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const STATUSES = ["all", "created", "paid", "shipped", "failed"] as const;

export default async function AdminOrdersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  const { status } = await searchParams;
  const filter = STATUSES.includes((status ?? "all") as (typeof STATUSES)[number])
    ? status
    : "all";

  const orders = await prisma.order.findMany({
    where: filter && filter !== "all" ? { status: filter } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { items: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Orders</h1>
        <div className="flex gap-1 text-sm">
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={s === "all" ? `/${locale}/admin` : `/${locale}/admin?status=${s}`}
              className={`rounded px-2.5 py-1 capitalize ${
                (filter ?? "all") === s ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Ship to</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <Link href={`/${locale}/admin/orders/${o.id}`} className="font-mono text-primary hover:underline">
                      {o.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {o.customerName}
                    <div className="text-xs text-muted-foreground">{o.phone}</div>
                  </TableCell>
                  <TableCell>{o.items.reduce((n, i) => n + i.qty, 0)}</TableCell>
                  <TableCell>{formatInr(o.amount)}</TableCell>
                  <TableCell className="text-xs">
                    {o.city}, {o.state} — {o.pincode}
                  </TableCell>
                  <TableCell>
                    <Badge variant={o.status === "paid" ? "default" : o.status === "shipped" ? "secondary" : "outline"}>
                      {o.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
