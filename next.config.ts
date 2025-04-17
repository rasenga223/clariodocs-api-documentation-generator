import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  distDir: '.next',
  // no experimental.platformArchitecture here
};

export default nextConfig;
