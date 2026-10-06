# Krishna Power & Engineers website

Corporate website for Krishna Power & Engineers (KPE), Lucknow. Its job is to turn
visitors into project enquiries: every page offers the enquiry form, WhatsApp and a
phone call.

**Status: live** at https://krishnapowereng.in, hosted on Cloudflare, since 7 October 2026.
Still to do: connect the enquiry email, and the dashboard settings in
[Launch steps](#launch-steps). An older preview is still on GitHub Pages at
https://siddharth-y26.github.io/KPE-Industries/ and is to be switched off.

The photos for power plants, steel industries, telecom and cable termination come from
the company profile. Three of them were very small and have been enlarged with an AI
upscaler (Real-ESRGAN), so sharper originals are still wanted.

## How it is put together

- **Next.js + TypeScript + Tailwind CSS**, exported as static files (`out/`).
- **Hosted on Cloudflare Workers.** Static files are served straight from Cloudflare's
  edge. The only server code is the enquiry endpoint in `worker/`.
- **No database, no CMS, no admin panel.** Enquiries are emailed to the business and
  are not stored.

```
Browser ──> Cloudflare (CDN, DDoS protection, WAF)
              ├── static site        out/                     no server code runs
              └── POST /api/enquiry  worker/index.ts ──> email provider ──> business inbox
```

## Commands

Requires Node.js 22 or newer.

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Development server at http://localhost:3000 (the enquiry form needs `npm run preview`) |
| `npm run preview` | Production build, served locally the way Cloudflare serves it, at http://localhost:8787 |
| `npm test` | Tests for the enquiry endpoint and its validation |
| `npm run lint` / `npm run typecheck` | Static checks |
| `npm run images` | Regenerate web images after changing a photo in `assets/photos/` |
| `npm run deploy` | Build and deploy to Cloudflare (the real site) |
| `npm run deploy:pages` | Build and publish the preview to GitHub Pages |

To try the enquiry form locally, copy `.dev.vars.example` to `.dev.vars` and run
`npm run preview`. With `EMAIL_DRY_RUN=true` the email is printed in the terminal
instead of being sent.

On Windows, stop `npm run preview` before building again: the preview server locks
the `out/` folder.

## Where to change things

| To change | Edit |
|---|---|
| Phone, email, address, maps link, social links | `config/site.ts` |
| About text, mission, vision, values, registrations | `data/company.ts` |
| Services | `data/services.ts` |
| Projects, work in hand, portfolio numbers | `data/projects.ts` |
| Capabilities, steel plant areas | `data/capabilities.ts` |
| Enquiry form fields and limits | `lib/enquiry.ts` (used by the form and the server) |
| A photo | Replace the file in `assets/photos/`, then `npm run images` |
| Home page slideshow: photos, captions, order | `heroSlides` in `data/company.ts` (photos in `assets/photos/hero/`) |
| Logo | `public/logo.svg` and `app/icon.svg` (the same drawing) |
| Colours and fonts | `app/globals.css`, `app/layout.tsx` |

Company facts come from the KPE company profile. Do not add clients, figures,
certifications or claims the profile does not support.

Photos are shown in a navy tint so that pictures of mixed quality read as one set.
To show them in natural colour, set `TREATMENT` to `"natural"` in
`components/ui/Photo.tsx`. The home page slideshow already shows its photos in natural
colour.

Phone photos often carry a date stamp in a corner. Crop it off before the photo goes
into `assets/photos/`.

## Settings

Browser-visible settings are baked in at build time. Put them in `.env.production`
(not committed); `.env.example` lists them all.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Final address: `https://krishnapowereng.in`. Required to deploy. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp Business number, digits only. Blank hides all WhatsApp buttons. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key for the form. |
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | Cloudflare Web Analytics token. Blank means no analytics. |

Server-side settings never go in an `.env` file that the build reads:

| Variable | Where | Purpose |
|---|---|---|
| `EMAIL_FROM` | `wrangler.jsonc` | Sender, on a domain verified with the email provider |
| `EMAIL_TO` | `wrangler.jsonc` | Business inbox that receives enquiries |
| `ALLOWED_ORIGINS` | `wrangler.jsonc` | Extra origins allowed to post the form |
| `EMAIL_API_KEY` | `npx wrangler secret put EMAIL_API_KEY` | Email provider (Resend) API key |
| `TURNSTILE_SECRET_KEY` | `npx wrangler secret put TURNSTILE_SECRET_KEY` | Turnstile secret key |

## Preview on GitHub Pages

`npm run deploy:pages` builds the site for the `/KPE-Industries/` sub-folder and pushes
the result to the `gh-pages` branch, which GitHub serves. It is for showing the site
before the domain exists, and it differs from the real site in four ways:

- **The enquiry form does not send.** GitHub Pages serves files only, so the enquiry
  endpoint does not run. The form says so and points to phone and email.
- **The WhatsApp number is a placeholder.** The preview uses the phone number from the
  company profile so that the WhatsApp buttons can be seen. The real site shows them
  only once the confirmed number is set in `.env.production`.
- **No security headers.** GitHub Pages cannot set the Content-Security-Policy and the
  other headers that Cloudflare will send.
- **Not indexed.** The preview asks search engines to stay away, so it does not compete
  with the real domain later.

To update the preview after a change: commit, push `main`, then run
`npm run deploy:pages`. GitHub takes a minute or two to serve the new version, and
browsers may keep the old one for up to ten minutes.

Once the site is live on its domain, turn GitHub Pages off and delete the `gh-pages`
branch.

## Launch steps

The domain is `krishnapowereng.in`, bought through Hostinger. Hostinger is the
registrar only: the site is not hosted there, so no Hostinger web hosting plan is needed.

1. **Domain.** Registered at Hostinger until October 2029. Keep the Hostinger account
   on an email address and phone number the business will keep, with two-factor
   authentication, registrar lock and auto-renewal switched on.
2. **Cloudflare.** Create the business's Cloudflare account, add the domain, and point
   the domain's nameservers at Cloudflare. This is done in Hostinger's domain settings
   and can take a few hours to take effect.
3. **Email.** Create a Resend account and verify the domain (this adds SPF and DKIM
   records). `EMAIL_FROM` in `wrangler.jsonc` is an address on the domain,
   `KPE Website <enquiries@krishnapowereng.in>`. Enquiries are delivered to `EMAIL_TO`
   with the enquirer as reply-to. The existing Yahoo inbox keeps working; no MX records
   change.
4. **Turnstile.** Create a Turnstile widget for the domain. Put the site key in
   `.env.production` and the secret key in `wrangler secret put`.
5. **Settings.** Create `.env.production` from `.env.example` with the site URL
   (`https://krishnapowereng.in`), the confirmed WhatsApp number and the Turnstile site
   key. Leave `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_STATIC_PREVIEW` blank: they are
   for the GitHub Pages preview only.
6. **Custom domain.** `routes` in `wrangler.jsonc` lists the domain and its `www` name,
   so the deploy attaches both. It fails until step 2 has taken effect.
7. **Deploy.** `npx wrangler login`, then `npm run deploy`. In the Cloudflare dashboard,
   turn on "Always Use HTTPS" and add a redirect rule from `www` to the bare domain.
8. **WAF.** Keep Cloudflare's managed rules on. Add one rate-limiting rule for
   `/api/enquiry` as a second layer behind the limit in `wrangler.jsonc`.
9. **Check.** Send a real enquiry and confirm it arrives. Test the WhatsApp, phone,
   email and maps links on a phone. Submit the sitemap in Google Search Console.
10. **Retire the preview.** Turn GitHub Pages off in the repository settings and delete
    the `gh-pages` branch.

## Security

- Static export: no Next.js server, no database and no login to attack.
- `/api/enquiry` accepts only same-origin JSON POSTs of at most 16 KB, rejects unknown
  fields, validates every field on the server, checks a honeypot, limits each IP to
  3 requests a minute, and verifies Turnstile when a secret is set.
- Enquiry email is HTML-escaped, and line breaks are stripped from single-line fields.
- Errors returned to the browser are generic; details go to the Worker's logs, which
  never include the enquirer's details.
- Response headers are written by `scripts/generate-headers.mjs` on every build. The
  Content-Security-Policy lists the hash of each inline script in the build, so no
  `unsafe-inline` is needed for scripts.
- Secrets live only in Cloudflare's secret store and in git-ignored local files.

These are layered controls that follow current good practice. They are not a guarantee
that the site cannot be attacked. Keep dependencies updated (`npm audit`) and rebuild
after security releases of Next.js.
