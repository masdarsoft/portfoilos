"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

export default function OptimizedImage({ className, alt, ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!props.src || props.src === "") {
    return <div className="absolute inset-0 bg-plum-dark/5" />;
  }

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* 1. Glow Skeleton Loading Placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-plum-dark/10 animate-pulse flex items-center justify-center z-10 backdrop-blur-sm">
          {/* Branded spinner */}
          <div className="w-6 h-6 rounded-full border-2 border-gold-accent/25 border-t-gold-accent animate-spin" />
        </div>
      )}

      {/* 2. Transitioning Image Layer */}
      <Image
        alt={alt || "تجهيزات ملك الحفلات للمناسبات"}
        className={`transition-[opacity,filter] duration-700 ease-out ${
          isLoading 
            ? "opacity-0 blur-[6px]" 
            : "opacity-100 blur-0"
        } ${className || ""}`}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
}
