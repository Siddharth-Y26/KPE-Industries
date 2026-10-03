import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

const paths = ["/", "/about", "/services", "/projects", "/capabilities", "/contact", "/privacy", "/disclaimer"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path === "/privacy" || path === "/disclaimer" ? 0.2 : 0.8,
  }));
}
