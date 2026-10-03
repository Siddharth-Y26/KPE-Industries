import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

// The share image for links to the site, generated once at build time and exported as
// /og.png. It is a route with a file extension so that it is served as image/png.
export function GET() {
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
          <svg width="72" height="72" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="2" fill="#f2a900" />
            <path d="M22.5 6 11 22.2h7.2L16 34l12.8-17.2h-7.6L22.5 6Z" fill="#071528" />
          </svg>
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
