// Pre-launch gate: fails while any `TODO(client)` placeholder remains in
// site-config (business/legal facts the client must fill before Razorpay KYC).
import fs from "node:fs";

const file = "src/lib/site-config.ts";
const src = fs.readFileSync(file, "utf8");
const lines = src.split("\n");

const offenders = lines
  .map((line, i) => ({ line: line.trim(), n: i + 1 }))
  .filter(({ line }) => line.includes("TODO(client)") && !line.startsWith("*") && !line.startsWith("//") && !line.includes("export const PLACEHOLDER"));

if (offenders.length) {
  console.error(`Found ${offenders.length} unfilled placeholder(s) in ${file}:`);
  for (const o of offenders) console.error(`  L${o.n}: ${o.line}`);
  console.error("\nFill these with real values before enabling Razorpay live keys.");
  process.exit(1);
}
console.log("No unfilled placeholders — site-config is launch-ready.");
