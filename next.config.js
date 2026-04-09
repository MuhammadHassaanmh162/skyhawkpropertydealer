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
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = nextConfig;
