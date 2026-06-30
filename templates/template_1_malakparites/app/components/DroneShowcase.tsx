"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { 
  Play, 
  Pause, 
  Sparkles, 
  CalendarDays,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Lazy load booking modal
const QuickViewModal = dynamic(() => import("./QuickViewModal"), { ssr: false });

export default function DroneShowcase() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  // Static category for booking reference
  const lightingCategory = {
    id: "lighting-rentals",
    slug: "lighting-rentals",
    title: "عقود إضاءة ليد وكشافات",
    seoTitle: "تأجير عقود نور وكشافات إضاءة بالرياض",
    description: "تأجير وتركيب عقود النور المضيئة، شبكات الليد الجمالية، وكشافات الإنارة الكبرى للمخيمات والممرات والمناسبات المفتوحة بالرياض.",
    mainImage: "/images/Noor_Contracts1.jpg",
    features: ["تجهيز عقود إنارة", "شبكات ليد جمالية", "كشافات عالية القوة"],
    icon: "Lightbulb"
  };

  return (
    <section className="bg-plum-dark text-white py-24 px-4 relative overflow-hidden border-y border-gold-accent/20 text-right" dir="rtl">
      {/* Cinematic grid backdrop */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Right Side: Copywriting & Value Props (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-accent/10 border border-gold-accent/25 rounded-none text-xs font-bold text-gold-accent self-start uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>تغطية سينمائية خاصة</span>
            </span>
            
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              روائع التجهيز المضيء: <span className="text-gold-accent">عقود النور</span>
            </h2>
            <div className="w-16 h-0.5 bg-gold-accent rounded-none" />
            
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
              شاهد عبر تغطية جوية بالدرون الدقة والجمالية الهندسية في تصميم وتركيب شبكات عقود النور والليد المضيء لمناسباتنا الكبرى بالرياض.
            </p>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
              نحن في <strong>مؤسسة ملك الحفلات</strong> نؤمن بأن الإنارة هي روح المناسبة، لذا نبتكر في توزيع سلاسل الإضاءة الذهبية والبيضاء لتغطية الساحات المفتوحة، المخيمات الملكية، والممرات الخارجية بأعلى درجات الفخامة والأمان.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3.5 bg-gold-accent hover:bg-gold-light text-plum-primary text-xs font-black rounded-none transition-all duration-300 shadow-md hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gold-accent cursor-pointer"
              >
                <CalendarDays className="w-4 h-4" />
                <span>طلب تسعير شبكات النور</span>
              </button>
              
              <Link
                href="/services"
                className="flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-black rounded-none transition-all duration-300 hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-white"
              >
                <span>استكشاف خدمات الإنارة</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Left Side: Cinematic Video Player (7 Columns) */}
          <div className="lg:col-span-7 w-full">
            <div className="relative aspect-video w-full bg-black/40 border border-white/10 rounded-none shadow-2xl overflow-hidden hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-gold-accent/35 transition-all duration-500 group">
              
              {/* HTML5 Video Tag with Drone Footage */}
              <video
                ref={videoRef}
                src="/malakparties/malakvideos/عقود%20نور%20بالرياض%20.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Subtle Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              {/* Top Floating Badge */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1 text-[10px] font-black tracking-widest text-gold-accent flex items-center gap-1.5 pointer-events-none">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                <span>عرض حي من الرياض</span>
              </div>

              {/* Custom Player Overlay Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20">
                
                {/* Play/Pause Button Only (Always Muted) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 bg-black/70 hover:bg-gold-accent text-white hover:text-plum-primary border border-white/10 rounded-none flex items-center justify-center transition-all cursor-pointer shadow-md"
                    aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>

                {/* Updated Video Label with Brand and Phone Number */}
                <span className="text-[10px] font-bold text-gray-200 bg-black/70 px-3 py-2 border border-white/10 pointer-events-none">
                  مؤسسة ملك الحفلات | +966 56 943 6019
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Booking Modal Portal */}
      <AnimatePresence>
        {isModalOpen && (
          <QuickViewModal
            selectedCategory={lightingCategory as any}
            onClose={() => setIsModalOpen(false)}
            tenantDomain="malakparties.com"
          />
        )}
      </AnimatePresence>
    </section>
  );
}
