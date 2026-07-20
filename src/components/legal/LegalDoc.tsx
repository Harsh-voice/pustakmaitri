import type { LegalDoc as LegalDocType } from "@/content/legal/types";

/** Renders a structured legal document in a readable prose column. */
export function LegalDoc({ doc, locale }: { doc: LegalDocType; locale: string }) {
  const dev = locale === "mr" ? "devanagari" : "";
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8 border-b pb-6">
        <h1 className={`text-3xl font-bold tracking-tight ${dev}`}>{doc.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {locale === "mr" ? "शेवटचे अद्यतन" : "Last updated"}: {doc.updated}
        </p>
      </header>

      {doc.intro && <p className={`mb-6 text-base leading-relaxed text-muted-foreground ${dev}`}>{doc.intro}</p>}

      <div className="flex flex-col gap-5">
        {doc.blocks.map((block, i) => {
          if ("h" in block) {
            return (
              <h2 key={i} className={`mt-4 text-xl font-semibold ${dev}`}>
                {block.h}
              </h2>
            );
          }
          if ("ul" in block) {
            return (
              <ul key={i} className={`ml-5 flex list-disc flex-col gap-2 leading-relaxed ${dev}`}>
                {block.ul.map((li, j) => (
                  <li key={j}>{li}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={i} className={`leading-relaxed ${dev}`}>
              {block.p}
            </p>
          );
        })}
      </div>
    </article>
  );
}
