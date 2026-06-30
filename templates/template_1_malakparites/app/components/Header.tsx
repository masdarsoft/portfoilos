"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Phone, 
  MessageCircle, 
  Home, 
  Sparkles, 
  Info, 
  Menu, 
  X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ServiceTabs from "./ServiceTabs";
import { RentalCategory, Tenant } from "../types";

interface HeaderProps {
  categories?: RentalCategory[];
  tenant?: Tenant;
}

export default function Header({ categories, tenant }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const phoneNum = tenant?.phone || "+966569436019";
  const whatsappNum = tenant?.whatsapp || "+966569436019";
  const cleanWhatsapp = whatsappNum.replace("+", "").replace(" ", "");

  const navLinks = [
    { href: "/tanseeq-manasabat", label: "تنسيق المناسبات" },
    { href: "/services", label: "خدماتنا" },
    { href: "/about", label: "من نحن" },
    { href: "/gallery", label: "معرض أعمالنا" },
    { href: "/contact", label: "اتصل بنا" }
  ];

  // All links are white since header always has a dark plum background
  const linkColorClass = "text-white hover:text-gold-accent";

  return (
    <>
      {/* ─── DESKTOP HEADER (MD & UP) ─── */}
      <div className="hidden md:block sticky top-0 z-50 w-full pointer-events-none bg-transparent transition-all duration-500">
        <div className={`mx-auto transition-all duration-500 pointer-events-auto w-full ${
          isScrolled ? "max-w-5xl mt-4 px-4" : "max-w-full mt-0 px-0"
        }`}>
          <header className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${
            isScrolled 
              ? "rounded-[40px] bg-plum-primary/95 border border-gold-accent/25 shadow-xl shadow-plum-dark/20 px-6 py-1.5" 
              : "rounded-none bg-plum-primary border-b border-white/10 shadow-none px-4 sm:px-6 lg:px-8 py-4"
          }`}>
            <div className="flex items-center justify-between">
              
              {/* Logo & Brand Identity */}
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-3 pointer-events-auto">
                  {/* Clean logo frame */}
                  <div className="w-11 h-11 flex items-center justify-center">
                    <Image
                      src={tenant?.logo || "/logo.png"}
                      alt={tenant?.name || "شعار ملك الحفلات"}
                      width={44}
                      height={44}
                      priority
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-base font-black tracking-wider text-white transition-colors duration-300">
                      مؤسسة ملك الحفلات
                    </span>
                    <span className="text-[9px] font-medium leading-none transition-colors duration-300 text-gold-accent">
                      {tenant?.tagline || "لتجهيز المناسبات والفعاليات"}
                    </span>
                  </div>
                </Link>
              </div>

              {/* Navigation Links */}
              <nav className="flex items-center gap-8">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative py-1 font-semibold text-xs transition-colors duration-300 ${
                        isActive ? "text-gold-accent" : linkColorClass
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-accent rounded-full animate-fade-in" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Call & WhatsApp CTAs */}
              <div className="flex items-center gap-3">
                {/* Sharp square quote button with offset hover drawing */}
                <a 
                  href={`https://api.whatsapp.com/send/?phone=${cleanWhatsapp}&text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85+%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C+%D8%A3%D8%B1%D9%8A%D8%AF+%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1+%D8%B9%D9%86+%D8%AE%D8%AF%D9%85%D8%A7%D8%AA+%D8%A7%D9%84%D8%AA%D8%A3%D8%AC%D9%8A%D8%B1+%D9%84%D8%AF%D9%8A%D9%83%D9%85&type=phone_number&app_absent=0`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-plum-primary rounded-none text-[10px] font-bold transition-all duration-300 gap-1.5 hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gold-accent"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>طلب تسعير سريع</span>
                </a>
                
                {/* Sharp square call button with phone number text */}
                <a 
                  href={`tel:${phoneNum}`}
                  className="inline-flex items-center justify-center px-4 py-2 bg-gold-accent text-plum-primary hover:bg-gold-light hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gold-accent transition-all duration-300 shadow-md gap-1.5 rounded-none text-[10px] font-bold"
                  aria-label={`اتصل بنا على الرقم ${phoneNum}`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span dir="ltr">{phoneNum}</span>
                </a>
              </div>
            </div>

            {/* Collapsible Category Tab Bar */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isScrolled ? "max-h-0 opacity-0 pointer-events-none mt-0" : "max-h-16 opacity-100 mt-2"
            }`}>
              <ServiceTabs categories={categories} />
            </div>
          </header>
        </div>
      </div>

      {/* ─── MOBILE TOP BRAND BAR ─── */}
      <div className="md:hidden sticky top-0 z-40 w-full bg-plum-primary border-b border-white/10 shadow-md flex flex-col">
        <div className="py-3.5 px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {/* Clean logo frame */}
            <div className="w-9 h-9 flex items-center justify-center">
              <Image
                src={tenant?.logo || "/logo.png"}
                alt={tenant?.name || "شعار ملك الحفلات"}
                width={36}
                height={36}
                priority
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-sm font-black text-white tracking-wide leading-tight">
                مؤسسة ملك الحفلات
              </span>
              <span className="text-[8px] text-gold-accent font-medium leading-none mt-0.5">
                {tenant?.tagline || "لتجهيز المناسبات والفعاليات"}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {/* Sharp square call button */}
            <a 
              href={`tel:${phoneNum}`}
              className="flex items-center justify-center w-8 h-8 rounded-none bg-gold-accent text-plum-primary shadow-md active:scale-95 transition-transform"
              aria-label="اتصل بنا"
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center justify-center w-8 h-8 rounded-none border border-white/20 text-white active:scale-95 transition-all bg-white/5"
              aria-label="القائمة الرئيسية"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
        
        {/* Scrollable category tabs for mobile */}
        <div className="w-full border-t border-white/5 bg-plum-dark/95">
          <ServiceTabs categories={categories} />
        </div>
      </div>

      {/* ─── MOBILE FULLSCREEN MENU OVERLAY ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-plum-dark/98 backdrop-blur-md flex flex-col text-right p-6"
            dir="rtl"
          >
            {/* Header in Menu */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center">
                  <Image
                    src={tenant?.logo || "/logo.png"}
                    alt={tenant?.name || "شعار ملك الحفلات"}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="text-sm font-black text-white">مؤسسة ملك الحفلات</span>
              </div>
              
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-none border border-white/20 text-white hover:text-gold-accent hover:border-gold-accent transition-all"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links List */}
            <nav className="flex flex-col gap-6 py-12 text-base font-black text-white">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`hover:text-gold-accent transition-colors pb-2 border-b border-white/5 ${pathname === "/" ? "text-gold-accent" : ""}`}
              >
                الرئيسية
              </Link>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`hover:text-gold-accent transition-colors pb-2 border-b border-white/5 ${isActive ? "text-gold-accent" : ""}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Quick CTAs */}
            <div className="mt-auto flex flex-col gap-4">
              <a
                href={`https://api.whatsapp.com/send/?phone=${cleanWhatsapp}&text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85+%D8%B9%D9%84%D9%8Account%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1+%D8%B9%D9%86+%D8%AA%D8%AC%D9%87%D9%8A%D8%B2%D8%A7%D8%AA%D9%83%D9%85`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white text-xs font-black text-center rounded-none flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4.5 h-4.5" />
                <span>تواصل عبر الواتساب الفوري</span>
              </a>
              <a
                href={`tel:${phoneNum}`}
                className="w-full py-3.5 bg-gold-accent hover:bg-gold-light text-plum-primary text-xs font-black text-center rounded-none flex items-center justify-center gap-2"
              >
                <Phone className="w-4.5 h-4.5" />
                <span>اتصال هاتفي مباشر</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MOBILE FIXED BOTTOM NAVIGATION BAR ─── */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-40 bg-plum-dark border border-gold-accent/40 rounded-none px-2 py-3 shadow-2xl shadow-black/80 flex items-center justify-around animate-fade-in">
        <Link 
          href="/" 
          className={`flex flex-col items-center gap-1 transition-colors duration-300 ${
            pathname === "/" ? "text-gold-accent" : "text-white hover:text-gold-accent"
          }`}
          aria-label="الصفحة الرئيسية"
        >
          <Home className="w-5.5 h-5.5" />
          <span className="text-[10px] font-black">الرئيسية</span>
        </Link>

        <Link 
          href="/services" 
          className={`flex flex-col items-center gap-1 transition-colors duration-300 ${
            pathname === "/services" ? "text-gold-accent" : "text-white hover:text-gold-accent"
          }`}
          aria-label="كل الخدمات"
        >
          <Sparkles className="w-5.5 h-5.5" />
          <span className="text-[10px] font-black">الخدمات</span>
        </Link>

        {/* Quick WhatsApp Quote */}
        <a 
          href={`https://api.whatsapp.com/send/?phone=${cleanWhatsapp}&text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85+%D8%B9%D9%84%D9%8Self%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1+%D8%B9%D9%86+%D8%A7%D9%84%D8%AA%D8%A3%D8%AC%D9%8A%D8%B1`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-white hover:text-gold-accent transition-colors duration-300"
          aria-label="مراسلة واتساب"
        >
          <MessageCircle className="w-5.5 h-5.5 text-green-400" />
          <span className="text-[10px] font-black">واتساب</span>
        </a>

        <Link 
          href="/about" 
          className={`flex flex-col items-center gap-1 transition-colors duration-300 ${
            pathname === "/about" ? "text-gold-accent" : "text-white hover:text-gold-accent"
          }`}
          aria-label="من نحن"
        >
          <Info className="w-5.5 h-5.5" />
          <span className="text-[10px] font-black">من نحن</span>
        </Link>

        <Link 
          href="/contact" 
          className={`flex flex-col items-center gap-1 transition-colors duration-300 ${
            pathname === "/contact" ? "text-gold-accent" : "text-white hover:text-gold-accent"
          }`}
          aria-label="اتصل بنا"
        >
          <Phone className="w-5.5 h-5.5 text-gold-accent" />
          <span className="text-[10px] font-black">حجز موعد</span>
        </Link>
      </div>
    </>
  );
}
