"use client";

import { useState } from "react";
import Link from "next/link";
import OptimizedImage from "../components/OptimizedImage";
import {
  CheckCircle,
  Star,
  MessageSquare,
  Phone,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  Clock,
  Users,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { RENTAL_CATEGORIES } from "../constants";
import { RentalCategory } from "../types";
import { getIconComponent } from "../../lib/resolveIcon";

// ─── Static Data (Overhauled with Malak Parties branding & keywords) ───────────────────

const EVENT_TYPES = [
  {
    title: "حفلات الأفراح الملكية",
    desc: "تنسيق كامل لحفلات الزواج الفاخرة من خيام ملكية، صبابين وقهوجيين، كوش إضاءة وجلسات راقية تناسب ليلتكم الكبرى.",
    keywords: ["تنسيق أفراح", "تجهيز أعراس", "تجهيز حفل زفاف ملفت"],
    image: "/images/tents1.jpg",
  },
  {
    title: "مجالس العزاء والوقار",
    desc: "توفير خيام العزاء المجهزة بالكامل، جلسات مريحة، أنظمة تكييف صامتة وهادئة، وقهوجيين لاستقبال المعزين بوقار واحترام.",
    keywords: ["تنظيم مجلس عزاء", "خيمة عزاء", "تجهيز عزاء سريع"],
    image: "/images/tents6.jpg",
  },
  {
    title: "الحفلات والمناسبات الخاصة",
    desc: "تجهيز وتصميم الجلسات للمناسبات العائلية وحفلات التخرج والأعياد بأجمل الأساليب التراثية والحديثة.",
    keywords: ["تنظيم حفلات", "تجهيز مناسبات", "تنسيق فعاليات"],
    image: "/images/Indoor_seating1.jpg",
  },
  {
    title: "المؤتمرات والفعاليات الرسمية",
    desc: "تشييد قاعات ضخمة متكاملة، مجالس استقبال كبار الشخصيات، تجهيزات الصوت والإضاءة للمعارض والافتتاحات الرسمية.",
    keywords: ["فعاليات حكومية", "استقبالات رسمية", "قاعات معارض للإيجار"],
    image: "/images/Outdoor_seating1.jpg",
  },
  {
    title: "المجالس الرمضانية الفخمة",
    desc: "تصميم الخيام والمجالس الرمضانية التراثية بإنارة دافئة، جلسات أرضية مريحة، وضيافة القهوة العربية الأصيلة.",
    keywords: ["مجالس رمضانية", "ليالي رمضان", "سهرات رمضان"],
    image: "/images/poetry_houses2.jpg",
  },
  {
    title: "المخيمات الشتوية والمجالس",
    desc: "تجهيز بيوت الشعر والمخيمات الخارجية بكافة مستلزمات الشتاء من وجار ودفايات وجلسات شعبية أصيلة.",
    keywords: ["مخيمات شتوية", "جلسات شتوية", "تجهيز مخيم متكامل"],
    image: "/images/outdoor_heater2.jpg",
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "التواصل والاستشارة",
    desc: "تواصل معنا مباشرة عبر الهاتف أو الواتساب لعرض أفكارك وتحديد نوع المناسبة والموقع المستهدف وعدد الضيوف.",
    icon: Phone,
  },
  {
    num: "02",
    title: "مخطط التنسيق الهندسي",
    desc: "يقوم مستشارو ملك الحفلات بوضع خطة تنظيمية وتوزيع مساحات التجهيز لعرضها عليك مع تسعير دقيق وواضح.",
    icon: Sparkles,
  },
  {
    num: "03",
    title: "التركيب والتهيئة الفنية",
    desc: "يصل فريق الدعم الفني والتركيب مبكراً لتثبيت التجهيزات واختبار المكيفات والإنارة والصوتيات بأعلى درجات الأمان.",
    icon: Award,
  },
  {
    num: "04",
    title: "الإشراف والتشغيل الفوري",
    desc: "نرافقكم طوال مدة الفعالية لضمان سير العمل وصيانة الأنظمة، ونتكفل بأعمال الفك والنقل بعد انتهاء مناسبتكم.",
    icon: CheckCircle,
  },
];

const ALL_REVIEWS = [
  {
    name: "أم خالد الرشيدي",
    rating: 5,
    text: "ملك الحفلات جهّزوا حفل زواج ابني من الألف إلى الياء. الخيمة الملكية كانت مبهرة، والقهوجيين كانوا محترفين جداً، والجلسات كانت راقية. لن نتعامل مع غيرهم!",
    date: "مايو 2026",
    service: "تنسيق حفل زواج",
    city: "الرياض"
  },
  {
    name: "أحمد العتيبي",
    rating: 5,
    text: "استعنا بملك الحفلات لتجهيز مجلس عزاء وكانت الخدمة على أعلى مستوى. الخيمة، المكيفات، الكراسي، والقهوجيين — كل شيء كان مثالياً في وقت صعب.",
    date: "أبريل 2026",
    service: "تجهيز مجلس عزاء",
    city: "الرياض"
  },
  {
    name: "سلطان الدوسري",
    rating: 5,
    text: "حفلة عيد ميلاد ابنتي كانت الأجمل بفضل تنسيق ملك الحفلات. الجلسات والإضاءة والترتيبات كانت رائعة. شكراً جزيلاً.",
    date: "مارس 2026",
    service: "تنسيق حفل ميلاد",
    city: "الرياض"
  },
  {
    name: "فهد القحطاني",
    rating: 5,
    text: "فعالية شركتنا السنوية جهّزها ملك الحفلات باحترافية عالية. القاعة المتحركة، الصوتيات، الإضاءة، والضيافة — كل شيء كان على أعلى مستوى.",
    date: "مارس 2026",
    service: "تجهيز فعالية شركة",
    city: "الرياض"
  },
  {
    name: "نورة السليم",
    rating: 5,
    text: "مخيمنا الشتوي كان أجمل تجربة بفضل ملك الحفلات. بيت الشعر، الدفايات، الجلسات الشعبية، والقهوة العربية خلقت أجواءً لا تُنسى.",
    date: "يناير 2026",
    service: "تجهيز مخيم شتوي",
    city: "الرياض"
  },
  {
    name: "عبدالله الشمري",
    rating: 5,
    text: "مجلس رمضاني فاخر نظّمه ملك الحفلات. الجلسات التراثية والقهوجيون والإضاءة الدافئة خلقت أجواءً رمضانية أصيلة. أوصي بهم بشدة.",
    date: "مارس 2026",
    service: "تجهيز مجلس رمضاني",
    city: "الرياض"
  },
];

const FAQS = [
  {
    q: "ما المناطق التي تغطيها مؤسسة ملك الحفلات في الرياض؟",
    a: "نغطي كافة أحياء مدينة الرياض وضواحيها (الملقا، الياسمين، النرجس، حي السفارات، الدرعية، وغيرها). كما نوفر إمكانية نقل وتجهيز الفعاليات الكبرى للمدن المجاورة بالتنسيق المسبق."
  },
  {
    q: "كم يستغرق التجهيز والتركيب الميداني؟",
    a: "يتوقف ذلك على حجم الفعالية وتكامل التجهيزات. بالنسبة للمجالس والخيام الفردية ننهي العمل خلال 6-12 ساعة، أما القاعات والسرادقات الضخمة فيبدأ العمل عليها قبل المناسبة بـ 24 إلى 48 ساعة."
  },
  {
    q: "هل توفرون خيارات إيجار متكاملة (مظلة واحدة)؟",
    a: "نعم، هذا هو صميم تميزنا في ملك الحفلات. نوفر لك الخيام، التكييف، الإنارة، الكراسي، الجلسات الأرضية، الصوتيات، وضيافة القهوجيين والصبابين دون الحاجة للتنسيق مع موردين متعددين."
  },
  {
    q: "كيف يتم تسعير خدمات تنظيم الحفلات والمناسبات؟",
    a: "يتم احتساب الأسعار بناءً على نوع التجهيز المحدد، كمية الكراسي والمكيفات المطلوبة، وموقع التركيب. تواصل معنا مباشرة لنقدم لك كشف أسعار مجاني ودقيق."
  },
  {
    q: "هل يتواجد مشرفون فنيون طوال فترة الحفل؟",
    a: "بالتأكيد. نوفر مشرفين فنيين لمتابعة أداء المولدات الكهربائية وأجهزة التكييف والصوت لضمان خلو مناسبتك من أي عوائق تقنية طوال فترة التشغيل."
  },
];

const STATS = [
  { num: "+500", label: "فعالية ملكية تم تنسيقها", icon: Award },
  { num: "+1000", label: "عميل يثق بخدماتنا", icon: Users },
  { num: "24/7", label: "دعم وإشراف ميداني مستمر", icon: Clock },
  { num: "15+", label: "خدمة متكاملة تحت سقف واحد", icon: CheckCircle },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface TanseeqClientProps {
  categories?: RentalCategory[];
}

export default function TanseeqClient({ categories = RENTAL_CATEGORIES }: TanseeqClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const renderStars = (n: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < n ? "fill-gold-accent text-gold-accent" : "text-gray-300"}`} />
    ));

  return (
    <div className="min-h-screen bg-bg-soft text-right" dir="rtl">

      {/* ─── 1. HERO SECTION: Split-Screen Layout ─── */}
      <section className="relative min-h-[85vh] bg-gradient-to-br from-plum-dark via-plum-primary to-plum-dark flex items-center justify-center overflow-hidden clip-slant pb-20 md:pb-24">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gold-accent/10 blur-[120px]" />
          <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-plum-light/20 blur-[150px] -translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Text details (7 columns) */}
            <div className="lg:col-span-7 flex flex-col items-start text-right animate-hero-enter gap-6">
              {/* Tagline - Sharp */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none border border-gold-accent/30 bg-white/5 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-gold-accent animate-pulse" />
                <span className="text-[10px] text-gold-light font-black tracking-wider">تنسيق وتجهيز الفعاليات الكبرى</span>
              </div>

              {/* Heading */}
              <div className="flex gap-4 items-stretch">
                <div className="w-1.5 bg-gradient-to-b from-gold-accent to-gold-light rounded-none" />
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-md tracking-tight">
                  تنسيق الحفلات <br />
                  <span className="text-gold-accent font-light text-3xl sm:text-4xl block mt-2">
                    والمناسبات الملكية بالرياض
                  </span>
                </h1>
              </div>

              <p className="max-w-xl text-sm text-gray-300 leading-relaxed font-light">
                مؤسسة ملك الحفلات تقدم خدمات التنسيق الشامل والتخطيط المتكامل لكافة مناسباتكم العائلية والرسمية بالرياض. نوفر الخيام الفاخرة، التكييف الفائق، الكراسي الفخمة، والضيافة العربية في باقة واحدة متكاملة.
              </p>

              {/* CTAs - Sharp */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4 w-full sm:w-auto">
                <a
                  href="https://api.whatsapp.com/send/?phone=966569436019&text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85+%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C+%D8%A3%D8%B1%D9%8A%D8%AF+%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1+%D8%B9%D9%86+%D8%AA%D9%86%D8%B3%D9%8A%D9%82+%D9%85%D9%86%D8%A7%D8%B3%D8%A8%D8%A9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 bg-gold-accent hover:bg-gold-light text-plum-primary font-black rounded-none shadow-lg hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-gold-accent transition-all duration-300 text-center text-xs"
                >
                  احجز تنسيق الفعالية الآن
                </a>
                <a
                  href="tel:+966569436019"
                  className="px-8 py-3.5 border border-white/20 hover:border-gold-accent text-white font-bold rounded-none bg-white/5 hover:bg-white/10 hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-white/30 transition-all duration-300 text-center text-xs"
                >
                  اتصال مباشر بالمنسق
                </a>
              </div>
            </div>

            {/* Media Spotlight (5 columns) - Flat offset shadow */}
            <div className="lg:col-span-5 relative h-[350px] md:h-[420px] w-full flex items-center justify-center animate-hero-enter" style={{ animationDelay: "150ms" }}>
              <div className="absolute inset-0 border border-white/5 rounded-none bg-white/[0.02] backdrop-blur-3xl z-0" />
              
              <div className="relative w-72 h-96 rounded-none overflow-hidden border-2 border-gold-accent shadow-[12px_12px_0px_0px_rgba(11,19,43,0.9)] z-20 hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-500 group">
                <OptimizedImage
                  src="/images/tents4.jpg"
                  alt="تنسيق المناسبات الملكية"
                  fill
                  priority
                  sizes="(max-width: 768px) 250px, 300px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 2. HOW WE WORK (Process Steps) ─── */}
      <section className="py-24 px-4 bg-plum-dark text-white relative overflow-hidden border-b border-gold-accent/20">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-right mb-16 border-r-4 border-gold-accent pr-6">
            <span className="text-xs font-bold text-gold-accent tracking-widest block mb-1">مسار العمل المعتمد</span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">كيف ننظم مناسبتكم؟</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative bg-white/5 border border-white/10 rounded-none p-8 hover:bg-white/10 hover:border-gold-accent/30 transition-all duration-300 hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-gold-accent/30"
                >
                  <div className="flex items-center gap-3 mb-6 justify-end">
                    <div className="w-10 h-10 rounded-none bg-gold-accent/15 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gold-accent" />
                    </div>
                    <span className="text-4xl font-black text-gold-accent/20 leading-none">{step.num}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-light">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 3. EVENT TYPES GRID (Royal Occasions) ─── */}
      <section className="py-24 px-4 bg-bg-soft">
        <div className="max-w-7xl mx-auto">
          <div className="text-right mb-16 border-r-4 border-gold-accent pr-6">
            <span className="text-xs font-bold text-gold-accent tracking-widest block mb-1">خدماتنا الشاملة</span>
            <h2 className="text-3xl md:text-5xl font-black text-plum-primary leading-tight">تنسيق لكل مناسبة</h2>
            <p className="mt-4 text-xs sm:text-sm text-text-light leading-relaxed font-light max-w-2xl">
              سواء كانت مناسبتك فرحاً يجمع الأهل، عزاءً يستدعي الاحتراف والوقار، أو فعالية رسمية تمثل مؤسستك — لدى ملك الحفلات الحل التنظيمي المتكامل.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EVENT_TYPES.map((event) => (
              <div
                key={event.title}
                className="group relative h-[320px] rounded-none overflow-hidden shadow-md border border-transparent hover:border-gold-accent/20 hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-gold-accent/25 transition-all duration-300"
              >
                <div className="absolute inset-0 z-0">
                  <OptimizedImage
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/95 via-plum-primary/60 to-transparent transition-opacity duration-300" />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-end p-8">
                  <h3 className="text-xl font-black text-white mb-2 group-hover:text-gold-accent transition-colors duration-300">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-200 leading-relaxed mb-4 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {event.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 justify-end">
                    {event.keywords.map((kw) => (
                      <span key={kw} className="text-[9px] px-2.5 py-0.5 rounded-none bg-gold-accent/20 text-gold-light font-bold">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. THE 15 SERVICES LIST (Geometric Grid) ─── */}
      <section className="py-24 px-4 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-right mb-16 border-r-4 border-gold-accent pr-6">
            <span className="text-xs font-bold text-gold-accent tracking-widest block mb-1">دليل التجهيزات</span>
            <h2 className="text-3xl md:text-5xl font-black text-plum-primary leading-tight">تكامل التجهيزات الفنية</h2>
            <p className="mt-4 text-xs sm:text-sm text-text-light leading-relaxed font-light max-w-xl">
              نوفر لك كافة مستلزمات الحفل من مكان واحد لتوحيد الجودة والضيافة وتوفير عناء التنسيق مع جهات متعددة.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              return (
                <Link
                  key={cat.id}
                  href={`/${cat.id}`}
                  className="group flex flex-col items-center justify-center p-6 h-24 rounded-none bg-gray-50 hover:bg-plum-dark border border-gray-100 hover:border-plum-dark hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gold-accent/40 transition-all duration-300 text-center cursor-pointer"
                  aria-label={`تصفح خدمة ${cat.title}`}
                >
                  <span className="text-xs font-bold text-text-dark group-hover:text-white transition-colors duration-300 leading-snug">
                    {cat.title}
                  </span>
                  <ArrowLeft className="w-3.5 h-3.5 mt-1 text-gold-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. PHOTO GALLERY STRIP (Geometric Tiles) ─── */}
      <section className="py-20 bg-gray-50 border-t border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-10 text-right border-r-4 border-gold-accent pr-6">
          <span className="text-xs font-bold text-gold-accent tracking-widest block mb-1">أعمالنا الميدانية</span>
          <h2 className="text-3xl font-black text-plum-primary leading-tight">من معرض مناسباتنا الحية</h2>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-6 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            "/images/tents1.jpg",
            "/images/Indoor_seating1.jpg",
            "/images/poetry_houses2.jpg",
            "/images/Outdoor_seating1.jpg",
            "/images/Noor_Contracts2.jpg",
            "/images/chairs4.jpg",
            "/images/outdoor_heater2.jpg",
            "/images/tents4.jpg",
          ].map((src, i) => (
            <div
              key={i}
              className="relative shrink-0 w-64 h-48 rounded-none overflow-hidden shadow-md border border-gray-100"
            >
              <OptimizedImage
                src={src}
                alt={`معرض أعمال ملك الحفلات للمناسبات ${i + 1}`}
                fill
                sizes="256px"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/gallery"
            aria-label="عرض معرض الأعمال الكامل"
            className="inline-flex items-center gap-2 px-6 py-3 border border-plum-primary text-plum-primary font-bold rounded-none hover:bg-plum-primary hover:text-white hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-plum-primary transition-all duration-300 text-sm"
          >
            عرض كامل معرض الأعمال
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── 6. CLIENT TESTIMONIALS (Reviews) ─── */}
      <section className="py-24 px-4 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-right mb-16 border-r-4 border-gold-accent pr-6">
            <span className="text-xs font-bold text-gold-accent tracking-widest block mb-1">تقييمات العملاء</span>
            <h2 className="text-3xl md:text-5xl font-black text-plum-primary leading-tight">تجارب حقيقية</h2>
            <p className="mt-4 text-xs sm:text-sm text-text-light leading-relaxed font-light">
              ثقة عملائنا في الرياض هي أساس نجاحنا في تقديم وتجهيز أروع المجالس والخيام.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ALL_REVIEWS.map((review, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-none p-8 border border-gray-100 hover:shadow-lg hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-gold-accent/20 transition-all duration-300 flex flex-col text-right"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4 justify-end">{renderStars(review.rating)}</div>

                {/* Badge */}
                <span className="inline-block text-[10px] font-bold px-3 py-1 rounded-none bg-plum-primary/10 text-plum-primary mb-4 w-fit">
                  {review.service}
                </span>

                <p className="text-sm text-text-dark leading-relaxed font-light mb-6 flex-1">
                  &quot;{review.text}&quot;
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-[10px] text-text-light">{review.date}</span>
                  <div className="flex items-center gap-3 justify-end">
                    <div>
                      <p className="text-xs font-bold text-text-dark">{review.name}</p>
                      <div className="flex items-center gap-1 text-[10px] text-text-light justify-end">
                        {review.city}
                        <MapPin className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-none bg-plum-primary/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-plum-primary" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. FAQ ACCORDION (Structured Geometric List) ─── */}
      <section className="py-24 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-gold-accent tracking-widest block mb-1">الأسئلة الشائعة</span>
            <h2 className="text-3xl md:text-5xl font-black text-plum-primary leading-tight">استفسارات تجهيز المناسبات</h2>
            <div className="w-16 h-0.5 bg-gold-accent mt-4 rounded-none mx-auto" />
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-none border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-right cursor-pointer"
                  aria-expanded={openFaq === idx}
                >
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-gold-accent shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-plum-primary shrink-0" />
                  )}
                  <span className="text-sm font-bold text-text-dark leading-snug pr-4">{faq.q}</span>
                </button>
                <div
                  className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    openFaq === idx ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-5 pb-5 text-sm text-text-light leading-relaxed font-light">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. CTA BANNER ─── */}
      <section className="py-24 px-4 bg-plum-dark relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[url('/images/tents5.jpg')] bg-cover bg-center opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-dark via-plum-dark/95 to-plum-dark/90 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-none bg-gold-accent/15 border border-gold-accent/30 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-7 h-7 text-gold-accent animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            مناسبتك القادمة تستحق <span className="text-gold-accent">الأفضل</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 font-light">
            تواصل مع فريق ملك الحفلات الآن واحصل على عرض سعر مجاني وخطة تجهيز متكاملة تناسب مناسبتكم وميزانيتكم. نحن هنا لنجعل من مناسبتكم تجربة ملكية لا تُنسى.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://api.whatsapp.com/send/?phone=966569436019&text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85+%D8%B9%D9%84%D9%88%D9%83%D9%85%D8%8C+%D8%A3%D8%B1%D9%8A%D8%AF+%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1+%D8%B9%D9%86+%D8%AA%D9%86%D8%B3%D9%8A%D9%82+%D9%85%D9%86%D8%A7%D8%B3%D8%A8%D8%A9"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تواصل معنا عبر واتساب"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#20ba56] text-white font-black rounded-none shadow-lg hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-green-500 transition-all duration-300 text-sm cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>واتساب فوري</span>
            </a>
            <a
              href="tel:+966569436019"
              aria-label="اتصل بنا الآن"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold-accent hover:bg-gold-light text-plum-primary font-black rounded-none shadow-lg hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gold-accent transition-all duration-300 text-sm cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>اتصل بنا الآن</span>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-gold-accent" /> عرض سعر مجاني</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-gold-accent" /> توصيل وتركيب شامل</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-gold-accent" /> ضمان رضا تام</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-gold-accent" /> خدمة 24/7</span>
          </div>
        </div>
      </section>

    </div>
  );
}
