import type { MetadataRoute } from "next";

// Installable shell only. Offline support is a later phase.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ubuntu Impact",
    short_name: "Ubuntu Impact",
    description: "Human Capital Consulting Partner in Tanzania",
    start_url: "/en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#40006a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
