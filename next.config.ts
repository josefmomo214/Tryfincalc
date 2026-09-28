import type { NextConfig } from "next";
import { pseoData } from "./src/lib/pseo-data";
import { PSEO_EDITORIAL_DECISIONS } from "./src/lib/pseo-publication";
import { ARTICLE_REDIRECTS } from "./src/lib/article-publication";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: isProd ? 'standalone' : undefined, // Only use standalone for production builds
  async redirects() {
    const consolidatedScenarioRedirects = Object.entries(PSEO_EDITORIAL_DECISIONS)
      .flatMap(([slug, decision]) => decision.status === 'redirect' ? [{
        source: `/calculator/${slug}`,
        destination: decision.destination,
        permanent: true,
      }] : []);
    const crossCurrencyScenarioRedirects = pseoData.map((scenario) => {
      const decision = PSEO_EDITORIAL_DECISIONS[scenario.slug];
      return {
        source: scenario.currency === 'EUR'
          ? `/calculator/${scenario.slug}`
          : `/eur/calculator/${scenario.slug}`,
        destination: decision.status === 'redirect'
          ? decision.destination
          : scenario.currency === 'EUR'
            ? `/eur/calculator/${scenario.slug}`
            : `/calculator/${scenario.slug}`,
        permanent: true,
      };
    });

    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.tryfincalc.com' }],
        destination: 'https://tryfincalc.com/:path*',
        permanent: true,
      },
      ...Object.entries(ARTICLE_REDIRECTS).map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      ...consolidatedScenarioRedirects,
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
