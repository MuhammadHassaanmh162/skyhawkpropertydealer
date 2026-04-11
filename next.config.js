/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['swiper'],
  webpack: (config, { dev }) => {
    // Use memory cache in production to avoid Windows file-locking issues with .pack files
    if (!dev) config.cache = { type: 'memory' };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimised images for 24 h — avoids re-processing on every request
    minimumCacheTTL: 86400,
    // Disable the layout-shift-causing skeleton color flash on unoptimised images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
