import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict mode catches potential issues early
  reactStrictMode: true,

  // Compress responses with gzip
  compress: true,

  // Allow SVG imports as React components (if needed in future)
  // images.formats: prefer modern formats
  images: {
    formats: ["image/avif", "image/webp"],
    // Add external domains here when needed, e.g.:
    // domains: ["cdn.flashlocatif.fr"],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
