import fs from "node:fs";
import path from "node:path";

const src = path.resolve("src/styles.css");
const outDir = path.resolve("dist");
const dest = path.join(outDir, "styles.css");

if (!fs.existsSync(src)) {
  console.log("No src/styles.css found. Skipping CSS copy.");
  process.exit(0);
}

fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log("Copied styles.css -> dist/styles.css");
