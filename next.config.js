/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export to enable Supabase client-side functionality
  trailingSlash: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ngquunzrscytljlzufpu.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
    qualities: [25, 50, 75, 100],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'TML Collections',
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

module.exports = nextConfig;
