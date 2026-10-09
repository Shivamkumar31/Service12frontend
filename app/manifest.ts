import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Getworkfy",
    short_name: "Getworkfy",
    description: "Book verified local workers near you with Getworkfy.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F5F0",
    theme_color: "#101B2B",
    icons: [
      {
        src: "/favicon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
