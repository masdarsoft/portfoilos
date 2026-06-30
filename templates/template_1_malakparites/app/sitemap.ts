import { MetadataRoute } from "next";
import { getCategories } from "../lib/api/catalog";
import { getTenant, FALLBACK_TENANT } from "../lib/api/tenants";
import { getTenantDomain } from "../lib/getTenantDomain";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = getTenantDomain();
  const tenant = await getTenant(domain).catch(() => FALLBACK_TENANT);
  const categories = await getCategories(domain).catch(() => []);
  
  const baseUrl = tenant.custom_domain ? `https://${tenant.custom_domain}` : `https://${tenant.subdomain}.najdalzian.com`;
  const today = new Date().toISOString().split("T")[0];

  // Core pages
  const corePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tanseeq-manasabat`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic service category pages loaded from API
  const servicePages: MetadataRoute.Sitemap = categories.map((category) => {
    return {
      url: `${baseUrl}/${category.id}`,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    };
  });

  return [...corePages, ...servicePages];
}
