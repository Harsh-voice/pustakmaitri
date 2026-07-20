"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * While an order is still `created` (payment being confirmed by the webhook),
 * refresh the server component periodically until it flips to paid/failed or a
 * max number of attempts is reached.
 */
export function OrderStatusPoller({ active }: { active: boolean }) {
  const router = useRouter();
  const attempts = useRef(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      attempts.current += 1;
      if (attempts.current > 20) {
        clearInterval(id);
        return;
      }
      router.refresh();
    }, 3000);
    return () => clearInterval(id);
  }, [active, router]);

  return null;
}
