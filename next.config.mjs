/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [85, 100],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;