import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Header from "./components/Header";
import { getTenant, FALLBACK_TENANT } from "../lib/api/tenants";
import { getCategories } from "../lib/api/catalog";
import { getTenantDomain } from "../lib/getTenantDomain";

const tajawal = localFont({
  src: [
    {
      path: "../public/fonts/Tajawal-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Tajawal-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Tajawal-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Tajawal-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Tajawal-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/Tajawal-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-tajawal",
});

// Dynamic metadata generation based on Resolved Tenant
export async function generateMetadata(): Promise<Metadata> {
  const domain = getTenantDomain();
  const tenant = await getTenant(domain).catch(() => FALLBACK_TENANT);

  return {
    title: {
      default: tenant.meta_title || `${tenant.name} | لتجهيز المناسبات`,
      template: `%s | ${tenant.name}`
    },
    description: tenant.meta_description || tenant.tagline,
    authors: [{ name: tenant.name }],
    creator: tenant.name,
    publisher: tenant.name,
    metadataBase: new URL(tenant.custom_domain ? `https://${tenant.custom_domain}` : `https://${tenant.subdomain}.najdalzian.com`),
    openGraph: {
      title: tenant.meta_title || tenant.name,
      description: tenant.meta_description || tenant.tagline,
      url: tenant.custom_domain ? `https://${tenant.custom_domain}` : `https://${tenant.subdomain}.najdalzian.com`,
      siteName: tenant.name,
      locale: tenant.language === 'ar' ? 'ar_SA' : 'en_US',
      type: "website",
      images: [
        {
          url: tenant.logo || "/logo.png",
          width: 800,
          height: 800,
          alt: tenant.name,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tenant.meta_title || tenant.name,
      description: tenant.meta_description || tenant.tagline,
      images: [tenant.logo || "/logo.png"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const domain = getTenantDomain();
  
  // Fetch tenant and categories server-side
  const tenant = await getTenant(domain).catch(() => FALLBACK_TENANT);
  const categories = await getCategories(domain).catch(() => []);

  // Map theme colors to CSS variables injected inline into <html>
  const themeVars = {
    "--color-plum-primary": tenant.theme.primary || "#5B2D4A",
    "--color-plum-dark": tenant.theme.dark || "#3B1B30",
    "--color-plum-light": tenant.theme.light || "#7A3F65",
    "--color-gold-accent": tenant.theme.gold_accent || "#D4AF37",
    "--color-gold-light": tenant.theme.gold_light || "#F3D062",
    "--color-bg-soft": tenant.theme.bg_soft || "#FAFAFA",
    "fontFamily": "var(--font-tajawal), sans-serif",
  } as React.CSSProperties;

  const phoneNum = tenant.phone || "+966569436019";
  const whatsappNum = tenant.whatsapp || "+966569436019";
  const emailAddr = tenant.email || "info@malakparties.com";
  const addressText = tenant.address || "الرياض - ملك الحفلات";

  return (
    <html 
      lang={tenant.language} 
      dir={tenant.direction} 
      data-scroll-behavior="smooth" 
      className={`${tajawal.variable} h-full scroll-smooth`} 
      style={themeVars}
      suppressHydrationWarning
    >
      <head>
        {/* Favicon from API */}
        <link rel="icon" href={tenant.favicon || "/icon.png"} type="image/png" sizes="192x192" />
        <link rel="shortcut icon" href={tenant.favicon || "/icon.png"} type="image/png" />
        <link rel="apple-touch-icon" href={tenant.favicon || "/icon.png"} />
        
        {/* Google Search Results Thumbnail Image Preview */}
        <meta name="thumbnail" content={tenant.logo || "/logo.png"} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-bg-soft text-text-dark antialiased" style={{ fontFamily: "var(--font-tajawal), sans-serif" }}>

        {/* Sticky Glassmorphism Responsive Navbar with API categories */}
        <Header categories={categories} tenant={tenant} />

        {/* Page Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Elegant Footer */}
        <footer className="bg-plum-dark text-white border-t-2 border-gold-accent mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-right">
              
              {/* Column 1: Logo & Brand Description */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 justify-start">
                  {/* Clean logo frame */}
                  <div className="w-11 h-11 flex items-center justify-center">
                    <Image
                      src={tenant.logo || "/logo.png"}
                      alt={tenant.name}
                      width={44}
                      height={44}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="text-xl font-black tracking-wider text-gold-accent">
                    مؤسسة ملك الحفلات
                  </span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed font-light max-w-sm">
                  {tenant.meta_description || tenant.tagline || `${tenant.name} لتجهيز المناسبات والفعاليات.`}
                </p>
              </div>

              {/* Column 2: Quick Links */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-gold-accent border-r-2 border-gold-accent pr-2">روابط سريعة</h3>
                <ul className="flex flex-col gap-2.5 text-xs text-gray-200 font-light">
                  <li>
                    <Link href="/" className="hover:text-gold-accent transition-colors duration-300">الرئيسية</Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-gold-accent transition-colors duration-300">من نحن</Link>
                  </li>
                  <li>
                    <Link href="/services" className="hover:text-gold-accent transition-colors duration-300">دليل الخدمات</Link>
                  </li>
                  <li>
                    <Link href="/gallery" className="hover:text-gold-accent transition-colors duration-300">معرض الصور</Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-gold-accent transition-colors duration-300">اتصل بنا</Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Top Services (SEO Internal Links with Keywords) */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-gold-accent border-r-2 border-gold-accent pr-2">خدمات التأجير الأكثر طلباً</h3>
                <ul className="flex flex-col gap-2.5 text-xs text-gray-200 font-light font-medium">
                  {categories.slice(0, 5).map((category) => (
                    <li key={category.id}>
                      <Link href={`/${category.id}`} className="hover:text-gold-accent transition-colors duration-300">
                        {category.title} بالرياض
                      </Link>
                    </li>
                  ))}
                  {categories.length === 0 && (
                    <>
                      <li><Link href="/tent-rentals" className="hover:text-gold-accent transition-colors duration-300">تأجير خيام بالرياض</Link></li>
                      <li><Link href="/ac-rentals" className="hover:text-gold-accent transition-colors duration-300">تأجير مكيفات بالرياض</Link></li>
                      <li><Link href="/hair-tents" className="hover:text-gold-accent transition-colors duration-300">تأجير بيوت شعر بالرياض</Link></li>
                    </>
                  )}
                </ul>
              </div>

              {/* Column 4: Contact Info */}
              <div className="flex flex-col gap-4 text-right">
                <h3 className="text-sm font-bold text-gold-accent border-r-2 border-gold-accent pr-2">معلومات التواصل</h3>
                <ul className="flex flex-col gap-3 text-xs text-gray-200 font-light">
                  <li className="flex items-start gap-2 justify-start">
                    <span className="text-gold-accent font-bold">العنوان:</span>
                    <span className="text-gray-200">{addressText}</span>
                  </li>
                  <li className="flex items-center gap-2 justify-start">
                    <span className="text-gold-accent font-bold">الهاتف:</span>
                    <a href={`tel:${phoneNum}`} className="hover:text-gold-accent transition-colors duration-300 font-semibold" dir="ltr">{phoneNum}</a>
                  </li>
                  <li className="flex items-center gap-2 justify-start">
                    <span className="text-gold-accent font-bold">البريد:</span>
                    <a href={`mailto:${emailAddr}`} className="hover:text-gold-accent transition-colors duration-300" dir="ltr">{emailAddr}</a>
                  </li>
                </ul>
              </div>

            </div>
            
            <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-300">
              <p>© {new Date().getFullYear()} {tenant.name}. جميع الحقوق محفوظة.</p>
              
              {/* Payment Methods */}
              <div className="flex flex-wrap items-center justify-center gap-3 my-2 md:my-0">
                <span className="text-[10px] text-gray-400 font-medium ml-1">طرق الدفع المتاحة:</span>
                <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-none border border-white/10 backdrop-blur-sm shadow-inner">
                  {/* Mada */}
                  <div className="relative w-9 h-5 bg-white/95 rounded-none flex items-center justify-center px-1 py-0.5 shadow-sm hover:bg-white transition-colors duration-300" title="مدى - Mada">
                    <Image
                      src="/images/logo.svg"
                      alt="مدى - mada"
                      width={28}
                      height={12}
                      className="object-contain"
                      style={{ height: "auto" }}
                    />
                  </div>
                  {/* Visa */}
                  <div className="w-9 h-5 bg-white/95 rounded-none flex items-center justify-center font-black text-[7px] text-[#1A1F71] tracking-wider shadow-sm hover:bg-white transition-colors duration-300" title="فيزا - Visa">
                    VISA
                  </div>
                  {/* Mastercard */}
                  <div className="w-9 h-5 bg-white/95 rounded-none flex items-center justify-center font-bold text-[7px] text-[#EB0015] tracking-wider shadow-sm hover:bg-white transition-colors duration-300" title="ماستركارد - Mastercard">
                    MC
                  </div>
                  <span className="text-[9px] text-gray-400 font-bold border-r border-white/10 pr-2 mr-1">الدفع عند الاستلام</span>
                </div>
              </div>

              <p className="text-[10px] text-gray-500">
                 تطوير وتصميم:{" "} 
                 <a 
                   href="https://api.whatsapp.com/send/?phone=967776776287" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="hover:text-gold-accent transition-colors duration-300 underline underline-offset-4"
                 >
                   اتصال بالمطور
                 </a>
              </p>
            </div>
          </div>
        </footer>

        {/* Pulsing WhatsApp FAB (Desktop Only since mobile has it in the bottom navigation bar) */}
        <a
          href={`https://api.whatsapp.com/send/?phone=${whatsappNum.replace("+", "").replace(" ", "")}&text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85+%D8%B9%D9%84%D9%8Adjust+%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1+%D8%B9%D9%86+%D8%AE%D8%AF%D9%85%D8%A7%D8%AA+%D8%A7%D9%84%D8%AA%D8%A3%D8%AC%D9%8A%D8%B1+%D9%84%D8%AF%D9%8A%D9%83%D9%85&type=phone_number&app_absent=0`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex fixed z-50 md:bottom-8 md:left-8 items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group cursor-pointer"
          aria-label="اتصال سريع واتساب"
        >
          <span className="absolute inset-0 rounded-full bg-green-500/30 animate-ping group-hover:hidden" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-7 h-7 fill-current">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </a>

        {tenant.analytics.gtm_id && <GoogleTagManager gtmId={tenant.analytics.gtm_id} />}
        {tenant.analytics.ga_id && <GoogleAnalytics gaId={tenant.analytics.ga_id} />}
      </body>
    </html>
  );
}
