"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Sparkles, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception context
    console.error("Runtime exception caught:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] bg-bg-soft flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      
      {/* Branded error boundary card */}
      <div className="max-w-md w-full bg-white rounded-[32px] p-8 md:p-12 shadow-2xl border border-gray-100/60 relative z-10 flex flex-col items-center gap-6">
        
        {/* Glow red alert badge */}
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-red-500/10 border border-red-500/25 rounded-full text-[10px] font-bold text-red-500 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>خطأ في التحميل - عطل مؤقت</span>
        </span>
        
        <h1 className="text-6xl font-black text-plum-primary tracking-tight">عطل بسيط</h1>
        
        <h2 className="text-base font-bold text-plum-primary leading-tight">عذراً، حدث خطأ أثناء تحميل الصفحة!</h2>
        
        <p className="text-xs text-text-light leading-relaxed font-light">
          نواجه عطلاً تقنياً مؤقتاً أثناء معالجة الطلب في الخادم. يرجى محاولة إعادة تحميل الصفحة أو العودة للرئيسية.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
          <button
            onClick={() => reset()}
            type="button"
            className="flex-grow py-3.5 px-5 bg-gold-accent hover:bg-gold-light text-plum-primary text-xs font-bold rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            <span>إعادة تحميل</span>
          </button>
          
          <Link 
            href="/"
            className="flex-grow py-3.5 px-5 border border-gray-200 hover:bg-gray-50 text-text-dark text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-plum-primary" />
            <span>الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
