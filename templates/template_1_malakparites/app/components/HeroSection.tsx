"use client";

import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen w-full bg-gradient-to-br from-plum-dark via-plum-primary to-plum-dark flex items-center justify-center overflow-hidden clip-slant pb-20 md:pb-24">
      {/* Background Ambient Mesh Glowing Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gold-accent/10 blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-plum-light/20 blur-[150px] -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ─── RIGHT SIDE: ASYMMETRIC TEXT LAYOUT (6 columns) ─── */}
          <div className="lg:col-span-7 flex flex-col items-start text-right animate-hero-enter gap-6">
            
            {/* Tagline Badge - Sharp geometric outline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none border border-gold-accent/30 bg-white/5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-gold-accent animate-pulse" />
              <span className="text-[10px] text-gold-light font-black tracking-wider">الفخامة في تجهيز المناسبات</span>
            </div>

            {/* Typography Emphasis & Accent Line Indicator */}
            <div className="flex gap-4 items-stretch">
              {/* Solid Rose Gold vertical accent line */}
              <div className="w-1.5 bg-gradient-to-b from-gold-accent to-gold-light rounded-none" />
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-md select-none tracking-tight">
                ملك الحفلات <br />
                <span className="text-gold-accent font-light text-3xl sm:text-4xl md:text-5xl block mt-2">
                  لتجهيز المناسبات الملكية
                </span>
              </h1>
            </div>

            <p className="max-w-xl text-sm md:text-base text-gray-300 leading-relaxed font-light select-none pr-1">
              نصنع لفعالياتكم ذكريات لا تُنسى. نبتكر تصاميم الخيام الملكية والأوروبية، ونجهز القاعات وأنظمة التبريد الفائقة والمجالس الفاخرة لتجسيد فخامة ضيافتكم بأعلى درجات الرقي والاحترافية.
            </p>

            {/* Stacked Vertical CTAs - Sharp corners with offset hover outlines */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4 w-full sm:w-auto pr-1">
              <Link 
                href="/services"
                className="px-8 py-3.5 bg-gold-accent hover:bg-gold-light text-plum-primary font-black rounded-none shadow-lg hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-gold-accent transition-all duration-300 text-center text-xs"
              >
                تصفح الخدمات الملكية
              </Link>
              <Link 
                href="/contact"
                className="px-8 py-3.5 border border-white/20 hover:border-gold-accent text-white font-bold rounded-none bg-white/5 hover:bg-white/10 hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-white/30 transition-all duration-300 text-center text-xs"
              >
                تنسيق حجز فوري
              </Link>
            </div>
          </div>

          {/* ─── LEFT SIDE: STAGGERED IMAGE COLLAGE (5 columns) ─── */}
          {/* Replaced rotated frames with flat, sharp frames having solid offset gold shadows */}
          <div className="lg:col-span-5 relative h-[380px] md:h-[480px] w-full flex items-center justify-center animate-hero-enter" style={{ animationDelay: "150ms" }}>
            
            {/* Frame Background Layer - Sharp corners */}
            <div className="absolute inset-0 border border-white/5 rounded-none bg-white/[0.02] backdrop-blur-3xl z-0" />

            {/* Collage Image 1: Bottom Right Backing - Sharp and offset shadowed */}
            <div className="absolute bottom-6 right-6 w-40 h-52 md:w-52 md:h-64 rounded-none overflow-hidden border border-white/10 shadow-[8px_8px_0px_0px_rgba(197,168,128,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-500 group z-10">
              <Image
                src="/images/poetry_houses1.jpg"
                alt="بيوت شعر ملكية فاخرة"
                fill
                priority
                sizes="(max-width: 768px) 150px, 200px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-plum-dark/20 group-hover:bg-transparent transition-colors duration-300" />
            </div>

            {/* Collage Image 2: Top Left Backing - Sharp and offset shadowed */}
            <div className="absolute top-6 left-6 w-36 h-48 md:w-48 md:h-60 rounded-none overflow-hidden border border-white/10 shadow-[-8px_-8px_0px_0px_rgba(197,168,128,0.2)] hover:shadow-none hover:-translate-x-1 hover:-translate-y-1 transition-all duration-500 group z-10">
              <Image
                src="/images/Outdoor_seating1.jpg"
                alt="جلسات خارجية راقية"
                fill
                priority
                sizes="(max-width: 768px) 150px, 200px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-plum-dark/20 group-hover:bg-transparent transition-colors duration-300" />
            </div>

            {/* Collage Image 3: Center Spotlight - Sharp, solid copper outline and offset shadow */}
            <div className="absolute w-56 h-72 md:w-64 md:h-80 rounded-none overflow-hidden border-2 border-gold-accent shadow-[12px_12px_0px_0px_rgba(11,19,43,0.9)] z-20 hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-500 group">
              <Image
                src="/images/tents6.jpg"
                alt="تجهيزات خيام ملك الحفلات"
                fill
                priority
                sizes="(max-width: 768px) 220px, 280px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Floating gold overlay card inside image */}
              <div className="absolute bottom-4 left-4 right-4 bg-plum-dark/95 border border-gold-accent/30 rounded-none p-2.5 backdrop-blur-md select-none transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-center">
                <span className="text-[10px] font-black text-gold-accent block">مؤسسة ملك الحفلات</span>
                <span className="text-[8px] text-gray-300 font-light mt-0.5 block">الريادة في تنظيم وتجهيز المناسبات</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
