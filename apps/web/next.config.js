/**** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@pkg/db'],
  experimental: { esmExternals: 'loose' },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@pkg/db': require('path').resolve(__dirname, '../../packages/db/src/index.ts'),
    };
    return config;
  },
};

module.exports = nextConfig;