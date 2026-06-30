"use client";

import { useState, useMemo } from "react";
import OptimizedImage from "../components/OptimizedImage";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Compass, 
  Tent, 
  Wind, 
  Lightbulb,
  ArrowLeft
} from "lucide-react";

// Categorized high-resolution premium photos matching assets exactly
const GALLERY_PHOTOS = [
  { src: "/images/tents6.jpg", tag: "tents", title: "تأسيس خيمة ملكية كبرى" },
  { src: "/images/tents1.jpg", tag: "tents", title: "تنسيق قاعات ضيافة خارجية فاخرة" },
  { src: "/images/poetry_houses1.jpg", tag: "tents", title: "خيمة تراثية بطراز عربي عريق" },
  { src: "/images/poetry_houses4.jpg", tag: "tents", title: "تجهيز خيام كبرى للمناسبات الرسمية" },
  { src: "/images/chairs.jpg", tag: "seating", title: "كراسي نابليون مذهبة راقية" },
  { src: "/images/chairs1.jpg", tag: "seating", title: "كراسي ديور الفخمة وتنسيق طاولات" },
  { src: "/images/chairs3.jpg", tag: "seating", title: "كراسي ملكية مخصصة للاستقبال" },
  { src: "/images/Indoor_seating1.jpg", tag: "seating", title: "مجالس شعبية وتنسيق جلسات أرضية" },
  { src: "/images/Outdoor_seating1.jpg", tag: "seating", title: "جلسات استقبال خارجية فاخرة" },
  { src: "/images/air_conditioner1.jpg", tag: "cooling", title: "تأجير مكيف صحراوي عالي الدفع" },
  { src: "/images/air_conditioner2.jpg", tag: "cooling", title: "تركيب مكيفات فريون عمودية صامتة" },
  { src: "/images/air_conditioner3.jpg", tag: "cooling", title: "مكيف فريون تبريد مكثف للخيام" },
  { src: "/images/air_conditioner4.jpg", tag: "cooling", title: "مراوح رذاذ وتلطيف حدائق" },
  { src: "/images/Noor_Contracts1.jpg", tag: "tech", title: "عقود إضاءة ليد وكشافات كبرى" },
  { src: "/images/Noor_Contracts2.jpg", tag: "tech", title: "كشافات وحوامل إضاءة ليلية" },
  { src: "/images/Speaker1.jpg", tag: "tech", title: "تجهيز سماعات دي جي وأنظمة صوت" }
];

const FILTER_TAGS = [
  { id: "all", label: "الكل", icon: Compass },
  { id: "tents", label: "خيام وبيوت شعر", icon: Tent },
  { id: "seating", label: "كراسي وجلسات", icon: Sparkles },
  { id: "cooling", label: "تبريد وتهوية", icon: Wind },
  { id: "tech", label: "إضاءة وصوتيات", icon: Lightbulb }
];

