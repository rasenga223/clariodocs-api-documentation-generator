/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during builds for Vercel deployment
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during builds for faster deployments
  typescript: {
    // Warning: This setting is only recommended if you have properly set up
    // your IDE to catch type errors during development.
    ignoreBuildErrors: true,
  },
  
  // Set the output directory (optional)
  distDir: '.next',
  
  // Enable experimental features to handle platform-specific modules better
  experimental: {
    // This helps with issues related to native modules like lightningcss
    esmExternals: 'loose',
    // Ensure we use the correct architecture for binary dependencies
    platformArchitecture: process.env.PLATFORM_ARCHITECTURE || process.arch,
  },
};

module.exports = nextConfig; 