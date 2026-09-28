import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { renderToStaticMarkup } from 'react-dom/server';
import { HeadManagerContext } from 'next/dist/shared/lib/head-manager-context.shared-runtime';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import type { NextRouter } from 'next/router';
import { articles } from '../src/data/articles';
import { getPSEOContent, pseoData } from '../src/lib/pseo-data';
import { getGeneratedPseoScenarios } from '../src/lib/pseo-publication';
import { calculateLoan } from '../src/lib/finance';
import { SEOHandler } from '../src/components/seo/SEOHandler';
import BlogIndex from '../src/pages/blog';
import { ThemeProvider } from '../src/lib/context/ThemeContext';
import { PSEOPageTemplate } from '../src/components/pseo/PSEOPageTemplate';
import MonthlyPaymentCalculator from '../src/pages/monthly-payment-calculator';
import TotalInterestCalculator from '../src/pages/total-interest-calculator';
import BlogPost from '../src/pages/blog/[slug]';
import { getStaticPaths as getUsdScenarioPaths } from '../src/pages/calculator/[slug]';
import { getStaticPaths as getEurScenarioPaths } from '../src/pages/eur/calculator/[slug]';

const router = {
  pathname: '/blog',
  asPath: '/blog',
  route: '/blog',
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

test('CookieYes loads on the public site but not on local browser hosts', async () => {
  const documentModule = await import('../src/pages/_document');
  const loader = (documentModule as unknown as { cookieYesLoader?: string }).cookieYesLoader;
  assert.equal(typeof loader, 'string');
  if (typeof loader !== 'string') assert.fail('CookieYes loader is missing');

  const loadedSources = (hostname: string) => {
    const appended: Array<{ id?: string; src?: string; async?: boolean }> = [];
    vm.runInNewContext(loader, {
      window: { location: { hostname } },
      document: {
        createElement: () => ({}),
        head: { appendChild: (script: { id?: string; src?: string; async?: boolean }) => appended.push(script) },
      },
    });
    return appended;
  };

  assert.deepEqual(loadedSources('127.0.0.1'), []);
  assert.deepEqual(loadedSources('localhost'), []);
  assert.deepEqual(loadedSources('tryfincalc.com'), [{
    id: 'cookieyes',
    src: 'https://cdn-cookieyes.com/client_data/29532702d975c18a1902941805a6ae6d/script.js',
    async: false,
  }]);
  assert.equal(loadedSources('www.tryfincalc.com').length, 1);
});

test('AdSense uses a plain async document script without Next.js script annotations', () => {
  const documentSource = fs.readFileSync(
    path.join(process.cwd(), 'src', 'pages', '_document.tsx'),
    'utf8',
  );
  const adsenseStart = documentSource.indexOf('id="adsbygoogle-loader"');
  assert.notEqual(adsenseStart, -1);
  const adsenseMarkup = documentSource.slice(
    documentSource.lastIndexOf('<script', adsenseStart),
    documentSource.indexOf('/>', adsenseStart) + 2,
  );
  assert.match(adsenseMarkup, /<script/);
  assert.match(adsenseMarkup, /\basync\b/);
  assert.match(adsenseMarkup, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/);
  assert.doesNotMatch(adsenseMarkup, /<Script|strategy=|data-nscript/);
});

function renderHead(element: React.ReactElement) {
  let head: React.ReactElement[] = [];
  const manager = {
    mountedInstances: new Set(),
    updateHead: (items: React.ReactElement[]) => { head = items; },
    updateScripts: () => undefined,
    scripts: {},
    getIsSsr: () => true,
  };
  renderToStaticMarkup(
    <HeadManagerContext.Provider value={manager}>{element}</HeadManagerContext.Provider>,
  );
  return head;
}

test('the proven 400k at 6.5% scenario is a real data-backed page', () => {
  const scenario = pseoData.find((item) => item.slug === '400k-mortgage-monthly-payment-6-5-percent');
  assert.ok(scenario);
  assert.equal(scenario.currency, 'USD');
  assert.equal(scenario.amount, 400000);
  assert.equal(scenario.rate, 6.5);
  assert.equal(scenario.term, 30);
  const result = calculateLoan(scenario.amount, scenario.rate, scenario.term);
  assert.equal(Number(result.monthly.toFixed(2)), 2528.27);
  assert.equal(Number(result.totalInterest.toFixed(2)), 510177.95);
  assert.equal(Number(result.totalPaid.toFixed(2)), 910177.95);
  const html = renderToStaticMarkup(
    <RouterContext.Provider value={{ ...router, pathname: '/calculator/[slug]', asPath: `/calculator/${scenario.slug}` }}>
      <ThemeProvider><PSEOPageTemplate params={scenario} /></ThemeProvider>
    </RouterContext.Provider>,
  );
  assert.match(html, /\$2,528\.27/);
  assert.match(html, /id="homePrice"[^>]*value="400000"/);
  assert.match(html, /id="interestRate"[^>]*value="6\.5"/);
});

test('Next routing has one ordinary canonical URL and no 400k redirect', async () => {
  const nextConfig = (await import('../next.config')).default;
  assert.equal(nextConfig.i18n, undefined);
  const redirects = await nextConfig.redirects?.();
  assert.ok(Array.isArray(redirects));
  assert.equal(
    redirects.some((rule) => rule.source === '/calculator/400k-mortgage-monthly-payment-6-5-percent'),
    false,
  );
  assert.deepEqual(
    redirects.find((rule) => rule.source === '/:path*' && rule.has?.[0]?.type === 'host'),
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'www.tryfincalc.com' }],
      destination: 'https://tryfincalc.com/:path*',
      permanent: true,
    },
  );
});

