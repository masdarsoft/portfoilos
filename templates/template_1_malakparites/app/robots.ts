import { MetadataRoute } from "next";

// Next.js native robots.ts — auto-served at /robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://najdalzian.com/sitemap.xml",
  };
}
