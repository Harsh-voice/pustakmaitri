import { cn } from "@/lib/utils";

// Stable hue from a string so each book gets a consistent spine color.
function hueFrom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return h;
}

/**
 * Intentional gradient/spine-style cover used when a book has no real image.
 * Devanagari-legible: generous line-height, no letter-spacing, no uppercase.
 */
export function PlaceholderCover({
  title,
  author,
  seed,
  className,
}: {
  title: string;
  author?: string | null;
  seed: string;
  className?: string;
}) {
  const h = hueFrom(seed);
  const from = `hsl(${h} 42% 38%)`;
  const to = `hsl(${(h + 28) % 360} 48% 26%)`;
  const spine = `hsl(${(h + 28) % 360} 50% 20%)`;

  return (
    <div
      className={cn(
        "relative flex aspect-[2/3] w-full flex-col justify-between overflow-hidden rounded-md p-4 text-white shadow-sm",
        className,
      )}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="false"
    >
      {/* Spine */}
      <div
        className="absolute inset-y-0 left-0 w-2.5"
        style={{ backgroundColor: spine }}
      />
      <p
        className="devanagari line-clamp-4 pr-1 pl-2 text-[0.95rem] font-semibold leading-[1.65]"
        style={{ textWrap: "balance" } as React.CSSProperties}
      >
        {title}
      </p>
      {author ? (
        <p className="devanagari line-clamp-2 pl-2 text-xs/relaxed text-white/80">
          {author}
        </p>
      ) : (
        <span className="pl-2 text-[0.65rem] uppercase tracking-wide text-white/60">
          पुस्तक मैत्री
        </span>
      )}
    </div>
  );
}
