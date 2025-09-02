import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove static export to enable Supabase client-side functionality
  trailingSlash: true,
  
  // Image optimization
  images: {
    domains: ['ngquunzrscytljlzufpu.supabase.co'],
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
  
  // Note: Headers and redirects can be handled by middleware or API routes
  
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