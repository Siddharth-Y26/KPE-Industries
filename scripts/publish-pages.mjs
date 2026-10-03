// Publishes a PREVIEW of the site to GitHub Pages.
//
//   npm run deploy:pages             build and publish to the gh-pages branch of origin
//   npm run deploy:pages -- --dry    build and stage the files, but do not push
//
// GitHub Pages serves static files only, so the enquiry endpoint does not run there:
// the preview build shows a notice on the form and asks search engines not to index it.
// The real site is deployed to Cloudflare with `npm run deploy`.
import { execFileSync, execSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry");

const git = (args, cwd = root) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();

const remote = git(["remote", "get-url", "origin"]);
const match = /github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/.exec(remote);
if (!match) throw new Error(`origin is not a GitHub repository: ${remote}`);
const [, owner, repo] = match;

// A project site lives at https://<owner>.github.io/<repo>/
const basePath = `/${repo}`;
const siteUrl = `https://${owner.toLowerCase()}.github.io/${repo}`;

// PLACEHOLDER: the phone number from the company profile, so the preview shows the
// WhatsApp buttons. It has not been confirmed as the WhatsApp Business number. The real
// site never falls back to it: it uses NEXT_PUBLIC_WHATSAPP_NUMBER from .env.production
// and hides the buttons while that is blank.
const PREVIEW_WHATSAPP_NUMBER = "918808055589";

console.log(`Building preview for ${siteUrl}/`);
execSync("npm run build", {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
    NEXT_PUBLIC_STATIC_PREVIEW: "true",
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PREVIEW_WHATSAPP_NUMBER,
  },
});

// Stage a copy outside the project, so no second repository ends up inside it.
const stage = mkdtempSync(path.join(tmpdir(), "kpe-pages-"));
try {
  cpSync(path.join(root, "out"), stage, { recursive: true });
  // Without this, GitHub's Jekyll step drops every file and folder starting with "_".
  writeFileSync(path.join(stage, ".nojekyll"), "");
  // Cloudflare's header rules mean nothing to GitHub Pages.
  rmSync(path.join(stage, "_headers"), { force: true });

  if (dryRun) {
    console.log(`\nDry run: files staged in ${stage}, nothing pushed.`);
  } else {
    const identity = ["-c", `user.name=${git(["config", "user.name"])}`, "-c", `user.email=${git(["config", "user.email"])}`];
    git(["init", "--quiet", "--initial-branch=gh-pages"], stage);
    git(["add", "--all"], stage);
    git([...identity, "commit", "--quiet", "-m", "Publish preview"], stage);
    // The branch holds build output only, so it is replaced rather than appended to.
    execFileSync("git", ["push", "--force", remote, "gh-pages"], { cwd: stage, stdio: "inherit" });
    console.log(`\nPublished. GitHub takes a minute or two to serve it at ${siteUrl}/`);
  }
} finally {
  if (!dryRun) rmSync(stage, { recursive: true, force: true, maxRetries: 3 });
}
