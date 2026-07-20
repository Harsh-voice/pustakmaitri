"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";

export function AddToCartButton({
  bookId,
  disabled,
  className,
  size = "default",
}: {
  bookId: string;
  disabled?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg";
}) {
  const t = useTranslations("book");
  return (
    <Button
      size={size}
      className={className}
      disabled={disabled}
      onClick={() => {
        useCart.getState().add(bookId);
        toast.success(t("added"));
      }}
    >
      <ShoppingCart className="size-4" />
      {t("addToCart")}
    </Button>
  );
}
