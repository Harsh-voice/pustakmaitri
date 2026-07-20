"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Renders the coverUrl field. Lets the admin paste a URL directly OR upload an
// image file (posted to /api/admin/upload, which returns a public URL).
export function CoverUploader({ defaultUrl }: { defaultUrl?: string | null }) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "upload failed");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="coverUrl">Cover image URL</Label>
      <Input
        id="coverUrl"
        name="coverUrl"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://… (or upload below)"
      />
      <div className="flex items-center gap-3">
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onFile} className="text-sm" />
        {uploading && <span className="text-xs text-muted-foreground">Uploading…</span>}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="cover preview" className="mt-1 h-32 w-auto rounded border object-cover" />
      )}
    </div>
  );
}
