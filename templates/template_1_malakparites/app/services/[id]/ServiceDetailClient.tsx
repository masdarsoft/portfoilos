"use client";

import { useState, useMemo } from "react";
import OptimizedImage from "../../components/OptimizedImage";
import Link from "next/link";
import { 
  ChevronRight, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  MessageSquare,
  CheckCircle,
  Star,
  BookOpen,
  Sparkles,
  Play
} from "lucide-react";
import { RentalCategory } from "../../types";
import { createBooking } from "../../../lib/api/bookings";
import { getIconComponent } from "../../../lib/resolveIcon";

interface ServiceDetailClientProps {
  category: RentalCategory;
  allCategories: RentalCategory[];
  tenantDomain?: string;
}

// Map category IDs to their corresponding video files in public/malakparties/malakvideos
const getCategoryVideo = (id: string): string | null => {
  const mapping: { [key: string]: string } = {
    "ac-rentals": "/malakparties/malakvideos/مكيفات تبريد.mp4",
    "split-ac-rentals": "/malakparties/malakvideos/مكيفات تبريد.mp4",
    "cabinet-ac-rentals": "/malakparties/malakvideos/مكيفات تبريد.mp4",
    "fan-rentals": "/malakparties/malakvideos/مكيفات تبريد.mp4",
    "tent-rentals": "/malakparties/malakvideos/خيام ملكية.mp4",
    "hair-tents": "/malakparties/malakvideos/خيام تراثية.mp4",
    "heater-rentals": "/malakparties/malakvideos/دفايات.mp4",
    "chair-rentals": "/malakparties/malakvideos/كراسي.mp4",
    "outdoor-sitting-rentals": "/malakparties/malakvideos/جلسات.mp4",
    "outdoor-seats": "/malakparties/malakvideos/جلسات.mp4",
    "indoor-seats": "/malakparties/malakvideos/جلسات.mp4",
    "turasiyat": "/malakparties/malakvideos/جلسات تراثية وفرش ملكي.mp4",
    "qahwajiyeen": "/malakparties/malakvideos/قهوجيين وصبابين.mp4",
    "lighting-rentals": "/malakparties/malakvideos/عقود نور.mp4",
    "sound-systems": "/malakparties/malakvideos/جلسات وخيام وكراسي.mp4"
  };
  return mapping[id] ?? null;
};

