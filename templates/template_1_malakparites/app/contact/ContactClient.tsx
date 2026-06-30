"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageSquare, Check, Sparkles, Send } from "lucide-react";
import Image from "next/image";

const SERVICE_OPTIONS = [
  { id: "ac-rentals", label: "تأجير مكيفات" },
  { id: "tent-rentals", label: "تأجير خيام" },
  { id: "hair-tents", label: "تأجير بيوت شعر" },
  { id: "fan-rentals", label: "تأجير مراوح رذاذ" },
  { id: "heater-rentals", label: "تأجير دفايات خارجية وهرمية" },
  { id: "chair-rentals", label: "تأجير كراسي ديور ونابليون" },
  { id: "outdoor-seats", label: "تأجير جلسات خارجية" },
  { id: "lighting-rentals", label: "تأجير عقود نور وكشافات" },
  { id: "sound-systems", label: "تأجير سماعات وأنظمة صوت" },
  { id: "turasiyat", label: "تأجير تراثيات وبيوت شعر" },
  { id: "other", label: "تجهيز متكامل / خدمات أخرى" }
];

export default function ContactClient() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [messageText, setMessageText] = useState("");
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !eventLocation) return;

    const chosenServiceLabel = SERVICE_OPTIONS.find(s => s.id === selectedService)?.label || "غير محدد";

    const arabicMsg = `السلام عليكم ورحمة الله وبركاته،
أود الاستفسار عن تجهيز مناسبة عبر صفحة اتصل بنا:

*بيانات العميل:*
- الاسم: ${customerName}
- الجوال: ${customerPhone}
- المدينة / الموقع: ${eventLocation}
- الخدمة المطلوبة: ${chosenServiceLabel}

*ملاحظات الاستفسار:*
${messageText || "لا توجد ملاحظات إضافية"}

شكراً لكم، أرجو التواصل معي لتأكيد التفاصيل والأسعار.`;

    const encodedText = encodeURIComponent(arabicMsg);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=%2B966569436019&text=${encodedText}`;
    window.open(whatsappUrl, "_blank");

    // Show custom success card
    setIsSubmitted(true);
    
    // Reset form fields
    setTimeout(() => {
      setCustomerName("");
      setCustomerPhone("");
      setSelectedService("");
      setEventLocation("");
      setMessageText("");
      setIsSubmitted(false);
    }, 6000);
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
              <Sparkles className="w-3.5 h-3.5" />
              <span>تواصل مباشر على مدار الساعة</span>
            </span>
            <h1 className="text-4xl md:text-6xl font-black">يسعدنا تواصلكم معنا</h1>
            <div className="w-24 h-0.5 bg-gold-accent mt-2 rounded-none" />
            <p className="mt-4 text-xs sm:text-base text-gray-300 max-w-2xl leading-relaxed font-light">
              سواء كنت تخطط لحفل زفاف ملوكي، أو افتتاح رسمي، أو جلسة شعبية خاصة، فريق خدمة العملاء جاهز للرد على جميع استفساراتك فوراً.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* 2. Left: Interactive Feedback Inquiry Form */}
          <div className="bg-white rounded-none p-8 sm:p-10 border border-gray-100 shadow-md">
            <h2 className="text-xl sm:text-2xl font-black text-plum-primary mb-2">إرسال طلب تسعير مخصص</h2>
            <p className="text-xs text-text-light mb-6">يرجى تعبئة بيانات مناسبتك أدناه، وسيقوم نظام ملك الحفلات بتنسيق رسالة فورية لفتح محادثة مباشرة مع مسؤولي الحجوزات.</p>
            <div className="w-12 h-0.5 bg-gold-accent mb-8 rounded-none" />

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleFormSubmit}
                  className="space-y-5 text-xs font-semibold"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">الاسم الكريم *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="مثال: محمد السديري"
                        className="p-3 border border-gray-200 rounded-none focus:ring-1 focus:ring-gold-accent/40 focus:border-gold-accent outline-none text-text-dark bg-white"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">رقم الجوال *</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="مثال: 050XXXXXXX"
                        className="p-3 border border-gray-200 rounded-none focus:ring-1 focus:ring-gold-accent/40 focus:border-gold-accent outline-none text-text-dark bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Service category Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">الخدمة المطلوبة</label>
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="p-3 border border-gray-200 rounded-none focus:ring-1 focus:ring-gold-accent/40 focus:border-gold-accent outline-none text-text-dark bg-white cursor-pointer font-medium"
                      >
                        <option value="">-- اختر فئة التجهيز --</option>
                        {SERVICE_OPTIONS.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">موقع الفعالية / المدينة *</label>
                      <input
                        type="text"
                        required
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        placeholder="مثال: الرياض، حي حطين"
                        className="p-3 border border-gray-200 rounded-none focus:ring-1 focus:ring-gold-accent/40 focus:border-gold-accent outline-none text-text-dark bg-white"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">تفاصيل أو متمتلكات خاصة</label>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="اكتب مواصفات خيمتك أو درجات التبريد أو أي تجهيزات تود الاستفسار عنها بالتفصيل..."
                      rows={4}
                      className="p-3 border border-gray-200 rounded-none focus:ring-1 focus:ring-gold-accent/40 focus:border-gold-accent outline-none text-text-dark bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-plum-primary hover:bg-gold-accent hover:text-plum-primary text-white text-xs sm:text-sm font-bold rounded-none transition-all duration-300 shadow-md hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-plum-primary flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <Send className="w-4 h-4" />
                    <span>تأكيد الإرسال عبر الواتساب الفوري</span>
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="contact-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gold-accent/10 border border-gold-accent/20 rounded-none p-8 text-center flex flex-col items-center gap-4 py-16"
                >
                  <div className="w-14 h-14 bg-gold-accent rounded-none text-plum-primary flex items-center justify-center font-bold shadow shadow-gold-accent/20">
                    <Check className="w-7 h-7 text-plum-primary" />
                  </div>
                  <h3 className="text-lg font-black text-plum-primary">تم إرسال استفسارك بنجاح!</h3>
                  <p className="text-xs text-text-light max-w-sm leading-relaxed font-light">
                    تم إنشاء وتنسيق تفاصيل طلبك وفتح نافذة واتساب المشفرة للتحدث مباشرة مع مسؤولي الحجوزات لمؤسسة ملك الحفلات.
                  </p>
                  <span className="text-[10px] text-gray-400 mt-2 font-medium">سيتم إعادة تعيين الحقول تلقائياً بعد قليل...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Right: Contact details, Address, Map mock */}
          <div className="flex flex-col gap-10">
            
            {/* Direct Cards Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Address card */}
              <a
                href="https://www.google.com/search?kgmid=%2Fg%2F11ysn62f2y&hl=en-SA&q=%D8%A7%D9%84%D9%85%D8%A7%D8%B1%D9%8A%D9%86%D8%A7.%D9%84%D9%84%D8%AD%D9%81%D9%84%D8%A7%D8%AA%20%D9%88%D8%A7%D9%84%D9%85%D9%86%D8%A7%D8%B3%D8%A8%D8%A7%D8%AA.%D8%AF%D9%81%D8%A7%D9%8A%D8%A7%D8%AA%20%D9%85%D9%83%D9%8A%D9%81%D8%A7%D8%AA%20%D8%AE%D9%8A%D8%A7%D9%85.%D9%83%D8%B1%D8%A7%D8%B3%D9%8A&shem=epsdc%2Crimspwouoe&shndl=30&source=sh%2Fx%2Floc%2Fosrp%2Fm5%2F1&kgs=2ea93a7c63b6c476"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:border-plum-primary/35 hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-plum-primary/20 transition-all duration-300 rounded-none p-6 border border-gray-100 shadow-sm flex items-start gap-4 text-right cursor-pointer group"
              >
                <div className="p-3 bg-plum-primary/10 text-plum-primary rounded-none flex items-center justify-center flex-shrink-0 group-hover:bg-plum-primary group-hover:text-white transition-all duration-300">
                  <MapPin className="w-5 h-5 text-plum-primary group-hover:text-white transition-all duration-300" />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">موقعنا على الخريطة</span>
                  <span className="text-xs font-bold text-plum-primary leading-snug group-hover:text-gold-accent transition-colors duration-300">ملك الحفلات</span>
                  <span className="text-[11px] text-text-light font-medium mt-0.5 leading-relaxed">الرياض، المملكة العربية السعودية (اضغط للتوجيه)</span>
                </div>
              </a>

              {/* Working Hours */}
              <div className="bg-white rounded-none p-6 border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="p-3 bg-plum-primary/10 text-plum-primary rounded-none flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-plum-primary" />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">أوقات العمل المتاحة</span>
                  <span className="text-xs font-bold text-plum-primary leading-snug">٢٤ ساعة يومياً</span>
                  <span className="text-[11px] text-text-light font-medium mt-0.5">متواجدون طوال أيام الأسبوع لخدمتكم</span>
                </div>
              </div>

              {/* Direct call */}
              <a
                href="tel:+966569436019"
                className="bg-white hover:border-plum-primary/35 hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-plum-primary/20 transition-all duration-300 rounded-none p-6 border border-gray-100 shadow-sm flex items-start gap-4"
              >
                <div className="p-3 bg-plum-primary/10 text-plum-primary rounded-none flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-plum-primary" />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">اتصال هاتفي مباشر</span>
                  <span className="text-xs font-bold text-plum-primary leading-snug" dir="ltr">+966 56 943 6019</span>
                  <span className="text-[11px] text-text-light font-medium mt-0.5">تحدث مع موظف خدمة العملاء</span>
                </div>
              </a>

              {/* WhatsApp direct */}
              <a
                href="https://api.whatsapp.com/send/?phone=%2B966569436019&text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85+%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C+%D8%A3%D8%B1%D9%8A%D8%AF+%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1+%D8%B9%D9%86+%D8%AE%D8%AF%D9%85%D8%A7%D8%AA+%D8%A7%D9%84%D8%AA%D8%A3%D8%AC%D9%8A%D8%B1+%D9%84%D8%AF%D9%8A%D9%83%D9%85&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:border-[#25D366]/35 hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-[#25D366]/20 transition-all duration-300 rounded-none p-6 border border-gray-100 shadow-sm flex items-start gap-4"
              >
                <div className="p-3 bg-[#25D366]/10 text-[#25D366] rounded-none flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#25D366]" />
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">الدردشة عبر الواتساب</span>
                  <span className="text-xs font-bold text-plum-primary leading-snug">راسلنا فورياً</span>
                  <span className="text-[11px] text-[#25D366] font-bold mt-0.5">متاح دائماً للاستفسارات</span>
                </div>
              </a>

            </div>

            {/* Simulated Live Google Map Mock */}
            <div className="bg-white rounded-none p-6 border border-gray-100 shadow-sm overflow-hidden flex flex-col gap-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-plum-primary flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gold-accent" />
                  <span>موقعنا الجغرافي على Google Maps</span>
                </span>
                <span className="px-2.5 py-0.5 bg-gold-accent/15 border border-gold-accent/20 rounded-none text-[9px] font-bold text-gold-accent">
                  اضغط للتوجيه
                </span>
              </div>

              {/* Map Canvas Simulated Container */}
              <a
                href="https://www.google.com/search?kgmid=%2Fg%2F11ysn62f2y&hl=en-SA&q=%D8%A7%D9%84%D9%85%D8%A7%D8%B1%D9%8A%D9%86%D8%A7.%D9%84%D9%84%D8%AD%D9%81%D9%84%D8%A7%D8%AA%20%D9%88%D8%A7%D9%84%D9%85%D9%86%D8%A7%D8%B3%D8%A8%D8%A7%D8%AA.%D8%AF%D9%81%D8%A7%D9%8A%D8%A7%D8%AA%20%D9%85%D9%83%D9%8A%D9%81%D8%A7%D8%AA%20%D8%AE%D9%8A%D8%A7%D9%85.%D9%83%D8%B1%D8%A7%D8%B3%D9%8A&shem=epsdc%2Crimspwouoe&shndl=30&source=sh%2Fx%2Floc%2Fosrp%2Fm5%2F1&kgs=2ea93a7c63b6c476"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-[220px] rounded-none overflow-hidden border border-gray-100 shadow-inner bg-slate-900 flex items-center justify-center select-none group cursor-pointer block"
              >
                {/* Simulated grid lines */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                
                {/* Simulated radar glow */}
                <div className="absolute w-[180px] h-[180px] rounded-none border-2 border-gold-accent/15 bg-gold-accent/5 animate-ping duration-3000 pointer-events-none" />
                <div className="absolute w-[90px] h-[90px] rounded-none border border-gold-accent/20 bg-gold-accent/10 pointer-events-none" />

                {/* Central pin animation */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="relative">
                    <MapPin className="w-10 h-10 text-gold-accent drop-shadow-lg animate-bounce" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/40 rounded-none blur-[1px]" />
                  </div>
                  <div className="px-3 py-1.5 rounded-none bg-plum-dark/95 border border-gold-accent/30 shadow-md backdrop-blur-sm text-center group-hover:scale-105 transition-transform duration-300">
                    <span className="text-[10px] text-gold-accent font-black block">ملك الحفلات</span>
                    <span className="text-[8px] text-gray-300 block">اضغط للانتقال إلى خرائط Google</span>
                  </div>
                </div>

                {/* Cover info */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/85 border border-white/10 rounded-none p-3 text-center pointer-events-none">
                  <p className="text-[9px] text-gray-200 font-light leading-relaxed">
                    موقعنا: الرياض. نقوم بتنسيق وتأسيس خيام وبيوت شعر ومجالس ملكية وأنظمة التكييف والتهوية في كافة مدن ومناطق المملكة بدقة عالية.
                  </p>
                </div>
              </a>
            </div>

            {/* Payment Options Card */}
            <div className="bg-white rounded-none p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
              <span className="text-xs font-bold text-plum-primary flex items-center gap-1.5">
                <Check className="w-4 h-4 text-gold-accent" />
                <span>طرق الدفع والتعاقد</span>
              </span>
              <p className="text-[11px] text-text-light leading-relaxed font-light">
                مؤسسة ملك الحفلات توفر طرق دفع مرنة وآمنة لضمان سهولة التعاقد والتجهيز.
              </p>
              <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3.5 rounded-none border border-gray-100">
                {/* Mada */}
                <div className="relative w-10 h-6 bg-white rounded-none border border-gray-200/60 flex items-center justify-center px-1.5 py-0.5 shadow-sm" title="مدى - Mada">
                  <Image
                    src="/images/logo.svg"
                    alt="مدى"
                    width={32}
                    height={14}
                    className="object-contain"
                    style={{ height: "auto" }}
                  />
                </div>
                {/* Visa */}
                <div className="w-10 h-6 bg-white rounded-none border border-gray-200/60 flex items-center justify-center font-black text-[8px] text-[#1A1F71] tracking-wider shadow-sm" title="Visa">
                  VISA
                </div>
                {/* Mastercard */}
                <div className="w-10 h-6 bg-white rounded-none border border-gray-200/60 flex items-center justify-center font-bold text-[8px] text-[#EB0015] tracking-wider shadow-sm" title="Mastercard">
                  MC
                </div>
                <div className="text-[9px] text-text-light font-medium mr-1 flex flex-col">
                  <span className="font-bold text-plum-primary text-[10px]">مدى، فيزا، ماستركارد</span>
                  <span className="text-[9px] font-light mt-0.5">والدفع النقدي أو التحويل البنكي</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
