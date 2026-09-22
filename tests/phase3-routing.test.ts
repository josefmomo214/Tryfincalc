import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { getRedirectUrl } from 'next/experimental/testing/server';
import { proxy } from '../src/proxy';

test('USD duplicate routes permanently redirect to the unprefixed canonical route', () => {
  const response = proxy(new NextRequest('https://tryfincalc.com/usd/mortgage-calculator?term=30'));
  assert.equal(response.status, 308);
  assert.equal(getRedirectUrl(response), 'https://tryfincalc.com/mortgage-calculator?term=30');
  assert.match(response.headers.get('set-cookie') || '', /tryfincalc_currency=USD/);
});

test('EUR ordinary routes preserve the display preference in a cookie', () => {
  const response = proxy(new NextRequest('https://tryfincalc.com/eur/blog/mortgage-payment-guide'));
  assert.equal(response.status, 308);
  assert.equal(getRedirectUrl(response), 'https://tryfincalc.com/blog/mortgage-payment-guide');
  assert.match(response.headers.get('set-cookie') || '', /tryfincalc_currency=EUR/);
});

test('genuine euro scenario routes pass through without a locale redirect', () => {
  const response = proxy(new NextRequest('https://tryfincalc.com/eur/calculator/200k-mortgage-monthly-payment-3-5-percent-eur'));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('x-middleware-next'), '1');
});
