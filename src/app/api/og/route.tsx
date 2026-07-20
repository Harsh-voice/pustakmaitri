import { ImageResponse } from "next/og";

export const runtime = "nodejs";

// Default site OG image (Latin only — no custom font needed).
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #9a4a2f, #5b2a1c)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 78, fontWeight: 700 }}>Pustak Maitri</div>
        <div style={{ fontSize: 36, marginTop: 20, opacity: 0.9 }}>
          Marathi books, delivered across India
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
