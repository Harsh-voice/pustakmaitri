// Fails if any legal document is missing a locale or a title.
import fs from "node:fs";
import path from "node:path";

const SLUGS = ["about", "contact", "terms", "privacy", "refund-policy", "shipping-policy"];
const dir = "src/content/legal";

let ok = true;
for (const slug of SLUGS) {
  const file = path.join(dir, `${slug}.ts`);
  if (!fs.existsSync(file)) {
    console.error(`  missing content file: ${file}`);
    ok = false;
    continue;
  }
  const src = fs.readFileSync(file, "utf8");
  for (const locale of ["en", "mr"]) {
    // Each bundle must define the locale key with a title.
    if (!new RegExp(`${locale}:\\s*{`).test(src)) {
      console.error(`  ${slug}: missing '${locale}' locale`);
      ok = false;
    }
  }
  if ((src.match(/title:/g) ?? []).length < 2) {
    console.error(`  ${slug}: expected a title for both locales`);
    ok = false;
  }
}

if (!ok) {
  console.error("legal completeness CHECK FAILED");
  process.exit(1);
}
console.log(`legal completeness OK (${SLUGS.length} docs × 2 locales)`);
