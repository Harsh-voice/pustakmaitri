import { cn } from "@/lib/utils";

// Stable hue from a string so each book gets a consistent spine color.
function hueFrom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return h;
}

/**
 * Designed book-jacket placeholder used when a book has no real cover image.
 * Framed, textured, title-forward with an author band and a faded initial —
 * reads as an intentional cover, not a broken image. Devanagari-legible:
 * generous line-height, no letter-spacing, no uppercase on the title.
 */
export function PlaceholderCover({
  title,
  author,
  seed,
  size = "sm",
  className,
}: {
  title: string;
  author?: string | null;
  seed: string;
  size?: "sm" | "lg";
  className?: string;
}) {
  const h = hueFrom(seed);
  const bg = `linear-gradient(150deg, hsl(${h} 44% 39%), hsl(${(h + 30) % 360} 50% 25%))`;
  const first = (title || "?").trim().charAt(0);
  const lg = size === "lg";

  return (
    <div
      className={cn(
        "relative aspect-[2/3] w-full overflow-hidden rounded-md text-white shadow-md",
        className,
      )}
      style={{ backgroundImage: bg }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(130% 90% at 28% -10%, rgba(255,255,255,.16), transparent 55%), radial-gradient(100% 60% at 80% 120%, rgba(0,0,0,.30), transparent 60%), repeating-linear-gradient(135deg, rgba(255,255,255,.04) 0 2px, transparent 2px 8px)",
        }}
      />
      <div
        className="absolute inset-y-0 left-0 w-2 bg-black/25"
        style={{ boxShadow: "inset -2px 0 4px rgba(0,0,0,.25)" }}
      />
      <div className="pointer-events-none absolute inset-[9px] rounded-[3px] border border-white/30" />
      <div
        className={cn(
          "devanagari pointer-events-none absolute -bottom-6 -right-2 select-none font-bold leading-none text-white/10",
          lg ? "text-[13rem]" : "text-[7rem]",
        )}
        aria-hidden="true"
      >
        {first}
      </div>

      <div className={cn("relative grid h-full grid-rows-[auto_1fr_auto] gap-2", lg ? "p-6" : "p-4")}>
        <span className={cn("uppercase tracking-[0.16em] text-white/70", lg ? "text-[0.7rem]" : "text-[0.6rem]")}>
          पुस्तक मैत्री
        </span>
        <p
          className={cn(
            "devanagari self-center text-center font-semibold leading-[1.55] line-clamp-6",
            lg ? "text-2xl" : "text-[0.95rem]",
          )}
          style={{ textShadow: "0 1px 3px rgba(0,0,0,.3)", textWrap: "balance" }}
        >
          {title}
        </p>
        <p
          className={cn(
            "devanagari line-clamp-2 border-t border-white/30 pt-2 text-center text-white/90",
            lg ? "text-sm" : "text-[0.7rem]",
          )}
        >
          {author || "पुस्तक मैत्री"}
        </p>
      </div>
    </div>
  );
}
