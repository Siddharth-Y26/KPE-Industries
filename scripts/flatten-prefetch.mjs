// Next.js prefetches each page's data from a file named like
//   /about/__next.about.__PAGE__.txt
// On Windows the static export writes that file as a nested path instead:
//   out/about/__next.about/__PAGE__.txt
// so every prefetch returns 404 once the site is deployed. This copies each nested
// file to the flat name the browser asks for. It finds nothing to do when the
// export is already flat.
import { copyFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "out");

async function filesUnder(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await filesUnder(full)));
    else files.push(full);
  }
  return files;
}

async function flatten(dir) {
  let copied = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const file of await filesUnder(full)) {
        const flatName = path.relative(dir, file).split(path.sep).join(".");
        await copyFile(file, path.join(dir, flatName));
        copied += 1;
      }
    } else if (entry.name !== "_next") {
      copied += await flatten(full);
    }
  }
  return copied;
}

const copied = await flatten(outDir);
console.log(`[prefetch] Flattened ${copied} prefetch file${copied === 1 ? "" : "s"}.`);
