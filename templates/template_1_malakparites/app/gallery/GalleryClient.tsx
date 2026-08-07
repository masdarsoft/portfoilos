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
  Film,
  Play,
  ArrowLeft
} from "lucide-react";

type MediaItem = {
  src: string;
  tag: string;
  title: string;
  type: "photo" | "video";
  poster?: string;
  duration?: string;
};

// Categorized high-resolution premium photos matching assets exactly
const GALLERY_PHOTOS: MediaItem[] = [
  { src: "/images/tents6.jpg", tag: "tents", title: "تأسيس خيمة ملكية كبرى", type: "photo" },
  { src: "/images/tents1.jpg", tag: "tents", title: "تنسيق قاعات ضيافة خارجية فاخرة", type: "photo" },
  { src: "/images/poetry_houses1.jpg", tag: "tents", title: "خيمة تراثية بطراز عربي عريق", type: "photo" },
  { src: "/images/poetry_houses4.jpg", tag: "tents", title: "تجهيز خيام كبرى للمناسبات الرسمية", type: "photo" },
  { src: "/صور/IMG-20260801-WA0005.jpg", tag: "tents", title: "بيت شعر تراثي مع مظلات خارجية", type: "photo" },
  { src: "/صور/IMG-20260801-WA0015.jpg", tag: "tents", title: "بيت شعر كبير مجهز لمناسبة ليلية", type: "photo" },
  { src: "/صور/IMG-20260801-WA0017.jpg", tag: "tents", title: "خيمة واسعة بمجالس سدو وإضاءة زينة", type: "photo" },
  { src: "/صور/IMG-20260801-WA0002.jpg", tag: "tents", title: "تجهيز خيمة استقبال بمجالس خشبية فاخرة", type: "photo" },
  { src: "/صور/IMG-20260801-WA0016.jpg", tag: "tents", title: "ركن تراثي بضيافة عربية وفرش سدو", type: "photo" },
  { src: "/images/chairs.jpg", tag: "seating", title: "كراسي نابليون مذهبة راقية", type: "photo" },
  { src: "/images/chairs1.jpg", tag: "seating", title: "كراسي ديور الفخمة وتنسيق طاولات", type: "photo" },
  { src: "/images/chairs3.jpg", tag: "seating", title: "كراسي ملكية مخصصة للاستقبال", type: "photo" },
  { src: "/images/Indoor_seating1.jpg", tag: "seating", title: "مجالس شعبية وتنسيق جلسات أرضية", type: "photo" },
  { src: "/images/Outdoor_seating1.jpg", tag: "seating", title: "جلسات استقبال خارجية فاخرة", type: "photo" },
  { src: "/صور/IMG-20260516-WA0020.jpg", tag: "seating", title: "جلسة خارجية بفرش شعبي وموقد قهوة", type: "photo" },
  { src: "/صور/IMG-20260801-WA0003.jpg", tag: "seating", title: "جلسة أرضية بجانب المسبح بفرش سدو", type: "photo" },
  { src: "/صور/IMG-20260801-WA0013.jpg", tag: "seating", title: "جلسة فناء خارجي بإضاءة معلقة", type: "photo" },
  { src: "/صور/IMG-20260801-WA0009.jpg", tag: "seating", title: "تنسيق طاولات وكراسي مكسوة لحفل خارجي", type: "photo" },
  { src: "/صور/IMG-20260801-WA0010.jpg", tag: "seating", title: "كراسي فندقية وفرش سجاد لصالة داخلية", type: "photo" },
  { src: "/صور/IMG-20260627-WA0012.jpg", tag: "seating", title: "فرش سجاد فاخر لساحة استقبال كبرى", type: "photo" },
  { src: "/images/air_conditioner1.jpg", tag: "cooling", title: "تأجير مكيف صحراوي عالي الدفع", type: "photo" },
  { src: "/images/air_conditioner2.jpg", tag: "cooling", title: "تركيب مكيفات فريون عمودية صامتة", type: "photo" },
  { src: "/images/air_conditioner3.jpg", tag: "cooling", title: "مكيف فريون تبريد مكثف للخيام", type: "photo" },
  { src: "/images/air_conditioner4.jpg", tag: "cooling", title: "مراوح رذاذ وتلطيف حدائق", type: "photo" },
  { src: "/صور/IMG-20260801-WA0011.jpg", tag: "cooling", title: "أسطول مكيفات صحراوية جاهزة للتأجير", type: "photo" },
  { src: "/صور/IMG-20260801-WA0012.jpg", tag: "cooling", title: "مكيفات رذاذ لممرات الفعاليات الخارجية", type: "photo" },
  { src: "/images/مكيفات سبليت/condiation-air.jpg", tag: "cooling", title: "تركيب مكيفات سبليت للقاعات والخيام", type: "photo" },
  { src: "/images/fan/مرواح-1.jpg", tag: "cooling", title: "مراوح دفع هواء صناعية للمناسبات", type: "photo" },
  { src: "/images/fan/images.jpg", tag: "cooling", title: "مراوح تهوية للجلسات الخارجية", type: "photo" },
  { src: "/images/Noor_Contracts1.jpg", tag: "tech", title: "عقود إضاءة ليد وكشافات كبرى", type: "photo" },
  { src: "/images/Noor_Contracts2.jpg", tag: "tech", title: "كشافات وحوامل إضاءة ليلية", type: "photo" },
  { src: "/images/Speaker1.jpg", tag: "tech", title: "تجهيز سماعات دي جي وأنظمة صوت", type: "photo" }
];

