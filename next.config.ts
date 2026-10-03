import type { NextConfig } from "next";

// The site is exported as static files and served from Cloudflare's edge.
// The only server code is the enquiry endpoint in worker/.
const nextConfig: NextConfig = {
  output: "export",
  // Empty on the real domain. Set to "/<repo>" when the site is served from a
  // sub-folder, as on GitHub Pages.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  // GitHub Pages only: export each page as <page>/index.html. The export also writes a
  // <page>/ folder of prefetch data, and GitHub serves a folder in preference to
  // <page>.html, so without this every page except Home would be a 404 there.
  trailingSlash: process.env.NEXT_PUBLIC_STATIC_PREVIEW === "true",
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;
