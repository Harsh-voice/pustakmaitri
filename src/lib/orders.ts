import { prisma } from "@/lib/db";

export function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
}

/** Guest order lookup — requires both the order number AND matching email. */
export function getOrderByNumberAndEmail(orderNumber: string, email: string) {
  return prisma.order.findFirst({
    where: {
      orderNumber,
      email: { equals: email, mode: "insensitive" },
    },
    include: { items: true },
  });
}
