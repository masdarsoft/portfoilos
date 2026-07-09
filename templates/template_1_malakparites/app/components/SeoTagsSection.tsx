import { Sparkles, MapPin } from "lucide-react";

export default function SeoTagsSection() {
  const seoKeywords = [
    "اقرب محل تاجير مكيفات",
    "رقم تلفون تاجير مكيفات صحراوي",
    "حفلات الروضة",
    "حفلات السعاده",
    "حفلات حي الجزيره",
    "تاجير حفلات السلي",
    "حفلات وتنسق حفلات النسيم",
    "حفلات الروابي",
    "تاجير كنب مركاز وكنب كويتي",
    "تاجير زل ازرق",
    "تاجير زل ملكي",
    "تاجير كراسي كلاسيكي",
    "تاجير مخمل",
    "تاجير اخيام جميع المقاسات",
    "تاجير بيوت شعر جميع المقاسات",
    "تاجير جلسات مرتفعه",
    "شركه حفلات ومناسبات",
    "موسسة حفلات ومناسبات",
    "تاجير كراسي مخمل",
    "تاجير طولات",
    "تاجير سمعات",
    "احسن محل تاجير الرياض",
    "حفلات الدرعيه تاجير مكيفات صحراوي",
    "حفلات حي الرمال",
    "محل حفلات العزازيه",
    "محل حفلات شرقي الرياض"
  ];

  return (
    <section className="py-16 bg-plum-dark/60 border-t border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold-accent blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-gold-accent" />
          <h3 className="text-sm font-bold text-gold-accent tracking-wider uppercase">دليل خدمات ومناطق التغطية بالرياض</h3>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white mb-6">
          خدمات تجهيز الحفلات والمناسبات المتكاملة
        </h2>
        <p className="max-w-2xl mx-auto text-xs text-gray-400 mb-10 leading-relaxed font-light">
          نحن في مؤسسة ملك الحفلات نفخر بتغطية جميع أحياء ومناطق الرياض بشرقها وغربها وشمالها وجنوبها، لتوفير أرقى خدمات تأجير المكيفات، الخيام، بيوت الشعر، الكنب والكراسي الفاخرة لمختلف المناسبات.
        </p>

        {/* Tags Container */}
        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {seoKeywords.map((keyword, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/[0.02] border border-white/10 hover:border-gold-accent/40 text-gray-300 hover:text-white text-xs font-medium transition-all duration-300 rounded-none cursor-default hover:scale-[1.02]"
            >
              <MapPin className="w-3 h-3 text-gold-accent/70" />
              <span>{keyword}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
