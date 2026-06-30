import ServiceDetailClient from "../services/[id]/ServiceDetailClient";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTenant, FALLBACK_TENANT } from "../../lib/api/tenants";
import { getCategory, getCategories } from "../../lib/api/catalog";
import { getTenantDomain } from "../../lib/getTenantDomain";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Enable dynamic params so new database categories work instantly on the live site
export const dynamicParams = true;

export async function generateStaticParams() {
  const domain = getTenantDomain();
  const categories = await getCategories(domain).catch(() => []);
  return categories.map((category) => ({ id: category.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const domain = getTenantDomain();
  const tenant = await getTenant(domain).catch(() => FALLBACK_TENANT);
  const category = await getCategory(domain, id);

  if (!category) {
    return {
      title: "الخدمة غير متوفرة",
      description: "عذراً، لم نتمكن من العثور على الخدمة المطلوبة لتجهيز المناسبات."
    };
  }

  const seoDesc = category.seoDescription || category.description;
  const siteUrl = tenant.custom_domain ? `https://${tenant.custom_domain}` : `https://${tenant.subdomain}.najdalzian.com`;

  return {
    title: category.seoTitle,
    description: seoDesc,
    keywords: category.seoKeywords || [
      `${category.seoTitle}`,
      `${category.title} الرياض`,
      "تجهيز مناسبات الرياض",
      tenant.name
    ],
    alternates: {
      canonical: `${siteUrl}/${id}`,
    },
    openGraph: {
      title: category.seoTitle,
      description: seoDesc,
      url: `${siteUrl}/${id}`,
      siteName: tenant.name,
      locale: "ar_SA",
      type: "website",
      images: [
        {
          url: category.mainImage,
          width: 1200,
          height: 630,
          alt: `${category.seoTitle} - ${tenant.name}`,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: category.seoTitle,
      description: seoDesc,
      images: [category.mainImage],
    },
  };
}

export default async function RootServiceDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const domain = getTenantDomain();
  const tenant = await getTenant(domain).catch(() => FALLBACK_TENANT);
  const category = await getCategory(domain, id);
  const categories = await getCategories(domain).catch(() => []);
  
  if (!category) {
    notFound();
  }

  // Generate Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": category.seoTitle,
    "description": category.seoDescription || category.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": tenant.name,
      "image": category.mainImage,
      "telephone": tenant.phone,
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": tenant.city || "الرياض",
        "addressCountry": "SA"
      }
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": tenant.city || "الرياض"
    }
  };

  // Generate dynamic FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `كيف يمكنني حجز ${category.title} بالرياض من ${tenant.name}؟`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `يمكنك حجز خدمة ${category.title} بالرياض بسهولة عبر الاتصال المباشر أو الواتساب على الرقم ${tenant.phone}. حدد التاريخ والمقاسات أو الكميات المطلوبة وسنقوم بتوصيلها وتركيبها وتجهيزها لك بالكامل.`
        }
      },
      {
        "@type": "Question",
        "name": `هل تقدمون خدمة التوصيل والتركيب لـ ${category.title} في جميع أحياء الرياض؟`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `نعم، نوفر خدمة التوصيل والتركيب والتشغيل الفوري لخدمة ${category.title} في جميع أحياء ومناطق الرياض بالكامل، مع وجود فريق فني متخصص للتركيب وضمان تشغيل الأجهزة والمعدات بكفاءة طوال فترة مناسبتكم لدى ${tenant.name}.`
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ServiceDetailClient category={category} allCategories={categories} tenantDomain={domain} />
    </>
  );
}
