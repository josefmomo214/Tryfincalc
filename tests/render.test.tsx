import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { MortgageCalculatorWidget } from '../src/components/calculator/MortgageCalculatorWidget';
import { Input } from '../src/components/ui/Input';

test('invalid mortgage renders a field-associated message and no negative principal', () => {
  const html = renderToStaticMarkup(<MortgageCalculatorWidget initialHomePrice={300000} initialDownPaymentPercent={350000 / 300000 * 100} />);
  assert.match(html, /Down payment must not exceed the home price/);
  const field = html.match(/<input[^>]*id="downPayment"[^>]*>/)?.[0] || "";
  assert.match(field, /aria-describedby="mortgage-error"/);
  assert.match(field, /aria-invalid="true"/);
  assert.match(html, /<label for="loanTerm"[^>]*>Loan Term/);
  assert.match(html, /<label for="propertyTax"[^>]*>Tax/);
  assert.doesNotMatch(html, /-\$|NaN|Infinity/);
});
test('empty numeric field remains empty with an accessible error', () => {
  const html = renderToStaticMarkup(<Input type="number" value={NaN} readOnly aria-label="Loan amount" />);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /value=""/);
  assert.match(html, /aria-describedby=/);
  assert.doesNotMatch(html, /NaN|Infinity/);
});

import { AmortizationTable } from '../src/components/calculator/AmortizationTable';
import { generateAmortizationSchedule } from '../src/lib/finance';
test('amortization preview and expanded table render complete, numbered payments', () => {
  for (const years of [20, 25, 30]) for (const expanded of [false, true]) {
    const html = renderToStaticMarkup(<AmortizationTable schedule={generateAmortizationSchedule(400000, 6.5, years)}
      currency="USD" showFullSchedule={expanded} validationError="" onToggle={() => {}} />);
    const body = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/)?.[1] || '';
    assert.equal((body.match(/<tr\b/g) || []).length, expanded ? years * 12 : 12);
    assert.match(html, new RegExp(`aria-expanded="${expanded}"`));
    assert.ok(html.includes(expanded ? 'Show fewer payments' : 'Show full schedule'));
    if (expanded) assert.match(body, /\$0\.00<\/td><\/tr>$/);
  }
});
