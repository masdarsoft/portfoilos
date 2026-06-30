import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  // Ensure no trailing slashes cause redirect chains
  trailingSlash: false,

  // Image optimization: serve modern formats (WebP/AVIF) automatically
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "najdalzian.com",
        pathname: "/media/**",
      },
    ],
  },

  // Compress static assets
  compress: true,

  // Explicit redirects to fix Google Search Console issues:
  // 1. Redirect www to non-www (www.najdalzian.com → najdalzian.com)
  // 2. Legacy URLs that may have been indexed with old structure
  async redirects() {
    return [
      // www → non-www (permanent 301)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.najdalzian.com" }],
        destination: "https://najdalzian.com/:path*",
        permanent: true,
      },
      // Redirects for flattened services URLs
      {
        source: "/services/:id",
        destination: "/:id",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    try {
      const apiOrigin = new URL(apiUrl).origin;
      return [
        {
          source: "/media/:path*",
          destination: `${apiOrigin}/media/:path*`,
        },
      ];
    } catch (e) {
      return [
        {
          source: "/media/:path*",
          destination: "http://localhost:8000/media/:path*",
        },
      ];
    }
  },

  // Security headers to also improve SEO trust signals
  async headers() {
    return [
      // Block Google from indexing internal Next.js build assets
      // (font files, JS chunks, CSS — their hashed URLs break every rebuild)
      {
        source: "/_next/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      // Standard security headers for all pages
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
