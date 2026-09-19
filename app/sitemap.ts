import type { MetadataRoute } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function slugify(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.getworkfy.in";
  const publicRoutes = [
    { path: "/", changeFrequency: "daily" as const, priority: 1 },
    { path: "/workers", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/how-it-works", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/blog", changeFrequency: "weekly" as const, priority: 0.6 },
    { path: "/contact-us", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/help", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/cookies", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/safety-center", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/verification-process", changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const entries = publicRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    changeFrequency,
    priority,
  }));

  try {
    const response = await fetch(`${API_URL}/categories`, { next: { revalidate: 3600 } });
    if (!response.ok) return entries;

    const { categories = [] } = await response.json();
    return [
      ...entries,
      ...categories.map((category: { name: string }) => ({
        url: `${baseUrl}/services/${slugify(category.name)}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return entries;
  }
}
