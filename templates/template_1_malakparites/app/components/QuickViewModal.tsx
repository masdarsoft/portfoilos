"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Phone, MapPin, MessageSquare } from "lucide-react";
import Image from "next/image";
import { RentalCategory } from "../types";
import { createBooking } from "../../lib/api/bookings";

interface QuickViewModalProps {
  selectedCategory: RentalCategory;
  onClose: () => void;
  tenantDomain: string;
}

export default function QuickViewModal({ selectedCategory, onClose, tenantDomain }: QuickViewModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  // Form states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendWhatsAppRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingData = {
      customer_name: customerName,
      customer_phone: customerPhone,
      notes: `تاريخ التجهيز: من ${startDate || "غير محدد"} إلى ${endDate || "غير محدد"}\nالموقع: ${eventLocation}\nملاحظات: ${extraNotes}`,
      category_slug: selectedCategory.id
    };

    try {
      const res = await createBooking(tenantDomain, bookingData);
      if (res.whatsapp_redirect_url) {
        window.open(res.whatsapp_redirect_url, "_blank");
      }
      onClose();
    } catch (err) {
      console.error("Failed to create booking:", err);
      // Fallback manual URL
      const manualUrl = `https://api.whatsapp.com/send/?phone=966569436019&text=${encodeURIComponent(
        `السلام عليكم، أريد الاستفسار عن خدمة: ${selectedCategory.title}\nالاسم: ${customerName}\nالجوال: ${customerPhone}\nالتاريخ: من ${startDate || "غير محدد"} إلى ${endDate || "غير محدد"}\nالموقع: ${eventLocation}\nالملاحظات: ${extraNotes}`
      )}`;
      window.open(manualUrl, "_blank");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative w-full max-w-4xl bg-white rounded-none overflow-hidden shadow-2xl glass-modal border border-gold-accent/20 flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
      >
        
        {/* Close Button - Sharp Square */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-none bg-white/80 hover:bg-gold-accent hover:text-plum-primary transition-all duration-300 flex items-center justify-center shadow hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gold-accent"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Media Gallery */}
        <div className="w-full md:w-1/2 bg-gray-900 relative flex flex-col justify-between h-[30vh] md:h-auto p-4">
          <div className="absolute inset-0 z-0">
            {selectedCategory.gallery && selectedCategory.gallery.length > 0 && (
              <Image 
                src={selectedCategory.gallery[activeImageIdx]} 
                alt={selectedCategory.title} 
                fill 
                sizes="(max-w-768px) 100vw, 50vw"
                className="object-cover brightness-95" 
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 mt-auto w-full">
            {/* Thumbnails to swap media - Sharp Squares */}
            <div className="flex gap-2 justify-center p-2 rounded-none bg-black/40 backdrop-blur-sm max-w-fit mx-auto">
              {selectedCategory.gallery.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIdx(i)}
                  className={`relative w-12 h-12 rounded-none overflow-hidden border-2 transition-all duration-300 ${
                    activeImageIdx === i ? "border-gold-accent scale-105 shadow-md" : "border-white/20 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image 
                    src={img} 
                    alt="تجهيز" 
                    fill 
                    sizes="48px"
                    className="object-cover" 
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Request details form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto max-h-[60vh] md:max-h-full">
          
          {!showInquiryForm ? (
            /* Overview & Date selection state */
            <div className="flex flex-col gap-6">
              <div>
                <span className="text-xs font-bold text-gold-accent">تفاصيل التجهيز</span>
                <h3 className="text-2xl font-black text-plum-primary mt-1">{selectedCategory.title}</h3>
                <div className="w-12 h-0.5 bg-gold-accent mt-2 rounded-none" />
              </div>

              <p className="text-xs text-text-light leading-relaxed text-right">
                {selectedCategory.description}
              </p>

              {/* Custom Date Input - Sharp */}
              <div className="bg-gray-50 p-4 rounded-none border border-gray-100 text-right">
                <h4 className="text-xs font-bold text-plum-primary mb-3 flex items-center gap-2 justify-end">
                  <span>تحديد تواريخ التجهيز المبدئية</span>
                  <Calendar className="w-4 h-4 text-gold-accent" />
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-semibold">تاريخ البداية</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="p-2 border border-gray-200 rounded-none focus:ring-1 focus:ring-gold-accent outline-none text-text-dark bg-white font-medium focus:outline-offset-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-500 font-semibold">تاريخ الانتهاء</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split("T")[0]}
                      className="p-2 border border-gray-200 rounded-none focus:ring-1 focus:ring-gold-accent outline-none text-text-dark bg-white font-medium focus:outline-offset-2"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowInquiryForm(true)}
                className="w-full py-4 bg-plum-primary hover:bg-gold-accent hover:text-plum-primary text-white font-bold rounded-none transition-all duration-300 shadow-md hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-plum-primary cursor-pointer"
              >
                طلب تسعير / حجز التجهيز
              </button>
            </div>
          ) : (
            /* Form Submission state */
            <form onSubmit={handleSendWhatsAppRequest} className="flex flex-col gap-5 text-right">
              <div>
                <h3 className="text-xl font-bold text-plum-primary">بيانات الاتصال والتجهيز</h3>
                <p className="text-[11px] text-gray-500 mt-1">يرجى تعبئة الحقول لإرسال الطلب لخدمة العملاء مباشرة.</p>
                <div className="w-10 h-0.5 bg-gold-accent mt-2 rounded-none" />
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
                    className="p-3 border border-gray-200 rounded-none focus:ring-1 focus:ring-gold-accent outline-none text-text-dark bg-white focus:outline-offset-2 text-left dir-ltr"
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
                    rows={2}
                    className="p-3 border border-gray-200 rounded-none focus:ring-1 focus:ring-gold-accent outline-none text-text-dark bg-white resize-none focus:outline-offset-2"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowInquiryForm(false)}
                  className="w-1/3 py-3.5 border border-gray-200 hover:bg-gray-50 rounded-none text-xs font-bold text-text-dark transition-all duration-300 hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gray-300 cursor-pointer"
                >
                  رجوع
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-3.5 bg-[#25D366] hover:bg-[#20ba56] disabled:bg-gray-400 text-white font-bold rounded-none transition-all duration-300 flex items-center justify-center gap-2 text-xs shadow-md hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-green-500 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>{isSubmitting ? "جاري الإرسال..." : "أرسل عبر الواتساب الفوري"}</span>
                </button>
              </div>

              <p className="text-[9px] text-gray-400 text-center leading-relaxed">
                عند النقر، سيقوم النظام تلقائياً بإنشاء تفاصيل الطلب وتنسيق رسالة واتساب لفتح محادثة مباشرة مع خدمة العملاء.
              </p>
            </form>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
}
