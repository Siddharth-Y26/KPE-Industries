// The site is a static export, so images are pre-sized by scripts/optimize-images.mjs
// rather than by next/image's on-demand optimiser.
import { siteConfig } from "@/config/site";
import manifest from "@/data/image-manifest.json";

// "duotone" tints every photo navy so mixed-quality sources read as one set.
// Switch to "natural" once the client supplies full-resolution photography.
const TREATMENT: "duotone" | "natural" = "duotone";

type PhotoKey = keyof typeof manifest;

type PhotoProps = {
  src: string;
  alt: string;
  // The CSS width the image is displayed at, e.g. "(min-width: 1024px) 40vw, 100vw".
  sizes: string;
  // Classes for the frame. Give it an aspect ratio or a height.
  className?: string;
  // Load eagerly: only for the image that is visible when the page opens.
  priority?: boolean;
  // The part of the photo to keep in view when the frame crops it, as a CSS
  // object-position such as "50% 20%". Defaults to the centre.
  position?: string;
  // Overrides TREATMENT for this one photo.
  treatment?: "duotone" | "natural";
};

export function Photo({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
  position,
  treatment = TREATMENT,
}: PhotoProps) {
  const entry = manifest[src as PhotoKey];
  if (!entry) throw new Error(`Photo "${src}" is not in data/image-manifest.json. Run "npm run images".`);

  const srcSet = (extension: string) =>
    entry.widths
      .map((width) => `${siteConfig.basePath}/images/${src}-${width}.${extension}?v=${entry.version} ${width}w`)
      .join(", ");
  const largest = entry.widths[entry.widths.length - 1];

  return (
    <div className={`overflow-hidden ${treatment === "duotone" ? "photo-duotone" : "bg-steel-100"} ${className}`}>
      <picture>
        <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
        <img
          src={`${siteConfig.basePath}/images/${src}-${largest}.webp?v=${entry.version}`}
          srcSet={srcSet("webp")}
          sizes={sizes}
          width={entry.width}
          height={entry.height}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          className="h-full w-full object-cover"
          style={position ? { objectPosition: position } : undefined}
        />
      </picture>
    </div>
  );
}
