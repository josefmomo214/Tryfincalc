import { EXCHANGE_RATE, convertCurrency } from "./finance";

export interface PSEOParams {
  slug: string;
  type: 'mortgage' | 'loan' | 'affordability';
  amount: number;
  rate: number;
  term: number;
  currency: 'USD' | 'EUR';
  salary?: number;
  customTitle?: string;
  customDescription?: string;
  customH1?: string;
  customIntro?: string;
  customContent?: string;
  customFaqs?: { question: string; answer: string }[];
}

export interface ComparisonScenario {
  label: string;
  rate: number;
  payment: number;
  difference: number;
}

export const pseoData: PSEOParams[] = [
  // Mortgages USD
  { 
    slug: '300k-mortgage-monthly-payment-6-percent', 
    type: 'mortgage', 
    amount: 300000, 
    rate: 6, 
    term: 30, 
    currency: 'USD',
    customTitle: "$300,000 Mortgage at 6%: Your Complete Payment Breakdown",
    customDescription: "What is the monthly payment on a $300,000 mortgage at 6% interest? See your exact P&I payment, full PITI breakdown, total interest cost, income requirements, and amortization schedule.",
    customH1: "$300,000 Mortgage at 6%: Your Complete Payment Breakdown",
    customIntro: "A $300,000 mortgage at 6% is one of the most common loan scenarios in the US — typical for first-time buyers in affordable to mid-range markets across the Midwest, South, and Mountain West in 2026. This page gives you the exact monthly payment at every term, a full PITI breakdown including taxes and insurance, the income you need to qualify, and a rate sensitivity table showing exactly what a better or worse rate would cost. Use the <a href='/mortgage-calculator'>mortgage calculator</a> above to adjust for your specific down payment and term.",
    customContent: `
      <h2>Monthly Payment on a $300,000 Mortgage at 6%</h2>
      <p>The term of your loan is the biggest factor in determining your monthly cash flow versus your total interest savings. Here is the breakdown for a $300,000 balance at a 6% fixed rate:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Loan Term</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly P&I</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">10 years</td><td class="py-3 px-4 text-sm">$3,330</td><td class="py-3 px-4 text-sm">$99,600</td><td class="py-3 px-4 text-sm">$399,600</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">15 years</td><td class="py-3 px-4 text-sm">$2,532</td><td class="py-3 px-4 text-sm">$155,760</td><td class="py-3 px-4 text-sm">$455,760</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">20 years</td><td class="py-3 px-4 text-sm">$2,149</td><td class="py-3 px-4 text-sm">$215,760</td><td class="py-3 px-4 text-sm">$515,760</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">25 years</td><td class="py-3 px-4 text-sm">$1,933</td><td class="py-3 px-4 text-sm">$279,900</td><td class="py-3 px-4 text-sm">$579,900</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">30 years</td><td class="py-3 px-4 text-sm">$1,799</td><td class="py-3 px-4 text-sm">$347,640</td><td class="py-3 px-4 text-sm">$647,640</td></tr>
          </tbody>
        </table>
      </div>

      <p>At 6% over 30 years the monthly principal and interest payment is $1,799 — and the total interest paid over the life of the loan is $347,640. Choosing a <a href="/blog/15-vs-30-year-mortgage">15-year vs 30-year mortgage comparison</a> shows that the shorter term saves $191,880 in interest but adds $733 to the monthly payment. You can view the full year-by-year equity growth on our <a href="/amortization-schedule">amortization schedule</a>.</p>

      <h2>Full Monthly Cost Including Taxes and Insurance (PITI)</h2>
      <p>Your actual check to the bank includes more than just principal and interest. Here is a realistic breakdown for a $334,000 home purchase with 10% down ($34,000), resulting in a $300,000 loan at 6% over 30 years:</p>
      
      <ul>
        <li><strong>Principal and Interest:</strong> $1,799</li>
        <li><strong>Property Tax (1.1%/yr):</strong> $306</li>
        <li><strong>Homeowners Insurance:</strong> $110</li>
        <li><strong>Private Mortgage Insurance (PMI):</strong> $125</li>
        <li><strong>Total Monthly Payment:</strong> $2,340</li>
      </ul>

      <p>Note that PMI typically cancels once you reach 20% equity (as defined by the <a href="https://www.consumerfinance.gov" target="_blank" rel="noopener noreferrer">Consumer Financial Protection Bureau</a>), dropping your total monthly cost to approximately $2,215. Property taxes vary significantly by state — please use our <a href="/mortgage-calculator">mortgage calculator</a> for a personalised PITI breakdown based on your local rates. Also, check our <a href="/blog/down-payment-guide">down payment guide</a> for more on avoiding PMI.</p>

      <h2>What Income Do You Need for a $300,000 Mortgage at 6%?</h2>
      <p>Most lenders follow the 28% rule, which states your housing costs shouldn't exceed 28% of your gross monthly income. Here is the income required for a <strong>$300000 mortgage monthly payment 6 percent</strong> scenario:</p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Payment Scenario</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Cost</th>
              <th class="py-3 px-4 font-bold text-sm">Required Annual Income</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td>P&I only</td><td>$1,799</td><td>~$77,100</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td>Full PITI (example)</td><td>$2,340</td><td>~$100,286</td></tr>
            <tr class="border-b border-outline-variant/30"><td>With $400 other debts</td><td>$2,740</td><td>~$117,429</td></tr>
          </tbody>
        </table>
      </div>
      <p>Most buyers will need a household income between $77,000 and $117,000 to comfortably qualify depending on existing debts and local property taxes. You can get a personalized requirement using our <a href="/affordability-calculator">affordability calculator</a> or read about <a href="/blog/how-much-house-can-i-afford">how much house you can afford</a>.</p>

      <h2>How 6% Compares to Other Rates on a $300,000 Loan</h2>
      <p>How does 6% sit relative to current benchmarks? According to <a href="https://fred.stlouisfed.org" target="_blank" rel="noopener noreferrer">Federal Reserve Economic Data</a>, small rate movements have big consequences. Here is the sensitivity for a 30-year term:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Interest Rate</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly P&I</th>
              <th class="py-3 px-4 font-bold text-sm">Difference vs 6%</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td>5.0%</td><td>$1,610</td><td>−$189/month</td><td>$279,600</td></tr>
            <tr class="border-b border-outline-variant/30"><td>5.5%</td><td>$1,703</td><td>−$96/month</td><td>$313,080</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td>6.0%</td><td>$1,799</td><td>—</td><td>$347,640</td></tr>
            <tr class="border-b border-outline-variant/30"><td>6.5%</td><td>$1,896</td><td>+$97/month</td><td>$382,560</td></tr>
            <tr class="border-b border-outline-variant/30"><td>7.0%</td><td>$1,996</td><td>+$197/month</td><td>$418,560</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5"><td>7.5%</td><td>$2,098</td><td>+$299/month</td><td>$455,280</td></tr>
          </tbody>
        </table>
      </div>
      <p>A 1% rate increase adds approximately $197–$299/month and over $70,000 in total interest. Check out our <a href="/blog/interest-rate-impact">how your rate affects total cost</a> guide for more. If rates drop after you close, the <a href="/refinancing-calculator">refinancing calculator</a> can help you find your break-even point. Also, see our related guides on a <a href="/calculator/400k-mortgage-monthly-payment-6-5-percent">$400,000 mortgage at 6.5%</a> and a <a href="/calculator/250k-mortgage-monthly-payment-3-5-percent">$250,000 mortgage at 3.5%</a>.</p>

      <h2>Run Your Personalised Scenario</h2>
      <p>Ready to see your exact numbers? Use the mortgage calculator above to adjust the term, down payment, and rate and see exactly how your payment changes. Don't forget to use the <a href="/affordability-calculator">affordability calculator</a> to confirm this loan fits your income. Understanding <a href="/blog/mortgage-payment-guide">how mortgage payments are calculated</a> is the first step toward smart homeownership.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white text-center shadow-xl">
          <h3 class="text-xl font-bold mb-4">Mortgage Calculator</h3>
          <p class="mb-6 opacity-90 text-sm">Get an instant 2026 breakdown.</p>
          <a href="/mortgage-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Calculate Now →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant text-center shadow-sm">
          <h3 class="text-xl font-bold mb-4">Total Interest</h3>
          <p class="mb-6 opacity-70 text-sm">See the full lifetime cost.</p>
          <a href="/total-interest-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">View Lifetime Cost →</a>
        </div>
      </div>
    `,
    customFaqs: [
      {
        question: "What is the monthly payment on a $300,000 mortgage at 6%?",
        answer: "The monthly principal and interest payment is $1,799 on a 30-year term. For a **$300000 mortgage monthly payment 6 percent** scenario including taxes and insurance, the total PITI is closer to $2,340."
      },
      {
        question: "What income do I need for a $300,000 mortgage?",
        answer: "To qualify for a $300,000 mortgage at 6%, most lenders look for a household income between $77,000 and $100,000 depending on your other monthly debts."
      },
      {
        question: "How much total interest do I pay on a $300,000 mortgage at 6%?",
        answer: "Over 30 years, you will pay a total of $347,640 in interest. If you choose a 15-year term, that interest cost drops to $155,760."
      },
      {
        question: "Is 6% a good mortgage rate in 2026?",
        answer: "In the 2026 market, 6% is considered a solid, mid-range rate for a 30-year fixed mortgage. Always check **Federal Reserve Economic Data** for the most current national benchmarks."
      }
    ]
  },
  { 
    slug: '400k-mortgage-monthly-payment-6-5-percent', 
    type: 'mortgage', 
    amount: 400000, 
    rate: 6.5, 
    term: 30, 
    currency: 'USD',
    customTitle: "$400,000 Mortgage at 6.5%: Your Complete Payment Breakdown",
    customDescription: "What is the monthly payment on a $400,000 mortgage at 6.5% interest? See your exact P&I payment, full PITI breakdown, total interest cost, income requirements, and amortization schedule.",
    customH1: "$400,000 Mortgage at 6.5%: Your Complete Payment Breakdown",
    customIntro: "A $400,000 mortgage at 6.5% interest is one of the most searched loan scenarios in 2026—common for buyers in mid-range markets across the South, Midwest, and Mountain West. This page gives you the exact monthly payment, a full cost breakdown, and the income you need to qualify comfortably. Use the calculator above to adjust for your specific term and down payment.",
    customContent: `<p>Whether you are buying a suburban family home or a high-end condo, understanding these numbers is critical before you approach a lender. Use the <a href="/mortgage-calculator">mortgage calculator</a> to adjust for your specific term and down payment.</p>

<h2>Monthly Payment on a $400,000 Mortgage at 6.5%</h2>
<p>The monthly principal and interest (P&I) payment remains fixed for the life of the loan on a standard fixed-rate mortgage. However, the term you choose significantly impacts both your monthly cash flow and the total amount you will pay back to the bank. Here is how a $400,000 loan at 6.5% breaks down across different terms:</p>

<table>
  <thead>
    <tr>
      <th>Loan Term</th>
      <th>Monthly P&I</th>
      <th>Total Interest</th>
      <th>Total Paid</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>10 years</td><td>$4,541</td><td>$144,920</td><td>$544,920</td></tr>
    <tr><td>15 years</td><td>$3,485</td><td>$227,300</td><td>$627,300</td></tr>
    <tr><td>20 years</td><td>$2,981</td><td>$315,440</td><td>$715,440</td></tr>
    <tr><td>25 years</td><td>$2,701</td><td>$410,300</td><td>$810,300</td></tr>
    <tr><td>30 years</td><td>$2,528</td><td>$510,080</td><td>$910,080</td></tr>
  </tbody>
</table>

<p>At 6.5% over 30 years, the monthly principal and interest payment is $2,528—and the total interest paid over the life of the loan is $510,080, meaning you pay back $910,080 on a $400,000 loan. Choosing a 15-year term instead saves $282,780 in interest but adds $957/month to the payment. Review your full <a href="/amortization-schedule">amortization schedule</a> for a month-by-month breakdown of your equity growth.</p>

<h2>Full Monthly Cost Including Taxes and Insurance (PITI)</h2>
<p>The "sticker price" of your mortgage (P&I) isn't the whole story. Lenders look at your PITI—Principal, Interest, Taxes, and Insurance. Below is a realistic breakdown for a $445,000 home purchase with 10% down ($45,000), resulting in a $400,000 loan at 6.5%:</p>

<table>
  <thead>
    <tr><th>Component</th><th>Monthly Cost</th></tr>
  </thead>
  <tbody>
    <tr><td>Principal and interest</td><td>$2,528</td></tr>
    <tr><td>Property tax (1.1%/yr)</td><td>$407</td></tr>
    <tr><td>Homeowners insurance</td><td>$140</td></tr>
    <tr><td>PMI (~0.5% — under 20%)</td><td>$167</td></tr>
    <tr><td><strong>Total monthly payment</strong></td><td><strong>$3,242</strong></td></tr>
  </tbody>
</table>

<p>Note: Private Mortgage Insurance (PMI) is usually required when you put down less than 20%. Under the <a href="https://www.consumerfinance.gov" target="_blank" rel="noopener noreferrer">Consumer Financial Protection Bureau</a> (CFPB) guidelines, PMI must be canceled once you reach 22% equity (and you can request it at 20%). At that point, your total monthly cost drops to approximately $3,075. Use the <a href="/mortgage-calculator">mortgage calculator</a> for a personalized estimate based on your exact location.</p>

<h2>What Income Do You Need for a $400,000 Mortgage at 6.5%?</h2>
<p>Lenders use the Debt-to-Income (DTI) ratio to determine if you can afford the loan. Most prefer that your housing costs stay under 28% of your gross monthly income (the "28% rule"). Here is the annual income required for different payment levels:</p>

<table>
  <thead>
    <tr><th>Payment Scenario</th><th>Monthly Cost</th><th>Required Annual Income</th></tr>
  </thead>
  <tbody>
    <tr><td>P&I only</td><td>$2,528</td><td>~$108,343</td></tr>
    <tr><td>Full PITI (example)</td><td>$3,242</td><td>~$138,943</td></tr>
    <tr><td>With $500 other debts</td><td>$3,742</td><td>~$160,371</td></tr>
  </tbody>
</table>

<p>Most buyers will need a household income between $108,000 and $160,000 to comfortably qualify depending on existing debts and local tax rates. Check <a href="/blog/how-much-house-can-i-afford">how much house you can afford</a> using our <a href="/affordability-calculator">affordability calculator</a>.</p>

<h2>How 6.5% Compares to Other Rates on a $400,000 Loan</h2>
<p>Mortgage rates fluctuate daily based on <a href="https://fred.stlouisfed.org" target="_blank" rel="noopener noreferrer">Federal Reserve Economic Data</a> and market conditions. Small movements in your rate have outsized impacts on a $400,000 loan balance:</p>

<table>
  <thead>
    <tr>
      <th>Interest Rate</th>
      <th>Monthly P&I</th>
      <th>Difference vs 6.5%</th>
      <th>Total Interest</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>5.5%</td><td>$2,271</td><td>−$257/month</td><td>$417,560</td></tr>
    <tr><td>6.0%</td><td>$2,398</td><td>−$130/month</td><td>$463,280</td></tr>
    <tr><td>6.5%</td><td>$2,528</td><td>—</td><td>$510,080</td></tr>
    <tr><td>7.0%</td><td>$2,661</td><td>+$133/month</td><td>$557,960</td></tr>
    <tr><td>7.5%</td><td>$2,797</td><td>+$269/month</td><td>$606,920</td></tr>
  </tbody>
</table>

<p>A 1% rate difference on a $400,000 loan changes the monthly payment by approximately $269 and the total interest by nearly $97,000 over 30 years. Learn <a href="/blog/interest-rate-impact">how your rate affects total cost</a> to better time your purchase. If rates drop after you close, use the <a href="/refinancing-calculator">refinancing calculator</a> to see whether refinancing makes sense.</p>

<h2>Run Your Personalised Scenario</h2>
<p>Ready to see your exact numbers? Use the mortgage calculator above to adjust the term, down payment, and rate and see exactly how your payment changes. Don't forget to use the <a href="/affordability-calculator">affordability calculator</a> to confirm this loan fits your income and long-term financial goals.</p>

<div class="flex flex-col md:flex-row gap-6 my-10 text-center">
  <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant text-center">
    <h3 class="text-xl font-bold mb-4">Mortgage Calculator</h3>
    <a href="/mortgage-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline">Calculate Now →</a>
  </div>
  <div class="flex-1 bg-primary/5 p-8 rounded-3xl border border-primary/20 shadow-lg text-center font-bold">
    <h3 class="text-xl font-bold mb-4">Related Calculators</h3>
    <div class="flex flex-col gap-2">
      <a href="/calculator/400k-mortgage-monthly-payment-4-percent" class="text-primary hover:underline">$400k Mortgage at 4%</a>
      <a href="/calculator/500k-mortgage-monthly-payment-7-percent" class="text-primary hover:underline">$500k Mortgage at 7%</a>
    </div>
  </div>
</div>`,
    customFaqs: [
      {
        question: "What is the monthly payment on a $400,000 mortgage at 6.5%?",
        answer: "The monthly principal and interest payment is $2,528 for a 30-year term. When you include taxes, insurance, and PMI, the total **$400000 mortgage monthly payment 6.5 percent** is typically around $3,242."
      },
      {
        question: "What income do I need for a $400,000 mortgage?",
        answer: "To qualify comfortably for a $400,000 loan at current rates, most lenders look for a household income between $110,000 and $140,000, assuming moderate existing debt."
      },
      {
        question: "How much total interest do I pay on a $400,000 mortgage at 6.5%?",
        answer: "Over a 30-year term, you will pay a total of $510,080 in interest. If you choose a 15-year term, your total interest cost drops significantly to $227,300."
      },
      {
        question: "Is 6.5% a good mortgage rate for 2026?",
        answer: "In the context of 2026 market benchmarks, 6.5% is considered a competitive rate. However, you should always check the latest Federal Reserve Economic Data to see where rates stand today."
      }
    ]
  },
  { slug: '500k-mortgage-monthly-payment-7-percent', type: 'mortgage', amount: 500000, rate: 7, term: 30, currency: 'USD' },
  
  // Mortgages EUR
  { slug: '250k-mortgage-monthly-payment-3-5-percent', type: 'mortgage', amount: 250000, rate: 3.5, term: 20, currency: 'EUR' },
  { 
    slug: '400k-mortgage-monthly-payment-4-percent', 
    type: 'mortgage', 
    amount: 400000, 
    rate: 4, 
    term: 30, 
    currency: 'USD',
    customTitle: "$400,000 Mortgage at 4%: Your Complete Payment Breakdown",
    customDescription: "What is the monthly payment on a $400,000 mortgage at 4% interest? See your exact P&I payment, full PITI breakdown, total interest cost, income requirements, and how this compares to current 2026 rates.",
    customH1: "$400,000 Mortgage at 4%: Your Complete Payment Breakdown",
    customIntro: "A $400,000 mortgage at 4% represents one of the most financially favorable loan scenarios available — either locked in during the low-rate era of 2020–2021 or a potential future scenario if rates fall significantly from their 2026 levels. This page gives you the exact monthly payment at every term, a full PITI breakdown, the income needed to qualify, and a direct comparison to what the same loan costs at current 2026 rates — showing exactly how much the rate environment affects your total cost. Use the <a href='/mortgage-calculator'>mortgage calculator</a> above to adjust for your specific situation.",
    customContent: `
      <h2>Monthly Payment on a $400,000 Mortgage at 4%</h2>
      <p>A lower interest rate dramatically reduces your monthly commitment. Here is how a $400,000 loan at a 4% fixed rate breaks down across different common terms:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Loan Term</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly P&I</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">10 years</td><td class="py-3 px-4 text-sm">$4,041</td><td class="py-3 px-4 text-sm">$84,920</td><td class="py-3 px-4 text-sm">$484,920</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">15 years</td><td class="py-3 px-4 text-sm">$2,959</td><td class="py-3 px-4 text-sm">$132,620</td><td class="py-3 px-4 text-sm">$532,620</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">20 years</td><td class="py-3 px-4 text-sm">$2,424</td><td class="py-3 px-4 text-sm">$181,760</td><td class="py-3 px-4 text-sm">$581,760</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">25 years</td><td class="py-3 px-4 text-sm">$2,112</td><td class="py-3 px-4 text-sm">$233,600</td><td class="py-3 px-4 text-sm">$633,600</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">30 years</td><td class="py-3 px-4 text-sm">$1,910</td><td class="py-3 px-4 text-sm">$287,480</td><td class="py-3 px-4 text-sm">$687,480</td></tr>
          </tbody>
        </table>
      </div>

      <p>At 4% over 30 years the monthly principal and interest payment is $1,910 — and the total interest paid over the life of the loan is $287,480. Compared to the same loan at 6.8%, this saves $253,920 in total interest and $605/month — illustrating exactly why the rate environment matters so much. Review the complete year-by-year breakdown on our <a href="/amortization-schedule">amortization schedule</a>.</p>

      <h2>Full Monthly Cost Including Taxes and Insurance (PITI)</h2>
      <p>To understand your total monthly check to the lender, you must account for taxes and insurance. Here is a realistic breakdown for a $445,000 home purchase with 10% down ($45,000), resulting in a $400,000 loan at 4% over 30 years:</p>
      
      <ul>
        <li><strong>Principal and Interest:</strong> $1,910</li>
        <li><strong>Property Tax (1.1%/yr):</strong> $407</li>
        <li><strong>Homeowners Insurance:</strong> $140</li>
        <li><strong>Private Mortgage Insurance (PMI):</strong> $167</li>
        <li><strong>Total Monthly Payment:</strong> $2,624</li>
      </ul>

      <p>Private Mortgage Insurance (PMI) typically cancels once you reach 20% equity under the <a href="https://www.consumerfinance.gov" target="_blank" rel="noopener noreferrer">Consumer Financial Protection Bureau</a> (CFPB) rules. Once cancelled, your total cost drops to approximately $2,457. Because interest costs are lower at 4%, your equity builds significantly faster than it would at higher rates. To see your specific scenario, check our <a href="/mortgage-calculator">mortgage calculator</a> for a personalised PITI breakdown.</p>

      <h2>What Income Do You Need for a $400,000 Mortgage at 4%?</h2>
      <p>Using the gold-standard 28% rule, here is the annual income required to qualify for a <strong>$400000 mortgage monthly payment 4 percent</strong> scenario:</p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Payment Scenario</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Cost</th>
              <th class="py-3 px-4 font-bold text-sm">Required Annual Income</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td>P&I only</td><td>$1,910</td><td>~$81,857</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td>Full PITI (example)</td><td>$2,624</td><td>~$112,457</td></tr>
            <tr class="border-b border-outline-variant/30"><td>With $500 other debts</td><td>$3,124</td><td>~$133,886</td></tr>
          </tbody>
        </table>
      </div>
      <p>A $400,000 mortgage at 4% is significantly more accessible than the same loan at current 2026 rates of 6.8%, which requires a household income of $108,000–$160,000. You can confirm your own buying power with our <a href="/affordability-calculator">affordability calculator</a>.</p>

      <h2>4% vs. Current Rates: The Full Cost Comparison</h2>
      <p>This comparison shows exactly why the low-rate environment of previous years was so powerful. Here is the cost difference on a $400,000 loan over 30 years compared to recent benchmarks:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Interest Rate</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly P&I</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Difference</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Extra Cost vs 4%</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td>4.0%</td><td>$1,910</td><td>—</td><td>$287,480</td><td>—</td></tr>
            <tr class="border-b border-outline-variant/30"><td>5.0%</td><td>$2,147</td><td>+$237/month</td><td>$372,920</td><td>+$85,440</td></tr>
            <tr class="border-b border-outline-variant/30"><td>5.5%</td><td>$2,271</td><td>+$361/month</td><td>$417,560</td><td>+$130,080</td></tr>
            <tr class="border-b border-outline-variant/30"><td>6.0%</td><td>$2,398</td><td>+$488/month</td><td>$463,280</td><td>+$175,800</td></tr>
            <tr class="border-b border-outline-variant/30"><td>6.5%</td><td>$2,528</td><td>+$618/month</td><td>$510,080</td><td>+$222,600</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5 font-bold"><td>6.8%</td><td>$2,615</td><td>+$705/month</td><td>$541,400</td><td>+$253,920</td></tr>
            <tr class="border-b border-outline-variant/30"><td>7.0%</td><td>$2,661</td><td>+$751/month</td><td>$557,960</td><td>+$270,480</td></tr>
          </tbody>
        </table>
      </div>

      <p>Borrowers with a 4% rate are paying significantly less than current market participants. For buyers today, this data reinforces the importance of using a <a href="/refinancing-calculator">refinancing calculator</a> to identify exactly when a future rate drop makes a refinance profitable. Read more on <a href="/blog/when-to-refinance">when refinancing makes sense</a> and <a href="/blog/interest-rate-impact">how your rate affects total cost</a>.</p>

      <h2>Run Your Personalised Scenario</h2>
      <p>Whether you are comparing a historical rate or planning for the future, use the mortgage calculator above to run your specific numbers. Also, compare this scenario to a <a href="/calculator/400k-mortgage-monthly-payment-6-5-percent">$400,000 mortgage at 6.5%</a>, a <a href="/calculator/300k-mortgage-monthly-payment-6-percent">$300,000 mortgage at 6%</a>, or a <a href="/calculator/500k-mortgage-monthly-payment-7-percent">$500,000 mortgage at 7%</a>. For those torn between terms, see our <a href="/blog/15-vs-30-year-mortgage">15-year vs 30-year mortgage comparison</a>.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white text-center shadow-xl">
          <h3 class="text-xl font-bold mb-4">Mortgage Calculator</h3>
          <p class="mb-6 opacity-90 text-sm italic">Model any rate scenario.</p>
          <a href="/mortgage-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Calculate Now →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant text-center shadow-sm">
          <h3 class="text-xl font-bold mb-4">Refinance Planning</h3>
          <p class="mb-6 opacity-70 text-sm">Calculate your savings.</p>
          <a href="/refinancing-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Refinance Calculator →</a>
        </div>
      </div>
    `,
    customFaqs: [
      {
        question: "What is the monthly payment on a $400,000 mortgage at 4%?",
        answer: "The monthly principal and interest payment is $1,910 for a 30-year fixed term. When including property taxes and insurance, the total **$400000 mortgage monthly payment 4 percent** typically comes to around $2,624."
      },
      {
        question: "How much do I save with a 4% rate vs a 7% rate on a $400,000 mortgage?",
        answer: "A 4% rate saves you roughly $751 per month in principal and interest compared to a 7% rate. Over 30 years, this results in a staggering $270,480 in interest savings."
      },
      {
        question: "What income do I need for a $400,000 mortgage at 4%?",
        answer: "To qualify comfortably, you typically need a gross annual household income between $82,000 and $112,000, assuming you have moderate down payment and minimal other monthly debts."
      },
      {
        question: "Can I still get a 4% mortgage rate in 2026?",
        answer: "While 4% is significantly lower than current 2026 market benchmarks, it remains a common target for refinancing if the economy shifts. Review **Federal Reserve Economic Data** (FRED) to see where today's national averages sit."
      }
    ]
  },

  // Loans USD
  { slug: '10k-personal-loan-repayment-10-percent', type: 'loan', amount: 10000, rate: 10, term: 5, currency: 'USD' },
  { slug: '25k-personal-loan-repayment-8-percent', type: 'loan', amount: 25000, rate: 8, term: 5, currency: 'USD' },

  // Affordability
  { slug: 'how-much-house-can-i-afford-100k-salary', type: 'affordability', amount: 0, rate: 7, term: 30, currency: 'USD', salary: 100000 },
];

function getSimpleHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}



export function getPSEOContent(params: PSEOParams, targetCurrency?: 'USD' | 'EUR') {
  const currency = targetCurrency || params.currency;
  const amount = convertCurrency(params.amount, params.currency, currency);
  const salary = params.salary ? convertCurrency(params.salary, params.currency, currency) : undefined;
  
  const symbol = currency === 'USD' ? '$' : '€';
  const formattedAmount = `${symbol}${Math.round(amount).toLocaleString()}`;
  const formattedSalary = salary ? `${symbol}${Math.round(salary).toLocaleString()}` : '';

  const hash = getSimpleHash(params.slug);
  const variantIdx = hash % 3;

  const phrasing = {
    mortgage: [
      {
        h1: `What is the Monthly Payment on a ${formattedAmount} Mortgage?`,
        intro: `Thinking about a ${formattedAmount} home loan? At a ${params.rate}% interest rate over ${params.term} years, your monthly commitment for principal and interest will be a key deciding factor.`,
      },
      {
        h1: `${formattedAmount} Mortgage: Monthly Payment Breakdown`,
        intro: `If you're eyeing a house with a ${formattedAmount} price tag and have secured a ${params.rate}% rate, you need to know your exact monthly overhead. Here is how the math works for your ${params.term}-year term.`,
      },
      {
        h1: `Monthly Payment for ${formattedAmount} at ${params.rate}% Interest`,
        intro: `Securing a ${formattedAmount} mortgage is a massive milestone. But before you sign, let's look at the monthly principal and interest requirements for a ${params.term}-year fixed-rate loan.`,
      }
    ],
    loan: [
      {
        h1: `Monthly Repayment for a ${formattedAmount} Personal Loan`,
        intro: `Borrowing ${formattedAmount} at ${params.rate}% APR? Whether it's for consolidation or a major purchase, knowing your monthly installment is critical for a healthy budget.`,
      },
      {
        h1: `How Much is the Monthly Bill for a ${formattedAmount} Loan?`,
        intro: `A ${formattedAmount} personal loan with a ${params.term}-year term at ${params.rate}% APR carries a specific monthly weight. Let's break down the repayment schedule.`,
      },
      {
        h1: `${formattedAmount} Loan: Monthly Installment Guide`,
        intro: `Ready to take on a ${formattedAmount} loan? At ${params.rate}% interest, your fixed monthly payment ensures you can plan ahead without surprises.`,
      }
    ],
    affordability: [
      {
        h1: `Mortgage Affordability for a ${formattedSalary} Income`,
        intro: `Earning ${formattedSalary} annually puts you in a strong position. But what does that mean for your homebuying power in today's ${params.rate}% rate environment?`,
      },
      {
        h1: `How Much House Can I Buy with a ${formattedSalary} Salary?`,
        intro: `With a gross annual income of ${formattedSalary}, your monthly housing budget can vary significantly. Let's see what a lender might approve at ${params.rate}% interest.`,
      },
      {
        h1: `Budgeting for a Home on ${formattedSalary} a Year`,
        intro: `Financial experts suggest keeping your housing costs below 28% of your gross income. If you earn ${formattedSalary}, here is your estimated affordability limit.`,
      }
    ]
  };

  const selectedPhrasing = phrasing[params.type][variantIdx];

  const tips = {
    mortgage: [
      "Aim for a 20% down payment to avoid Private Mortgage Insurance (PMI).",
      "Check your credit score 6 months before applying to secure the best rates.",
      "Consider a 15-year term if you want to save massively on total interest.",
      "Don't forget to budget for closing costs, usually 2-5% of the home price."
    ],
    loan: [
      "Look for loans with no prepayment penalties to save on interest by paying early.",
      "Compare APRs, not just interest rates, to see the true cost including fees.",
      "Keep your total debt payments below 36% of your gross monthly income.",
      "Automate your payments to avoid late fees and protect your credit score."
    ],
    affordability: [
      "Use the 28/36 rule: House costs < 28% and total debt < 36% of income.",
      "Pre-approval is not a guarantee; keep your spending stable before closing.",
      "Budget for 'hidden' costs like maintenance, which is roughly 1% of home value annually.",
      "Lenders care about your Debt-to-Income (DTI) ratio more than almost anything else."
    ]
  };

  const relatedBlog = {
    mortgage: { title: "How to Calculate Mortgage Payments", href: "/blog/mortgage-payment-guide" },
    loan: { title: "The Power of Compound Interest", href: "/blog/compound-interest-explained" },
    affordability: { title: "Understanding Debt-to-Income Ratio", href: "/blog/debt-to-income-ratio" }
  }[params.type];

  const similarPages = pseoData
    .filter(p => p.type === params.type && p.slug !== params.slug)
    .slice(0, 2)
    .map(p => {
      const pAmount = convertCurrency(p.amount, p.currency, currency);
      const pSalary = p.salary ? convertCurrency(p.salary, p.currency, currency) : undefined;
      return {
        title: p.type === 'affordability' 
          ? `${symbol}${Math.round(pSalary || 0).toLocaleString()} Salary Affordability`
          : `${symbol}${Math.round(pAmount).toLocaleString()} ${p.type === 'mortgage' ? 'Mortgage' : 'Loan'}`,
        href: `/calculator/${p.slug}`
      };
    });

  return {
    title: params.customTitle || (params.type === 'affordability' 
      ? `How Much House Can I Afford with a ${formattedSalary} Salary?`
      : `${formattedAmount} ${params.type === 'mortgage' ? 'Mortgage' : 'Loan'} Monthly Payment at ${params.rate}%`),
    h1: params.customH1 || selectedPhrasing.h1,
    description: params.customDescription || `Detailed calculation for a ${formattedAmount} ${params.type} at ${params.rate}% interest. See monthly payments, total cost, and expert tips.`,
    intro: params.customIntro || selectedPhrasing.intro,
    body: params.customContent,
    tips: tips[params.type],
    relatedBlog,
    similarPages,
    faqs: params.customFaqs || [
      {
        question: `How much is the monthly payment for a ${formattedAmount} ${params.type}?`,
        answer: `For a ${params.term}-year term at ${params.rate}% interest, the calculation uses a standard fixed-rate formula. Monthly costs depend heavily on the interest rate and term length.`
      },
      {
        question: `Can I lower my ${params.type} payments?`,
        answer: `Potentially. Strategies include putting more money down, securing a lower rate through better credit, or choosing a longer repayment term.`
      }
    ]
  };
}
