/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  // Compression
  compress: true,
  // Security: hide powered by header
  poweredByHeader: false,
  // Disable source maps in production
  productionBrowserSourceMaps: false,
};

export default nextConfig;
