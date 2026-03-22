import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://*.googlesyndication.com https://*.googletagservices.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com;
  font-src 'self' data:;
  frame-src 'self' https://*.googlesyndication.com https://*.doubleclick.net;
  connect-src 'self' https://*.googlesyndication.com https://*.doubleclick.net https://www.google-analytics.com;
  object-src 'none';
  base-uri 'self';
`.replace(/\s{2,}/g, ' ').trim();

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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
