import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import type { NextRouter } from 'next/router';
import { ThemeProvider } from '../src/lib/context/ThemeContext';
import Mortgage from '../src/pages/mortgage-calculator';
import Loan from '../src/pages/loan-calculator';
import Monthly from '../src/pages/monthly-payment-calculator';
import Interest from '../src/pages/total-interest-calculator';
import Refinance from '../src/pages/refinancing-calculator';
import Affordability from '../src/pages/affordability-calculator';
import RentBuy from '../src/pages/rent-vs-buy';
import Amortization from '../src/pages/amortization-schedule';
const router = {locale:'usd', pathname:'/', asPath:'/', route:'/', query:{}, basePath:'', isReady:true, isFallback:false, isPreview:false, push:async()=>true, replace:async()=>true, prefetch:async()=>{}, events:{on(){},off(){},emit(){}}} as unknown as NextRouter;
for (const [name,Component] of Object.entries({Mortgage,Loan,Monthly,Interest,Refinance,Affordability,RentBuy,Amortization})) {
 test(`${name} has nonzero result and Calculate action without hydration`,()=>{
  const html=renderToStaticMarkup(<RouterContext.Provider value={router}><ThemeProvider><Component/></ThemeProvider></RouterContext.Provider>);
  const results=html.match(/data-calculator-results="true"[^>]*>([\s\S]*?)<!--calculator-results-end-->/)?.[1] ?? html.match(/data-calculator-results="true"[^>]*>([\s\S]*)/)?.[1];
  assert.ok(results, 'results region exists');
  assert.match(results, /\$[1-9][\d,]*(?:\.\d{2})?/);
  assert.doesNotMatch(results,/Enter details to calculate|NaN|Infinity/);
  assert.match(html, /<button[^>]*type="submit"[^>]*>Calculate/);
 });
}