// Field clips from real setups — poster frames pre-extracted so the grid never
// downloads the mp4 until the visitor actually opens one.
const GALLERY_VIDEOS: MediaItem[] = [
  { src: "/فيدوهات/VID-20260801-WA0018.mp4", tag: "videos", title: "تجهيز ساحة مناسبة بالسجاد والكراسي", type: "video", poster: "/فيدوهات/posters/VID-20260801-WA0018.jpg", duration: "0:33" },
  { src: "/فيدوهات/VID-20260801-WA0022.mp4", tag: "videos", title: "خيمة تراثية بإضاءة وشراريب زينة", type: "video", poster: "/فيدوهات/posters/VID-20260801-WA0022.jpg", duration: "0:29" },
  { src: "/فيدوهات/VID-20260801-WA0020.mp4", tag: "videos", title: "خيمة صحراوية بإضاءة معلقة لحفل ليلي", type: "video", poster: "/فيدوهات/posters/VID-20260801-WA0020.jpg", duration: "0:28" },
  { src: "/فيدوهات/VID-20260627-WA0037.mp4", tag: "videos", title: "تحويل صالة داخلية إلى مجلس شعبي", type: "video", poster: "/فيدوهات/posters/VID-20260627-WA0037.jpg", duration: "0:25" },
  { src: "/فيدوهات/VID-20260801-WA0021.mp4", tag: "videos", title: "داخل خيمة مجهزة بمجالس سدو وسجاد", type: "video", poster: "/فيدوهات/posters/VID-20260801-WA0021.jpg", duration: "0:24" },
  { src: "/فيدوهات/VID-20260801-WA0023.mp4", tag: "videos", title: "جولة في صالة مفروشة لمناسبة عائلية", type: "video", poster: "/فيدوهات/posters/VID-20260801-WA0023.jpg", duration: "0:22" },
  // mp4 already shipped under /videos for the hero reel — reused here instead of a second copy
  { src: "/videos/VID-20260520-WA0037.mp4", tag: "videos", title: "بيت شعر تراثي بفرش ملكي وزينة ملونة", type: "video", poster: "/فيدوهات/posters/VID-20260520-WA0037.jpg", duration: "0:22" },
  { src: "/فيدوهات/VID-20260712-WA0009.mp4", tag: "videos", title: "خيمة ضخمة بإضاءة ليلية وكراسي ضيافة", type: "video", poster: "/فيدوهات/posters/VID-20260712-WA0009.jpg", duration: "0:20" },
  { src: "/فيدوهات/VID-20260801-WA0008.mp4", tag: "videos", title: "تجهيز حوش خارجي بفرش شعبي ليلاً", type: "video", poster: "/فيدوهات/posters/VID-20260801-WA0008.jpg", duration: "0:18" },
  { src: "/فيدوهات/VID-20260801-WA0007.mp4", tag: "videos", title: "فرش صالة استقبال بسجاد أحمر ومجالس", type: "video", poster: "/فيدوهات/posters/VID-20260801-WA0007.jpg", duration: "0:15" },
  { src: "/فيدوهات/VID-20260801-WA0006.mp4", tag: "videos", title: "تنسيق عشاء زفاف خارجي بإضاءة معلقة", type: "video", poster: "/فيدوهات/posters/VID-20260801-WA0006.jpg", duration: "0:11" },
  { src: "/فيدوهات/VID-20260801-WA0019.mp4", tag: "videos", title: "بيت شعر تراثي بفرش أحمر ومجالس سدو", type: "video", poster: "/فيدوهات/posters/VID-20260801-WA0019.jpg", duration: "0:08" },
  { src: "/فيدوهات/VID-20260627-WA0032.mp4", tag: "videos", title: "جولة في مجلس تراثي مجهز بالكامل", type: "video", poster: "/فيدوهات/posters/VID-20260627-WA0032.jpg", duration: "0:02" }
];

