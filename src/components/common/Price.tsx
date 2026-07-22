import { cn } from "@/lib/utils";
import { formatInr } from "@/lib/utils";

/** Price with optional struck-through MRP when discounted. Always Latin digits. */
export function Price({
  price,
  mrp,
  className,
  size = "md",
}: {
  price: number;
  mrp?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const discounted = mrp != null && mrp > price;
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  } as const;
  return (
    <span className={cn("tnum inline-flex items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-foreground", sizes[size])}>
        {formatInr(price)}
      </span>
      {discounted && (
        <span className="text-sm text-muted-foreground line-through">
          {formatInr(mrp!)}
        </span>
      )}
    </span>
  );
}
