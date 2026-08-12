import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/blog";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.somevideopost.com";
const LOCALES = ["en", "es", "de"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // hreflang cluster shared by every localised landing URL, so Google serves
  // the right language variant and avoids duplicate-content penalties.
  const landingLanguages = {
    da: BASE,
    en: `${BASE}/en`,
    es: `${BASE}/es`,
    de: `${BASE}/de`,
    "x-default": BASE,
  };

  // Localised landing pages (da is the root, en/es/de are prefixed)
  const landingPages: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: landingLanguages },
    },
    ...LOCALES.map((loc) => ({
      url: `${BASE}/${loc}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: { languages: landingLanguages },
    })),
  ];

  return [
    ...landingPages,
    {
      url: `${BASE}/hvorfor-somevideopost`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/priser`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/some-ai-video`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/ai-video-for-real-estate`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/generate-ai-video-free`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/ai-video-for-apartment`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...POSTS.map((post) => ({
      url: `${BASE}/blog/${post.id}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${BASE}/signup`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${BASE}/login`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
