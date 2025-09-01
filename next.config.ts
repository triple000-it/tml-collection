import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Vercel
  output: 'export',
  trailingSlash: true,
  
  // Image optimization for Vercel
  images: {
    unoptimized: true,
    domains: ['your-supabase-project.supabase.co'],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'TML Collect',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['framer-motion']
  },
  
  // Note: Headers and redirects are handled by vercel.json for static export
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;