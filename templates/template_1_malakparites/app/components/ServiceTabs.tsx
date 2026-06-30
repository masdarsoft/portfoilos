"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { RENTAL_CATEGORIES } from "../constants";
import { RentalCategory } from "../types";

interface ServiceTabsProps {
  categories?: RentalCategory[];
}

export default function ServiceTabs({ categories = RENTAL_CATEGORIES }: ServiceTabsProps) {
  const pathname = usePathname();

  return (
    <div className="w-full bg-plum-dark/95 border-t border-white/10 backdrop-blur-md z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center gap-6 overflow-x-auto py-3.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="فئات الخدمات"
          role="navigation"
        >
          {/* Master Tab: All Services */}
          <Link
            href="/services"
            aria-label="عرض كل الخدمات"
            className={`relative py-2.5 text-[11px] font-black tracking-wider transition-colors duration-300 whitespace-nowrap cursor-pointer shrink-0 ${
              pathname === "/services"
                ? "text-white"
                : "text-white hover:text-white/80"
            }`}
          >
            <span>كل الخدمات</span>
            {pathname === "/services" && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-white"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>

          {/* Individual Category Tabs */}
          {categories.map((category) => {
            const targetPath = `/${category.id}`;
            const isActive = pathname === targetPath;
            
            return (
              <Link
                key={category.id}
                href={targetPath}
                aria-label={`تصفح خدمة ${category.title}`}
                className={`relative py-2.5 text-[11px] font-black tracking-wider transition-colors duration-300 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? "text-white"
                    : "text-white hover:text-white/80"
                }`}
              >
                <span>{category.title}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-white"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
