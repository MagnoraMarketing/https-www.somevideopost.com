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

  // da-default pages: bare URL is Danish, en/es/de are prefixed.
  const daDefaultSlugs = [
    "hvorfor-somevideopost",
    "priser",
    "privatlivspolitik",
    "cookiepolitik",
    "handelsbetingelser",
  ];
  const daDefaultPages: MetadataRoute.Sitemap = daDefaultSlugs.flatMap((slug) => {
    const languages = {
      da: `${BASE}/${slug}`,
      en: `${BASE}/en/${slug}`,
      es: `${BASE}/es/${slug}`,
      de: `${BASE}/de/${slug}`,
      "x-default": `${BASE}/${slug}`,
    };
    return [
      { url: `${BASE}/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9, alternates: { languages } },
      ...LOCALES.map((loc) => ({
        url: `${BASE}/${loc}/${slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: { languages },
      })),
    ];
  });

  // en-default pillar pages: bare URL is the English canonical, da/es/de are prefixed.
  const enDefaultSlugs = ["some-ai-video", "ai-video-for-real-estate", "generate-ai-video-free", "ai-video-for-apartment"];
  const enDefaultPages: MetadataRoute.Sitemap = enDefaultSlugs.flatMap((slug) => {
    const languages = {
      en: `${BASE}/${slug}`,
      da: `${BASE}/da/${slug}`,
      es: `${BASE}/es/${slug}`,
      de: `${BASE}/de/${slug}`,
      "x-default": `${BASE}/${slug}`,
    };
    return [
      { url: `${BASE}/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9, alternates: { languages } },
      { url: `${BASE}/da/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8, alternates: { languages } },
      { url: `${BASE}/es/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8, alternates: { languages } },
      { url: `${BASE}/de/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8, alternates: { languages } },
    ];
  });

  return [
    ...landingPages,
    ...daDefaultPages,
    ...enDefaultPages,
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
