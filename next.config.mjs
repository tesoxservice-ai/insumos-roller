const nextConfig = {
  images: {
    qualities: [85, 100],
    unoptimized: true,  // ← agregá esto
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};