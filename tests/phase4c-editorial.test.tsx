import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { HeadManagerContext } from 'next/dist/shared/lib/head-manager-context.shared-runtime';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import type { NextRouter } from 'next/router';
import { ThemeProvider } from '../src/lib/context/ThemeContext';
import { PSEOPageTemplate } from '../src/components/pseo/PSEOPageTemplate';
import { articles } from '../src/data/articles';
import { pseoData } from '../src/lib/pseo-data';
import { searchIndex } from '../src/lib/searchIndex';
import BlogIndex from '../src/pages/blog';
import BlogPost, {
  getStaticPaths as getBlogStaticPaths,
  getStaticProps as getBlogStaticProps,
} from '../src/pages/blog/[slug]';

const redirects = [
  ['/blog/400k-mortgage-monthly-payment', '/calculator/400k-mortgage-monthly-payment-6-5-percent'],
  ['/blog/300k-mortgage-monthly-payment', '/calculator/300k-mortgage-monthly-payment-6-percent'],
  ['/blog/200k-euro-mortgage', '/eur/calculator/200k-mortgage-monthly-payment-3-5-percent-eur'],
  ['/blog/300k-euro-mortgage', '/eur/calculator/300k-mortgage-monthly-payment-3-5-percent-eur'],
  ['/blog/loan-eligibility-by-income-detail', '/blog/loan-eligibility-by-income'],
  ['/blog/2026-homebuyers-playbook-step-by-step', '/blog/2026-homebuyers-playbook'],
] as const;

const router = {
  pathname: '/', asPath: '/', route: '/', query: {}, basePath: '', isReady: true,
  isFallback: false, isPreview: false, push: async () => true, replace: async () => true,
  prefetch: async () => undefined, events: { on() {}, off() {}, emit() {} },
} as unknown as NextRouter;

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

function renderArticle(slug: string) {
  const article = articles.find((item) => item.slug === slug);
  assert.ok(article, `Missing article ${slug}`);
  const path = `/blog/${slug}`;
  const element = (
    <RouterContext.Provider value={{ ...router, pathname: '/blog/[slug]', asPath: path, route: '/blog/[slug]' }}>
      <ThemeProvider><BlogPost article={article} recentArticles={articles.slice(0, 2)} /></ThemeProvider>
    </RouterContext.Provider>
  );
  return { html: renderToStaticMarkup(element), head: renderHead(element), path };
}

function renderScenario(slug: string) {
  const scenario = pseoData.find((item) => item.slug === slug);
  assert.ok(scenario, `Missing scenario ${slug}`);
  const path = scenario.currency === 'EUR' ? `/eur/calculator/${slug}` : `/calculator/${slug}`;
  const element = (
    <RouterContext.Provider value={{ ...router, pathname: path, asPath: path, route: path }}>
      <ThemeProvider><PSEOPageTemplate params={scenario} /></ThemeProvider>
    </RouterContext.Provider>
  );
  return { html: renderToStaticMarkup(element), head: renderHead(element), path };
}

test('the six retired articles redirect permanently and directly to final destinations', async () => {
  const nextConfig = (await import('../next.config')).default;
  const rules = await nextConfig.redirects?.();
  assert.ok(Array.isArray(rules));
  for (const [source, destination] of redirects) {
    assert.ok(rules.some((rule) => rule.source === source && rule.destination === destination && rule.permanent === true));
    assert.ok(!rules.some((rule) => rule.source === destination), `${destination} would create a redirect chain`);
  }
});

test('redirect sources are absent from published articles, static paths, archive and sitemap', async () => {
  const sourceSlugs = redirects.map(([source]) => source.replace('/blog/', ''));
  const paths = await getBlogStaticPaths({} as never);
  assert.ok(Array.isArray(paths.paths));
  const staticSlugs = paths.paths.flatMap((path) => typeof path === 'string' ? [path.replace('/blog/', '')] : [String(path.params?.slug)]);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sitemap = require('../next-sitemap.config.js');
  const sitemapLocations = (await sitemap.additionalPaths()).map((item: { loc: string }) => item.loc);
  const archive = renderToStaticMarkup(<RouterContext.Provider value={router}><ThemeProvider><BlogIndex /></ThemeProvider></RouterContext.Provider>);

  for (const slug of sourceSlugs) {
    assert.ok(!articles.some((article) => article.slug === slug), `${slug} remains published`);
    assert.ok(!staticSlugs.includes(slug), `${slug} remains a static path`);
    assert.ok(!sitemapLocations.includes(`/blog/${slug}`), `${slug} remains in sitemap`);
    assert.doesNotMatch(archive, new RegExp(`href="/blog/${slug}"`));
  }
});

