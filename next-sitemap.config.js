// next-sitemap config — runs as the "postbuild" script (see package.json).
//
// pseo-data.ts and articles.ts are TypeScript, so we register tsx's require
// hook before importing them. That keeps this file the single place that
// needs to know how to read those source files; everything else here is
// plain data mapping.
require('tsx/cjs');

const { pseoData } = require('./src/lib/pseo-data.ts');
const { articles } = require('./src/data/articles.ts');

const SITE_URL = 'https://tryfincalc.com';

// [route, changefreq, priority] — mirrors the priorities/changefreqs the
// hand-written sitemap used to assign to these routes.
const STATIC_PAGES = [
  ['/', 'weekly', '1.0'],
  ['/mortgage-calculator', 'monthly', '0.9'],
  ['/loan-calculator', 'monthly', '0.9'],
  ['/monthly-payment-calculator', 'monthly', '0.8'],
  ['/total-interest-calculator', 'monthly', '0.8'],
  ['/refinancing-calculator', 'monthly', '0.8'],
  ['/affordability-calculator', 'monthly', '0.8'],
  ['/rent-vs-buy', 'monthly', '0.8'],
  ['/amortization-schedule', 'monthly', '0.8'],
  ['/blog', 'daily', '0.7'],
  ['/faq', 'monthly', '0.5'],
  ['/about', 'monthly', '0.5'],
  ['/contact', 'monthly', '0.4'],
  ['/privacy-policy', 'yearly', '0.3'],
  ['/terms-of-service', 'yearly', '0.3'],
];

const lastmod = new Date().toISOString().split('T')[0];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: false, // public/robots.txt is hand-maintained separately
  generateIndexSitemap: false, // keep a single flat public/sitemap.xml, not a sitemap-0.xml + index
  // Next.js's own build manifest can't be trusted as the URL source here:
  // getStaticPaths for /calculator/[slug] and /blog/[slug] enumerates every
  // slug under BOTH locales (usd + eur), but this site only wants one
  // canonical URL per page (eur-prefixed only for EUR-currency pSEO
  // entries — see PSEOPageTemplate.tsx's canonicalUrl logic). So we exclude
  // everything auto-discovered and build the URL list explicitly below,
  // directly from the same data sources the pages themselves render from.
  exclude: ['*'],
  additionalPaths: async () => {
    const paths = [];

    for (const [loc, changefreq, priority] of STATIC_PAGES) {
      // The homepage keeps its trailing slash (https://tryfincalc.com/);
      // every other route is trailing-slash-free, matching next.config.js
      // (no `trailingSlash: true`) and the previous hand-written sitemap.
      paths.push({
        loc,
        lastmod,
        changefreq,
        priority,
        trailingSlash: loc === '/',
      });
    }

    // Blog articles. A couple of slugs in articles.ts are accidentally
    // duplicated (same slug, different content) — only the first article
    // for a given slug is reachable at /blog/[slug], so only emit one
    // sitemap entry per unique slug to match reality.
    const seenSlugs = new Set();
    for (const article of articles) {
      if (seenSlugs.has(article.slug)) continue;
      seenSlugs.add(article.slug);
      paths.push({
        loc: `/blog/${article.slug}`,
        lastmod,
        changefreq: 'monthly',
        priority: '0.6',
      });
    }

    // pSEO calculator pages — one entry per pseoData item, using the
    // /eur/calculator/ prefix for EUR-currency entries exactly as
    // PSEOPageTemplate.tsx does when it builds canonicalUrl.
    for (const item of pseoData) {
      const route =
        item.currency === 'EUR'
          ? `/eur/calculator/${item.slug}`
          : `/calculator/${item.slug}`;
      paths.push({ loc: route, lastmod, changefreq: 'monthly', priority: '0.6' });
    }

    return paths;
  },
};
