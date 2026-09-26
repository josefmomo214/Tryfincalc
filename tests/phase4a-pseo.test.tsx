import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import type { NextRouter } from 'next/router';
import { ThemeProvider } from '../src/lib/context/ThemeContext';
import { getPSEOContent, pseoData } from '../src/lib/pseo-data';
import { PSEOPageTemplate } from '../src/components/pseo/PSEOPageTemplate';
import MortgageCalculator from '../src/pages/mortgage-calculator';
import LoanCalculator from '../src/pages/loan-calculator';
import AffordabilityCalculator from '../src/pages/affordability-calculator';

const baseRouter = {
  pathname: '/calculator/[slug]',
  asPath: '/calculator/example',
  route: '/calculator/[slug]',
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

const targetSlugs = [
  '300k-mortgage-monthly-payment-6-percent',
  'how-much-house-can-i-afford-80k-salary',
  '50k-loan-monthly-payment-8-percent',
  '30k-loan-monthly-payment-9-percent',
  '200k-mortgage-monthly-payment-3-5-percent-eur',
  '300k-mortgage-monthly-payment-3-5-percent-eur',
] as const;

function renderScenario(slug: string) {
  const scenario = pseoData.find((item) => item.slug === slug);
  assert.ok(scenario, `Missing scenario ${slug}`);
  const path = scenario.currency === 'EUR'
    ? `/eur/calculator/${slug}`
    : `/calculator/${slug}`;
  return renderToStaticMarkup(
    <RouterContext.Provider value={{ ...baseRouter, asPath: path }}>
      <ThemeProvider><PSEOPageTemplate params={scenario} /></ThemeProvider>
    </RouterContext.Provider>,
  );
}

test('all six Phase 4A pages SSR an editable prefilled calculator with a nonzero matching result', () => {
  const expectations = [
    ['300k-mortgage-monthly-payment-6-percent', 'homePrice', '300000', '$1,798.65'],
    ['how-much-house-can-i-afford-80k-salary', 'monthlyIncome', '6666.666666666667', '$261,479'],
    ['50k-loan-monthly-payment-8-percent', 'loanAmount', '50000', '$779.31'],
    ['30k-loan-monthly-payment-9-percent', 'loanAmount', '30000', '$622.75'],
    ['200k-mortgage-monthly-payment-3-5-percent-eur', 'homePrice', '200000', '€1,001.25'],
    ['300k-mortgage-monthly-payment-3-5-percent-eur', 'homePrice', '300000', '€1,501.87'],
  ] as const;

  for (const [slug, inputId, inputValue, initialResult] of expectations) {
    const html = renderScenario(slug);
    assert.match(html, new RegExp(`<label for="${inputId}"`), `${slug} needs a programmatic label`);
    assert.match(html, new RegExp(`id="${inputId}"[^>]*value="${inputValue.replaceAll('.', '\\.') }"`));
    assert.match(html, new RegExp(initialResult.replace(/[.$€]/g, '\\$&')));
    assert.match(html, /<button[^>]*type="submit"[^>]*>Calculate<\/button>/);
    assert.match(html, /data-calculator-results="true"/);
    assert.doesNotMatch(html, /Enter (?:details|your income details)[^<]*to (?:calculate|see results)|NaN|Infinity/);
  }
});

test('the $300k mortgage explains declining-balance interest with finance-derived first-payment values', () => {
  const html = renderScenario('300k-mortgage-monthly-payment-6-percent');
  const visibleText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  assert.match(html, /Why isn.t 6% charged on the original \$300,000 every year\?/);
  assert.match(visibleText, /\$1,798\.65/);
  assert.match(visibleText, /first (?:scheduled )?(?:payment|month)[^$]*\$1,500\.00/i);
  assert.match(visibleText, /\$298\.65[^.]*principal/i);
  assert.match(visibleText, /\$347,514\.57/);
  assert.doesNotMatch(visibleText, /\$347,640/);
});

test('the $80k affordability page exposes selected assumptions and every requested sensitivity', () => {
  const html = renderScenario('how-much-house-can-i-afford-80k-salary');
  assert.match(html, /What does this \$80,000 salary example actually permit\?/);
  for (const field of ['monthlyIncome', 'monthlyDebts', 'downPayment', 'monthlyPropertyTax', 'monthlyInsurance', 'interestRate', 'loanTerm']) {
    assert.match(html, new RegExp(`<label for="${field}"`), `Missing label for ${field}`);
  }
  for (const value of ['$261,479', '$220,575', '$286,479', '$239,159', '$246,140', '$249,975']) {
    assert.match(html, new RegExp(value.replace(/[.$]/g, '\\$&')), `Missing derived affordability value ${value}`);
  }
  assert.match(html, /user-selected planning examples/i);
  assert.match(html, /does not predict lender approval/i);
});

test('the two loan pages answer different decisions and distinguish note rate from APR', () => {
  const fifty = renderScenario('50k-loan-monthly-payment-8-percent');
  assert.match(fifty, /What is the payment and total cost of a \$50,000 loan at 8%\?/);
  for (const value of ['$1,013.82', '$779.31', '$606.64', '$60,829.18', '$65,462.10', '$72,796.56']) {
    assert.match(fifty, new RegExp(value.replace(/[.$]/g, '\\$&')));
  }
  assert.match(fifty, /selected note interest rate/i);
  assert.match(fifty, /not an APR/i);

  const thirty = renderScenario('30k-loan-monthly-payment-9-percent');
  assert.match(thirty, /Is a three-year or five-year term better for a \$30,000 loan\?/);
  for (const value of ['$953.99', '$622.75', '$482.67', '$4,343.71', '$7,365.04', '$10,544.48']) {
    assert.match(thirty, new RegExp(value.replace(/[.$]/g, '\\$&')));
  }
  assert.match(thirty, /fees are excluded/i);
  assert.match(thirty, /APR/i);
  assert.match(thirty, /not universally (?:better|comparable)/i);
});

test('EUR targets remain euro-only and make distinct finance-derived comparisons', () => {
  const twoHundred = renderScenario('200k-mortgage-monthly-payment-3-5-percent-eur');
  assert.match(twoHundred, /How much does the term change a €200,000 mortgage\?/);
  for (const value of ['€1,429.77', '€1,159.92', '€1,001.25', '€898.09']) {
    assert.match(twoHundred, new RegExp(value.replace('.', '\\.')));
  }

  const threeHundred = renderScenario('300k-mortgage-monthly-payment-3-5-percent-eur');
  assert.match(threeHundred, /How does a down payment change a €300,000 mortgage\?/);
  for (const value of ['€300,000', '€270,000', '€240,000', '€1,501.87', '€1,351.68', '€1,201.50']) {
    assert.match(threeHundred, new RegExp(value.replace('.', '\\.')));
  }

  for (const [slug, html] of [
    ['200k', twoHundred],
    ['300k', threeHundred],
  ] as const) {
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? html;
    assert.doesNotMatch(main, /\b(?:USD|dollars?|PMI|PITI|FHA|Fannie Mae|Freddie Mac|credit score)\b/i, `${slug} EUR terminology leaked`);
    const scenarioLinks = [...main.matchAll(/href="([^"]*\/calculator\/[^"]+)"/g)].map((match) => match[1]);
    assert.ok(scenarioLinks.length > 0);
    assert.ok(scenarioLinks.every((href) => href.startsWith('/eur/calculator/')), `${slug} has a cross-currency scenario link`);
  }
});

test('Phase 4A introductions render no literal HTML tokens and each page has an original question', () => {
  const questions = new Set<string>();
  for (const slug of targetSlugs) {
    const html = renderScenario(slug);
    assert.doesNotMatch(html, /&lt;a href=|&lt;strong&gt;/);
    const question = html.match(/<h2[^>]*data-scenario-question="true"[^>]*>([^<]+)<\/h2>/)?.[1];
    assert.ok(question, `${slug} is missing its decision question`);
    questions.add(question);
  }
  assert.equal(questions.size, targetSlugs.length);
});

test('shared pSEO labels and protected update date do not depend on the default locale', () => {
  const scenario = pseoData.find((item) => item.slug === '300k-mortgage-monthly-payment-6-percent');
  assert.ok(scenario);
  const originalToLocaleString = Number.prototype.toLocaleString;
  const originalToLocaleDateString = Date.prototype.toLocaleDateString;
  Number.prototype.toLocaleString = () => 'DEFAULT-LOCALE';
  Date.prototype.toLocaleDateString = function (locales?: Intl.LocalesArgument) {
    return locales === 'en-US' ? '9/26/2026' : 'DEFAULT-LOCALE-DATE';
  };
  try {
    const content = getPSEOContent(scenario, 'USD');
    assert.deepEqual(
      content.similarPages.map((page) => page.title),
      ['$400,000 Mortgage', '$350,000 Mortgage'],
    );
    const protectedHtml = renderScenario('400k-mortgage-monthly-payment-6-5-percent');
    assert.match(protectedHtml, /Updated as of 9\/26\/2026/);
    assert.doesNotMatch(protectedHtml, /DEFAULT-LOCALE-DATE/);
  } finally {
    Number.prototype.toLocaleString = originalToLocaleString;
    Date.prototype.toLocaleDateString = originalToLocaleDateString;
  }
});

test('parent tools expose server-rendered links to the six targets', () => {
  const renderTool = (Component: React.ComponentType, path: string) => renderToStaticMarkup(
    <RouterContext.Provider value={{ ...baseRouter, pathname: path, asPath: path, route: path }}>
      <ThemeProvider><Component /></ThemeProvider>
    </RouterContext.Provider>,
  );
  const mortgage = renderTool(MortgageCalculator, '/mortgage-calculator');
  assert.match(mortgage, /href="\/calculator\/300k-mortgage-monthly-payment-6-percent"/);
  assert.match(mortgage, /href="\/eur\/calculator\/200k-mortgage-monthly-payment-3-5-percent-eur"/);
  assert.match(mortgage, /href="\/eur\/calculator\/300k-mortgage-monthly-payment-3-5-percent-eur"/);

  const loan = renderTool(LoanCalculator, '/loan-calculator');
  assert.match(loan, /href="\/calculator\/30k-loan-monthly-payment-9-percent"/);
  assert.match(loan, /href="\/calculator\/50k-loan-monthly-payment-8-percent"/);

  const affordability = renderTool(AffordabilityCalculator, '/affordability-calculator');
  assert.match(affordability, /href="\/calculator\/how-much-house-can-i-afford-80k-salary"/);
});

test('the protected 400k scenario and route inventory remain unchanged', () => {
  assert.equal(pseoData.length, 31);
  assert.equal(pseoData.filter((item) => item.currency === 'USD').length, 25);
  assert.equal(pseoData.filter((item) => item.currency === 'EUR').length, 6);
  assert.deepEqual(
    pseoData.filter((item) => item.substantiveModified).map((item) => [item.slug, item.substantiveModified]),
    [['400k-mortgage-monthly-payment-6-5-percent', '2026-09-21']],
  );

  const protectedHtml = renderScenario('400k-mortgage-monthly-payment-6-5-percent');
  assert.match(protectedHtml, /\$2,528\.27/);
  assert.match(protectedHtml, /id="homePrice"[^>]*value="400000"/);
  assert.match(protectedHtml, /id="interestRate"[^>]*value="6\.5"/);
  assert.match(protectedHtml, /Why the payment is not \$400,000 divided by 360/);
});