test('legacy cross-currency scenario URLs permanently redirect to their canonical route', async () => {
  const nextConfig = (await import('../next.config')).default;
  const redirects = await nextConfig.redirects?.();
  assert.ok(Array.isArray(redirects));
  assert.ok(redirects.some((rule) => (
    rule.source === '/calculator/200k-mortgage-monthly-payment-3-5-percent-eur'
    && rule.destination === '/eur/calculator/200k-mortgage-monthly-payment-3-5-percent-eur'
    && rule.permanent === true
  )));
  assert.ok(redirects.some((rule) => (
    rule.source === '/eur/calculator/300k-mortgage-monthly-payment-6-percent'
    && rule.destination === '/calculator/300k-mortgage-monthly-payment-6-percent'
    && rule.permanent === true
  )));
});

test('scenario static paths only prerender the currency owned by each route', async () => {
  const usdResult = await getUsdScenarioPaths({});
  const eurResult = await getEurScenarioPaths({});
  const slugs = (result: typeof usdResult) => result.paths.map((entry) => {
    if (typeof entry === 'string') {
      assert.fail(`Expected a parameterized static path, received ${entry}`);
    }
    return entry.params.slug;
  });

  assert.deepEqual(
    slugs(usdResult),
    getGeneratedPseoScenarios(pseoData).filter((item) => item.currency === 'USD').map((item) => item.slug),
  );
  assert.deepEqual(
    slugs(eurResult),
    getGeneratedPseoScenarios(pseoData).filter((item) => item.currency === 'EUR').map((item) => item.slug),
  );
});

test('related scenarios stay within the current route currency', () => {
  for (const currency of ['USD', 'EUR'] as const) {
    const scenario = pseoData.find((item) => item.currency === currency);
    assert.ok(scenario);
    const related = getPSEOContent(scenario, currency).similarPages;
    const expectedPrefix = currency === 'EUR' ? '/eur/calculator/' : '/calculator/';
    assert.equal(related.length, 2);
    assert.ok(related.every((item) => item.href.startsWith(expectedPrefix)));
  }
});

test('the sitemap includes only canonical routes and dates only substantive changes', async () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sitemap = require('../next-sitemap.config.js');
  const paths = await sitemap.additionalPaths();
  const locations = paths.map((item: { loc: string }) => item.loc);
  assert.ok(locations.includes('/calculator/400k-mortgage-monthly-payment-6-5-percent'));
  assert.ok(locations.includes('/methodology'));
  assert.ok(locations.includes('/editorial-policy'));
  assert.ok(!locations.includes('/contact'));
  assert.ok(!locations.includes('/privacy-policy'));
  assert.ok(!locations.includes('/terms-of-service'));
  assert.ok(!locations.some((location: string) => /^\/(usd|eur)\/(?!calculator\/[^/]+-eur$)/.test(location)));
  const restoredScenario = paths.find((item: { loc: string }) => (
    item.loc === '/calculator/400k-mortgage-monthly-payment-6-5-percent'
  ));
  assert.equal(restoredScenario?.lastmod, '2026-09-21');
  assert.ok(paths
    .filter((item: { loc: string }) => item.loc !== restoredScenario?.loc)
    .every((item: { lastmod?: string }) => item.lastmod === undefined));
});

