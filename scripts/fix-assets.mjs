#!/usr/bin/env node
/**
 * Downloads images from Lovable CDN and rewrites asset JSON URLs to local paths.
 * Runs automatically before every Vercel build so Lovable's CDN URLs never ship.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { createWriteStream } from "fs";
import { readdirSync } from "fs";
import { get as httpsGet } from "https";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC_ASSETS = join(ROOT, "public", "assets");

mkdirSync(PUBLIC_ASSETS, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (existsSync(dest)) return resolve(); // already cached
    const file = createWriteStream(dest);
    httpsGet(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", reject);
  });
}

const assetsDir = join(ROOT, "src", "assets");
const files = readdirSync(assetsDir)
  .filter((f) => f.endsWith(".asset.json"))
  .map((f) => join(assetsDir, f));

let fixed = 0;
for (const f of files) {
  const data = JSON.parse(readFileSync(f, "utf8"));
  if (!data.url.startsWith("/__l5e/")) continue; // already local

  const filename = data.original_filename;
  const cdnUrl = `https://${data.project_id}.lovableproject.com/__l5e/assets-v1/${data.asset_id}/${filename}`;
  const dest = join(PUBLIC_ASSETS, filename);

  process.stdout.write(`Downloading ${filename}...`);
  try {
    await download(cdnUrl, dest);
    data.url = `/assets/${filename}`;
    writeFileSync(f, JSON.stringify(data, null, 2));
    console.log(" done");
    fixed++;
  } catch (e) {
    console.log(` FAILED: ${e.message}`);
  }
}

console.log(`\nFixed ${fixed} asset(s).`);