const GALLERY_MEDIA: MediaItem[] = [...GALLERY_PHOTOS, ...GALLERY_VIDEOS];

const FILTER_TAGS = [
  { id: "all", label: "الكل", icon: Compass },
  { id: "tents", label: "خيام وبيوت شعر", icon: Tent },
  { id: "seating", label: "كراسي وجلسات", icon: Sparkles },
  { id: "cooling", label: "تبريد وتهوية", icon: Wind },
  { id: "tech", label: "إضاءة وصوتيات", icon: Lightbulb },
  { id: "videos", label: "فيديوهات", icon: Film }
];

export default function GalleryClient() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Live filter media items
  const filteredPhotos = useMemo(() => {
    if (activeFilter === "all") return GALLERY_MEDIA;
    return GALLERY_MEDIA.filter(item => item.tag === activeFilter);
  }, [activeFilter]);

  // Reset the open lightbox when the filter changes — the index refers to the
  // previous filtered list and would otherwise point at unrelated media.
  const handleFilterChange = (id: string) => {
    setActiveFilter(id);
    setLightboxIdx(null);
  };

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

  const activeItem = lightboxIdx === null ? null : filteredPhotos[lightboxIdx];

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
              شاهد لمساتنا وتجهيزاتنا الواقعية بالصور والفيديو في تزيين وتكييف وتنسيق كبرى الحفلات الرسمية والشعبية والخاصة بالرياض.
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
                    onClick={() => handleFilterChange(tag.id)}
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
                    onClick={() => handleFilterChange(tag.id)}
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
                      src={photo.type === "video" ? photo.poster! : photo.src}
                      alt={photo.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-750 group-hover:scale-103"
                    />

                    {/* Play affordance + runtime for clips */}
                    {photo.type === "video" && (
                      <>
                        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                          <span className="w-14 h-14 rounded-none bg-plum-dark/55 backdrop-blur-sm border border-gold-accent/60 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                            <Play className="w-6 h-6 text-gold-accent fill-gold-accent translate-x-[1px]" />
                          </span>
                        </div>
                        <span className="absolute top-3 left-3 z-20 px-2 py-0.5 rounded-none bg-black/60 text-[10px] font-bold text-white tracking-wide pointer-events-none">
                          {photo.duration}
                        </span>
                      </>
                    )}

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
                {activeItem!.type === "video" ? (
                  <video
                    key={activeItem!.src}
                    src={activeItem!.src}
                    poster={activeItem!.poster}
                    controls
                    autoPlay
                    playsInline
                    controlsList="nodownload"
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <OptimizedImage
                    src={activeItem!.src}
                    alt={activeItem!.title}
                    fill
                    priority
                    className="object-contain"
                  />
                )}
              </div>

              {/* Lightbox Caption bar */}
              <div className="text-center p-3 text-white z-10">
                <span className="text-xs text-gold-accent font-semibold block mb-1">
                  {activeItem!.type === "video" ? "مقطع" : "صورة"} {lightboxIdx + 1} من {filteredPhotos.length}
                </span>
                <p className="text-sm font-bold text-gray-100">{activeItem!.title}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
