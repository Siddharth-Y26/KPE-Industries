import type { Metadata, Viewport } from "next";
import { Barlow, Inter } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { MotionObserver } from "@/components/ui/MotionObserver";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { siteConfig } from "@/config/site";
import { rootMetadata } from "@/lib/metadata";
import "./globals.css";

// Body text in Inter; headings and labels in Barlow, a DIN-style face.
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const heading = Barlow({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: "#071528",
  width: "device-width",
  initialScale: 1,
};

// Only facts the company profile states. No ratings, hours, founding date or staff count.
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  alternateName: siteConfig.shortName,
  url: siteConfig.url,
  description: siteConfig.tagline,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phoneHref.replace("tel:", ""),
  address: {
    "@type": "PostalAddress",
    streetAddress: `${siteConfig.contact.address.line1}, ${siteConfig.contact.address.line2}`,
    addressLocality: siteConfig.contact.address.city,
    addressRegion: siteConfig.contact.address.state,
    postalCode: siteConfig.contact.address.postalCode,
    addressCountry: siteConfig.contact.address.country,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const analyticsToken = siteConfig.analytics.cloudflareToken;

  return (
    <html lang="en-IN" className={`${body.variable} ${heading.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-gold-500 focus:px-4 focus:py-3 focus:font-display focus:font-semibold focus:text-navy-950"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
        <MotionObserver />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }}
        />
        {analyticsToken ? (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: analyticsToken })}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