export default function ServiceDetailClient({ category, allCategories, tenantDomain }: ServiceDetailClientProps) {
  const similarServices = useMemo(() => {
    return allCategories.filter((cat) => cat.id !== category.id).slice(0, 3);
  }, [category.id, allCategories]);

  const videoUrl = useMemo(() => getCategoryVideo(category.id), [category.id]);
  
  // Set video as active initially if available
  const [isVideoActive, setIsVideoActive] = useState<boolean>(!!videoUrl);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  
  // Date and Inquiry Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit Inquiry (WhatsApp redirect)
  const handleSendWhatsAppRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !eventLocation) return;

    setIsSubmitting(true);
    const domain = tenantDomain || window.location.hostname;
    
    const datesStr = startDate && endDate 
      ? `من تاريخ ${startDate} إلى تاريخ ${endDate}` 
      : startDate 
        ? `بتاريخ ${startDate}` 
        : "غير محدد بدقة";

    const payload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      event_date: startDate || undefined,
      event_type: eventLocation,
      notes: `${extraNotes ? `ملاحظات: ${extraNotes}. ` : ''}الموقع: ${eventLocation}. التواريخ: ${datesStr}`,
      category: category.id,
    };

    try {
      const res = await createBooking(domain, payload);
      if (res && res.whatsapp_redirect_url) {
        window.open(res.whatsapp_redirect_url, "_blank");
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.warn('[ServiceDetailClient] API Booking submission failed, falling back to manual WhatsApp:', err);
    }

    const defaultWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP || "966569436019";
    const cleanWhatsApp = defaultWhatsApp.replace("+", "").replace(" ", "");

    const arabicMsg = `السلام عليكم ورحمة الله وبركاته،
أود الاستفسار عن خدمة: *${category.title}*

*بيانات الطلب:*
- الاسم: ${customerName}
- الجوال: ${customerPhone}
- موقع المناسبة: ${eventLocation}
- التواريخ المطلوبة: ${datesStr}
${extraNotes ? `- ملاحظات إضافية: ${extraNotes}` : ""}

شكراً لكم، أرجو تزويدي بالأسعار والتفاصيل المتاحة.`;

    const encodedText = encodeURIComponent(arabicMsg);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=%2B${cleanWhatsApp}&text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
    setIsSubmitting(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < rating ? "fill-gold-accent text-gold-accent" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-bg-soft py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-right" dir="rtl">
      
      {/* Back Button - Sharp corners with offset hover */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-xs font-bold text-plum-primary hover:text-gold-accent bg-white hover:bg-plum-dark/5 px-4 py-2.5 rounded-none border border-gray-200/80 shadow-sm hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-plum-primary transition-all duration-300 mb-8"
      >
        <ChevronRight className="w-4 h-4" />
        <span>العودة للرئيسية</span>
      </Link>

      {/* Main Card - Sharp Corners */}
      <div className="bg-white rounded-none overflow-hidden shadow-xl border border-gray-100 flex flex-col lg:flex-row min-h-[70vh]">
        
        {/* Left Side: Media Gallery (50% Width) */}
        <div className="w-full lg:w-1/2 bg-gray-950 relative flex flex-col justify-between p-6 min-h-[45vh] lg:min-h-auto">
          
          {/* Main Media Showcase (Video or Image) */}
          <div className="absolute inset-0 z-0">
            {isVideoActive && videoUrl ? (
              <video
                src={videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover brightness-90"
              />
            ) : (
              category.gallery && category.gallery.length > 0 && (
                <OptimizedImage 
                  src={category.gallery[activeImageIdx]} 
                  alt={`${category.seoTitle} | ملك الحفلات`} 
                  fill 
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover brightness-95 transition-all duration-500" 
                />
              )
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="h-10 z-10" />

          {/* Media Switcher Thumbnails */}
          <div className="relative z-10 w-full mt-auto">
            <div className="flex gap-3 justify-center p-3 rounded-none bg-black/40 backdrop-blur-sm max-w-fit mx-auto border border-white/10 flex-wrap">
              
              {/* Video Thumbnail Button (if video exists) */}
              {videoUrl && (
                <button
                  type="button"
                  onClick={() => setIsVideoActive(true)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-none overflow-hidden border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center bg-black ${
                    isVideoActive ? "border-gold-accent scale-105 shadow-md" : "border-white/20 opacity-70 hover:opacity-100"
                  }`}
                >
                  <video 
                    src={videoUrl} 
                    muted 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-5 h-5 text-gold-accent drop-shadow" />
                  </div>
                </button>
              )}

              {/* Image Thumbnails */}
              {category.gallery.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setIsVideoActive(false);
                    setActiveImageIdx(i);
                  }}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-none overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                    !isVideoActive && activeImageIdx === i ? "border-gold-accent scale-105 shadow-md" : "border-white/20 opacity-70 hover:opacity-100"
                  }`}
                >
                  <OptimizedImage 
                    src={img} 
                    alt={`${category.title} بالرياض للمناسبات - صورة ${i + 1}`} 
                    fill 
                    sizes="64px"
                    className="object-cover" 
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Request details form (50% Width) */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white text-right">
          
          {!showInquiryForm ? (
            /* Overview & Date selection state */
            <div className="flex flex-col gap-8">
              <div>
                <span className="text-xs font-bold text-gold-accent tracking-wider">تفاصيل التجهيز الراقية</span>
                <h1 className="text-3xl sm:text-4xl font-black text-plum-primary mt-1.5">{category.seoTitle.split("|")[0].trim()}</h1>
                <div className="w-16 h-0.5 bg-gold-accent mt-3 rounded-none" />
              </div>

              <p className="text-sm text-text-light leading-relaxed font-light">
                {category.description}
              </p>

              {/* Features Checklist - Sharp Corners */}
              {category.features && category.features.length > 0 && (
                <div className="bg-gray-50 p-5 rounded-none border border-gray-100 text-right">
                  <h3 className="text-xs font-bold text-plum-primary mb-3 flex items-center gap-2 justify-end">
                    <span>ما يشمله هذا التجهيز</span>
                    <CheckCircle className="w-4 h-4 text-gold-accent" />
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {category.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-dark justify-end">
                        <span>{feature}</span>
                        <span className="w-1.5 h-1.5 bg-gold-accent mt-1.5 shrink-0" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Custom Date Input - Sharp */}
              <div className="bg-gray-50 p-6 rounded-none border border-gray-100 shadow-inner">
                <h4 className="text-xs font-bold text-plum-primary mb-4 flex items-center gap-2 justify-end">
                  <span>تحديد تواريخ التجهيز المبدئية</span>
                  <Calendar className="w-4.5 h-4.5 text-gold-accent" />
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-semibold">تاريخ البداية</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="p-3 border border-gray-200 rounded-none focus:ring-1 focus:ring-gold-accent outline-none text-text-dark bg-white font-medium focus:outline-offset-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-semibold">تاريخ الانتهاء</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split("T")[0]}
                      className="p-3 border border-gray-200 rounded-none focus:ring-1 focus:ring-gold-accent outline-none text-text-dark bg-white font-medium focus:outline-offset-2"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button - Sharp with offset hover */}
              <button
                type="button"
                onClick={() => setShowInquiryForm(true)}
                className="w-full py-4.5 bg-plum-primary hover:bg-gold-accent hover:text-plum-primary text-white font-bold rounded-none transition-all duration-300 shadow-md text-sm cursor-pointer hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-plum-primary"
              >
                طلب تسعير / حجز التجهيز الآن
              </button>
            </div>
          ) : (
            /* Form Submission state */
            <form onSubmit={handleSendWhatsAppRequest} className="flex flex-col gap-6 text-right">
              <div>
                <h3 className="text-2xl font-bold text-plum-primary">بيانات الاتصال والتجهيز</h3>
                <p className="text-xs text-gray-500 mt-1">يرجى تعبئة الحقول لإرسال الطلب لخدمة العملاء مباشرة.</p>
                <div className="w-12 h-0.5 bg-gold-accent mt-2 rounded-none" />
              </div>

              <div className="space-y-4 text-xs font-medium">
                
                {/* Name input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-500 flex items-center gap-1 justify-end">
                    <span>الاسم الكريم</span>
                    <User className="w-3.5 h-3.5 text-gold-accent" />
                  </label>
                  <input 
                    type="text" 
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: محمد السديري"
                    className="p-3 border border-gray-200 rounded-none focus:ring-1 focus:ring-gold-accent outline-none text-text-dark bg-white focus:outline-offset-2"
                  />
                </div>

                {/* Phone input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-500 flex items-center gap-1 justify-end">
                    <span>رقم الجوال</span>
                    <Phone className="w-3.5 h-3.5 text-gold-accent" />
                  </label>
                  <input 
                    type="tel" 
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="مثال: 050XXXXXXX"
                    className="p-3 border border-gray-200 rounded-none focus:ring-1 focus:ring-gold-accent outline-none text-text-dark bg-white text-left dir-ltr focus:outline-offset-2"
                  />
                </div>

                {/* Location input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-500 flex items-center gap-1 justify-end">
                    <span>موقع الفعالية / المدينة</span>
                    <MapPin className="w-3.5 h-3.5 text-gold-accent" />
                  </label>
                  <input 
                    type="text" 
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="مثال: الرياض، حي الملقا"
                    className="p-3 border border-gray-200 rounded-none focus:ring-1 focus:ring-gold-accent outline-none text-text-dark bg-white focus:outline-offset-2"
                  />
                </div>

                {/* Custom notes */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-500">ملاحظات أو مواصفات خاصة</label>
                  <textarea 
                    value={extraNotes}
                    onChange={(e) => setExtraNotes(e.target.value)}
                    placeholder="مثال: أريد خيمة بطول ١٢ متر مع تكييف مكثف..."
                    rows={3}
                    className="p-3 border border-gray-200 rounded-none focus:ring-1 focus:ring-gold-accent outline-none text-text-dark bg-white resize-none focus:outline-offset-2"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowInquiryForm(false)}
                  className="w-1/3 py-4 border border-gray-200 hover:bg-gray-50 rounded-none text-xs font-bold text-text-dark transition-all duration-300 cursor-pointer hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gray-300"
                >
                  رجوع
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-4 bg-[#25D366] hover:bg-[#20ba56] text-white font-bold rounded-none transition-all duration-300 flex items-center justify-center gap-2 text-xs shadow-md cursor-pointer hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-green-500"
                >
                  <MessageSquare className="w-4.5 h-4.5 fill-white" />
                  <span>{isSubmitting ? "جاري الإرسال..." : "أرسل عبر الواتساب الفوري"}</span>
                </button>
              </div>

              <p className="text-[9px] text-gray-400 text-center leading-relaxed">
                عند النقر، سيقوم النظام تلقائياً بإنشاء تفاصيل الطلب وتنسيق رسالة واتساب لفتح محادثة مباشرة مع خدمة العملاء.
              </p>
            </form>
          )}

        </div>
      </div>

      {/* Reviews Section - Sharp styling */}
      {category.reviews && category.reviews.length > 0 && (
        <div className="mt-16 text-right">
          <div className="mb-8 border-r-4 border-gold-accent pr-4">
            <span className="text-[10px] font-bold text-[#9a6f00] uppercase tracking-widest block mb-1">آراء عملائنا</span>
            <h2 className="text-2xl font-black text-plum-primary">تجارب حقيقية من عملائنا الكرام</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {category.reviews.map((review, idx) => (
              <div
                key={idx}
                className="bg-white rounded-none p-6 shadow-sm border border-gray-100 hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-gold-accent/20 transition-all duration-300"
              >
                <div className="flex gap-0.5 mb-3 justify-end">
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm text-text-dark leading-relaxed font-light mb-4">
                  &quot;{review.text}&quot;
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-[10px] text-text-light">{review.date}</span>
                  <div className="flex items-center gap-2 justify-end">
                    <div>
                      <p className="text-xs font-bold text-text-dark">{review.name}</p>
                      {review.city && <p className="text-[10px] text-text-light">{review.city}</p>}
                    </div>
                    <div className="w-8 h-8 rounded-none bg-plum-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-plum-primary" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Blog Article Section - Sharp styling */}
      {category.blogContent && (
        <div className="mt-16 text-right">
          <div className="mb-8 border-r-4 border-gold-accent pr-4">
            <span className="text-[10px] font-bold text-[#9a6f00] uppercase tracking-widest block mb-1">دليل شامل</span>
            <h2 className="text-2xl font-black text-plum-primary">
              {category.blogContent.split("\n")[0]}
            </h2>
          </div>

          <div className="bg-white rounded-none p-8 sm:p-10 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4 mb-6 justify-end">
              <div>
                <h3 className="text-lg font-bold text-plum-primary">{category.seoTitle.split("|")[0].trim()}</h3>
                <p className="text-xs text-text-light mt-1">دليل تفصيلي للاستفادة القصوى من هذه الخدمة</p>
              </div>
              <div className="p-3 bg-gold-accent/10 rounded-none shrink-0">
                <BookOpen className="w-6 h-6 text-gold-accent" />
              </div>
            </div>
            <div className="prose prose-sm max-w-none text-text-dark leading-relaxed text-right">
              {category.blogContent.split("\n").slice(1).map((paragraph, i) => {
                if (paragraph.trim() === "") return null;
                const isHeading = paragraph.length < 80 && !paragraph.endsWith("،") && !paragraph.endsWith(".") && !paragraph.startsWith("•") && !paragraph.startsWith("-");
                if (isHeading && i < 5) {
                  return (
                    <h4 key={i} className="text-sm font-bold text-plum-primary mt-5 mb-2">
                      {paragraph}
                    </h4>
                  );
                }
                return (
                  <p key={i} className="text-sm text-text-dark leading-relaxed mb-3 font-light">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Similar Services Section - Sharp styling */}
      <div className="mt-16 text-right">
        <div className="mb-8 border-r-4 border-gold-accent pr-4">
          <span className="text-[10px] font-bold text-[#9a6f00] uppercase tracking-widest block mb-1">خيارات إضافية لمناسبتك</span>
          <h2 className="text-2xl font-black text-plum-primary">خدمات مشابهة قد تهمك</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {similarServices.map((simCategory) => {
            const SimIcon = getIconComponent(simCategory.icon);
            return (
              <Link 
                key={simCategory.id}
                href={`/${simCategory.id}`}
                className="group relative h-[260px] rounded-none overflow-hidden glass-card shadow-md hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-gold-accent/20 transition-all duration-300 flex flex-col justify-end border border-transparent"
              >
                <div className="absolute inset-0 z-0">
                  <OptimizedImage 
                    src={simCategory.mainImage}
                    alt={simCategory.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-750 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/95 via-plum-primary/60 to-transparent transition-opacity duration-300" />
                </div>

                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-2 mb-2 justify-end">
                    <h3 className="text-base font-bold text-white group-hover:text-gold-accent transition-colors duration-300">
                      {simCategory.title}
                    </h3>
                    <span className="p-2 bg-gold-accent/90 text-plum-primary rounded-none flex items-center justify-center transition-transform duration-300">
                      <SimIcon className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-200 line-clamp-2 leading-relaxed opacity-90 font-light">
                    {simCategory.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
