import ServicesCatalogClient from "./ServicesCatalogClient";
import type { Metadata } from "next";
import { getTenant, FALLBACK_TENANT } from "../../lib/api/tenants";
import { getCategories } from "../../lib/api/catalog";
import { getTenantDomain } from "../../lib/getTenantDomain";

export async function generateMetadata(): Promise<Metadata> {
  const domain = getTenantDomain();
  const tenant = await getTenant(domain).catch(() => FALLBACK_TENANT);
  const siteUrl = tenant.custom_domain ? `https://${tenant.custom_domain}` : `https://${tenant.subdomain}.najdalzian.com`;

  return {
    title: `خدمات تأجير مستلزمات الحفلات والمناسبات بالرياض | ${tenant.name}`,
    description: `جميع خدمات تأجير مستلزمات المناسبات بالرياض لدى ${tenant.name}: مكيفات صحراوية وفريون، خيام ملكية وأوروبية، بيوت شعر تراثية، مراوح رذاذ، دفايات، كراسي، وجلسات.`,
    alternates: {
      canonical: `${siteUrl}/services`,
    },
    openGraph: {
      title: `خدمات تأجير مستلزمات الحفلات والمناسبات بالرياض | ${tenant.name}`,
      description: `جميع خدمات تأجير مستلزمات المناسبات بالرياض لدى ${tenant.name}: مكيفات، خيام، بيوت شعر، مراوح، دفايات، كراسي، وجلسات.`,
      url: `${siteUrl}/services`,
      siteName: tenant.name,
      locale: "ar_SA",
      type: "website",
    },
  };
}

export default async function ServicesPage() {
  const domain = getTenantDomain();
  const tenant = await getTenant(domain).catch(() => FALLBACK_TENANT);
  const categories = await getCategories(domain).catch(() => []);

  return <ServicesCatalogClient categories={categories} tenantDomain={domain} />;
}
