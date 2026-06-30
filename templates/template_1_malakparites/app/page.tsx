import { Metadata } from "next";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import AboutSection from "./components/AboutSection";
import GallerySection from "./components/GallerySection";
import ContactSection from "./components/ContactSection";
import DroneShowcase from "./components/DroneShowcase";
import { getTenant, FALLBACK_TENANT } from "../lib/api/tenants";
import { getCategories } from "../lib/api/catalog";
import { getTenantDomain } from "../lib/getTenantDomain";

export async function generateMetadata(): Promise<Metadata> {
  const domain = getTenantDomain();
  const tenant = await getTenant(domain).catch(() => FALLBACK_TENANT);
  
  return {
    alternates: {
      canonical: tenant.custom_domain ? `https://${tenant.custom_domain}` : `https://${tenant.subdomain}.najdalzian.com`,
    },
  };
}

export default async function HomePage() {
  const domain = getTenantDomain();
  const tenant = await getTenant(domain).catch(() => FALLBACK_TENANT);
  const categories = await getCategories(domain).catch(() => []);

  // Map database categories to JSON-LD Offer catalog dynamically
  const catalogElements = categories.map((cat) => ({
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "name": `${cat.title} بالرياض`,
      "description": cat.description,
      "url": tenant.custom_domain 
        ? `https://${tenant.custom_domain}/${cat.id}` 
        : `https://${tenant.subdomain}.najdalzian.com/${cat.id}`,
      "areaServed": tenant.city || "الرياض"
    }
  }));

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": tenant.name,
    "alternateName": [tenant.name, tenant.tagline],
    "description": tenant.meta_description || tenant.tagline,
    "image": tenant.logo || "https://najdalzian.com/logo.png",
    "logo": tenant.logo || "https://najdalzian.com/logo.png",
    "url": tenant.custom_domain ? `https://${tenant.custom_domain}` : `https://${tenant.subdomain}.najdalzian.com`,
    "telephone": tenant.phone,
    "priceRange": "$$",
    "currenciesAccepted": "SAR",
    "paymentAccepted": "Cash, Bank Transfer",
    "areaServed": {
      "@type": "City",
      "name": tenant.city || "الرياض",
      "containedInPlace": {
        "@type": "Country",
        "name": "المملكة العربية السعودية"
      }
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": tenant.address || "حي الملقا، طريق الملك فهد",
      "addressLocality": tenant.city || "الرياض",
      "addressRegion": "منطقة الرياض",
      "postalCode": "11564",
      "addressCountry": "SA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": tenant.geo_lat ? parseFloat(tenant.geo_lat) : 24.8122,
      "longitude": tenant.geo_lng ? parseFloat(tenant.geo_lng) : 46.6133
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `خدمات تأجير مستلزمات الحفلات والمناسبات بالرياض لدى ${tenant.name}`,
      "itemListElement": catalogElements.length > 0 ? catalogElements : [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "تأجير مكيفات بالرياض",
            "description": "تأجير مكيفات صحراوية وفريون عالية التبريد لجميع المناسبات والحفلات الخارجية بالرياض",
            "url": "https://najdalzian.com/ac-rentals",
            "areaServed": "الرياض"
          }
        }
      ]
    },
    "sameAs": [
      `https://api.whatsapp.com/send/?phone=${tenant.whatsapp.replace('+', '').replace(' ', '')}`
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `كم سعر تأجير مكيفات بالرياض لدى ${tenant.name}؟`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "تختلف أسعار تأجير المكيفات حسب النوع (صحراوي أو فريون) والمدة والكمية. تواصل معنا عبر الواتساب للحصول على تسعيرة مخصصة لمناسبتك مع التوصيل والتركيب المجاني بالرياض."
        }
      },
      {
        "@type": "Question",
        "name": "هل توفرون تأجير خيام للمناسبات والعزاء بالرياض؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `نعم، نوفر تأجير خيام ملكية وأوروبية بجميع المقاسات للمناسبات والحفلات والعزاء بالرياض مع التركيب والتجهيز الكامل من إضاءة وتكييف وجلسات لدى ${tenant.name}.`
        }
      },
      {
        "@type": "Question",
        "name": "هل تغطون جميع أحياء الرياض؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نعم، نغطي جميع أحياء ومناطق الرياض بما فيها حي الملقا، حطين، النرجس، العارض، الياسمين، وغيرها. كما نقدم خدماتنا في القصيم وكافة مدن المملكة."
        }
      }
    ]
  };

  return (
    <div className="relative">
      
      {/* Dynamic SEO JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. HERO SECTION WITH CINEMATIC BACKDROP VIDEO */}
      <HeroSection />

      {/* 2. CORE SERVICES SECTION (DYNAMIC CATEGORIES GRID FROM API) */}
      <ServicesSection categories={categories} tenantDomain={domain} />

      {/* 3. CINEMATIC DRONE SHOWCASE (LIGHTING CONTRACTS VIDEO) */}
      <DroneShowcase />

      {/* 4. ABOUT US & Traditional setup grids */}
      <AboutSection />

      {/* 5. GALLERY OF LUXURIOUS EVENTS */}
      <GallerySection />

      {/* 6. QUICK DIRECT CONTACT PANEL */}
      <ContactSection />

    </div>
  );
}
