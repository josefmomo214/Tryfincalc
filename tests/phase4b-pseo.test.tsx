import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { HeadManagerContext } from 'next/dist/shared/lib/head-manager-context.shared-runtime';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import type { NextRouter } from 'next/router';
import { ThemeProvider } from '../src/lib/context/ThemeContext';
import { PSEOPageTemplate } from '../src/components/pseo/PSEOPageTemplate';
import { getPSEOContent, pseoData } from '../src/lib/pseo-data';
import { articles } from '../src/data/articles';
import HomePage from '../src/pages/index';
import MortgageCalculator from '../src/pages/mortgage-calculator';
import LoanCalculator from '../src/pages/loan-calculator';
import AffordabilityCalculator from '../src/pages/affordability-calculator';

const router = {
  pathname: '/',
  asPath: '/',
  route: '/',
  query: {},
  basePath: '',
  isReady: true,
  isFallback: false,
  isPreview: false,
  push: async () => true,
  replace: async () => true,
  prefetch: async () => undefined,
  events: { on() {}, off() {}, emit() {} },
} as unknown as NextRouter;

const keptSlugs = [
  '350k-mortgage-monthly-payment-6-5-percent',
  '700k-mortgage-monthly-payment-7-percent',
  '20k-loan-monthly-payment-10-percent',
  'how-much-house-can-i-afford-70k-salary',
  'how-much-house-can-i-afford-90k-salary',
  '250k-mortgage-monthly-payment-3-5-percent-eur',
] as const;

const noindexSlugs = [
  '250k-mortgage-monthly-payment-3-5-percent',
  '400k-mortgage-monthly-payment-4-percent',
  '10k-personal-loan-repayment-10-percent',
  '25k-personal-loan-repayment-8-percent',
  '5k-loan-monthly-payment-12-percent',
  '15k-loan-monthly-payment-10-percent',
  'how-much-house-can-i-afford-50k-salary',
  'how-much-house-can-i-afford-60k-salary',
  'how-much-house-can-i-afford-100k-salary',
  '150k-mortgage-monthly-payment-3-5-percent-eur',
  '350k-mortgage-monthly-payment-3-5-percent-eur',
  '400k-mortgage-monthly-payment-3-5-percent-eur',
] as const;

const redirectedSlugs = [
  'income-required-for-200k-house',
  'income-required-for-300k-house',
  'income-required-for-400k-house',
  'income-required-for-500k-house',
  'income-required-for-600k-house',
  'income-required-for-700k-house',
] as const;

const phase4aProtected = [
  ['400k-mortgage-monthly-payment-6-5-percent', '$2,528.27'],
  ['300k-mortgage-monthly-payment-6-percent', '$1,798.65'],
  ['how-much-house-can-i-afford-80k-salary', '$261,479'],
  ['30k-loan-monthly-payment-9-percent', '$622.75'],
  ['50k-loan-monthly-payment-8-percent', '$779.31'],
  ['200k-mortgage-monthly-payment-3-5-percent-eur', '€1,001.25'],
  ['300k-mortgage-monthly-payment-3-5-percent-eur', '€1,501.87'],
] as const;

function scenarioPath(slug: string) {
  const scenario = pseoData.find((item) => item.slug === slug);
  assert.ok(scenario, `Missing scenario ${slug}`);
  return scenario.currency === 'EUR' ? `/eur/calculator/${slug}` : `/calculator/${slug}`;
}

function renderScenario(slug: string) {
  const scenario = pseoData.find((item) => item.slug === slug);
  assert.ok(scenario, `Missing scenario ${slug}`);
  return renderToStaticMarkup(
    <RouterContext.Provider value={{ ...router, pathname: scenarioPath(slug), asPath: scenarioPath(slug), route: scenarioPath(slug) }}>
      <ThemeProvider><PSEOPageTemplate params={scenario} /></ThemeProvider>
    </RouterContext.Provider>,
  );
}

