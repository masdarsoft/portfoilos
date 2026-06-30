"use client";

import OptimizedImage from "../components/OptimizedImage";
import { motion } from "framer-motion";
import { Award, Compass, Heart, Users, Sparkles, CheckCircle2 } from "lucide-react";

export default function AboutClient() {
  const stats = [
    { value: "+٥٠٠", label: "مناسبة وفعالية مجهزة", desc: "قمنا بخدمة الفعاليات الحكومية الكبرى وحفلات الزفاف والمخيمات الفاخرة." },
    { value: "٪١٠٠", label: "رضا العملاء وضيافة أصيلة", desc: "نحرص على دمج دفء التراث العربي بأساليب التجهيز الفاخرة الحديثة." },
    { value: "٢٤/٧", label: "دعم وصيانة فورية", desc: "طاقم فني متواجد ميدانياً طوال مدة مناسبتك لضمان تشغيل مثالي لجميع الأنظمة." },
    { value: "المملكة", label: "تغطية شاملة للمدن", desc: "جاهزية كاملة لنقل وتأسيس وتركيب التجهيزات في الرياض وكافة مناطق المملكة." }
  ];

  const values = [
    {
      icon: Award,
      title: "الجودة الملوكية",
      desc: "نقتني أفضل خامات الأقمشة والخيام المقاومة للمناخ، وكراسي ديور الفخمة، ومكيفات عالية التبريد لضمان بيئة مثالية."
    },
    {
      icon: Compass,
      title: "الأصالة التراثية",
      desc: "نحافظ على الطراز النجدي والتراثي الأصيل في بيوت الشعر والمجالس الأرضية لنضفي طابع الأصالة والكرم."
    },
    {
      icon: Heart,
      title: "الاهتمام بأدق التفاصيل",
      desc: "بدءاً من توزيع الإضاءات والمسافات الهندسية ودرجات التبريد المتناسقة ومروراً بتنسيق ألوان السجاد."
    }
  ];

  return (
    <div className="min-h-screen bg-bg-soft pb-24 text-text-dark text-right" dir="rtl">
      
      {/* 1. Page Cinematic Header */}
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
              <Sparkles className="w-3.5 h-3.5" />
              <span>مؤسسة ملك الحفلات لتجهيز المناسبات</span>
            </span>
            <h1 className="text-4xl md:text-6xl font-black">أصالة الضيافة وكرم التجهيز</h1>
            <div className="w-24 h-0.5 bg-gold-accent mt-2 rounded-none" />
            <p className="mt-4 text-xs sm:text-base text-gray-300 max-w-2xl leading-relaxed font-light">
              تعرّف على الشريك الأول والأكثر موثوقية لتجهيز الفعاليات الفاخرة، الاحتفالات الرسمية، والمجالس التراثية الكبرى في المملكة.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24">
        
        {/* 2. Core Legacy Section (Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative h-[240px] rounded-none overflow-hidden border border-gray-100 shadow-md">
                <OptimizedImage 
                  src="/images/tents1.jpg" 
                  alt="تأسيس خيام ملك الحفلات" 
                  fill 
                  sizes="(max-w-768px) 50vw, 25vw"
                  className="object-cover" 
                />
              </div>
              <div className="relative h-[180px] rounded-none overflow-hidden border border-gray-100 shadow-md">
                <OptimizedImage 
                  src="/images/chairs.jpg" 
                  alt="تنسيق كراسي ومفروشات" 
                  fill 
                  sizes="(max-w-768px) 50vw, 25vw"
                  className="object-cover" 
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="relative h-[180px] rounded-none overflow-hidden border border-gray-100 shadow-md">
                <OptimizedImage 
                  src="/images/poetry_houses1.jpg" 
                  alt="بيوت شعر ملكية" 
                  fill 
                  priority
                  sizes="(max-w-768px) 50vw, 25vw"
                  className="object-cover" 
                />
              </div>
              <div className="relative h-[240px] rounded-none overflow-hidden border border-gray-100 shadow-md">
                <OptimizedImage 
                  src="/images/air_conditioner1.jpg" 
                  alt="أنظمة تبريد وقاعات" 
                  fill 
                  sizes="(max-w-768px) 50vw, 25vw"
                  className="object-cover" 
                />
              </div>
            </div>
          </div>

          {/* Legacy description */}
          <div className="flex flex-col gap-6">
            <span className="text-xs font-bold text-gold-accent tracking-widest block">من نحن</span>
            <h2 className="text-3xl font-black text-plum-primary leading-tight">مسيرة مكللة بـالتميز في خدمة ضيوفكم</h2>
            <div className="w-16 h-0.5 bg-gold-accent rounded-none" />
            <p className="text-xs sm:text-sm text-text-light leading-relaxed font-light">
              تأسست مؤسسة **ملك الحفلات** لتجهيز المناسبات في قلب المملكة لتقديم أعلى درجات الفخامة والأصالة في تأجير مستلزمات الحفلات. نسعى جاهدين لتحويل المناسبات العادية إلى لوحات فنية تراثية وعصرية راقية.
            </p>
            <p className="text-xs sm:text-sm text-text-light leading-relaxed font-light">
              نحن نؤمن بأن كل مناسبة لها خصوصية وهوية مستقلة، لذا يقدم خبراؤنا استشارات مخصصة في اختيار الخيام المناسبة والمساحات المطلوبة، ودرجات التبريد المتكافئة، وتوزيع الجلسات التراثية أو العصرية.
            </p>
            
            <div className="space-y-3.5 mt-2">
              {[
                "دقة هندسية في تركيب بيوت الشعر والخيام الملكية والقاعات المتنقلة.",
                "مكيفات صحراوية وفريون صامتة ومكثفة التبريد تناسب الصيف الحار.",
                "مجالس وجلسات استقبال مذهبة وكراسي ديور تعزز رفاهية ضيافتكم."
              ].map((bullet, i) => (
                <div key={i} className="flex items-start gap-3 justify-end">
                  <span className="text-xs sm:text-sm font-medium text-text-dark">{bullet}</span>
                  <span className="w-1.5 h-1.5 bg-gold-accent mt-2 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Operational Values */}
        <section className="bg-white rounded-none p-8 sm:p-12 border border-gray-100 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-gold-accent tracking-widest uppercase">ركن أساسي لعملنا</span>
            <h2 className="text-2xl sm:text-3xl font-black text-plum-primary mt-1">قيم نلتزم بها لتوفير تجربة استثنائية</h2>
            <div className="w-12 h-0.5 bg-gold-accent mx-auto mt-3 rounded-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => {
              const IconComp = v.icon;
              return (
                <div key={i} className="p-6 rounded-none bg-gray-50 border border-gray-100 hover:shadow-lg hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-gold-accent/25 transition-all duration-300 flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-none bg-plum-primary/10 text-plum-primary flex items-center justify-center font-bold">
                    <IconComp className="w-6 h-6 text-plum-primary" />
                  </div>
                  <h3 className="text-base font-bold text-plum-primary">{v.title}</h3>
                  <p className="text-xs text-text-light leading-relaxed font-light">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Statistics Section (Plum Background banner) */}
        <section className="relative rounded-none bg-plum-dark text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-gold-accent/20">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-white/10">
            {stats.map((s, i) => (
              <div key={i} className={`flex flex-col gap-2 ${i > 0 ? "pt-6 sm:pt-0" : ""}`}>
                <span className="text-4xl sm:text-5xl font-black text-gold-accent">{s.value}</span>
                <span className="text-sm font-bold text-white">{s.label}</span>
                <p className="text-[11px] text-gray-300 px-4 leading-relaxed font-light">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
