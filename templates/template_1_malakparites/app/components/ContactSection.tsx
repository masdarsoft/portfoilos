"use client";

import { useState } from "react";
import { MessageSquare, Phone, Send, Loader2 } from "lucide-react";
import { createBooking } from "../../lib/api/bookings";
import { getTenantDomain } from "../../lib/getTenantDomain";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setLoading(true);
    try {
      const domain = getTenantDomain();
      const res = await createBooking(domain, {
        customer_name: formData.name,
        customer_phone: formData.phone,
        notes: formData.notes
      });
      setSuccess(true);
      // Redirect to WhatsApp link returned by server
      if (res.whatsapp_redirect_url) {
        window.open(res.whatsapp_redirect_url, "_blank");
      }
    } catch (err) {
      console.error("Booking error:", err);
      // Fallback redirect manually
      const manualUrl = `https://api.whatsapp.com/send/?phone=966569436019&text=${encodeURIComponent(
        `السلام عليكم، اسمي ${formData.name}. أريد الاستفسار عن خدمات التجهيز لمناسبتي. ملاحظات: ${formData.notes}`
      )}`;
      window.open(manualUrl, "_blank");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="py-24 bg-gradient-to-tr from-plum-dark via-plum-primary to-plum-dark text-white relative"
    >
      {/* Background ambient light */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-gold-accent blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-section">
          <span className="text-xs font-bold text-gold-accent tracking-widest uppercase block mb-1">طلب حجز مباشر</span>
          <h2 className="text-3xl md:text-5xl font-black text-white">ابدأ بتنسيق مناسبتك</h2>
          <div className="w-16 h-0.5 bg-gold-accent mx-auto mt-3 rounded-none" />
          <p className="mt-4 text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
            املأ تفاصيل الاتصال الفورية بالأسفل. سيقوم خبراؤنا بالاتصال بك فوراً لتأكيد مقاسات الخيام، سعة التكييف، وتنسيق الجلسات المناسبة لضيوفكم.
          </p>
        </div>

        {/* Centered Floating Glassmorphic Form Card - Sharp corners */}
        <div className="max-w-xl mx-auto bg-white/[0.03] border border-white/10 rounded-none p-8 md:p-10 backdrop-blur-xl shadow-2xl animate-fade-in-section">
          <form onSubmit={handleSubmit} className="space-y-5 text-right">
            
            {/* Customer Name - Sharp Inputs with offset focus outline */}
            <div>
              <label htmlFor="name-input" className="block text-xs font-bold text-gold-light mb-2">اسم العميل</label>
              <input 
                id="name-input"
                type="text"
                required
                placeholder="أدخل اسمك الكريم"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-plum-dark/40 border border-white/15 focus:border-gold-accent rounded-none text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gold-accent/50 focus:outline-offset-2 transition-all duration-300"
              />
            </div>

            {/* Customer Phone - Sharp Inputs with offset focus outline */}
            <div>
              <label htmlFor="phone-input" className="block text-xs font-bold text-gold-light mb-2">رقم الجوال</label>
              <input 
                id="phone-input"
                type="tel"
                required
                placeholder="مثال: 0569436019"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-plum-dark/40 border border-white/15 focus:border-gold-accent rounded-none text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gold-accent/50 focus:outline-offset-2 transition-all text-left dir-ltr transition-all duration-300"
              />
            </div>

            {/* Notes - Sharp Inputs with offset focus outline */}
            <div>
              <label htmlFor="notes-input" className="block text-xs font-bold text-gold-light mb-2">تفاصيل المناسبة أو الطلب</label>
              <textarea 
                id="notes-input"
                rows={3}
                placeholder="اكتب أي ملاحظات بخصوص المقاسات أو تاريخ المناسبة..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 bg-plum-dark/40 border border-white/15 focus:border-gold-accent rounded-none text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gold-accent/50 focus:outline-offset-2 transition-all duration-300"
              />
            </div>

            {/* Submit Button - Sharp corners with offset hover outlines */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gold-accent hover:bg-gold-light text-plum-primary font-black rounded-none shadow-lg hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-gold-accent transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-xs disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري إرسال طلبك...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>تأكيد الطلب والتوجيه للواتساب</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Direct Connect Options Below Form - Sharp buttons with offset hover outlines */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
            <a 
              href="tel:+966569436019"
              className="flex items-center justify-center gap-2 py-2.5 rounded-none bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-white/20 transition-all duration-300"
              aria-label="اتصال هاتفي مباشر"
            >
              <Phone className="w-3.5 h-3.5 text-gold-accent" />
              <span>اتصال مباشر</span>
            </a>
            
            <a 
              href="https://api.whatsapp.com/send/?phone=966569436019"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-none bg-green-500/10 hover:bg-green-500/25 border border-green-500/20 text-xs font-bold text-green-400 hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-green-500/30 transition-all duration-300"
              aria-label="راسلنا واتساب"
            >
              <MessageSquare className="w-3.5 h-3.5 text-green-400" />
              <span>واتساب سريع</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
