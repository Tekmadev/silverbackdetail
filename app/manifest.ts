import type { MetadataRoute } from "next";
import { businessConfig } from "@/lib/config/business";

/**
 * Web app manifest, served at /manifest.webmanifest. Next.js links it
 * automatically. Brand name and palette come from the config so a rebrand is a
 * single edit. Colors match the site's dark theme (ink) for a seamless install.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: businessConfig.name,
    short_name: "Silverback",
    description: businessConfig.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
