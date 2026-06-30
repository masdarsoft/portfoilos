"use client";

import { useState, useMemo } from "react";
import OptimizedImage from "../components/OptimizedImage";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  CalendarDays, 
  Eye, 
  RefreshCw, 
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { RENTAL_CATEGORIES } from "../constants";
import { RentalCategory } from "../types";
import QuickViewModal from "../components/QuickViewModal";
import { getIconComponent } from "../../lib/resolveIcon";

// E-commerce style Filter tags
const FILTER_TAGS = [
  { id: "all", label: "كل التجهيزات" },
  { id: "cooling", label: "تبريد وتهوية", items: ["ac-rentals", "fan-rentals", "split-ac-rentals", "cabinet-ac-rentals"] },
  { id: "seating", label: "خيام وجلسات ملكية", items: ["tent-rentals", "hair-tents", "chair-rentals", "outdoor-seats", "indoor-seats", "outdoor-sitting-rentals"] },
  { id: "tech", label: "إضاءة وصوتيات", items: ["lighting-rentals", "sound-systems"] },
  { id: "heritage", label: "ضيافة وتراثيات", items: ["turasiyat", "qahwajiyeen"] }
];

interface ServicesCatalogClientProps {
  categories?: RentalCategory[];
  tenantDomain?: string;
}