function renderPage(Component: React.ComponentType, path: string) {
  return renderToStaticMarkup(
    <RouterContext.Provider value={{ ...router, pathname: path, asPath: path, route: path }}>
      <ThemeProvider><Component /></ThemeProvider>
    </RouterContext.Provider>,
  );
}

function renderHead(element: React.ReactElement) {
  let head: React.ReactElement[] = [];
  const manager = {
    mountedInstances: new Set(),
    updateHead: (items: React.ReactElement[]) => { head = items; },
    updateScripts: () => undefined,
    scripts: {},
    getIsSsr: () => true,
  };
  renderToStaticMarkup(<HeadManagerContext.Provider value={manager}>{element}</HeadManagerContext.Provider>);
  return head.map((item) => item.props as Record<string, unknown>);
}

test('one typed editorial decision controls the 12 noindex and six redirect scenarios', async () => {
  const publication = await import('../src/lib/pseo-publication');
  assert.deepEqual(noindexSlugs.map((slug) => publication.getPseoEditorialStatus(slug)), Array(12).fill('noindex'));
  assert.deepEqual(redirectedSlugs.map((slug) => publication.getPseoEditorialStatus(slug)), Array(6).fill('redirect'));
  assert.deepEqual(keptSlugs.map((slug) => publication.getPseoEditorialStatus(slug)), Array(6).fill('indexable'));
  assert.deepEqual(phase4aProtected.map(([slug]) => publication.getPseoEditorialStatus(slug)), Array(7).fill('indexable'));
});

test('the six Phase 4B scenarios SSR distinct editable answers and finance-derived comparisons', () => {
  const expectations = [
    ['350k-mortgage-monthly-payment-6-5-percent', 'homePrice', '350000', '$2,212.24', ['$3,048.88', '$1,987.26', '$2,447.25']],
    ['700k-mortgage-monthly-payment-7-percent', 'homePrice', '700000', '$4,657.12', ['$6,291.80', '$5,427.09', '$976,562.29']],
    ['20k-loan-monthly-payment-10-percent', 'loanAmount', '20000', '$424.94', ['$645.34', '$332.02', '$7,889.99']],
    ['how-much-house-can-i-afford-70k-salary', 'monthlyIncome', '5833.333333333333', '$226,056', ['$174,926', '$113,569']],
    ['how-much-house-can-i-afford-90k-salary', 'monthlyIncome', '7500', '$295,368', ['$265,368', '$325,368', '$324,843', '$270,321']],
    ['250k-mortgage-monthly-payment-3-5-percent-eur', 'homePrice', '250000', '€1,251.56', ['€1,787.21', '€1,449.90', '€1,122.61', '€1,126.40']],
  ] as const;
  const questions = new Set<string>();

  for (const [slug, inputId, inputValue, answer, comparisons] of expectations) {
    const html = renderScenario(slug);
    assert.match(html, new RegExp(`id="${inputId}"[^>]*value="${inputValue.replaceAll('.', '\\.')}`));
    assert.match(html, new RegExp(answer.replace(/[.$€]/g, '\\$&')));
    assert.match(html, /data-calculator-results="true"/);
    assert.match(html, /<button[^>]*type="submit"[^>]*>Calculate<\/button>/);
    for (const comparison of comparisons) assert.match(html, new RegExp(comparison.replace(/[.$€]/g, '\\$&')));
    const question = html.match(/data-scenario-question="true"[^>]*>([^<]+)<\/h2>/)?.[1];
    assert.ok(question, `${slug} needs a decision question`);
    questions.add(question);
    assert.doesNotMatch(html, /\{\{[^}]+\}\}|\$\{[^}]+\}/);
  }
  assert.equal(questions.size, keptSlugs.length);
});

