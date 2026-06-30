"use client";

import OptimizedImage from "./OptimizedImage";
import { RECENT_EVENTS } from "../constants";

export default function GallerySection() {
  // Asymmetrical masonry grid style helpers based on index
  const getGridClasses = (index: number) => {
    switch (index) {
      case 0:
        return "col-span-2 md:col-span-2 row-span-2 h-[320px] md:h-[500px]";
      case 1:
        return "col-span-1 h-[150px] md:h-[238px]";
      case 2:
        return "col-span-1 h-[150px] md:h-[238px]";
      case 3:
        return "col-span-1 h-[170px] md:h-[238px]";
      case 4:
        return "col-span-1 h-[170px] md:h-[238px]";
      case 5:
        default:
        return "col-span-2 md:col-span-1 h-[170px] md:h-[238px]";
    }
  };

  return (
    <section 
      id="gallery" 
      className="py-24 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8 bg-bg-soft animate-fade-in-section"
    >
      {/* Section Header */}
      <div className="text-right max-w-3xl mb-16 border-r-4 border-gold-accent pr-6">
        <span className="text-xs font-bold text-gold-accent tracking-widest block mb-1">مشاريع تم تجهيزها</span>
        <h2 className="text-3xl md:text-5xl font-black text-plum-primary leading-tight">معرض الفعاليات الملكية</h2>
        <p className="mt-4 text-xs sm:text-sm text-text-light leading-relaxed font-light">
          نستعرض جانباً من تغطيات وتجهيزات المناسبات التي تشرفنا بتنظيمها. خيام مجهزة بالكامل، جلسات استقبال فاخرة، وتفاصيل ضيافة تجسد الاحترافية والجمال في كل زاوية.
        </p>
      </div>

      {/* Asymmetrical Masonry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {RECENT_EVENTS.map((imgUrl, i) => (
          <div
            key={i}
            className={`relative rounded-lg overflow-hidden shadow-sm border border-gold-accent/10 hover:border-gold-accent/40 transition-all duration-300 ${getGridClasses(i)}`}
          >
            <OptimizedImage 
              src={imgUrl} 
              alt={`معرض ملك الحفلات ${i+1}`} 
              fill 
              sizes={i === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
              loading="lazy"
              className="object-cover transition-transform duration-700 hover:scale-105" 
            />
            {/* Minimal frosted glass overlay with index badge */}
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-plum-dark/90 border border-white/10 rounded backdrop-blur-md opacity-0 hover:opacity-100 transition-opacity duration-300 text-center pointer-events-none select-none">
              <span className="text-[9px] font-bold text-gold-accent">تجهيز ملك الحفلات</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
