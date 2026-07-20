"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Result =
  | { found: true; orderNumber: string; status: string; itemCount: number }
  | { found: false };

const STATUS_KEY: Record<string, string> = {
  created: "statusCreated",
  paid: "statusPaid",
  shipped: "statusShipped",
  failed: "statusFailed",
};

export function TrackForm() {
  const t = useTranslations("track");
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderNumber: orderNumber.trim(), email: email.trim() }),
      });
      setResult(await res.json());
    } catch {
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="orderNumber">{t("orderNumberLabel")}</Label>
          <Input
            id="orderNumber"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="PM-20260720-0001"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">{t("emailLabel")}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "…" : t("submit")}
        </Button>
      </form>

      {result &&
        (result.found ? (
          <div className="rounded-lg border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-semibold">{result.orderNumber}</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {t(STATUS_KEY[result.status] ?? "statusCreated")}
              </span>
            </div>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
            {t("notFound")}
          </p>
        ))}
    </div>
  );
}
