import { ImageResponse } from "next/og";
import { getBookBySlug } from "@/lib/books";

export const runtime = "nodejs";

function hueFrom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return h;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  const title = book?.titleEn ?? "Pustak Maitri";
  const author = book?.author ?? "";
  const h = hueFrom(slug);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: `linear-gradient(135deg, hsl(${h} 42% 38%), hsl(${(h + 28) % 360} 48% 26%))`,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, opacity: 0.85 }}>Pustak Maitri</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
          {author ? (
            <div style={{ fontSize: 34, marginTop: 16, opacity: 0.9 }}>{author}</div>
          ) : null}
        </div>
        <div style={{ fontSize: 26, opacity: 0.8 }}>Marathi book · Buy online</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
