/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  transpilePackages: ['framer-motion'],
  outputFileTracing: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
