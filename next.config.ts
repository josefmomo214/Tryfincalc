import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'standalone', // Optimized for production hosting
  i18n: {
    locales: ['usd', 'eur'],
    defaultLocale: 'usd',
    localeDetection: false,
  },
};

export default nextConfig;
