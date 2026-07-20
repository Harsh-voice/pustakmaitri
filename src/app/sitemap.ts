import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

const base = siteConfig.baseUrl;

function alternates(path: string) {
  const clean = path === "/" ? "" : path;
  const languages: Record<string, string> = {
    "x-default": `${base}/${routing.defaultLocale}${clean}`,
  };
  for (const loc of routing.locales) languages[loc] = `${base}/${loc}${clean}`;
  return languages;
}

function entry(
  path: string,
  opts: { changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"]; priority?: number; lastModified?: Date } = {},
): MetadataRoute.Sitemap[number] {
  return {
    url: `${base}/${routing.defaultLocale}${path === "/" ? "" : path}`,
    lastModified: opts.lastModified,
    changeFrequency: opts.changeFrequency ?? "weekly",
    priority: opts.priority ?? 0.6,
    alternates: { languages: alternates(path) },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    entry("/", { changeFrequency: "daily", priority: 1 }),
    entry("/books", { changeFrequency: "daily", priority: 0.9 }),
    entry("/about", { priority: 0.5 }),
    entry("/contact", { priority: 0.5 }),
    entry("/terms", { priority: 0.3 }),
    entry("/privacy", { priority: 0.3 }),
    entry("/refund-policy", { priority: 0.3 }),
    entry("/shipping-policy", { priority: 0.3 }),
  ];

  try {
    const books = await prisma.book.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    const bookEntries = books.map((b) =>
      entry(`/books/${b.slug}`, {
        changeFrequency: "weekly",
        priority: 0.7,
        lastModified: b.updatedAt,
      }),
    );
    return [...staticEntries, ...bookEntries];
  } catch {
    // Never 500 the whole sitemap on a DB hiccup — return the static routes.
    return staticEntries;
  }
}
