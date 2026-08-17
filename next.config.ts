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
  async redirects() {
    return [
      {
        source: '/calculator/100k-mortgage-monthly-payment-6-5-percent',
        destination: '/mortgage-calculator',
        permanent: true,
      },
      {
        source: '/calculator/150k-mortgage-monthly-payment-6-5-percent',
        destination: '/mortgage-calculator',
        permanent: true,
      },
      {
        source: '/calculator/200k-mortgage-monthly-payment-6-5-percent',
        destination: '/mortgage-calculator',
        permanent: true,
      },
      {
        source: '/calculator/400k-mortgage-monthly-payment-6-5-percent',
        destination: '/mortgage-calculator',
        permanent: true,
      },
      {
        source: '/calculator/500k-mortgage-monthly-payment-7-percent',
        destination: '/mortgage-calculator',
        permanent: true,
      },
      {
        source: '/calculator/600k-mortgage-monthly-payment-7-percent',
        destination: '/mortgage-calculator',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