export default function GalleryClient() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Live filter photo items
  const filteredPhotos = useMemo(() => {
    if (activeFilter === "all") return GALLERY_PHOTOS;
    return GALLERY_PHOTOS.filter(photo => photo.tag === activeFilter);
  }, [activeFilter]);

  const handleNextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % filteredPhotos.length);
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  return (
    <div className="min-h-screen bg-bg-soft pb-24 text-text-dark text-right" dir="rtl">
      
      {/* 1. Page Header */}
      <div className="relative py-24 bg-plum-dark text-white text-center overflow-hidden border-b border-gold-accent/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-accent/10 border border-gold-accent/25 rounded-none text-xs font-bold text-gold-accent tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>معرض المناسبات الفاخرة</span>
            </span>
            <h1 className="text-4xl md:text-6xl font-black">ألبوم أعمال ملك الحفلات</h1>
            <div className="w-24 h-0.5 bg-gold-accent mt-2 rounded-none" />
            <p className="mt-4 text-xs sm:text-base text-gray-300 max-w-2xl leading-relaxed font-light">
              شاهد لمساتنا وتجهيزاتنا الواقعية في تزيين وتكييف وتنسيق كبرى الحفلات الرسمية والشعبية والخاصة بالرياض.
            </p>
          </motion.div>
        </div>
      </div>

      {/* 2. Main Gallery Layout with Sticky Side Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Right Column: Sticky Side Tabs (3 cols on desktop) */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 z-20 bg-white border border-gray-100 p-6 rounded-none shadow-sm">
            <h2 className="text-sm font-black text-plum-primary border-b border-gray-100 pb-4 mb-4">
              تصنيفات المعرض
            </h2>
            
            {/* Desktop Vertical List */}
            <div className="hidden lg:flex flex-col gap-2">
              {FILTER_TAGS.map((tag) => {
                const IconComponent = tag.icon;
                const isActive = activeFilter === tag.id;
                return (
                  <button
                    key={tag.id}
                    onClick={() => setActiveFilter(tag.id)}
                    type="button"
                    className={`w-full px-4 py-3.5 rounded-none text-xs font-bold border transition-all duration-300 flex items-center justify-between cursor-pointer group ${
                      isActive
                        ? "bg-plum-primary border-plum-primary text-white hover:text-white"
                        : "bg-white border-gray-100 hover:border-gold-accent/35 text-text-dark hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className={`w-4 h-4 ${isActive ? "text-gold-accent animate-pulse" : "text-gold-accent"}`} />
                      <span>{tag.label}</span>
                    </div>
                    <ArrowLeft className={`w-3.5 h-3.5 transition-all duration-300 ${isActive ? "opacity-100 translate-x-0 text-gold-accent" : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-gold-accent"}`} />
                  </button>
                );
              })}
            </div>

            {/* Mobile Horizontal Scrollable List */}
            <div className="lg:hidden flex items-center gap-3 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {FILTER_TAGS.map((tag) => {
                const IconComponent = tag.icon;
                const isActive = activeFilter === tag.id;
                return (
                  <button
                    key={tag.id}
                    onClick={() => setActiveFilter(tag.id)}
                    type="button"
                    className={`px-5 py-3 rounded-none text-xs font-bold border transition-all duration-300 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-plum-primary border-plum-primary text-white"
                        : "bg-white border-gray-200 hover:border-gold-accent/30 text-text-dark hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 text-gold-accent" />
                    <span>{tag.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Left Column: Photos Grid (9 cols on desktop) */}
          <div className="lg:col-span-9">
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.src}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    onClick={() => setLightboxIdx(index)}
                    className="group relative h-[260px] rounded-none overflow-hidden shadow-md border border-gray-100/80 cursor-pointer hover:shadow-lg hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-gold-accent/25 transition-all duration-300"
                  >
                    <OptimizedImage 
                      src={photo.src}
                      alt={photo.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-750 group-hover:scale-103"
                    />
                    
                    {/* Gold hover card details */}
                    <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/95 via-plum-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                      <span className="text-[10px] text-gold-accent font-bold tracking-wide uppercase mb-1">ملك الحفلات للتجهيز</span>
                      <h3 className="text-sm font-bold text-white leading-snug">{photo.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>

      {/* 3. Fullscreen Lightbox Modal Slider */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIdx(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Close Overlay Button - Sharp */}
            <button
              onClick={() => setLightboxIdx(null)}
              className="absolute top-4 right-4 z-50 w-12 h-12 rounded-none bg-white/10 hover:bg-gold-accent text-white hover:text-plum-primary transition-all duration-300 flex items-center justify-center shadow hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gold-accent"
              aria-label="إغلاق المعاينة"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Prev Arrow Button - Sharp */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-none bg-white/5 border border-white/10 hover:bg-gold-accent text-white hover:text-plum-primary transition-all duration-300 flex items-center justify-center shadow hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gold-accent"
              aria-label="الصورة السابقة"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Next Arrow Button - Sharp */}
            <button
              onClick={handleNextPhoto}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-none bg-white/5 border border-white/10 hover:bg-gold-accent text-white hover:text-plum-primary transition-all duration-300 flex items-center justify-center shadow hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gold-accent"
              aria-label="الصورة التالية"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Showcase Box */}
            <motion.div
              initial={{ scale: 0.97 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl h-[70vh] flex flex-col justify-between"
            >
              <div className="relative w-full h-[90%] rounded-none overflow-hidden shadow-2xl border border-white/10">
                <OptimizedImage 
                  src={filteredPhotos[lightboxIdx].src}
                  alt={filteredPhotos[lightboxIdx].title}
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              {/* Lightbox Caption bar */}
              <div className="text-center p-3 text-white z-10">
                <span className="text-xs text-gold-accent font-semibold block mb-1">
                  صورة {lightboxIdx + 1} من {filteredPhotos.length}
                </span>
                <p className="text-sm font-bold text-gray-100">{filteredPhotos[lightboxIdx].title}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