export default function ServicesCatalogClient({ categories = RENTAL_CATEGORIES, tenantDomain }: ServicesCatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RentalCategory | null>(null);

  // Live filter and search logic
  const filteredServices = useMemo(() => {
    return categories.filter((service) => {
      // 1. Category Filter Matching
      if (activeFilter !== "all") {
        const filterGroup = FILTER_TAGS.find(t => t.id === activeFilter);
        if (filterGroup?.items && !filterGroup.items.includes(service.id)) {
          return false;
        }
      }

      // 2. Keyword Search Matching
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = service.title.toLowerCase().includes(query);
        const matchesDesc = service.description.toLowerCase().includes(query);
        return matchesTitle || matchesDesc;
      }

      return true;
    });
  }, [categories, searchQuery, activeFilter]);

  const handleOpenModal = (category: RentalCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveFilter("all");
  };

  return (
    <div className="min-h-screen bg-bg-soft py-12 px-4 sm:px-6 lg:px-8 text-right" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Cinematic Header section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-accent/10 border border-gold-accent/25 rounded-none text-xs font-bold text-gold-accent uppercase mb-3 tracking-wide">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>كتالوج التجهيزات الفاخرة</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-plum-primary leading-tight">معرض خدمات ملك الحفلات</h1>
          <div className="w-20 h-0.5 bg-gold-accent mx-auto mt-4 rounded-none" />
          <p className="mt-4 text-xs sm:text-sm text-text-light leading-relaxed font-light">
            تصفح تشكيلة واسعة من مستلزمات الفعاليات الراقية بالرياض. استخدم البحث والفرز لتحديد طلباتك مباشرة.
          </p>
        </div>

        {/* Main Grid Layout with Sticky Side Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Right Sidebar: Sticky Filter & Search (3 Columns on desktop) */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 z-20 bg-white border border-gray-100 p-6 rounded-none shadow-sm flex flex-col gap-6">
            <div>
              <h2 className="text-sm font-black text-plum-primary border-b border-gray-100 pb-4 mb-4">
                تصفية التجهيزات
              </h2>
              
              {/* Live Search Bar */}
              <div className="relative w-full">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم التجهيز..."
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 focus:border-gold-accent focus:ring-1 focus:ring-gold-accent/30 rounded-none text-xs font-medium text-text-dark outline-none transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 hover:text-plum-primary transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </div>

            {/* Vertical Filter Tabs */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">التصنيفات الرئيسية</span>
              
              {/* Desktop Vertical Menu */}
              <div className="hidden lg:flex flex-col gap-2">
                {FILTER_TAGS.map((tag) => {
                  const isActive = activeFilter === tag.id;
                  return (
                    <button
                      key={tag.id}
                      onClick={() => setActiveFilter(tag.id)}
                      type="button"
                      className={`w-full px-4 py-3 rounded-none text-xs font-bold border transition-all duration-300 flex items-center justify-between cursor-pointer group ${
                        isActive
                          ? "bg-plum-primary border-plum-primary text-white"
                          : "bg-white border-gray-100 hover:border-gold-accent/35 text-text-dark hover:bg-gray-50"
                      }`}
                    >
                      <span>{tag.label}</span>
                      <ArrowLeft className={`w-3.5 h-3.5 transition-all duration-300 ${isActive ? "opacity-100 translate-x-0 text-gold-accent" : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-gold-accent"}`} />
                    </button>
                  );
                })}
              </div>

              {/* Mobile Horizontal Scrollable List */}
              <div className="lg:hidden flex items-center gap-3 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {FILTER_TAGS.map((tag) => {
                  const isActive = activeFilter === tag.id;
                  return (
                    <button
                      key={tag.id}
                      onClick={() => setActiveFilter(tag.id)}
                      type="button"
                      className={`px-5 py-2.5 rounded-none text-xs font-bold border transition-all duration-300 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "bg-plum-primary border-plum-primary text-white"
                          : "bg-white border-gray-200 hover:border-gold-accent/30 text-text-dark hover:bg-gray-50"
                      }`}
                    >
                      <span>{tag.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Left Area: Dynamic Grid / Product Showcase (9 Columns on desktop) */}
          <div className="lg:col-span-9 w-full">
            
            {/* Results Counter / Status info */}
            <div className="flex justify-between items-center mb-6 px-1">
              <p className="text-xs text-text-light font-medium">
                تم العثور على <span className="text-plum-primary font-bold text-sm">{filteredServices.length}</span> من الخدمات المتاحة
              </p>
              {(searchQuery || activeFilter !== "all") && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-gold-accent hover:text-plum-primary flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>إعادة تعيين التصفية</span>
                </button>
              )}
            </div>

            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredServices.map((category, idx) => {
                    const IconComponent = getIconComponent(category.icon);
                    return (
                      <motion.div
                        key={category.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.02 }}
                        className="relative h-[360px] rounded-none overflow-hidden shadow-md hover:shadow-lg border border-transparent hover:outline hover:outline-1 hover:outline-offset-4 hover:outline-gold-accent/25 transition-all duration-300 group flex flex-col justify-end"
                      >
                        {/* Background Image with hover scale */}
                        <div className="absolute inset-0 z-0">
                          <OptimizedImage 
                            src={category.mainImage}
                            alt={category.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-750 group-hover:scale-103"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/95 via-plum-primary/60 to-transparent transition-opacity duration-300" />
                        </div>

                        {/* Card Content */}
                        <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                          {/* Header Icon + Name */}
                          <div className="flex items-center gap-3 mb-3">
                            <span className="w-10 h-10 bg-gold-accent/95 text-plum-primary rounded-none shadow-md group-hover:bg-gold-light transition-all duration-300 flex items-center justify-center shrink-0">
                              <IconComponent className="w-4.5 h-4.5" />
                            </span>
                            <h3 className="text-base font-bold text-white group-hover:text-gold-accent transition-colors duration-300 line-clamp-1">
                              {category.title}
                            </h3>
                          </div>
                          
                          {/* Description */}
                          <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed opacity-90 mb-5 font-light">
                            {category.description}
                          </p>

                          {/* Dual Split CTAs - Sharp */}
                          <div className="grid grid-cols-2 gap-3 mt-auto">
                            {/* Modal Trigger Button */}
                            <button
                              onClick={() => handleOpenModal(category)}
                              type="button"
                              className="py-2.5 px-4 bg-gold-accent hover:bg-gold-light text-plum-primary text-xs font-bold rounded-none transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gold-accent"
                            >
                              <CalendarDays className="w-3.5 h-3.5" />
                              <span>حجز سريع</span>
                            </button>

                            <Link
                              href={`/${category.id}`}
                              className="py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-none transition-all duration-300 flex items-center justify-center gap-1.5 hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-white"
                            >
                              <Eye className="w-3.5 h-3.5 text-gold-accent" />
                              <span>التفاصيل</span>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              /* Empty Search State - Sharp */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-none p-12 text-center shadow-md border border-gray-100 max-w-lg mx-auto mt-12"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-none flex items-center justify-center text-gray-400 mx-auto mb-4 border border-gray-100">
                  <Search className="w-8 h-8 text-gold-accent" />
                </div>
                <h3 className="text-lg font-bold text-plum-primary">عذراً، لم نجد نتائج تطابق بحثك</h3>
                <p className="text-xs text-text-light mt-2 max-w-sm mx-auto leading-relaxed font-light">
                  يرجى التحقق من صياغة الكلمات، أو إعادة تعيين التصفية لاستكشاف تشكيلة خدمات ملك الحفلات الكاملة.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-2.5 bg-gold-accent hover:bg-gold-light text-plum-primary text-xs font-bold rounded-none transition-all duration-300 shadow-sm cursor-pointer hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-gold-accent"
                >
                  عرض كافة الخدمات
                </button>
              </motion.div>
            )}

          </div>

        </div>

      </div>

      {/* Booking Dialog Modal Portal */}
      <AnimatePresence>
        {isModalOpen && selectedCategory && (
          <QuickViewModal 
            selectedCategory={selectedCategory} 
            tenantDomain={tenantDomain}
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
