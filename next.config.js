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
  
  // Optimize build for Vercel
  swcMinify: true,
  
  // Use stable options for Vercel deployment
  experimental: {
    // Set to true instead of 'loose' for better compatibility
    esmExternals: true
  }
};

module.exports = nextConfig; 