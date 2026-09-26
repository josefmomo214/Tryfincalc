// next-sitemap config — runs as the "postbuild" script (see package.json).
//
// pseo-data.ts and articles.ts are TypeScript, so we register tsx's require
// hook before importing them. That keeps this file the single place that
// needs to know how to read those source files; everything else here is
// plain data mapping.
require('tsx/cjs');

const { pseoData } = require('./src/lib/pseo-data.ts');
const { articles } = require('./src/data/articles.ts');
const { getPseoEditorialStatus } = require('./src/lib/pseo-publication.ts');
const {
  SITE_URL,
  CANONICAL_STATIC_ROUTES,
  canonicalArticlePath,
  canonicalScenarioPath,
} = require('./src/lib/route-registry.ts');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: false, // public/robots.txt is hand-maintained separately
  generateIndexSitemap: false, // keep a single flat public/sitemap.xml, not a sitemap-0.xml + index
  autoLastmod: false,
  // Next.js's own build manifest can't be trusted as the URL source here:
  // This site wants one canonical URL per page (EUR-prefixed only for
  // EUR-currency pSEO entries). Exclude auto-discovery and build the URL
  // list explicitly from the same route and content sources the pages use.
  exclude: ['*'],
  additionalPaths: async () => {
    const paths = [];

    for (const route of CANONICAL_STATIC_ROUTES) {
      paths.push({
        loc: route.path,
        changefreq: route.changefreq,
        priority: route.priority,
        trailingSlash: route.path === '/',
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
        loc: canonicalArticlePath(article.slug),
        changefreq: 'monthly',
        priority: '0.6',
      });
    }

    // pSEO calculator pages — one entry per pseoData item, using the
    // /eur/calculator/ prefix for EUR-currency entries exactly as
    // PSEOPageTemplate.tsx does when it builds canonicalUrl.
    for (const item of pseoData.filter((scenario) => getPseoEditorialStatus(scenario.slug) === 'indexable')) {
      paths.push({
        loc: canonicalScenarioPath(item),
        ...(item.substantiveModified ? { lastmod: item.substantiveModified } : {}),
        changefreq: 'monthly',
        priority: '0.6',
      });
    }

    return paths;
  },
};
