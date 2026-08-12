import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.somevideopost.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/hvorfor-somevideopost",
        "/blog",
        "/priser",
        "/login",
        "/signup",
        "/some-ai-video",
        "/ai-video-for-real-estate",
        "/generate-ai-video-free",
        "/ai-video-for-apartment",
      ],
      disallow: [
        "/dashboard",
        "/videos",
        "/posts",
        "/properties",
        "/accounts",
        "/analytics",
        "/billing",
        "/calendar",
        "/api/",
      ],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
