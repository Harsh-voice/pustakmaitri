// Fails if messages/mr.json and messages/en.json don't have identical key sets.
import fs from "node:fs";

type Json = Record<string, unknown>;

function keys(obj: Json, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? keys(v as Json, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );
}

const mr = JSON.parse(fs.readFileSync("messages/mr.json", "utf8")) as Json;
const en = JSON.parse(fs.readFileSync("messages/en.json", "utf8")) as Json;
const mk = new Set(keys(mr));
const ek = new Set(keys(en));

const onlyMr = [...mk].filter((k) => !ek.has(k));
const onlyEn = [...ek].filter((k) => !mk.has(k));

if (onlyMr.length || onlyEn.length) {
  console.error("i18n parity MISMATCH");
  if (onlyMr.length) console.error("  only in mr:", onlyMr);
  if (onlyEn.length) console.error("  only in en:", onlyEn);
  process.exit(1);
}
console.log(`i18n parity OK (${mk.size} keys in both locales)`);
