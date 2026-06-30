"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import OptimizedImage from "./OptimizedImage";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarRange, 
  Grid, 
  Layers,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RentalCategory } from "../types";
import { getIconComponent } from "../../lib/resolveIcon";

// Lazy-load booking modal — downloaded only on reservation clicks
const QuickViewModal = dynamic(() => import("./QuickViewModal"), { ssr: false });

interface ServicesSectionProps {
  categories?: RentalCategory[];
  tenantDomain?: string;
}

export default function ServicesSection({ categories = [], tenantDomain = "malakparties.com" }: ServicesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<RentalCategory | null>(null);
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotation for 3D view (stops when user interacts)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || viewMode !== "3d" || categories.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % categories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, viewMode, categories.length]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % categories.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  // Drag handler to rotate the 3D carousel
  const handleDragEnd = (event: any, info: any) => {
    setIsAutoPlaying(false);
    const threshold = 50; // Drag distance threshold
    if (info.offset.x < -threshold) {
      // Dragged left -> Next (since it's RTL, dragging left advances the carousel)
      handleNext();
    } else if (info.offset.x > threshold) {
      // Dragged right -> Prev
      handlePrev();
    }
  };

  return (
    <section id="services" className="py-24 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8 bg-bg-soft text-right" dir="rtl">
      
      {/* Section Header with View Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-r-4 border-gold-accent pr-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-gold-accent tracking-widest block mb-1">تأجير التجهيزات الفاخرة</span>
          <h2 className="text-3xl md:text-5xl font-black text-plum-primary leading-tight">كتالوج الخدمات الملكية</h2>
          <p className="mt-4 text-xs sm:text-sm text-text-light leading-relaxed font-light">
            تصفح فئات تجهيزات الفعاليات المختارة بعناية. توفر مؤسسة ملك الحفلات خيارات راقية ومتنوعة للخيام الملكية، بيوت الشعر، التكييف الفائق، والجلسات الخارجية لترقى لأعلى مستويات الضيافة.
          </p>
        </div>

        {/* View Mode Switcher - Sharp */}
        <div className="flex items-center bg-plum-dark/5 p-1 rounded-none self-start md:self-end border border-plum-primary/10 shrink-0">
          <button
            onClick={() => setViewMode("3d")}
            className={`flex items-center gap-2 px-4 py-2 rounded-none text-xs font-black transition-all duration-300 cursor-pointer ${
              viewMode === "3d"
                ? "bg-plum-primary text-white shadow"
                : "text-plum-primary/70 hover:text-plum-primary"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-gold-accent" />
            <span>عرض ثلاثي الأبعاد</span>
          </button>
          
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-none text-xs font-black transition-all duration-300 cursor-pointer ${
              viewMode === "grid"
                ? "bg-plum-primary text-white shadow"
                : "text-plum-primary/70 hover:text-plum-primary"
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-gold-accent" />
            <span>عرض الشبكة</span>
          </button>
        </div>
      </div>

      {/* Conditional Rendering of Views */}
      <AnimatePresence mode="wait">
        {viewMode === "3d" ? (
          /* ─── 3D CIRCLE CAROUSEL VIEW ─── */
          <motion.div
            key="3d-carousel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative w-full py-16 flex flex-col items-center justify-center overflow-hidden min-h-[520px]"
          >
            {/* 3D Perspective Container */}
            <div 
              className="relative w-full max-w-lg h-[400px] flex items-center justify-center"
              style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
            >
              {/* Floor Perspective Shadow/Ring */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-8 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18)_0%,transparent_70%)] [transform:rotateX(75deg)] pointer-events-none z-0" />

              {/* Draggable Area Wrapper */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
                style={{ transformStyle: "preserve-3d" }}
              >
                {categories.map((category, idx) => {
                  const IconComponent = getIconComponent(category.icon);
                  
                  // Calculate 3D Offset positioning
                  let offset = idx - activeIndex;
                  if (offset < -categories.length / 2) offset += categories.length;
                  if (offset > categories.length / 2) offset -= categories.length;

                  const absOffset = Math.abs(offset);
                  const isCenter = offset === 0;

                  // Hide cards that are far behind in the circle to optimize performance
                  if (absOffset > 2) return null;

                  // Math for 3D positioning
                  const rotateY = offset * -38; // Rotate cards along the Y axis
                  const translateZ = absOffset * -160; // Push inactive cards deeper into Z space
                  const scale = 1 - absOffset * 0.12;
                  
                  // Responsively calculate X translations for desktop vs mobile
                  const translateX = typeof window !== "undefined" && window.innerWidth < 768 
                    ? offset * 130 
                    : offset * 280;

                  return (
                    <motion.div
                      key={category.id}
                      onClick={() => {
                        if (!isCenter) {
                          setIsAutoPlaying(false);
                          setActiveIndex(idx);
                        }
                      }}
                      animate={{
                        x: translateX,
                        z: translateZ,
                        rotateY: rotateY,
                        scale: scale,
                        opacity: absOffset > 2 ? 0 : 1 - absOffset * 0.35,
                        zIndex: 10 - absOffset
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className={`absolute w-[280px] sm:w-[320px] h-[380px] bg-white border rounded-none overflow-hidden shadow-2xl transition-shadow duration-500 flex flex-col select-none ${
                        isCenter 
                          ? "border-gold-accent shadow-gold-accent/10 outline outline-1 outline-offset-4 outline-gold-accent/35" 
                          : "border-gray-200 shadow-black/10 cursor-pointer"
                      }`}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Card Image */}
                      <div className="relative h-[45%] w-full overflow-hidden bg-gray-100">
                        <OptimizedImage 
                          src={category.mainImage}
                          alt={category.title}
                          fill
                          sizes="320px"
                          className="object-cover pointer-events-none"
                        />
                        
                        {/* Floating Icon */}
                        <div className="absolute top-4 right-4 p-2 bg-plum-primary/95 text-gold-accent border border-gold-accent/25 rounded-none shadow">
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Card Info */}
                      <div className="p-5 flex flex-col flex-grow justify-between text-right">
                        <div>
                          <h3 className="text-base font-black text-plum-primary">
                            {category.title}
                          </h3>
                          <p className="mt-2 text-[11px] text-text-light line-clamp-3 leading-relaxed font-light">
                            {category.description}
                          </p>
                        </div>

                        {/* Action buttons (only interactive on the active center card) */}
                        <div className={`mt-4 pt-4 border-t border-gray-100 flex items-center justify-between transition-opacity duration-300 ${
                          isCenter ? "opacity-100 pointer-events-auto" : "opacity-40 pointer-events-none"
                        }`}>
                          <Link 
                            href={`/${category.id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-black text-plum-primary hover:text-gold-accent transition-colors"
                          >
                            <span>التفاصيل</span>
                            <ChevronLeft className="w-3 h-3" />
                          </Link>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCategory(category);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-accent/10 hover:bg-gold-accent hover:text-plum-primary border border-gold-accent/20 rounded-none text-[9px] font-black text-gold-accent hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gold-accent/40 transition-all duration-300 cursor-pointer"
                          >
                            <CalendarRange className="w-3 h-3" />
                            <span>طلب تسعير</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Navigation Arrows for 3D Carousel */}
            <div className="flex items-center gap-4 mt-8 z-20">
              <button
                onClick={handlePrev}
                className="w-10 h-10 bg-white border border-gray-200 hover:border-gold-accent text-plum-primary hover:text-gold-accent transition-all rounded-none flex items-center justify-center shadow-md active:scale-95 cursor-pointer hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gold-accent/40"
                aria-label="التجهيز السابق"
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Indicator dots */}
              <div className="flex items-center gap-1.5">
                {categories.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setActiveIndex(idx);
                    }}
                    className={`h-1 transition-all duration-300 rounded-none ${
                      idx === activeIndex 
                        ? "w-6 bg-gold-accent" 
                        : "w-1.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`الذهاب للتجهيز رقم ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-10 h-10 bg-white border border-gray-200 hover:border-gold-accent text-plum-primary hover:text-gold-accent transition-all rounded-none flex items-center justify-center shadow-md active:scale-95 cursor-pointer hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gold-accent/40"
                aria-label="التجهيز التالي"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* ─── CLASSIC EDITORIAL GRID VIEW ─── */
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            {categories.map((category, idx) => {
              const IconComponent = getIconComponent(category.icon);
              return (
                <div
                  key={category.id}
                  className="group flex flex-col bg-white border border-gold-accent/15 rounded-none overflow-hidden shadow-sm hover:shadow-md hover:border-gold-accent/40 hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-gold-accent/20 transition-all duration-300"
                >
                  {/* Top Image Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    <OptimizedImage 
                      src={category.mainImage}
                      alt={`${category.seoTitle} - مؤسسة ملك الحفلات`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Floating category icon */}
                    <div className="absolute top-4 right-4 p-2.5 bg-plum-primary/95 text-gold-accent border border-gold-accent/25 rounded-none shadow-md">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Bottom Details Panel */}
                  <div className="p-6 flex flex-col flex-grow justify-between text-right">
                    <div>
                      <h3 className="text-lg font-black text-plum-primary group-hover:text-gold-accent transition-colors duration-300">
                        {category.title}
                      </h3>
                      
                      <p className="mt-3 text-xs text-text-light line-clamp-3 leading-relaxed font-light">
                        {category.description}
                      </p>
                    </div>
                    
                    {/* Action Links & Triggers */}
                    <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                      <Link 
                        href={`/${category.id}`}
                        className="inline-flex items-center gap-1 text-xs font-black text-plum-primary hover:text-gold-accent transition-colors duration-300"
                        aria-label={`تصفح تجهيزات ${category.title}`}
                      >
                        <span>تفاصيل التجهيزات</span>
                        <ChevronLeft className="w-3.5 h-3.5 transform transition-transform group-hover:-translate-x-1" />
                      </Link>

                      <button
                        onClick={() => setSelectedCategory(category)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-accent/10 hover:bg-gold-accent hover:text-plum-primary border border-gold-accent/20 rounded-none text-[10px] font-black text-gold-accent hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gold-accent/40 transition-all duration-300 cursor-pointer"
                        aria-label={`حجز سريع لخدمة ${category.title}`}
                      >
                        <CalendarRange className="w-3.5 h-3.5" />
                        <span>طلب تسعير فوري</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render lazy-loaded booking modal */}
      {selectedCategory && (
        <QuickViewModal 
          selectedCategory={selectedCategory} 
          onClose={() => setSelectedCategory(null)} 
          tenantDomain={tenantDomain}
        />
      )}
    </section>
  );
}
