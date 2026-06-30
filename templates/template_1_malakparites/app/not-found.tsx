import Link from "next/link";
import { Sparkles, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-bg-soft flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      
      {/* Sleek branded glass card */}
      <div className="max-w-md w-full bg-white rounded-[32px] p-8 md:p-12 shadow-2xl border border-gray-100/60 relative z-10 flex flex-col items-center gap-6">
        
        {/* Glow badge */}
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-gold-accent/10 border border-gold-accent/25 rounded-full text-[10px] font-bold text-gold-accent uppercase tracking-wider animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>خطأ ٤٠٤ - الصفحة غير موجودة</span>
        </span>
        
        {/* Big error code */}
        <h1 className="text-8xl font-black text-plum-primary tracking-tight select-none">404</h1>
        
        <h2 className="text-xl font-bold text-plum-primary leading-tight">عذراً، لم نجد الصفحة المطلوبة!</h2>
        
        <p className="text-xs text-text-light leading-relaxed font-light">
          يبدو أن الرابط الذي اتبعته غير صالح أو أن الصفحة قد تم نقلها أو تحديثها من قِبل إدارة ملك الحفلات.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
          <Link 
            href="/"
            className="flex-grow py-3 px-5 bg-plum-primary hover:bg-gold-accent hover:text-plum-primary text-white text-xs font-bold rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
          <Link 
            href="/services"
            className="flex-grow py-3 px-5 border border-gray-200 hover:bg-gray-50 text-text-dark text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>عرض الخدمات</span>
            <ArrowLeft className="w-4 h-4 text-gold-accent" />
          </Link>
        </div>
      </div>
    </div>
  );
}
