// Reports which launch settings are still missing before a production build.
//   node scripts/check-env.mjs            warn and continue (used by `npm run build`)
//   node scripts/check-env.mjs --strict   fail if the site URL is missing (used by `npm run deploy`)
import nextEnv from "@next/env";

// Read the same files `next build` will: .env.production, .env.local, .env
nextEnv.loadEnvConfig(process.cwd(), false);

const strict = process.argv.includes("--strict");
const missing = [];

const checks = [
  ["NEXT_PUBLIC_SITE_URL", "canonical URLs, the sitemap and share links will point at localhost", true],
  ["NEXT_PUBLIC_WHATSAPP_NUMBER", "WhatsApp buttons are hidden", false],
  ["NEXT_PUBLIC_TURNSTILE_SITE_KEY", "the enquiry form runs without a Turnstile challenge", false],
];

for (const [name, consequence, required] of checks) {
  if (process.env[name]) continue;
  console.warn(`[check-env] ${name} is not set: ${consequence}.`);
  if (required) missing.push(name);
}

if (strict && missing.length > 0) {
  console.error(`\n[check-env] Cannot deploy without: ${missing.join(", ")}. Set it in .env.production.`);
  process.exit(1);
}
