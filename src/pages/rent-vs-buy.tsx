import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { MainLayout } from '@/components/layout/MainLayout';
import { SEOHandler } from '@/components/seo/SEOHandler';
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from '@/components/calculator/CalculatorContainer';
import { Input } from '@/components/ui/Input';
import { compareRentBuy, rentBuySensitivity, validateRentBuy, RENT_BUY_DEFAULTS, formatCurrency, type RentBuyInputs } from '@/lib/finance';
import Link from 'next/link';

const fields: {key:keyof RentBuyInputs;label:string;step?:number}[] = [
  {key:'rent',label:'Monthly rent'}, {key:'rentGrowth',label:'Annual rent growth (%)',step:.1},
  {key:'homePrice',label:'Purchase price'}, {key:'downPercent',label:'Down payment (%)',step:.1},
  {key:'rate',label:'Nominal annual mortgage interest rate (%)',step:.1}, {key:'term',label:'Mortgage term (years)'},
  {key:'years',label:'Time horizon (years)',step:1/12}, {key:'purchaseCostPercent',label:'Purchase closing costs (% of price)',step:.1},
  {key:'saleCostPercent',label:'Selling costs (% of future value)',step:.1}, {key:'appreciation',label:'Annual home appreciation (%)',step:.1},
  {key:'maintenancePercent',label:'Annual maintenance (% of home value)',step:.1}, {key:'propertyTaxPercent',label:'Annual property tax (% of home value)',step:.1},
  {key:'annualInsurance',label:'Annual homeowners insurance'}, {key:'investmentReturn',label:'Annual after-tax investment return / discount rate (%)',step:.1},
];
export default function RentVsBuy() {
  const currency = useRouter().locale === 'eur' ? 'EUR' : 'USD';
  const [inputs,setInputs] = useState(RENT_BUY_DEFAULTS);
  const error = validateRentBuy(inputs);
  const result = error ? null : compareRentBuy(inputs);
  const sensitivity = error ? [] : rentBuySensitivity(inputs);
  const crossings = sensitivity.flatMap(s=>s.crossing === null ? [] : [s.crossing]);
  const money = (value:number)=>formatCurrency(value,2,currency);
  return <MainLayout>
    <SEOHandler title="Rent vs Buy: Cost and Sensitivity Calculator" description="Compare estimated discounted renting and ownership costs, sale equity, opportunity cost and sensitivity to appreciation and investment returns." canonicalUrl="https://tryfincalc.com/rent-vs-buy" structuredData={{'@context':'https://schema.org','@type':'WebApplication',name:'Rent vs Buy Calculator',url:'https://tryfincalc.com/rent-vs-buy',applicationCategory:'FinanceApplication',operatingSystem:'All',offers:{'@type':'Offer',price:0,priceCurrency:'USD'}}}/>
    <header className="max-w-7xl mx-auto px-6 pt-16"><h1 className="text-4xl font-bold text-primary">Rent vs Buy Calculator</h1><p className="mt-4">Compare estimated costs across assumptions, including the return you could earn on money committed to a home.</p></header>
    <CalculatorContainer title="Your housing scenario" description="US-style fixed-rate cash-flow model. Currency is a display choice. Defaults are illustrative assumptions, not forecasts or offers.">
      <CalculatorInputArea>
        {error && <p id="rent-buy-error" role="alert">{error}</p>}
        <div className="space-y-4">{fields.map(({key,label,step})=><div key={key}>
          <label htmlFor={key} className="block text-sm font-semibold mb-2">{label}</label>
          <Input id={key} type="number" step={step??1} value={inputs[key]} aria-invalid={!!error} aria-describedby={error?'rent-buy-error':undefined} onChange={e=>setInputs({...inputs,[key]:e.target.valueAsNumber})}/>
        </div>)}</div>
      </CalculatorInputArea>
      <CalculatorResultsArea>
        {result ? <>
          <section className="rounded-2xl bg-primary/5 p-6 space-y-4">
            <h2 className="text-2xl font-bold">Estimated costs in today&apos;s money</h2>
            <p>Renting: <strong>{money(result.totalRent)}</strong></p>
            <p>Buying, after sale equity: <strong>{money(result.totalBuy)}</strong></p>
            <p>Buying minus renting: <strong>{money(result.difference)}</strong>. A positive value means buying costs more under these assumptions; a negative value means less. This is not a recommendation.</p>
            <p>Estimated sale equity before discounting: {money(result.saleEquity)}. Remaining loan balance: {money(result.balance)}.</p>
          </section>
          <section className="space-y-4"><h2 className="text-2xl font-bold">Break-even range and sensitivity</h2>
            <p>{crossings.length ? `First sampled crossing: ${Math.min(...crossings)}–${Math.max(...crossings)} years across scenarios that cross.` : 'No sampled scenario reaches buying cost parity within this horizon.'} {crossings.length>0 && crossings.length<3 && 'At least one scenario does not cross within the horizon.'} Checks are annual plus the chosen final horizon; a crossing is not guaranteed to persist.</p>
            <div className="overflow-x-auto"><table className="w-full text-left"><caption className="text-sm mb-3">Appreciation and investment return vary together by one percentage point in opposite directions. All other inputs stay fixed.</caption><thead><tr><th>Appreciation / return</th><th>Buying minus renting</th><th>First crossing</th></tr></thead><tbody>{sensitivity.map(s=><tr key={s.change}><td className="py-3">{s.appreciation}% / {s.investmentReturn}%</td><td>{money(s.difference)}</td><td>{s.crossing===null?'None in horizon':`${s.crossing} years`}</td></tr>)}</tbody></table></div>
          </section>
        </> : <p>Correct the highlighted inputs to calculate an estimate.</p>}
        <section className="space-y-3"><h2 className="text-xl font-bold">What this comparison includes</h2><p>Purchase costs and down payment are paid at the start. Mortgage payments, property tax, maintenance, insurance and rent are paid monthly. Rent increases annually; tax and maintenance follow assumed home value. The home is sold at the horizon, selling costs and remaining mortgage are deducted, and net equity offsets ownership costs.</p><p>Both streams are discounted using your assumed investment return, accounting for the opportunity cost of the down payment and monthly spending differences. Negative ownership costs can occur when assumed appreciation exceeds costs; this is a scenario outcome, not a forecast.</p><p>Excluded: PMI, HOA, tax deductions and capital-gains taxes, rent deposits, moving expenses, transaction timing risk and investment volatility. Add country-specific costs separately. No country-wide underwriting rule is implied.</p><p><Link href="/methodology" className="underline">Methodology and formula tests</Link> · <Link href="/mortgage-calculator" className="underline">Mortgage payment</Link> · <Link href="/affordability-calculator" className="underline">Budget assumptions</Link></p></section>
      </CalculatorResultsArea>
    </CalculatorContainer>
  </MainLayout>;
}