test('noindex scenarios render followable robots metadata and never enter the sitemap', async () => {
  const publication = await import('../src/lib/pseo-publication');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sitemap = require('../next-sitemap.config.js');
  const locations = (await sitemap.additionalPaths()).map((item: { loc: string }) => item.loc);

  for (const slug of noindexSlugs) {
    const scenario = pseoData.find((item) => item.slug === slug);
    assert.ok(scenario);
    const path = scenarioPath(slug);
    const head = renderHead(
      <RouterContext.Provider value={{ ...router, pathname: path, asPath: path, route: path }}>
        <ThemeProvider><PSEOPageTemplate params={scenario} /></ThemeProvider>
      </RouterContext.Provider>,
    );
    assert.ok(head.some((props) => props.name === 'robots' && props.content === 'noindex, follow'), `${slug} lacks noindex`);
    assert.ok(head.some((props) => props.rel === 'canonical' && props.href === `https://tryfincalc.com${path}`), `${slug} lacks self-canonical`);
    assert.ok(!locations.includes(path), `${slug} leaked into sitemap`);
    assert.equal(publication.getPseoEditorialStatus(slug), 'noindex');
  }
});

test('income-required legacy routes permanently redirect to the one canonical page', async () => {
  const nextConfig = (await import('../next.config')).default;
  const redirects = await nextConfig.redirects?.();
  assert.ok(Array.isArray(redirects));
  for (const slug of redirectedSlugs) {
    assert.ok(redirects.some((rule) => (
      rule.source === `/calculator/${slug}`
      && rule.destination === '/income-needed-for-a-house'
      && rule.permanent === true
    )), `Missing permanent redirect for ${slug}`);
  }
});

test('income-needed calculator uses the shared inverse affordability calculation', async () => {
  const finance = await import('../src/lib/finance');
  assert.equal(typeof finance.calculateIncomeRequired, 'function');
  const calculateIncomeRequired = finance.calculateIncomeRequired as unknown as (
    homePrice: number,
    monthlyDebts: number,
    downPayment: number,
    rate: number,
    years: number,
    monthlyPropertyTax: number,
    monthlyInsurance: number,
  ) => { requiredAnnualIncome: number; bindingRatio: string };
  const result = calculateIncomeRequired(400000, 500, 80000, 6.5, 30, 400, 150);
  assert.equal(Number(result.requiredAnnualIncome.toFixed(2)), 110255.04);
  assert.equal(result.bindingRatio, 'housing');
});

test('the consolidated page SSRs its calculator, comparison table, metadata and schema', async () => {
  const { default: IncomeNeededPage } = await import('../src/pages/income-needed-for-a-house');
  const page = (
    <RouterContext.Provider value={{ ...router, pathname: '/income-needed-for-a-house', asPath: '/income-needed-for-a-house', route: '/income-needed-for-a-house' }}>
      <ThemeProvider><IncomeNeededPage /></ThemeProvider>
    </RouterContext.Provider>
  );
  const html = renderToStaticMarkup(page);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  for (const [id, value] of [
    ['homePrice', '400000'], ['annualIncome', '110000'], ['monthlyDebts', '500'], ['downPayment', '80000'],
    ['interestRate', '6.5'], ['loanTerm', '30'], ['monthlyPropertyTax', '400'], ['monthlyInsurance', '150'],
  ]) {
    assert.match(html, new RegExp(`id="${id}"[^>]*value="${value}"`));
    assert.match(html, new RegExp(`<label for="${id}"`));
  }
  assert.match(html, /\$110,255/);
  assert.match(html, /data-calculator-results="true"/);
  for (const price of ['$200,000', '$300,000', '$400,000', '$500,000', '$600,000', '$700,000']) {
    assert.match(html, new RegExp(price.replace(/[.$]/g, '\\$&')));
  }
  assert.match(html, /selected planning assumptions/i);
  assert.match(html, /not (?:a |an )?(?:approval guarantee|guarantee of approval)/i);

  const head = renderHead(page);
  assert.ok(head.some((props) => props.rel === 'canonical' && props.href === 'https://tryfincalc.com/income-needed-for-a-house'));
  assert.ok(!head.some((props) => props.name === 'robots' && String(props.content).includes('noindex')));
  const schema = head.find((props) => props.type === 'application/ld+json');
  assert.ok(schema);
  assert.match(String((schema.dangerouslySetInnerHTML as { __html: string }).__html), /WebApplication/);
});

