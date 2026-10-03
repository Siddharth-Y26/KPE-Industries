// Turns the source photos in assets/photos/ into web-sized AVIF and WebP files in
// public/images/, and writes data/image-manifest.json for the <Photo> component.
//
// To replace a photo: overwrite the file in assets/photos/ (same name), then run
//   npm run images
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "assets", "photos");
const outputDir = path.join(root, "public", "images");
const manifestPath = path.join(root, "data", "image-manifest.json");

const TARGET_WIDTHS = [480, 800, 1200, 1920];

async function listPhotos(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await listPhotos(full)));
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

// Never upscale: keep the target widths clearly below the source width, plus the source
// width itself.
function widthsFor(sourceWidth) {
  const widths = TARGET_WIDTHS.filter((w) => w <= sourceWidth * 0.85);
  if (sourceWidth <= TARGET_WIDTHS.at(-1)) widths.push(sourceWidth);
  return widths;
}

const manifest = {};
await rm(outputDir, { recursive: true, force: true });

for (const file of (await listPhotos(sourceDir)).sort()) {
  const relative = path.relative(sourceDir, file).split(path.sep).join("/");
  const key = relative.replace(/\.[^.]+$/, "");
  const { width, height } = await sharp(file).metadata();
  const widths = widthsFor(width);

  await mkdir(path.dirname(path.join(outputDir, key)), { recursive: true });
  for (const w of widths) {
    const resized = sharp(file).resize({ width: w });
    await resized.clone().avif({ quality: 55 }).toFile(path.join(outputDir, `${key}-${w}.avif`));
    await resized.clone().webp({ quality: 78 }).toFile(path.join(outputDir, `${key}-${w}.webp`));
  }

  // A short hash of the source photo. It goes in the image URL, so a replaced photo
  // gets a new address and browsers never show a stale copy.
  const version = createHash("sha256").update(await readFile(file)).digest("hex").slice(0, 8);
  manifest[key] = { width, height, widths, version };
  console.log(`${key}  ${width}x${height}  ->  ${widths.join(", ")}`);
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nWrote ${Object.keys(manifest).length} entries to data/image-manifest.json`);
