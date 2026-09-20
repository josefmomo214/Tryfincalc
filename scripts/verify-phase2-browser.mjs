// Run against a production server. Install Playwright separately if needed:
// npm install --prefix /tmp/tryfincalc-browser --no-save playwright
// PLAYWRIGHT_MODULE=/tmp/tryfincalc-browser/node_modules/playwright/index.mjs node scripts/verify-phase2-browser.mjs http://localhost:3101 docs/audit/phase2/browser
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.argv[2]||'http://localhost:3101';
assert.ok(/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base),'Only a local test server is supported');
const out=process.argv[3]||'docs/audit/phase2/browser';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const tools=['mortgage-calculator','loan-calculator','monthly-payment-calculator','total-interest-calculator','refinancing-calculator','affordability-calculator','rent-vs-buy','amortization-schedule'];
const results=[];
const resultRegion=page=>page.getByRole('region',{name:'Estimated calculation results'});
const moneyPattern=/[$€][1-9][\d,]*(?:\.\d{2})?/;
try {
 for(const width of [1440,390]) {
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
  // The local application is under test; third-party ads/analytics/CMP are not.
  await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
  const page=await context.newPage(); const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  for(const tool of tools) {
   const response=await page.goto(`${base}/${tool}`); assert.equal(response.status(),200);
   const result=resultRegion(page);
   await result.waitFor();
   assert.match(await result.innerText(),moneyPattern,`${tool}: initial nonzero result`);
   assert.equal(await page.locator('h1').count(),1);
   const calculate=page.getByRole('button',{name:'Calculate',exact:true});
   await calculate.focus(); await page.keyboard.press('Enter');
   assert.equal(await result.evaluate(el=>el===document.activeElement),true,`${tool}: Calculate keyboard focus`);
   const first=page.locator('#calculator-top input[type=number]').first();
   const value=await first.inputValue(); await first.fill('');
   await calculate.focus(); await page.keyboard.press('Enter');
   assert.equal(await first.getAttribute('aria-invalid'),'true');
   assert.equal(await first.evaluate(el=>el===document.activeElement),true,`${tool}: invalid focus`);
   assert.ok(await page.getByRole('alert').count(),`${tool}: empty input error`);
   assert.doesNotMatch(await result.innerText(),/NaN|Infinity/);
   await first.fill('-1');
   await calculate.focus(); await page.keyboard.press('Enter');
   assert.equal(await first.getAttribute('aria-invalid'),'true',`${tool}: negative input invalid`);
   assert.ok(await page.getByRole('alert').count(),`${tool}: negative input error`);
   await first.fill(value); await calculate.click();
   assert.notEqual(await first.getAttribute('aria-invalid'),'true',`${tool}: valid value recovery`);
   assert.match(await result.innerText(),moneyPattern,`${tool}: recovered nonzero result`);
   const beforeUpdate=await result.innerText();
   await first.fill(String(Number(value)*1.1||1));
   assert.notEqual(await result.innerText(),beforeUpdate,`${tool}: result reacts to input change`);
   await first.fill(value);
   const viewport=await page.evaluate(()=>{
    const width=document.documentElement.clientWidth;
    const details=[...document.querySelectorAll('body *')].flatMap(element=>{
     const box=element.getBoundingClientRect();
     return box.right>width+1||box.left<-1?[{tag:element.tagName,id:element.id,className:String(element.className).slice(0,160),left:Math.round(box.left),right:Math.round(box.right),width:Math.round(box.width)}]:[];
    }).slice(0,20);
    return {fits:document.documentElement.scrollWidth<=width+1,scrollWidth:document.documentElement.scrollWidth,width,details};
   });
   assert.equal(viewport.fits,true,`${tool}: horizontal viewport overflow: ${JSON.stringify(viewport)}`);
   if(['mortgage-calculator','loan-calculator','rent-vs-buy'].includes(tool)) {
    await page.locator('#calculator-top').evaluate(element=>element.scrollIntoView({block:'start'}));
    await page.screenshot({path:path.join(out,`${tool}-${width}.png`),fullPage:false});
   }
   results.push({tool,width,status:'pass',checks:['initial results','one H1','keyboard Calculate','empty input error','negative input error','invalid focus','recovery','reactive result','viewport overflow']});
  }
  assert.deepEqual(errors,[], 'No uncaught client errors');
  await context.close();
 }
 const page=await browser.newPage();
 await page.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
 await page.goto(`${base}/monthly-payment-calculator`);
 await page.locator('#amount').fill('80000');await page.locator('#rate').fill('6');await page.locator('#years').fill('30');
 assert.ok((await resultRegion(page).innerText()).includes('$479.64'));
 await page.locator('#rate').fill('0');
 assert.ok((await resultRegion(page).innerText()).includes('$222.22'));
 await page.goto(`${base}/loan-calculator`);
 await page.locator('#loanAmount').fill('400000');await page.locator('#interestRate').fill('6.5');await page.locator('#loanTerm').fill('30');
 const loan400=await resultRegion(page).innerText();
 assert.ok(loan400.includes('$2,528.27'),'400000 at 6.5% monthly payment');
 assert.ok(loan400.includes('$510,177.95'),'400000 at 6.5% total interest');
 await page.goto(`${base}/monthly-payment-calculator`);
 await page.locator('#amount').fill('315000');await page.locator('#rate').fill('6.8');await page.locator('#years').fill('30');
 const loan315=await resultRegion(page).innerText();
 assert.ok(loan315.includes('$2,053.56'),'315000 at 6.8% monthly payment');
 assert.ok(loan315.includes('$424,283.16'),'315000 at 6.8% total interest');
 await page.goto(`${base}/rent-vs-buy`);
 const before=await resultRegion(page).innerText();
 await page.locator('#investmentReturn').fill('10');
 const afterReturn=await resultRegion(page).innerText();
 assert.notEqual(afterReturn,before,'investment-return sensitivity');
 await page.locator('#appreciation').fill('7');
 assert.notEqual(await resultRegion(page).innerText(),afterReturn,'appreciation sensitivity');
 const sitemap=await (await fetch(`${base}/sitemap.xml`)).text();
 const paths=[...sitemap.matchAll(/<loc>https:\/\/tryfincalc\.com([^<]*)<\/loc>/g)].map(match=>match[1]||'/');
 const leaked=[];
 for(const route of paths) {
  const html=await (await fetch(`${base}${route}`)).text();
  if(/\$\{(?:loanValue|loanTable)|\{\{[^}]+\}\}/.test(html)) leaked.push(route);
 }
 assert.deepEqual(leaked,[],'No template variables in sitemap route HTML');
 results.push({status:'pass',checks:['80000 at 6% => 479.64','400000 at 6.5% => 2528.27 monthly and 510177.95 interest','315000 at 6.8% => 2053.56 monthly and 424283.16 interest','zero-rate payment','investment-return sensitivity','appreciation sensitivity',`${paths.length} sitemap routes free of template tokens`]});
 await fs.writeFile(path.join(out,'results.json'),JSON.stringify(results,null,2));
 console.log(`PASS: ${tools.length*2} desktop/mobile calculator checks; known examples, sensitivity and ${paths.length} rendered sitemap routes checked; third-party scripts excluded.`);
} finally {await browser.close();}
