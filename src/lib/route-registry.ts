export const SITE_URL = 'https://tryfincalc.com';

export interface CanonicalRoute {
  path: string;
  changefreq: 'weekly' | 'monthly';
  priority: string;
}

export const CANONICAL_STATIC_ROUTES: CanonicalRoute[] = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/mortgage-calculator', changefreq: 'monthly', priority: '0.9' },
  { path: '/loan-calculator', changefreq: 'monthly', priority: '0.9' },
  { path: '/monthly-payment-calculator', changefreq: 'monthly', priority: '0.8' },
  { path: '/total-interest-calculator', changefreq: 'monthly', priority: '0.8' },
  { path: '/refinancing-calculator', changefreq: 'monthly', priority: '0.8' },
  { path: '/affordability-calculator', changefreq: 'monthly', priority: '0.8' },
  { path: '/income-needed-for-a-house', changefreq: 'monthly', priority: '0.8' },
  { path: '/rent-vs-buy', changefreq: 'monthly', priority: '0.8' },
  { path: '/amortization-schedule', changefreq: 'monthly', priority: '0.8' },
  { path: '/blog', changefreq: 'weekly', priority: '0.7' },
  { path: '/faq', changefreq: 'monthly', priority: '0.5' },
  { path: '/about', changefreq: 'monthly', priority: '0.5' },
  { path: '/methodology', changefreq: 'monthly', priority: '0.5' },
  { path: '/editorial-policy', changefreq: 'monthly', priority: '0.5' },
];

export function canonicalArticlePath(slug: string) {
  return `/blog/${slug}`;
}

export function canonicalScenarioPath(scenario: { slug: string; currency: 'USD' | 'EUR' }) {
  return scenario.currency === 'EUR'
    ? `/eur/calculator/${scenario.slug}`
    : `/calculator/${scenario.slug}`;
}

export function absoluteUrl(path: string) {
  return new URL(path, `${SITE_URL}/`).toString();
}
