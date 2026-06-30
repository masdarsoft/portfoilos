import type { Metadata } from "next";
import TanseeqClient from "./TanseeqClient";
import { getTenant, FALLBACK_TENANT } from "../../lib/api/tenants";
import { getCategories } from "../../lib/api/catalog";
import { getTenantDomain } from "../../lib/getTenantDomain";

export async function generateMetadata(): Promise<Metadata> {
  const domain = getTenantDomain();
  const tenant = await getTenant(domain).catch(() => FALLBACK_TENANT);
  const siteUrl = tenant.custom_domain ? `https://${tenant.custom_domain}` : `https://${tenant.subdomain}.malakparties.com`;

  return {
    title: `تنسيق الحفلات والمناسبات الملكية بالرياض | ${tenant.name}`,
    description: `مؤسسة ${tenant.name}: أرقى خدمات تنسيق وتنظيم الحفلات والمناسبات الملكية بالرياض. تجهيز متكامل للأفراح والفعاليات الرسمية والخاصة بأعلى معايير الفخامة.`,
    alternates: {
      canonical: `${siteUrl}/tanseeq-manasabat`,
    },
    openGraph: {
      title: `تنسيق الحفلات والمناسبات الملكية بالرياض | ${tenant.name}`,
      description: `أرقى خدمات تنسيق وتنظيم الحفلات والمناسبات الملكية بالرياض لدى ${tenant.name}. تجهيز متكامل للأفراح والفعاليات من مكان واحد بأعلى معايير الفخامة.`,
      url: `${siteUrl}/tanseeq-manasabat`,
      siteName: tenant.name,
      locale: "ar_SA",
      type: "website",
      images: [
        {
          url: tenant.logo || "/logo.png",
          width: 1200,
          height: 630,
          alt: `تنسيق الحفلات والمناسبات الملكية بالرياض - ${tenant.name}`,
        },
      ],
    },
  };
}

export default async function TanseeqManasabatPage() {
  const domain = getTenantDomain();
  const tenant = await getTenant(domain).catch(() => FALLBACK_TENANT);
  const categories = await getCategories(domain).catch(() => []);

  // FAQ Schema for rich snippets in Google
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `ما المناطق التي تغطيها ${tenant.name} في الرياض؟`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `نغطي جميع أحياء الرياض بما في ذلك العليا، الملقا، النرجس، الروضة، الدرعية، العزيزية، وجميع المناطق المحيطة لدى ${tenant.name}. نوفر خدمات التوصيل والتركيب للمناطق المجاورة بترتيب مسبق.`
        }
      },
      {
        "@type": "Question",
        "name": `هل يمكن تأجير كل مستلزمات المناسبة من ${tenant.name}؟`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `نعم! ${tenant.name} توفر مظلة واحدة متكاملة: الخيام، المكيفات، الكراسي، الجلسات، الإضاءة، السماعات، القهوجيين، وأكثر من 15 خدمة. لا تحتاج للتعامل مع أكثر من جهة.`
        }
      }
    ]
  };

  // LocalBusiness + Event Service Schema
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": tenant.name,
    "description": tenant.meta_description || tenant.tagline,
    "url": tenant.custom_domain ? `https://${tenant.custom_domain}/tanseeq-manasabat` : `https://${tenant.subdomain}.malakparties.com/tanseeq-manasabat`,
    "telephone": tenant.phone,
    "areaServed": { "@type": "City", "name": tenant.city || "الرياض" },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": tenant.city || "الرياض",
      "addressCountry": "SA"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "خدمات تنسيق المناسبات الملكية",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "تنسيق حفلات الزواج بالرياض" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "تجهيز مجالس العزاء بالرياض" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "تنظيم الفعاليات الحكومية بالرياض" } },
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <TanseeqClient categories={categories} />
    </>
  );
}
