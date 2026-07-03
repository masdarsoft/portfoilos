import { MetadataRoute } from "next";
import { getTenantDomain } from "./lib/getTenantDomain";

// Next.js native robots.ts — auto-served at /robots.txt
export default function robots(): MetadataRoute.Robots {
  const domain = getTenantDomain();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `https://${domain}/sitemap.xml`,
  };
}
