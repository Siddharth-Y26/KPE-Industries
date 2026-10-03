import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const defaultTitle = "Krishna Power & Engineers | Electrical & Power Infrastructure Solutions";

export const defaultDescription =
  "Krishna Power & Engineers provides electrical engineering, power infrastructure and telecom infrastructure solutions for the power, steel and cement industries. Based in Lucknow, Uttar Pradesh.";

// Full URLs, built from the site URL so they stay correct when the site is served
// from a sub-folder.
const absolute = (path: string) => `${siteConfig.url}${path}`;

// Generated at build time by app/og.png/route.tsx.
const shareImage = {
  url: absolute("/og.png"),
  width: 1200,
  height: 630,
  alt: `${siteConfig.name}: ${siteConfig.tagline}`,
};

// Next.js replaces the whole openGraph and twitter objects when a page sets them, so
// every page builds them from here rather than overriding one field.
function social(title: string, description: string, path: string): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: "en_IN",
      title,
      description,
      url: absolute(path),
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: defaultTitle, template: `%s | ${siteConfig.name}` },
  description: defaultDescription,
  applicationName: siteConfig.name,
  alternates: { canonical: absolute("/") },
  // A preview build must not be indexed: it would compete with the real domain later.
  robots: siteConfig.staticPreview ? { index: false, follow: false } : { index: true, follow: true },
  formatDetection: { telephone: false },
  ...social(defaultTitle, defaultDescription, "/"),
};

// Per-page metadata: title, description, canonical URL and matching social tags.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: absolute(path) },
    ...social(`${title} | ${siteConfig.name}`, description, path),
  };
}
