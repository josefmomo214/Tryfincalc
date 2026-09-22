import type { NextConfig } from "next";
import { pseoData } from "./src/lib/pseo-data";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: isProd ? 'standalone' : undefined, // Only use standalone for production builds
  async redirects() {
    const crossCurrencyScenarioRedirects = pseoData.map((scenario) => ({
      source: scenario.currency === 'EUR'
        ? `/calculator/${scenario.slug}`
        : `/eur/calculator/${scenario.slug}`,
      destination: scenario.currency === 'EUR'
        ? `/eur/calculator/${scenario.slug}`
        : `/calculator/${scenario.slug}`,
      permanent: true,
    }));

    return [
      { source: '/blog/debt-to-income-ratio', destination: '/blog/28-36-rule-explained', permanent: true },
      { source: '/blog/reduce-personal-loan-costs', destination: '/blog/compare-loan-offers', permanent: true },
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
        source: '/calculator/500k-mortgage-monthly-payment-7-percent',
        destination: '/mortgage-calculator',
        permanent: true,
      },
      {
        source: '/calculator/600k-mortgage-monthly-payment-7-percent',
        destination: '/mortgage-calculator',
        permanent: true,
      },
      ...crossCurrencyScenarioRedirects,
    ];
  },
};

export default nextConfig;
