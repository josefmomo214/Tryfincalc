import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: isProd ? 'standalone' : undefined, // Only use standalone for production builds
  i18n: {
    locales: ['usd', 'eur'],
    defaultLocale: 'usd',
    localeDetection: false,
  },
};

export default nextConfig;
