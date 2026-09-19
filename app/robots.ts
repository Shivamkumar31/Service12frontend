import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.getworkfy.in";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/worker/dashboard", "/login", "/register", "/otp-login", "/become-worker"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