test('sitemap and internal discovery expose only indexable scenario destinations', async () => {
  const publication = await import('../src/lib/pseo-publication');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sitemap = require('../next-sitemap.config.js');
  const locations = (await sitemap.additionalPaths()).map((item: { loc: string }) => item.loc);
  assert.equal(locations.length, 62);
  assert.ok(locations.includes('/income-needed-for-a-house'));
  for (const slug of keptSlugs) assert.ok(locations.includes(scenarioPath(slug)));
  for (const slug of [...noindexSlugs, ...redirectedSlugs]) assert.ok(!locations.includes(scenarioPath(slug)));

  const hubHtml = [
    renderPage(HomePage, '/'),
    renderPage(MortgageCalculator, '/mortgage-calculator'),
    renderPage(LoanCalculator, '/loan-calculator'),
    renderPage(AffordabilityCalculator, '/affordability-calculator'),
  ].join('\n');
  for (const slug of keptSlugs) assert.match(hubHtml, new RegExp(`href="${scenarioPath(slug)}"`));
  assert.match(hubHtml, /href="\/income-needed-for-a-house"/);

  const forbiddenPaths = [...noindexSlugs, ...redirectedSlugs].map(scenarioPath);
  for (const path of forbiddenPaths) assert.doesNotMatch(hubHtml, new RegExp(`href="${path}"`));

  for (const scenario of pseoData.filter((item) => publication.getPseoEditorialStatus(item.slug) === 'indexable')) {
    const html = renderScenario(scenario.slug);
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
    assert.ok(hrefs.every((href) => !forbiddenPaths.includes(href)), `${scenario.slug} links to an excluded scenario`);
    assert.ok(getPSEOContent(scenario).similarPages.every((page) => !forbiddenPaths.includes(page.href)));
  }

  const articleHtml = articles.map((article) => article.content).join('\n');
  for (const slug of redirectedSlugs) {
    assert.doesNotMatch(articleHtml, new RegExp(`href=["']\\/calculator\\/${slug}["']`));
  }
});

test('all EUR scenarios remain euro-only and the retained EUR scenario links only within its family', () => {
  for (const scenario of pseoData.filter((item) => item.currency === 'EUR')) {
    const html = renderScenario(scenario.slug);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? html;
    assert.doesNotMatch(main, /(\$|\bUSD\b|\bPMI\b|\bPITI\b|Home Price|Homeowners Insurance|HOA Fees)/i, scenario.slug);
  }

  const retainedHtml = renderScenario('250k-mortgage-monthly-payment-3-5-percent-eur');
  const retainedMain = retainedHtml.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? retainedHtml;
  const links = [...retainedMain.matchAll(/href="([^"#]*\/calculator\/[^"#]+)"/g)].map((match) => match[1]);
  assert.ok(links.length > 0);
  assert.ok(links.every((href) => href.startsWith('/eur/calculator/')));
});

test('all seven Phase 4A pages remain indexable with their protected initial result', async () => {
  const publication = await import('../src/lib/pseo-publication');
  for (const [slug, result] of phase4aProtected) {
    assert.equal(publication.getPseoEditorialStatus(slug), 'indexable');
    const html = renderScenario(slug);
    assert.match(html, new RegExp(result.replace(/[.$€]/g, '\\$&')));
    const scenario = pseoData.find((item) => item.slug === slug);
    assert.ok(scenario);
    const path = scenarioPath(slug);
    const head = renderHead(
      <RouterContext.Provider value={{ ...router, pathname: path, asPath: path, route: path }}>
        <ThemeProvider><PSEOPageTemplate params={scenario} /></ThemeProvider>
      </RouterContext.Provider>,
    );
    assert.ok(!head.some((props) => props.name === 'robots' && String(props.content).includes('noindex')));
    assert.ok(head.some((props) => props.rel === 'canonical' && props.href === `https://tryfincalc.com${path}`));
  }
});
