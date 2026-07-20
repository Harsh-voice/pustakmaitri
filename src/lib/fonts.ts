import { Inter, Noto_Sans_Devanagari } from "next/font/google";

// Latin/UI face.
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Devanagari face. `Noto_Sans_Devanagari` requires an explicit weight array.
// We include the `latin` subset too so mixed strings (e.g. a Marathi title with
// a stray Latin character) never fall back to a system font mid-word.
export const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-devanagari",
  display: "swap",
});
