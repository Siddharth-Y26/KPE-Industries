import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

// The share image for links to the site, generated once at build time and exported as
// /og.png. It is a route with a file extension so that it is served as image/png.
export async function GET() {
  const logo = await readFile(path.join(process.cwd(), "public", "logo.svg"), "base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: "#071528",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- drawn into the PNG, not a page */}
          <img
            src={`data:image/svg+xml;base64,${logo}`}
            width={88}
            height={88}
            style={{ borderRadius: 44, border: "2px solid rgba(255, 255, 255, 0.4)" }}
          />
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#8da9c4" }}>
            LUCKNOW, UTTAR PRADESH
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            Krishna Power &amp; Engineers
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 34, lineHeight: 1.35, color: "#c9d6e3", maxWidth: 940 }}>
            {siteConfig.tagline}
          </div>
        </div>
        <div style={{ display: "flex", width: 120, height: 8, backgroundColor: "#f2a900" }} />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