test('published article props contain no undefined value that breaks static serialization', async () => {
  const result = await getBlogStaticProps({ params: { slug: 'monthly-payment-formula' } } as never);
  assert.ok('props' in result);
  const findUndefined = (value: unknown): boolean => {
    if (value === undefined) return true;
    if (Array.isArray(value)) return value.some(findUndefined);
    if (value && typeof value === 'object') return Object.values(value).some(findUndefined);
    return false;
  };
  assert.equal(findUndefined(result.props), false);
});

test('internal discovery links only to final redirect destinations', () => {
  const renderedContent = [
    ...articles.map((article) => article.content),
    ...pseoData.map((scenario) => scenario.customContent ?? ''),
    ...searchIndex.map((entry) => `<a href="${entry.url}">${entry.title}</a>`),
  ].join('\n');
  for (const [source] of redirects) assert.doesNotMatch(renderedContent, new RegExp(`href=["']${source}["']`));
});

test('all six destinations remain 200-model indexable pages with self canonicals', () => {
  for (const slug of [
    '400k-mortgage-monthly-payment-6-5-percent',
    '300k-mortgage-monthly-payment-6-percent',
    '200k-mortgage-monthly-payment-3-5-percent-eur',
    '300k-mortgage-monthly-payment-3-5-percent-eur',
  ]) {
    const { html, head, path } = renderScenario(slug);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.ok(head.some((props) => props.rel === 'canonical' && props.href === `https://tryfincalc.com${path}`));
    assert.ok(!head.some((props) => props.name === 'robots' && String(props.content).includes('noindex')));
  }
  for (const slug of ['loan-eligibility-by-income', '2026-homebuyers-playbook']) {
    const { html, head, path } = renderArticle(slug);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.ok(head.some((props) => props.rel === 'canonical' && props.href === `https://tryfincalc.com${path}`));
    assert.ok(!head.some((props) => props.name === 'robots' && String(props.content).includes('noindex')));
  }
});

test('the four Phase 4A scenario calculators retain their exact initial results and currency', () => {
  for (const [slug, input, result] of [
    ['400k-mortgage-monthly-payment-6-5-percent', 'value="400000"', '$2,528.27'],
    ['300k-mortgage-monthly-payment-6-percent', 'value="300000"', '$1,798.65'],
    ['200k-mortgage-monthly-payment-3-5-percent-eur', 'value="200000"', '€1,001.25'],
    ['300k-mortgage-monthly-payment-3-5-percent-eur', 'value="300000"', '€1,501.87'],
  ]) {
    const { html } = renderScenario(slug);
    assert.match(html, new RegExp(input));
    assert.match(html, new RegExp(result.replace(/[.$€]/g, '\\$&')));
    assert.match(html, /data-calculator-results="true"/);
  }
});

test('the consolidated eligibility guide stays a planning estimate without approval promises', () => {
  const article = articles.find((item) => item.slug === 'loan-eligibility-by-income');
  assert.ok(article);
  assert.match(article.content, /planning (?:estimate|scenario)/i);
  assert.match(article.content, /criteria vary by lender and loan program/i);
  assert.match(article.content, /does not (?:predict(?: or guarantee)?|guarantee) approval/i);
  assert.doesNotMatch(article.content, /guaranteed approval|you (?:will|are guaranteed to) qualify|approval is guaranteed/i);
  assert.match(article.content, /\$412,241/);
  assert.match(article.content, /\$320,205/);
});

test('the canonical playbook is one coherent evergreen guide', () => {
  const article = articles.find((item) => item.slug === '2026-homebuyers-playbook');
  assert.ok(article);
  const { html } = renderArticle(article.slug);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  for (const step of ['Set a personal budget', 'Compare written loan terms', 'Inspect the property', 'Review the offer and contract', 'Verify closing figures']) {
    assert.match(article.content, new RegExp(step, 'i'));
  }
  assert.doesNotMatch(article.content, /this year|current market|today(?:'s)? (?:rate|market)|is 2026 a good/i);
});

test('formula and mortgage-payment guides have distinct intents and finance-derived examples', () => {
  const formula = articles.find((item) => item.slug === 'monthly-payment-formula');
  const guide = articles.find((item) => item.slug === 'mortgage-payment-guide');
  assert.ok(formula && guide);
  assert.match(formula.content, /M = P × \[r\(1\+r\)\^n\]/);
  assert.match(formula.content, /\$1,955\.78/);
  assert.match(formula.content, /\$1,700\.00/);
  assert.match(formula.content, /\$255\.78/);
  assert.match(guide.content, /principal and interest/i);
  assert.match(guide.content, /property tax/i);
  assert.match(guide.content, /homeowners insurance/i);
  assert.match(guide.content, /included and excluded/i);
  assert.doesNotMatch(guide.content, /Step-by-Step Example 1: Personal Loan/i);
  for (const record of [formula, guide]) assert.doesNotMatch(record.content, /\{\{[^}]+\}\}|\$\{[^}]+\}/);
});
