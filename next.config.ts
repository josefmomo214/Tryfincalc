import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  i18n: {
    locales: ['usd', 'eur'],
    defaultLocale: 'eur',
    localeDetection: false,
  },
};

export default nextConfig;
