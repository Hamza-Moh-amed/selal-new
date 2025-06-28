import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint build errors during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