test('the server-rendered blog archive links every published article', () => {
  const html = renderToStaticMarkup(
    <RouterContext.Provider value={router}>
      <ThemeProvider><BlogIndex /></ThemeProvider>
    </RouterContext.Provider>,
  );
  for (const article of articles) {
    assert.match(html, new RegExp(`href="/blog/${article.slug}"`));
  }
  assert.doesNotMatch(html, /Load More Articles/);
});

test('social metadata is absolute, uses Twitter name attributes, and emits no currency hreflang', () => {
  const head = renderHead(
    <SEOHandler
      title="Example"
      description="Example description"
      canonicalUrl="https://tryfincalc.com/eur/calculator/example-eur"
    />,
  );
  const props = head.map((item) => item.props as Record<string, string>);
  assert.ok(props.some((item) => item.property === 'og:image' && item.content === 'https://tryfincalc.com/og-image.png'));
  assert.ok(props.some((item) => item.name === 'twitter:card' && item.content === 'summary_large_image'));
  assert.ok(props.some((item) => item.name === 'twitter:image' && item.content === 'https://tryfincalc.com/og-image.png'));
  assert.ok(!props.some((item) => item.hrefLang));
});

test('metadata image assets exist at the referenced public paths', () => {
  for (const asset of ['og-image.png', 'logo-high-res.png']) {
    assert.ok(fs.existsSync(path.join(process.cwd(), 'public', asset)), asset);
  }
});

test('monthly-payment and total-interest tools publish application schema', () => {
  for (const Component of [MonthlyPaymentCalculator, TotalInterestCalculator]) {
    const head = renderHead(
      <RouterContext.Provider value={router}>
        <ThemeProvider><Component /></ThemeProvider>
      </RouterContext.Provider>,
    );
    const schemas = head.flatMap((item) => {
      const props = item.props as { type?: string; dangerouslySetInnerHTML?: { __html: string } };
      return item.type === 'script' && props.type === 'application/ld+json' && props.dangerouslySetInnerHTML
        ? [JSON.parse(props.dangerouslySetInnerHTML.__html)]
        : [];
    });
    assert.ok(schemas.some((schema) => schema['@type'] === 'WebApplication'));
  }
});

test('visible article author and Article schema identify the same person without invented dates', () => {
  const article = articles.find((item) => item.slug === 'mortgage-payment-guide');
  assert.ok(article);
  const page = (
    <RouterContext.Provider value={{ ...router, pathname: '/blog/[slug]', asPath: `/blog/${article.slug}` }}>
      <ThemeProvider><BlogPost article={article} recentArticles={articles.slice(0, 2)} /></ThemeProvider>
    </RouterContext.Provider>
  );
  const visibleHtml = renderToStaticMarkup(page);
  const head = renderHead(
    page,
  );
  const script = head.find((item) => {
    const props = item.props as { type?: string };
    return item.type === 'script' && props.type === 'application/ld+json';
  });
  assert.ok(script);
  const props = script.props as { dangerouslySetInnerHTML: { __html: string } };
  const schemas = JSON.parse(props.dangerouslySetInnerHTML.__html) as Record<string, unknown>[];
  const articleSchema = schemas.find((schema) => schema['@type'] === 'Article');
  assert.ok(articleSchema);
  assert.deepEqual(articleSchema.author, {
    '@type': 'Person',
    name: 'Youssef Aaouam',
    url: 'https://tryfincalc.com/about',
  });
  assert.equal('datePublished' in articleSchema, false);
  assert.equal('dateModified' in articleSchema, false);
  assert.match(visibleHtml, /By[\s\S]*Youssef Aaouam/);
});
