import "dotenv/config";
import { existsSync } from "node:fs";
import { readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import * as XLSX from "xlsx";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { CANONICAL_CATEGORIES, normalizeCategory } from "../src/lib/categories";
import { slugify } from "../src/lib/utils";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Normalized book shape both the real importer and the synthetic generator emit.
type CleanBook = {
  titleEn: string;
  titleMr: string;
  author: string | null;
  mrp: number;
  price: number;
  publisherName: string;
  categorySlug: string;
};

// Deterministic slug: kebab(titleEn) + short stable hash of the natural key, so
// re-running the seed is idempotent and true-duplicate rows collapse while real
// edition variants stay separate.
function bookSlug(b: CleanBook): string {
  const key = `${b.titleEn}|${b.titleMr}|${b.publisherName}|${b.mrp}`;
  const hash = createHash("sha1").update(key).digest("hex").slice(0, 6);
  return `${slugify(b.titleEn)}-${hash}`;
}

function toInt(v: unknown): number {
  const digits = String(v ?? "").replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function locateXlsx(): string | null {
  const configured = process.env.CATALOGUE_XLSX;
  if (configured && existsSync(configured)) return configured;
  const dataDir = path.join(process.cwd(), "data");
  if (existsSync(dataDir)) {
    const xlsx = readdirSync(dataDir).find((f) => f.toLowerCase().endsWith(".xlsx"));
    if (xlsx) return path.join(dataDir, xlsx);
  }
  return null;
}

// ---- Real importer (Sheet1, no header, positional 0-indexed columns) --------
function parseSpreadsheet(file: string): CleanBook[] {
  const wb = XLSX.readFile(file);
  const ws = wb.Sheets["Sheet1"] ?? wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(ws, {
    header: 1,
    raw: false,
    defval: "",
  });

  const out: CleanBook[] = [];
  for (const r of rows) {
    const titleEn = String(r[1] ?? "").trim();
    const titleMr = String(r[14] ?? "").trim();
    if (!titleEn && !titleMr) continue; // skip blank rows

    let author: string | null = String(r[2] ?? "").trim();
    if (!author || author.toUpperCase() === "NA") author = null;

    const mrp = toInt(r[3]) || 0;
    const publisherName = String(r[7] ?? "").trim() || "Unknown";
    const categorySlug = normalizeCategory(String(r[20] ?? ""));

    out.push({
      titleEn: titleEn || titleMr,
      titleMr: titleMr || titleEn,
      author,
      mrp,
      price: mrp,
      publisherName,
      categorySlug,
    });
  }
  return out;
}

// ---- Synthetic fallback (only when the real file is absent) -----------------
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateSynthetic(count = 500): CleanBook[] {
  const rand = mulberry32(20260720);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

  const prefixes = ["माझ्या", "अखेरचे", "हरवलेले", "निळे", "उंच", "शेवटचा", "पहिला", "अनोळखी", "स्वप्नातील", "मुक्त"];
  const nouns = ["प्रवास", "आठवणी", "गोष्टी", "किनारा", "आकाश", "पाऊस", "सावली", "क्षितिज", "वाट", "गाणी", "मैफल", "पानगळ"];
  const enWords = ["Pravas", "Aathvani", "Goshti", "Kinara", "Aakash", "Paus", "Savli", "Kshitij", "Vaat", "Gaani"];
  const authorsMr = ["वि. स. खांडेकर", "पु. ल. देशपांडे", "रणजित देसाई", "व. पु. काळे", "शिवाजी सावंत", "सुधा मूर्ती", "गौरी देशपांडे", "अनिल अवचट", "नारायण धारप", "मिलिंद बोकील"];
  const publishers = ["Mehta Publishing", "Rajhans Prakashan", "Popular Prakashan", "Continental", "Mouj", "Dilipraj", "Manovikas", "Saket", "Rohan", "Jyotsna"];
  const slugs = CANONICAL_CATEGORIES.map((c) => c.slug);

  const out: CleanBook[] = [];
  for (let i = 0; i < count; i++) {
    const titleMr = `${pick(prefixes)} ${pick(nouns)}`;
    const titleEn = `${pick(enWords)} ${i + 1}`;
    out.push({
      titleEn,
      titleMr: `${titleMr} ${i + 1}`,
      author: pick(authorsMr),
      mrp: 100 + Math.floor(rand() * 700),
      price: 0,
      publisherName: pick(publishers),
      categorySlug: slugs[i % slugs.length], // ensure every category is populated
    });
  }
  return out.map((b) => ({ ...b, price: b.mrp }));
}

// ---- Upsert helpers ---------------------------------------------------------
function uniquePublisherSlugs(names: string[]): Map<string, string> {
  const map = new Map<string, string>();
  const used = new Set<string>();
  for (const name of names) {
    let base = slugify(name);
    let slug = base;
    let n = 2;
    while (used.has(slug)) slug = `${base}-${n++}`;
    used.add(slug);
    map.set(name, slug);
  }
  return map;
}

async function chunkedUpsertBooks(
  books: CleanBook[],
  categoryIds: Map<string, string>,
  publisherIds: Map<string, string>,
) {
  const seen = new Set<string>();
  const deduped: (CleanBook & { slug: string })[] = [];
  for (const b of books) {
    const slug = bookSlug(b);
    if (seen.has(slug)) continue; // true-duplicate row
    seen.add(slug);
    deduped.push({ ...b, slug });
  }

  const CHUNK = 100;
  for (let i = 0; i < deduped.length; i += CHUNK) {
    const chunk = deduped.slice(i, i + CHUNK);
    await Promise.all(
      chunk.map((b) => {
        const categoryId = categoryIds.get(b.categorySlug) ?? categoryIds.get("itar")!;
        const publisherId = publisherIds.get(b.publisherName)!;
        return prisma.book.upsert({
          where: { slug: b.slug },
          create: {
            slug: b.slug,
            titleEn: b.titleEn,
            titleMr: b.titleMr,
            author: b.author,
            mrp: b.mrp,
            price: b.price,
            inStock: true,
            stockQty: 5,
            isActive: true,
            categoryId,
            publisherId,
          },
          update: {
            titleEn: b.titleEn,
            titleMr: b.titleMr,
            author: b.author,
            mrp: b.mrp,
            price: b.price,
            categoryId,
            publisherId,
          },
        });
      }),
    );
    process.stdout.write(`  upserted ${Math.min(i + CHUNK, deduped.length)}/${deduped.length}\r`);
  }
  process.stdout.write("\n");
  return deduped.length;
}

async function main() {
  const file = locateXlsx();
  const books = file ? parseSpreadsheet(file) : generateSynthetic();
  console.log(
    file
      ? `Importing from ${file} (${books.length} rows).`
      : `No catalogue file found — seeding ${books.length} synthetic books.`,
  );

  // 1. Categories
  console.log("Upserting categories…");
  const categoryIds = new Map<string, string>();
  for (const c of CANONICAL_CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: { nameEn: c.nameEn, nameMr: c.nameMr },
    });
    categoryIds.set(c.slug, row.id);
  }

  // 2. Publishers
  console.log("Upserting publishers…");
  const publisherNames = [...new Set(books.map((b) => b.publisherName))];
  const publisherSlugs = uniquePublisherSlugs(publisherNames);
  const publisherIds = new Map<string, string>();
  for (const name of publisherNames) {
    const row = await prisma.publisher.upsert({
      where: { name },
      create: { name, slug: publisherSlugs.get(name)! },
      update: {},
    });
    publisherIds.set(name, row.id);
  }
  console.log(`  ${publisherNames.length} publishers.`);

  // 3. Books
  console.log("Upserting books…");
  const inserted = await chunkedUpsertBooks(books, categoryIds, publisherIds);

  const total = await prisma.book.count();
  console.log(`Done. ${inserted} books processed; ${total} books in DB.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
