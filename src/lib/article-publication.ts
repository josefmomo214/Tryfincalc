export const ARTICLE_REDIRECTS = {
  '/blog/400k-mortgage-monthly-payment': '/calculator/400k-mortgage-monthly-payment-6-5-percent',
  '/blog/300k-mortgage-monthly-payment': '/calculator/300k-mortgage-monthly-payment-6-percent',
  '/blog/200k-euro-mortgage': '/eur/calculator/200k-mortgage-monthly-payment-3-5-percent-eur',
  '/blog/300k-euro-mortgage': '/eur/calculator/300k-mortgage-monthly-payment-3-5-percent-eur',
  '/blog/loan-eligibility-by-income-detail': '/blog/loan-eligibility-by-income',
  '/blog/2026-homebuyers-playbook-step-by-step': '/blog/2026-homebuyers-playbook',
} as const;

export const RETIRED_ARTICLE_SLUGS = new Set(
  Object.keys(ARTICLE_REDIRECTS).map((path) => path.replace('/blog/', '')),
);
