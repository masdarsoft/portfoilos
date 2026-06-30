"use client";

import OptimizedImage from "./OptimizedImage";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-plum-dark text-white overflow-hidden relative">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-gold-accent blur-[120px] -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* ─── 1. BRAND PHILOSOPHY BLOCKQUOTE ─── */}
        <div className="max-w-3xl mx-auto mb-16 animate-fade-in-section">
          <div className="flex justify-center mb-4">
            {/* Sharp square badge */}
            <span className="p-3 bg-white/5 border border-white/10 rounded-none">
              <Sparkles className="w-5 h-5 text-gold-accent" />
            </span>
          </div>
          <span className="text-[10px] font-bold text-gold-accent tracking-widest uppercase block mb-3">فلسفة الخدمة</span>
          
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-light italic leading-relaxed text-gray-100 select-none">
            "لا نصنع مجرد مخيمات أو جلسات، بل نبتكر مساحات تليق بـالضيافة الاستثنائية. في ملك الحفلات، نصنع لفعالياتكم هيبة ومظهراً فخماً يبقى راسخاً في ذاكرة الحضور."
          </blockquote>
          
          <div className="w-16 h-0.5 bg-gold-accent mx-auto mt-6 rounded-none" />
        </div>

        {/* ─── 2. TWO-COLUMN CRAFTSMANSHIP SHOWCASE ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-12">
          
          {/* Card 1: Craftsmanship (حرفية التجهيز) - Sharp corners with offset outline */}
          <div className="group relative h-[300px] md:h-[350px] rounded-none overflow-hidden shadow-lg border border-white/10 flex flex-col justify-end text-right p-8 hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-gold-accent/40 transition-all duration-300">
            {/* Background Image layer with hover scale */}
            <div className="absolute inset-0 z-0">
              <OptimizedImage 
                src="/images/tents2.jpg" 
                alt="حرفية تركيب الخيام" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/95 via-plum-primary/60 to-transparent transition-opacity duration-300" />
            </div>

            {/* Content card body */}
            <div className="relative z-10">
              {/* Sharp square badge */}
              <div className="inline-flex p-2.5 bg-gold-accent text-plum-primary rounded-none mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-gold-accent transition-colors duration-300">
                حرفية التجهيز والتفصيل
              </h3>
              <p className="mt-2 text-xs text-gray-300 leading-relaxed font-light">
                نلتزم بدقة هندسية في تشييد الخيام الملكية والقاعات الأوروبية. نهتم بمتانة البناء، وعزل العوامل الجوية، وجمال الزخارف التراثية والحديثة لضمان بيئة آمنة وراقية لمناسبتكم.
              </p>
            </div>
          </div>

          {/* Card 2: Royal Hospitality (الضيافة الملكية) - Sharp corners with offset outline */}
          <div className="group relative h-[300px] md:h-[350px] rounded-none overflow-hidden shadow-lg border border-white/10 flex flex-col justify-end text-right p-8 hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-gold-accent/40 transition-all duration-300">
            {/* Background Image layer with hover scale */}
            <div className="absolute inset-0 z-0">
              <OptimizedImage 
                src="/images/chairs.jpg" 
                alt="كراسي وجلسات ضيافة" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/95 via-plum-primary/60 to-transparent transition-opacity duration-300" />
            </div>

            {/* Content card body */}
            <div className="relative z-10">
              {/* Sharp square badge */}
              <div className="inline-flex p-2.5 bg-gold-accent text-plum-primary rounded-none mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-gold-accent transition-colors duration-300">
                تكامل تجهيزات الضيافة
              </h3>
              <p className="mt-2 text-xs text-gray-300 leading-relaxed font-light">
                من كراسي نابليون المذهبة وديور الفاخرة إلى أنظمة التكييف الصامتة وعقود الإنارة الساحرة. نهيئ كل تفاصيل الراحة والترف ليعيش ضيوفكم تجربة ضيافة ملكية حقيقية متكاملة.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
