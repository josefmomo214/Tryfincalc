import {
  affordabilityTable,
  affordabilityValue,
  amortizationValue,
  downPaymentTable,
  loanTable,
  loanValue,
  type AffordabilityTableRow,
} from './content-calculations';
import { calculateLoan, convertCurrency, formatCurrency } from "./finance";
import { canonicalScenarioPath } from './route-registry';
import {
  assertPseoPublicationInventory,
  getPseoEditorialDecision,
  getPseoEditorialStatus,
} from './pseo-publication';

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
  scenarioQuestion?: string;
  directAnswer?: string;
  calculatorDescription?: string;
  affordabilityInputs?: {
    monthlyIncome: number;
    monthlyDebts: number;
    downPayment: number;
    monthlyPropertyTax: number;
    monthlyInsurance: number;
  };
  showPrefilledCalculator?: boolean;
  substantiveModified?: string;
}

export interface ComparisonScenario {
  label: string;
  rate: number;
  payment: number;
  difference: number;
}

function euroScenarioFaqs(amount: number) {
  const formattedAmount = formatCurrency(amount, 0, 'EUR');
  const monthlyPayment = formatCurrency(calculateLoan(amount, 3.5, 25).monthly, 2, 'EUR');
  return [
    {
      question: `What is the monthly payment on a ${formattedAmount} mortgage at 3.5% over 25 years?`,
      answer: `The estimated principal-and-interest payment is ${monthlyPayment} per month. The 3.5% rate and 25-year term are editable scenario assumptions.`,
    },
    {
      question: 'Does this estimate include local property costs?',
      answer: 'No. Taxes, registration or notary fees, insurance, subsidies, and other costs vary by jurisdiction and are excluded unless entered separately.',
    },
    {
      question: 'Does this page estimate mortgage approval?',
      answer: 'No. Any income ratio shown is an illustrative stress-test assumption. Approval and affordability rules vary by country, lender, loan product, and borrower.',
    },
    {
      question: 'What market does this euro scenario cover?',
      answer: 'It is a euro-denominated mathematical example rather than country-specific mortgage guidance. Use a local quote and local cost inputs for a real decision.',
    },
  ];
}

const affordability80kBase: AffordabilityTableRow = {
  label: 'Selected example',
  monthlyIncome: 80000 / 12,
  monthlyDebts: 0,
  downPayment: 25000,
  rate: 6.8,
  years: 30,
  monthlyPropertyTax: 225,
  monthlyInsurance: 100,
};

const affordability80kSensitivity: AffordabilityTableRow[] = [
  affordability80kBase,
  { ...affordability80kBase, label: '$800 monthly debt', monthlyDebts: 800 },
  { ...affordability80kBase, label: '$50,000 down payment', downPayment: 50000 },
  { ...affordability80kBase, label: '7.8% example rate', rate: 7.8 },
  { ...affordability80kBase, label: '$325 monthly property tax', monthlyPropertyTax: 325 },
  { ...affordability80kBase, label: '$175 monthly property insurance', monthlyInsurance: 175 },
];

const basePseoData: PSEOParams[] = [
  // Mortgages USD
  {
    slug: '300k-mortgage-monthly-payment-6-percent',
    type: 'mortgage',
    amount: 300000,
    rate: 6,
    term: 30,
    currency: 'USD',
    showPrefilledCalculator: true,
    customTitle: '$300,000 Mortgage at 6%: Payment and First-Month Interest',
    customDescription: 'A $300,000 mortgage principal at a 6% example annual rate over 30 years: exact payment, first-month interest, total cost, and an editable calculator.',
    customH1: '$300,000 Mortgage at 6%: Payment and Amortization',
    customIntro: 'This U.S.-dollar mathematical scenario starts with a $300,000 home price and no down payment, so the loan principal is also $300,000. It applies a selected 6% nominal annual interest rate over 30 years. Property tax, insurance, mortgage insurance, association dues, maintenance, closing costs, and lender fees are excluded from the headline payment.',
    scenarioQuestion: 'Why isn’t 6% charged on the original $300,000 every year?',
    directAnswer: `The estimated monthly principal-and-interest payment is ${loanValue(300000, 6, 30, 'monthly')}. The first scheduled payment contains ${amortizationValue(300000, 6, 30, 0, 'interest')} of interest and ${amortizationValue(300000, 6, 30, 0, 'principal')} of principal because interest is charged on the outstanding balance, which declines after each payment.`,
    calculatorDescription: 'The initial home price and loan principal are both $300,000 because the selected down payment is $0. Edit the price, down payment, annual rate, term, tax, insurance, or other property fees to recalculate.',
    customContent: `
      <h2>6% is an annual rate on a declining balance, not a flat yearly charge</h2>
      <p>The selected 6% nominal annual rate is divided into a ${(6 / 12).toFixed(1)}% monthly rate for this calculation. Each month, that rate is applied to the remaining principal. The payment stays level in this fixed-rate example, but its composition changes: interest falls as the balance falls, while the principal share rises.</p>
      <p>On the first scheduled payment, interest is <strong>${amortizationValue(300000, 6, 30, 0, 'interest')}</strong>, principal repayment is <strong>${amortizationValue(300000, 6, 30, 0, 'principal')}</strong>, and the remaining balance is <strong>${amortizationValue(300000, 6, 30, 0, 'balance')}</strong>. The second month's interest is lower at <strong>${amortizationValue(300000, 6, 30, 1, 'interest')}</strong> because it is calculated on that smaller balance.</p>

      <h2>What changes if you choose 15 years instead of 30?</h2>
      <p>The comparison holds the ${formatCurrency(300000, 0)} principal and 6% selected annual rate constant. A shorter term raises the scheduled payment but reduces the number of interest-bearing months. Every result comes from the same amortization function as the editable calculator.</p>
      <div class="overflow-x-auto my-8 border border-outline-variant/30 rounded-2xl">
        ${loanTable(300000, [6], [15, 30])}
      </div>
      <p>At 30 years, total scheduled interest is <strong>${loanValue(300000, 6, 30, 'totalInterest')}</strong>. At 15 years it is <strong>${loanValue(300000, 6, 15, 'totalInterest')}</strong>. Whether the higher 15-year payment fits is a cash-flow decision, not a claim that one term is universally preferable.</p>

      <h2>What the estimate includes and excludes</h2>
      <p>The payment and comparison include only repayment of the stated loan principal and interest under equal end-of-month payments. They exclude property tax, insurance, mortgage insurance, association dues, maintenance, closing costs, discount points, and other lender fees. Add documented costs in the calculator before using the result as a housing budget.</p>
      <p>When comparing written offers, hold the loan principal, term, lock period, and points constant. The selected 6% note rate drives this amortization result; APR can differ when fees are included.</p>
      <p>Compare this amount with the protected <a href="/calculator/400k-mortgage-monthly-payment-6-5-percent">$400,000 mortgage at 6.5% scenario</a>, or inspect the payment sequence in the <a href="/amortization-schedule">amortization schedule</a>.</p>
    `,
    customFaqs: [
      {
        question: 'What is the payment on a $300,000 mortgage at 6% over 30 years?',
        answer: `The estimated principal-and-interest payment is ${loanValue(300000, 6, 30, 'monthly')} per month. The selected home price and principal are both $300,000 because the initial down payment is zero.`,
      },
      {
        question: 'How much of the first payment is interest?',
        answer: `The first scheduled payment contains ${amortizationValue(300000, 6, 30, 0, 'interest')} of interest and ${amortizationValue(300000, 6, 30, 0, 'principal')} of principal. Later interest is calculated on the declining balance.`,
      },
      {
        question: 'How much total interest does the 30-year example produce?',
        answer: `The amortization calculation produces ${loanValue(300000, 6, 30, 'totalInterest')} of scheduled interest if the loan runs for all 360 payments.`,
      },
      {
        question: 'Does the result include ownership costs or lender fees?',
        answer: 'No. Property tax, insurance, mortgage insurance, association dues, maintenance, closing costs, points, and lender fees are excluded unless entered separately.',
      },
    ],
  },
  {
    slug: '400k-mortgage-monthly-payment-6-5-percent',
    type: 'mortgage',
    amount: 400000,
    rate: 6.5,
    term: 30,
    currency: 'USD',
    showPrefilledCalculator: true,
    substantiveModified: '2026-09-21',
    customTitle: '$400,000 Mortgage at 6.5%: Monthly Payment and Interest',
    customDescription: `A $400,000 mortgage at a 6.5% example rate costs ${loanValue(400000, 6.5, 30, 'monthly')} per month in principal and interest. See total interest, assumptions, and rate sensitivity.`,
    customH1: '$400,000 Mortgage Payment at 6.5%',
    customIntro: `A $400,000 fixed-rate mortgage at a 6.5% example annual interest rate over 30 years has an estimated principal-and-interest payment of <strong>${loanValue(400000, 6.5, 30, 'monthly')}</strong> per month. Total interest is <strong>${loanValue(400000, 6.5, 30, 'totalInterest')}</strong> if the loan runs for the full term. The rate is an editable scenario input, not a statement about available mortgage rates.`,
    customContent: `
      <h2>Exact payment for the 400k mortgage scenario</h2>
      <p>The shared TryFinCalc amortization function calculates a monthly principal-and-interest payment of <strong>${loanValue(400000, 6.5, 30, 'monthly')}</strong>. Across 360 scheduled payments, the estimated total paid is <strong>${loanValue(400000, 6.5, 30, 'totalPaid')}</strong>, including <strong>${loanValue(400000, 6.5, 30, 'totalInterest')}</strong> of interest.</p>

      <h2>Why the payment is not $400,000 divided by 360</h2>
      <p>A fixed-rate mortgage payment covers both interest on the outstanding balance and repayment of principal. The monthly rate is 6.5% divided by 12, and the balance changes after every payment. Dividing $400,000 by 360 would account for principal only; multiplying $400,000 by 6.5% would describe first-year simple interest rather than an amortized monthly payment.</p>

      <h2>Rate and term sensitivity</h2>
      <p>The table uses the same $400,000 principal with selected example rates and terms. It excludes property tax, homeowners insurance, mortgage insurance, HOA dues, closing costs, maintenance, and lender fees.</p>
      <div class="overflow-x-auto my-8 border border-outline-variant/30 rounded-2xl">
        ${loanTable(400000, [5.5, 6, 6.5, 7, 7.5], [15, 30])}
      </div>

      <h2>How to use this estimate</h2>
      <p>The $400,000 headline amount is the loan principal, not necessarily the property price. A down payment on a higher-priced property can produce the same financed principal, so compare the upfront cash separately from the monthly loan payment.</p>
      <p>Use the prefilled calculator to replace the home price, down payment, rate, term, tax, insurance, and HOA assumptions. Compare the result with the <a href="/calculator/300k-mortgage-monthly-payment-6-percent">$300,000 mortgage at 6% scenario</a>, review the broader <a href="/blog/mortgage-payment-guide">mortgage payment guide</a>, or generate a full <a href="/amortization-schedule">amortization schedule</a>.</p>
    `,
    customFaqs: [
      {
        question: 'What is the monthly payment on a $400,000 mortgage at 6.5%?',
        answer: `The estimated principal-and-interest payment is ${loanValue(400000, 6.5, 30, 'monthly')} per month for a 30-year fixed-rate loan.`,
      },
      {
        question: 'How much interest does a $400,000 mortgage at 6.5% cost?',
        answer: `The estimated total interest is ${loanValue(400000, 6.5, 30, 'totalInterest')} across 360 scheduled payments when the loan runs for the full term.`,
      },
      {
        question: 'Does the payment include tax, insurance, or PMI?',
        answer: 'No. The headline result is principal and interest only. Property tax, insurance, mortgage insurance, HOA dues, fees, and maintenance are excluded unless you add them to the calculator.',
      },
      {
        question: 'Is 6.5% presented as an available mortgage rate?',
        answer: 'No. It is an editable example assumption used to show amortization and sensitivity. Use a written lender quote for an available rate and fees.',
      },
    ],
  },
  {
    slug: '350k-mortgage-monthly-payment-6-5-percent',
    type: 'mortgage',
    amount: 350000,
    rate: 6.5,
    term: 30,
    currency: 'USD',
    customTitle: "$350,000 Mortgage at 6.5%: Your Complete Payment Breakdown",
    customDescription: "What is the monthly payment on a $350,000 mortgage at a 6.5% example rate? See P&I, editable housing-cost assumptions, and rate sensitivity.",
    customH1: "$350,000 Mortgage at 6.5%: Your Complete Payment Breakdown",
    customIntro: "This illustrative scenario models a $350,000 mortgage at a 6.5% example annual interest rate. It shows payments by term, editable estimates for taxes and insurance, and rate sensitivity. The rate and added costs are calculator assumptions rather than market averages. Use the <a href='/mortgage-calculator'>mortgage calculator</a> above to model your own rate, down payment, term, taxes, and insurance.",
    customContent: `
      <h2>Monthly Payment on a $350,000 Mortgage at 6.5%</h2>
      <p>Here is how a $350,000 loan at a fixed 6.5% rate breaks down across every common repayment term:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Loan Term</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly P&amp;I</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">10 years</td><td class="py-3 px-4 text-sm">$3,976</td><td class="py-3 px-4 text-sm">$127,120</td><td class="py-3 px-4 text-sm">$477,120</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">15 years</td><td class="py-3 px-4 text-sm">$3,049</td><td class="py-3 px-4 text-sm">$198,820</td><td class="py-3 px-4 text-sm">$548,820</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">20 years</td><td class="py-3 px-4 text-sm">$2,611</td><td class="py-3 px-4 text-sm">$276,640</td><td class="py-3 px-4 text-sm">$626,640</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">25 years</td><td class="py-3 px-4 text-sm">$2,363</td><td class="py-3 px-4 text-sm">$358,900</td><td class="py-3 px-4 text-sm">$708,900</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">30 years</td><td class="py-3 px-4 text-sm">$2,212</td><td class="py-3 px-4 text-sm">$446,320</td><td class="py-3 px-4 text-sm">$796,320</td></tr>
          </tbody>
        </table>
      </div>

      <p>At 6.5% over 30 years the monthly P&amp;I is $2,212. Choosing a 15-year term saves $247,500 in interest but adds $837/month to your payment. See the full equity schedule on our <a href="/amortization-schedule">amortization schedule</a>.</p>

      <h2>Full Monthly Cost Including Taxes and Insurance (PITI)</h2>
      <p>Here is an illustrative cost breakdown using selected tax, insurance, and mortgage-insurance inputs for a $389,000 home purchase with 10% down ($39,000), resulting in a $350,000 loan at the 6.5% example rate over 30 years:</p>
      <ul>
        <li><strong>Principal and Interest:</strong> $2,212</li>
        <li><strong>Property Tax (1.1%/yr):</strong> $357</li>
        <li><strong>Homeowners Insurance:</strong> $127</li>
        <li><strong>PMI (~0.5%):</strong> $146</li>
        <li><strong>Total Monthly Payment:</strong> $2,842</li>
      </ul>
      <p>The $146 mortgage-insurance amount is an editable example assumption. Actual premiums and cancellation rules depend on the loan and lender. Property taxes and homeowners insurance vary by property and location; use the <a href="/mortgage-calculator">mortgage calculator</a> to replace these estimates. Read our <a href="/blog/down-payment-guide">down payment guide</a> for more context.</p>

      <h2>What Income Do You Need for a $350,000 Mortgage at 6.5%?</h2>
      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Payment Scenario</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Cost</th>
              <th class="py-3 px-4 font-bold text-sm">Illustrative Annual Income</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">P&amp;I only</td><td class="py-3 px-4 text-sm">$2,212</td><td class="py-3 px-4 text-sm">~$94,800</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">Full PITI (example)</td><td class="py-3 px-4 text-sm">$2,842</td><td class="py-3 px-4 text-sm">~$121,800</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">With $400 other debts</td><td class="py-3 px-4 text-sm">$3,242</td><td class="py-3 px-4 text-sm">~$138,943</td></tr>
          </tbody>
        </table>
      </div>
      <p>The $95,000–$139,000 range follows the illustrative ratios and costs shown here. It is not an approval estimate, and lender requirements vary. Dial in your own assumptions with our <a href="/affordability-calculator">affordability calculator</a>.</p>

      <h2>Rate Sensitivity: $350,000 Mortgage Over 30 Years</h2>
      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Interest Rate</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly P&amp;I</th>
              <th class="py-3 px-4 font-bold text-sm">Difference vs 6.5%</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">5.0%</td><td class="py-3 px-4 text-sm">$1,880</td><td class="py-3 px-4 text-sm">−$332/month</td><td class="py-3 px-4 text-sm">$326,800</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">5.5%</td><td class="py-3 px-4 text-sm">$1,988</td><td class="py-3 px-4 text-sm">−$224/month</td><td class="py-3 px-4 text-sm">$365,680</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">6.0%</td><td class="py-3 px-4 text-sm">$2,100</td><td class="py-3 px-4 text-sm">−$112/month</td><td class="py-3 px-4 text-sm">$406,000</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">6.5%</td><td class="py-3 px-4 text-sm">$2,212</td><td class="py-3 px-4 text-sm">-</td><td class="py-3 px-4 text-sm">$446,320</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">7.0%</td><td class="py-3 px-4 text-sm">$2,328</td><td class="py-3 px-4 text-sm">+$116/month</td><td class="py-3 px-4 text-sm">$488,080</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">7.5%</td><td class="py-3 px-4 text-sm">$2,447</td><td class="py-3 px-4 text-sm">+$235/month</td><td class="py-3 px-4 text-sm">$530,920</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5"><td class="py-3 px-4 text-sm">8.0%</td><td class="py-3 px-4 text-sm">$2,569</td><td class="py-3 px-4 text-sm">+$357/month</td><td class="py-3 px-4 text-sm">$574,840</td></tr>
          </tbody>
        </table>
      </div>
      <p>Within the displayed scenarios, changing the rate by 1.5 percentage points changes lifetime interest by $119,520. Use the <a href="/refinancing-calculator">refinancing calculator</a> to test a quoted rate and closing costs. Compare to a <a href="/calculator/400k-mortgage-monthly-payment-4-percent">$400,000 mortgage at a 4% example rate</a>.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white text-center shadow-xl">
          <h3 class="text-xl font-bold mb-4">Mortgage Calculator</h3>
          <p class="mb-6 opacity-90 text-sm">Adjust rate, term, and down payment.</p>
          <a href="/mortgage-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Calculate Now →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant text-center shadow-sm">
          <h3 class="text-xl font-bold mb-4">Affordability Check</h3>
          <p class="mb-6 opacity-70 text-sm">Confirm this loan fits your income.</p>
          <a href="/affordability-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Check Affordability →</a>
        </div>
      </div>

      <h2>How $350k Compares to Nearby Loan Amounts</h2>
      <p>A $350,000 loan sits squarely between two other common loan sizes on this site. Here's how the monthly payment and total interest compare at the same 6.5% rate over a 30-year term, calculated straight from the same amortization formula used above:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Loan Amount</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly P&amp;I</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">$300,000</td><td class="py-3 px-4 text-sm">$1,896</td><td class="py-3 px-4 text-sm">$382,633</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">$350,000</td><td class="py-3 px-4 text-sm">$2,212</td><td class="py-3 px-4 text-sm">$446,406</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">$400,000</td><td class="py-3 px-4 text-sm">${loanValue(400000,6.5,30,'monthly')}</td><td class="py-3 px-4 text-sm">${loanValue(400000,6.5,30,'totalInterest')}</td></tr>
          </tbody>
        </table>
      </div>

      <p>Each additional $50,000 borrowed adds roughly $316/month and about $64,000 in lifetime interest at this example rate. An illustrative 28% housing-cost assumption produces annual-income figures of about $94,810 for the $350,000 payment and $108,355 for the $400,000 payment. These are planning comparisons rather than lender limits; actual underwriting varies. Compare the full breakdown for a <a href="/calculator/300k-mortgage-monthly-payment-6-percent">$300,000 mortgage</a> or a <a href="/calculator/400k-mortgage-monthly-payment-4-percent">$400,000 mortgage</a>.</p>
    `,
    customFaqs: [
      {
        question: "What is the monthly payment on a $350,000 mortgage at 6.5%?",
        answer: "The monthly principal and interest payment is $2,212 on a 30-year fixed term. Including taxes, insurance, and PMI the total PITI is approximately $2,842 for a buyer purchasing a $389,000 home with 10% down."
      },
      {
        question: "What income do I need for a $350,000 mortgage at 6.5%?",
        answer: "Using the page's selected 28% housing-cost assumption produces about $95,000–$122,000 in illustrative gross annual income. Adding $400 in other monthly debts changes the scenario to roughly $139,000. These are planning outputs, not approval requirements."
      },
      {
        question: "How much total interest do I pay on a $350,000 mortgage at 6.5%?",
        answer: "Over 30 years you will pay $446,320 in total interest. Choosing a 15-year term reduces that to $198,820 (a saving of $247,500) but the monthly payment rises by $837."
      },
      {
        question: "What does the $350,000 example represent?",
        answer: "The page models a $350,000 loan amount without claiming that it is common in a particular market. Compare the payment with current property prices, local costs, and a written loan quote for the area you are considering."
      }
    ]
  },
  {
    slug: '700k-mortgage-monthly-payment-7-percent',
    type: 'mortgage',
    amount: 700000,
    rate: 7,
    term: 30,
    currency: 'USD',
    customTitle: "$700,000 Mortgage at 7%: Your Complete Payment Breakdown",
    customDescription: "What is the monthly payment on a $700,000 mortgage at a 7% example rate? See P&I, editable cost inputs, illustrative income scenarios, and rate sensitivity.",
    customH1: "$700,000 Mortgage at 7%: Your Complete Payment Breakdown",
    customIntro: "This illustrative scenario models a $700,000 mortgage at a 7% example annual interest rate. It shows payments by term, editable estimates for taxes and insurance, and rate sensitivity. It does not estimate approval or describe a universal borrower profile. Use the <a href='/mortgage-calculator'>mortgage calculator</a> to model your own rate, down payment, term, taxes, and insurance.",
    customContent: `
      <h2>Monthly Payment on a $700,000 Mortgage at 7%</h2>
      <p>Here is how a $700,000 loan at a fixed 7% rate breaks down across every common repayment term:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Loan Term</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly P&amp;I</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">10 years</td><td class="py-3 px-4 text-sm">$8,127</td><td class="py-3 px-4 text-sm">$275,240</td><td class="py-3 px-4 text-sm">$975,240</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">15 years</td><td class="py-3 px-4 text-sm">$6,286</td><td class="py-3 px-4 text-sm">$431,480</td><td class="py-3 px-4 text-sm">$1,131,480</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">20 years</td><td class="py-3 px-4 text-sm">$5,425</td><td class="py-3 px-4 text-sm">$602,000</td><td class="py-3 px-4 text-sm">$1,302,000</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">25 years</td><td class="py-3 px-4 text-sm">$4,949</td><td class="py-3 px-4 text-sm">$784,700</td><td class="py-3 px-4 text-sm">$1,484,700</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">30 years</td><td class="py-3 px-4 text-sm">$4,657</td><td class="py-3 px-4 text-sm">$976,520</td><td class="py-3 px-4 text-sm">$1,676,520</td></tr>
          </tbody>
        </table>
      </div>

      <p>At 7% over 30 years the monthly P&amp;I is $4,657: total interest paid is $976,520, meaning you repay $1,676,520 on a $700,000 loan. The 15-year term saves $545,040 in interest but adds $1,629/month. See the full equity schedule on our <a href="/amortization-schedule">amortization schedule</a>.</p>

      <h2>Full Monthly Cost Including Taxes and Insurance (PITI)</h2>
      <p>Here is an illustrative cost breakdown using selected tax, insurance, and mortgage-insurance inputs for a $778,000 home purchase with 10% down ($78,000), resulting in a $700,000 loan at the 7% example rate over 30 years:</p>
      <ul>
        <li><strong>Principal and Interest:</strong> $4,657</li>
        <li><strong>Property Tax (1.1%/yr):</strong> $713</li>
        <li><strong>Homeowners Insurance:</strong> $240</li>
        <li><strong>PMI (~0.5%):</strong> $292</li>
        <li><strong>Total Monthly Payment:</strong> $5,902</li>
      </ul>
      <p>The mortgage-insurance, tax, and insurance amounts are editable example assumptions. Actual premiums, cancellation rules, and local costs depend on the property, loan, and lender. Use the <a href="/mortgage-calculator">mortgage calculator</a> to replace them with quoted values.</p>

      <h2>What Income Do You Need for a $700,000 Mortgage at 7%?</h2>
      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Payment Scenario</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Cost</th>
              <th class="py-3 px-4 font-bold text-sm">Illustrative Annual Income</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">P&amp;I only</td><td class="py-3 px-4 text-sm">$4,657</td><td class="py-3 px-4 text-sm">~$199,586</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">Full PITI (example)</td><td class="py-3 px-4 text-sm">$5,902</td><td class="py-3 px-4 text-sm">~$252,943</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">With $400 other debts</td><td class="py-3 px-4 text-sm">$6,302</td><td class="py-3 px-4 text-sm">~$270,086</td></tr>
          </tbody>
        </table>
      </div>
      <p>The $200,000–$270,000 range follows only the illustrative ratios and costs shown here. It is not an approval estimate, and lender requirements vary. Change the assumptions in our <a href="/affordability-calculator">affordability calculator</a>.</p>

      <h2>Rate Sensitivity: $700,000 Mortgage Over 30 Years</h2>
      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Interest Rate</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly P&amp;I</th>
              <th class="py-3 px-4 font-bold text-sm">Difference vs 7%</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">5.0%</td><td class="py-3 px-4 text-sm">$3,759</td><td class="py-3 px-4 text-sm">−$898/month</td><td class="py-3 px-4 text-sm">$653,240</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">5.5%</td><td class="py-3 px-4 text-sm">$3,976</td><td class="py-3 px-4 text-sm">−$681/month</td><td class="py-3 px-4 text-sm">$731,360</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">6.0%</td><td class="py-3 px-4 text-sm">$4,200</td><td class="py-3 px-4 text-sm">−$457/month</td><td class="py-3 px-4 text-sm">$812,000</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">6.5%</td><td class="py-3 px-4 text-sm">$4,424</td><td class="py-3 px-4 text-sm">−$233/month</td><td class="py-3 px-4 text-sm">$892,640</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">7.0%</td><td class="py-3 px-4 text-sm">$4,657</td><td class="py-3 px-4 text-sm">-</td><td class="py-3 px-4 text-sm">$976,520</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">7.5%</td><td class="py-3 px-4 text-sm">$4,893</td><td class="py-3 px-4 text-sm">+$236/month</td><td class="py-3 px-4 text-sm">$1,061,480</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5"><td class="py-3 px-4 text-sm">8.0%</td><td class="py-3 px-4 text-sm">$5,138</td><td class="py-3 px-4 text-sm">+$481/month</td><td class="py-3 px-4 text-sm">$1,149,680</td></tr>
          </tbody>
        </table>
      </div>
      <p>A 2% rate improvement on a $700,000 loan saves $323,280 in lifetime interest. Monitor benchmarks at <a href="https://fred.stlouisfed.org" target="_blank" rel="noopener noreferrer">Federal Reserve Economic Data</a>. If rates fall after closing, use the <a href="/refinancing-calculator">refinancing calculator</a> to find your break-even. Compare to a <a href="/calculator/300k-mortgage-monthly-payment-6-percent">$300,000 mortgage at 6%</a> or a <a href="/calculator/400k-mortgage-monthly-payment-4-percent">$400,000 mortgage at 4%</a>.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white text-center shadow-xl">
          <h3 class="text-xl font-bold mb-4">Mortgage Calculator</h3>
          <p class="mb-6 opacity-90 text-sm">Adjust rate, term, and down payment.</p>
          <a href="/mortgage-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Calculate Now →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant text-center shadow-sm">
          <h3 class="text-xl font-bold mb-4">Affordability Check</h3>
          <p class="mb-6 opacity-70 text-sm">Confirm this loan fits your income.</p>
          <a href="/affordability-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Check Affordability →</a>
        </div>
      </div>

      <h2>Jumbo Loan Considerations at $700k</h2>
      <p>The <a href="https://www.fhfa.gov/news/news-release/fhfa-announces-conforming-loan-limit-values-for-2026" target="_blank" rel="noopener noreferrer">Federal Housing Finance Agency's 2026 release</a> lists a $832,750 baseline one-unit conforming loan limit for most of the U.S. and higher ceilings in designated high-cost areas. Confirm the applicable property type, location, and loan amount with the lender rather than assuming conforming status from this example.</p>
      <p>If a quoted loan exceeds the applicable conforming limit, its pricing and underwriting may differ. Credit, down-payment, reserve, and debt-to-income requirements vary by lender and loan program, so compare written loan estimates. See the <a href="/income-needed-for-a-house">$700,000 house planning scenario</a> to model the broader budget.</p>
    `,
    customFaqs: [
      {
        question: "What is the monthly payment on a $700,000 mortgage at 7%?",
        answer: "The monthly principal and interest payment is $4,657 on a 30-year fixed term. Including taxes, insurance, and PMI the total PITI is approximately $5,902 for a buyer purchasing a $778,000 home with 10% down."
      },
      {
        question: "What income do I need for a $700,000 mortgage at 7%?",
        answer: "Using the page's illustrative 28% housing-cost assumption produces about $200,000–$253,000 in annual income. Adding $400 in other monthly debts raises the example to roughly $270,000. These are scenario outputs, not approval requirements."
      },
      {
        question: "How much total interest do I pay on a $700,000 mortgage at 7%?",
        answer: "Over 30 years you will pay $976,520 in total interest, bringing the total repaid to $1,676,520. Choosing a 15-year term cuts that to $431,480 (a saving of $545,040) but raises the monthly payment by $1,629."
      },
      {
        question: "Is a $700,000 mortgage considered a jumbo loan in 2026?",
        answer: "The page links to the FHFA's 2026 conforming-loan-limit release. Whether a loan is conforming depends on the property location, unit count, loan amount, and applicable rules, so verify the limit for the specific transaction."
      }
    ]
  },
  
  // Mortgages EUR
  { 
    slug: '250k-mortgage-monthly-payment-3-5-percent', 
    type: 'mortgage', 
    amount: 250000, 
    rate: 3.5, 
    term: 30, 
    currency: 'USD',
    customTitle: "$250,000 Mortgage at 3.5%: Your Complete Payment Breakdown",
    customDescription: "What is the monthly payment on a $250,000 mortgage at a 3.5% example rate? See P&I, total interest, editable cost assumptions, and rate sensitivity.",
    customH1: "$250,000 Mortgage at 3.5%: Your Complete Payment Breakdown",
    customIntro: "This illustrative scenario models a $250,000 mortgage at a 3.5% example annual interest rate. It shows payments by term, editable estimates for taxes and insurance, and comparisons with other selected rates. The rates are inputs, not claims about available offers. Use the <a href='/mortgage-calculator'>mortgage calculator</a> above to adjust every assumption.",
    customContent: `
      <h2>Monthly Payment on a $250,000 Mortgage at 3.5%</h2>
      <p>The interest-rate input materially changes the payment. Here is how a $250,000 loan at the selected 3.5% example rate breaks down across several comparison terms:</p>

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
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">10 years</td><td class="py-3 px-4 text-sm">$2,472</td><td class="py-3 px-4 text-sm">$46,640</td><td class="py-3 px-4 text-sm">$296,640</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">15 years</td><td class="py-3 px-4 text-sm">$1,787</td><td class="py-3 px-4 text-sm">$71,660</td><td class="py-3 px-4 text-sm">$321,660</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">20 years</td><td class="py-3 px-4 text-sm">$1,449</td><td class="py-3 px-4 text-sm">$97,760</td><td class="py-3 px-4 text-sm">$347,760</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">25 years</td><td class="py-3 px-4 text-sm">$1,252</td><td class="py-3 px-4 text-sm">$125,600</td><td class="py-3 px-4 text-sm">$375,600</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">30 years</td><td class="py-3 px-4 text-sm">$1,123</td><td class="py-3 px-4 text-sm">$154,280</td><td class="py-3 px-4 text-sm">$404,280</td></tr>
          </tbody>
        </table>
      </div>

      <p>At the 3.5% example rate over 30 years, the monthly principal and interest payment is $1,123 and total interest is $154,280. Compared with a 6.8% example input, that is $838 less per month and $251,680 less total interest. See the month-by-month comparison in our <a href="/amortization-schedule">amortization schedule</a>.</p>

      <h2>Full Monthly Cost Including Taxes and Insurance (PITI)</h2>
      <p>This illustrative total adds selected tax, insurance, and mortgage-insurance inputs to principal and interest for a $278,000 home purchase with 10% down ($28,000), resulting in a $250,000 loan at the 3.5% example rate over 30 years:</p>
      
      <ul>
        <li><strong>Principal and Interest:</strong> $1,123</li>
        <li><strong>Property Tax (1.1%/yr):</strong> $255</li>
        <li><strong>Homeowners Insurance:</strong> $95</li>
        <li><strong>Private Mortgage Insurance (PMI):</strong> $104</li>
        <li><strong>Total Monthly Payment:</strong> $1,577</li>
      </ul>

      <p>The mortgage-insurance amount is an editable example assumption. Actual premiums and cancellation rules depend on the loan and lender. Use our <a href="/mortgage-calculator">mortgage calculator</a> to replace the tax, insurance, and rate assumptions, and see our <a href="/blog/down-payment-guide">down payment guide</a> for more context.</p>

      <h2>What Income Do You Need for a $250,000 Mortgage at 3.5%?</h2>
      <p>This illustrative affordability check uses a selected debt-to-income assumption. It is a planning scenario rather than a lender approval rule.</p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Payment Scenario</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Cost</th>
              <th class="py-3 px-4 font-bold text-sm">Illustrative Annual Income</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td>P&I only</td><td>$1,123</td><td>~$48,129</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td>Full PITI (example)</td><td>$1,577</td><td>~$67,586</td></tr>
            <tr class="border-b border-outline-variant/30"><td>With $300 other debts</td><td>$1,877</td><td>~$80,443</td></tr>
          </tbody>
        </table>
      </div>
      <p>Within these assumptions, a 3.5% input produces a lower payment than the 6.8% comparison input. The displayed income figures are illustrative and do not predict approval. Change the inputs in our <a href="/affordability-calculator">affordability calculator</a> or read about <a href="/blog/how-much-house-can-i-afford">how much house you can afford</a>.</p>

      <h2>3.5% vs. Other Example Rates</h2>
      <p>The following table compares the selected 3.5% input with other example rates for the same $250,000 loan over 30 years. It is a mathematical sensitivity table, not a claim about historical or current benchmarks:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Interest Rate</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly P&I</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Difference</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Extra Cost vs 3.5%</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td>3.5%</td><td>$1,123</td><td>-</td><td>$154,280</td><td>-</td></tr>
            <tr class="border-b border-outline-variant/30"><td>4.5%</td><td>$1,267</td><td>+$144/month</td><td>$206,120</td><td>+$51,840</td></tr>
            <tr class="border-b border-outline-variant/30"><td>5.5%</td><td>$1,419</td><td>+$296/month</td><td>$260,840</td><td>+$106,560</td></tr>
            <tr class="border-b border-outline-variant/30"><td>6.0%</td><td>$1,499</td><td>+$376/month</td><td>$289,640</td><td>+$135,360</td></tr>
            <tr class="border-b border-outline-variant/30"><td>6.5%</td><td>$1,580</td><td>+$457/month</td><td>$318,800</td><td>+$164,520</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5 font-bold"><td>6.8%</td><td>$1,632</td><td>+$509/month</td><td>$337,920</td><td>+$183,640</td></tr>
            <tr class="border-b border-outline-variant/30"><td>7.5%</td><td>$1,748</td><td>+$625/month</td><td>$379,280</td><td>+$224,400</td></tr>
          </tbody>
        </table>
      </div>

      <p>Within the table, the 3.5% input produces a payment more than $500 below the 6.8% example. Use the <a href="/refinancing-calculator">refinancing calculator</a> to test an actual quote and closing costs. See our <a href="/blog/when-to-refinance">when refinancing makes sense</a> and <a href="/blog/interest-rate-impact">how your rate affects total cost</a> guides for more. Also compare this to a <a href="/calculator/300k-mortgage-monthly-payment-6-percent">$300,000 mortgage at 6%</a> or a <a href="/calculator/400k-mortgage-monthly-payment-4-percent">$400,000 mortgage at 4%</a>.</p>

      <h2>Run Your Personalised Scenario</h2>
      <p>Model your exact situation using the mortgage calculator above to see the lifetime cost estimate. If you are comparing future possibilities, the <a href="/refinancing-calculator">refinancing calculator</a> can compare your current loan with a hypothetical 3.5% refinance scenario. To learn more about the components of your bill, read <a href="/blog/mortgage-payment-guide">how mortgage payments are calculated</a>.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white text-center shadow-xl">
          <h3 class="text-xl font-bold mb-4">Mortgage Calculator</h3>
          <p class="mb-6 opacity-90 text-sm italic">Analyze any mortgage rate.</p>
          <a href="/mortgage-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Calculate Now →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant text-center shadow-sm">
          <h3 class="text-xl font-bold mb-4">Lifetime Cost</h3>
          <p class="mb-6 opacity-70 text-sm italic">See your total interest.</p>
          <a href="/total-interest-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">View Lifetime Cost →</a>
        </div>
      </div>
    `,
    customFaqs: [
      {
        question: "What is the monthly payment on a $250,000 mortgage at 3.5%?",
        answer: "The monthly principal and interest payment is $1,123 for a 30-year fixed term. Using the page's selected tax and insurance inputs, the **$250000 mortgage monthly payment 3.5 percent** scenario totals about $1,577."
      },
      {
        question: "How much do I save with a 3.5% rate vs 6.8% on a $250,000 mortgage?",
        answer: "A 3.5% rate saves you approximately $509 per month in principal and interest compared to a 6.8% rate. Over 30 years, this translates to roughly $183,640 in interest savings."
      },
      {
        question: "What income do I need for a $250,000 mortgage at 3.5%?",
        answer: "The page's illustrative affordability assumptions produce a gross annual-income range of about $48,000–$68,000. This is not an approval estimate; lender requirements vary."
      },
      {
        question: "What does the 3.5% rate represent?",
        answer: "The 3.5% rate is an editable mathematical assumption. It does not represent an available offer or market average."
      }
    ]
  },
  { 
    slug: '400k-mortgage-monthly-payment-4-percent', 
    type: 'mortgage', 
    amount: 400000, 
    rate: 4, 
    term: 30, 
    currency: 'USD',
    customTitle: "$400,000 Mortgage at 4%: Your Complete Payment Breakdown",
    customDescription: "What is the monthly payment on a $400,000 mortgage at a 4% example rate? See P&I, total interest, editable cost assumptions, and rate sensitivity.",
    customH1: "$400,000 Mortgage at 4%: Your Complete Payment Breakdown",
    customIntro: "This illustrative scenario models a $400,000 mortgage at a 4% example annual interest rate. It shows payments by term, editable estimates for taxes and insurance, and comparisons with other selected rates. The rates are inputs, not claims about available offers. Use the <a href='/mortgage-calculator'>mortgage calculator</a> above to adjust every assumption.",
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

      <p>At the selected 4% example rate over 30 years, the monthly principal and interest payment is $1,910 and the total interest is $287,480. Compared with a 6.8% example input, that is $605 less per month and $253,920 less total interest. Review the year-by-year breakdown on our <a href="/amortization-schedule">amortization schedule</a>.</p>

      <h2>Full Monthly Cost Including Taxes and Insurance (PITI)</h2>
      <p>The illustrative total adds selected tax, insurance, and mortgage-insurance inputs to principal and interest for a $445,000 home purchase with 10% down ($45,000), resulting in a $400,000 loan at the 4% example rate over 30 years:</p>
      
      <ul>
        <li><strong>Principal and Interest:</strong> $1,910</li>
        <li><strong>Property Tax (1.1%/yr):</strong> $407</li>
        <li><strong>Homeowners Insurance:</strong> $140</li>
        <li><strong>Private Mortgage Insurance (PMI):</strong> $167</li>
        <li><strong>Total Monthly Payment:</strong> $2,624</li>
      </ul>

      <p>The mortgage-insurance amount is an editable example assumption. Actual premiums and cancellation rules depend on the loan and lender. Use our <a href="/mortgage-calculator">mortgage calculator</a> to replace the tax, insurance, and rate assumptions.</p>

      <h2>What Income Do You Need for a $400,000 Mortgage at 4%?</h2>
      <p>This illustrative affordability check limits housing costs to 28% of gross income. It is a selected planning assumption, not an approval rule; lender requirements vary.</p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Payment Scenario</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Cost</th>
              <th class="py-3 px-4 font-bold text-sm">Illustrative Annual Income</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td>P&I only</td><td>$1,910</td><td>~$81,857</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td>Full PITI (example)</td><td>$2,624</td><td>~$112,457</td></tr>
            <tr class="border-b border-outline-variant/30"><td>With $500 other debts</td><td>$3,124</td><td>~$133,886</td></tr>
          </tbody>
        </table>
      </div>
      <p>Within these assumptions, a 4% input produces a lower payment than the 6.8% comparison input. The income figures are illustrative and do not predict approval. Change the inputs in our <a href="/affordability-calculator">affordability calculator</a>.</p>

      <h2>4% vs. Other Example Rates</h2>
      <p>This table compares the 4% scenario with selected higher example rates for the same $400,000 loan over 30 years. It does not describe past or current market benchmarks:</p>

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
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td>4.0%</td><td>$1,910</td><td>-</td><td>$287,480</td><td>-</td></tr>
            <tr class="border-b border-outline-variant/30"><td>5.0%</td><td>$2,147</td><td>+$237/month</td><td>$372,920</td><td>+$85,440</td></tr>
            <tr class="border-b border-outline-variant/30"><td>5.5%</td><td>$2,271</td><td>+$361/month</td><td>$417,560</td><td>+$130,080</td></tr>
            <tr class="border-b border-outline-variant/30"><td>6.0%</td><td>$2,398</td><td>+$488/month</td><td>$463,280</td><td>+$175,800</td></tr>
            <tr class="border-b border-outline-variant/30"><td>6.5%</td><td>${loanValue(400000,6.5,30,'monthly')}</td><td>+$618/month</td><td>${loanValue(400000,6.5,30,'totalInterest')}</td><td>+$222,600</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5 font-bold"><td>6.8%</td><td>$2,615</td><td>+$705/month</td><td>$541,400</td><td>+$253,920</td></tr>
            <tr class="border-b border-outline-variant/30"><td>7.0%</td><td>$2,661</td><td>+$751/month</td><td>$557,960</td><td>+$270,480</td></tr>
          </tbody>
        </table>
      </div>

      <p>The table shows how the 4% assumption compares with the other displayed rates. Use a <a href="/refinancing-calculator">refinancing calculator</a> with an actual quote and closing costs to estimate a break-even point. Read more on <a href="/blog/when-to-refinance">when refinancing makes sense</a> and <a href="/blog/interest-rate-impact">how your rate affects total cost</a>.</p>

      <h2>Run Your Personalised Scenario</h2>
      <p>Whether you are comparing a historical rate or planning for the future, use the mortgage calculator above to run your specific numbers. Also, compare this scenario to a <a href="/calculator/300k-mortgage-monthly-payment-6-percent">$300,000 mortgage at 6%</a> or a <a href="/calculator/700k-mortgage-monthly-payment-7-percent">$700,000 mortgage at 7%</a>. For those torn between terms, see our <a href="/blog/15-vs-30-year-mortgage">15-year vs 30-year mortgage comparison</a>.</p>

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
        answer: "The monthly principal and interest payment is $1,910 for a 30-year fixed term. Using the page's selected tax and insurance inputs, the total **$400000 mortgage monthly payment 4 percent** scenario is about $2,624."
      },
      {
        question: "How much do I save with a 4% rate vs a 7% rate on a $400,000 mortgage?",
        answer: "A 4% rate saves you roughly $751 per month in principal and interest compared to a 7% rate. Over 30 years, this results in a staggering $270,480 in interest savings."
      },
      {
        question: "What income do I need for a $400,000 mortgage at 4%?",
        answer: "The page's illustrative affordability assumptions produce a gross annual-income range of about $82,000–$112,000. This is not an approval estimate; lender requirements vary."
      },
      {
        question: "What does the 4% rate represent?",
        answer: "The 4% rate is an editable mathematical assumption. It does not represent an available offer or market average."
      }
    ]
  },

  // Loans USD
  { 
    slug: '10k-personal-loan-repayment-10-percent', 
    type: 'loan', 
    amount: 10000, 
    rate: 10, 
    term: 3, 
    currency: 'USD',
    customTitle: "$10,000 Personal Loan at 10%: Full Repayment Breakdown",
    customDescription: "What are the monthly payments on a $10,000 personal loan at 10% interest? See exact payments by term, total interest, rate sensitivity, and offer-comparison questions.",
    customH1: "$10,000 Personal Loan at 10%: Full Repayment Breakdown",
    customIntro: "This illustrative scenario models a $10,000 personal loan at a 10% example annual interest rate. It compares payments and total interest across terms. The rate is an input rather than an available offer, and approval criteria vary by lender. Use the <a href='/loan-calculator'>loan calculator</a> above to adjust the rate and term.",
    customContent: `
      <h2>Monthly Payments on a $10,000 Loan at 10%</h2>
      <p>The repayment term you choose is the biggest factor in your monthly budget. A shorter term saves you money on interest, while a longer term provides a more manageable monthly payment. Here is the breakdown for a $10,000 loan at a 10% fixed rate:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Loan Term</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td>1 year</td><td>$879</td><td>$548</td><td>$10,548</td></tr>
            <tr class="border-b border-outline-variant/30"><td>2 years</td><td>$461</td><td>$1,064</td><td>$11,064</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5 text-primary"><td>3 years</td><td>$323</td><td>$1,616</td><td>$11,616</td></tr>
            <tr class="border-b border-outline-variant/30"><td>4 years</td><td>$254</td><td>$2,192</td><td>$12,192</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td>5 years</td><td>$212</td><td>$2,748</td><td>$12,748</td></tr>
            <tr class="border-b border-outline-variant/30"><td>7 years</td><td>$166</td><td>$3,944</td><td>$13,944</td></tr>
          </tbody>
        </table>
      </div>

      <p>At the selected 10% example rate over 3 years, the monthly payment is $323 and total interest is $1,616. Choosing the 5-year example lowers the payment by $111 per month but adds $1,132 in total interest. Use our <a href="/total-interest-calculator">total interest calculator</a> to compare your own term.</p>

      <h2>How Your Rate Affects the Total Cost</h2>
      <p>The rate in a written offer can differ from these examples. This table isolates how selected annual-rate inputs change a $10,000 loan over a 3-year term:</p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Interest Rate</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td>6%</td><td>$304</td><td>$944</td><td>$10,944</td></tr>
            <tr class="border-b border-outline-variant/30"><td>8%</td><td>$313</td><td>$1,128</td><td>$11,128</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td>10%</td><td>$323</td><td>$1,616</td><td>$11,616</td></tr>
            <tr class="border-b border-outline-variant/30"><td>12%</td><td>$332</td><td>$1,952</td><td>$11,952</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5"><td>15%</td><td>$347</td><td>$2,492</td><td>$12,492</td></tr>
            <tr class="border-b border-outline-variant/30"><td>20%</td><td>$372</td><td>$3,392</td><td>$13,392</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold"><td>25%</td><td>$398</td><td>$4,328</td><td>$14,328</td></tr>
          </tbody>
        </table>
      </div>
      <p>The selected 6% and 25% scenarios differ by $3,384 in total interest. Check your reports at <a href="https://www.annualcreditreport.com" target="_blank" rel="noopener noreferrer">AnnualCreditReport.com</a>, then compare the rate and fees in written offers. Read more in our <a href="/blog/interest-rate-impact">rate-impact guide</a>.</p>

      <h2>Inputs to Compare in Written Loan Offers</h2>
      <p>Compare the quoted interest rate, APR, itemized fees, term, payment schedule, and total repayment. This page does not associate its example rate with a credit score, income, employment history, debt ratio, approval threshold, or available offer; lender criteria vary.</p>
      <p>Personal loan interest rates vary significantly between lenders. Before you commit, learn <a href="/blog/compare-loan-offers">how to compare loan offers</a> and use our <a href="/blog/loan-calculator-explained">loan calculator guide</a> to understand the math. For larger needs, you can also see our analysis of a <a href="/calculator/25k-personal-loan-repayment-8-percent">$25,000 personal loan at 8%</a>.</p>

      <h2>10% APR vs. Nominal Rate: An Important Distinction</h2>
      <p>Use the APR and itemized fees disclosed in each written offer and review current <a href="https://www.consumerfinance.gov" target="_blank" rel="noopener noreferrer">Consumer Financial Protection Bureau</a> guidance for how APR is defined. Compare the payment schedule and total repayment as well as the stated interest rate using a <a href="/monthly-payment-calculator">monthly payment calculator</a>.</p>

      <h2>Calculate Your Exact Repayment</h2>
      <p>Ready to see your exact numbers? Use the <a href="/loan-calculator">loan calculator</a> above to enter $10,000 and your quoted rate. You can also dive deeper with our guides on <a href="/blog/total-interest-explained">total interest explained</a> and <a href="/blog/monthly-payment-formula">the monthly payment formula</a>. Comparing multiple lenders is the easiest way to ensure you aren't overpaying.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12 text-center">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white shadow-xl">
          <h3 class="text-xl font-bold mb-4">Loan Calculator</h3>
          <p class="mb-6 opacity-90 text-sm">Calculate any personal loan.</p>
          <a href="/loan-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Calculate Now →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm">
          <h3 class="text-xl font-bold mb-4">Total Interest</h3>
          <p class="mb-6 opacity-70 text-sm">See the full lifetime cost.</p>
          <a href="/total-interest-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Go to Tool →</a>
        </div>
      </div>
    `,
    customFaqs: [
      {
        question: "What is the monthly payment on a $10,000 loan at 10% interest?",
        answer: "On a 3-year term, your monthly payment is $323. For a **$10000 personal loan repayment 10 percent** scenario over 5 years, the payment drops to $212."
      },
      {
        question: "How much total interest do I pay on a $10,000 personal loan at 10%?",
        answer: "Over a 3-year term, you will pay a total of $1,616 in interest. Shifting to a 5-year term increases the total interest to $2,748."
      },
      {
        question: "What credit score do I need for a 10% personal loan rate?",
        answer: "The 10% rate is an editable scenario assumption, not an approval prediction. Credit, income, debt, fees, and pricing criteria vary by lender."
      },
      {
        question: "Is a 3-year or 5-year term better for a $10,000 loan?",
        answer: "A 3-year term is better for minimizing interest cost while a 5-year term is better for fitting the payment into a tight monthly budget."
      }
    ]
  },
  { 
    slug: '25k-personal-loan-repayment-8-percent', 
    type: 'loan', 
    amount: 25000, 
    rate: 8, 
    term: 5, 
    currency: 'USD',
    customTitle: "$25,000 Personal Loan at 8%: Full Repayment Breakdown",
    customDescription: "What are the monthly payments on a $25,000 personal loan at 8% interest? See exact payments by term, total interest, rate sensitivity, and offer-comparison questions.",
    customH1: "$25,000 Personal Loan at 8%: Full Repayment Breakdown",
    customIntro: "This illustrative scenario models a $25,000 personal loan at an 8% example annual interest rate. It compares payments and total interest across terms and rates. The rate is an input rather than an available offer, and approval criteria vary by lender. Use the <a href='/loan-calculator'>loan calculator</a> above to adjust the rate and term.",
    customContent: `
      <h2>Monthly Payments on a $25,000 Loan at 8%</h2>
      <p>The repayment term you choose balances your monthly lifestyle costs against the total lifetime cost of the loan. A $25,000 loan balance carries a significant monthly weight, making it critical to find your target payment-to-income ratio:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Loan Term</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td>1 year</td><td>$2,172</td><td>$1,064</td><td>$26,064</td></tr>
            <tr class="border-b border-outline-variant/30"><td>2 years</td><td>$1,130</td><td>$2,120</td><td>$27,120</td></tr>
            <tr class="border-b border-outline-variant/30"><td>3 years</td><td>$783</td><td>$3,188</td><td>$28,188</td></tr>
            <tr class="border-b border-outline-variant/30"><td>4 years</td><td>$610</td><td>$4,280</td><td>$29,280</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td>5 years</td><td>$507</td><td>$5,420</td><td>$30,420</td></tr>
            <tr class="border-b border-outline-variant/30"><td>7 years</td><td>$389</td><td>$7,676</td><td>$32,676</td></tr>
          </tbody>
        </table>
      </div>

      <p>At the selected 8% example rate over 5 years, the monthly payment is $507 and total interest is $5,420. Choosing the 3-year example raises the payment by $276 per month and lowers total interest by $2,232. Compare both payments with your budget in our <a href="/total-interest-calculator">total interest calculator</a>.</p>

      <h2>How Your Rate Affects the Total Cost</h2>
      <p>The table compares selected example rates for a $25,000 loan over five years. The rates are editable mathematical assumptions rather than available offers or qualification predictions.</p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Interest Rate</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td>5%</td><td>$472</td><td>$3,320</td><td>$28,320</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5 text-primary"><td>6%</td><td>$483</td><td>$4,980</td><td>$29,980</td></tr>
            <tr class="border-b border-outline-variant/30"><td>8%</td><td>$507</td><td>$5,420</td><td>$30,420</td></tr>
            <tr class="border-b border-outline-variant/30"><td>10%</td><td>$531</td><td>$6,860</td><td>$31,860</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5"><td>12%</td><td>$556</td><td>$8,360</td><td>$33,360</td></tr>
            <tr class="border-b border-outline-variant/30"><td>15%</td><td>$595</td><td>$10,700</td><td>$35,700</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold"><td>20%</td><td>$663</td><td>$14,780</td><td>$39,780</td></tr>
          </tbody>
        </table>
      </div>
      <p>The selected 8% and 20% examples differ by $9,360 in total interest over five years. Check your reports at <a href="https://www.annualcreditreport.com" target="_blank" rel="noopener noreferrer">AnnualCreditReport.com</a>, then use the actual rate and fees from a written offer. Read more in our <a href="/blog/interest-rate-impact">rate-impact guide</a>.</p>

      <h2>Inputs to Compare in Written Loan Offers</h2>
      <p>Compare the quoted interest rate, APR, itemized fees, term, payment schedule, and total repayment. This page does not associate its example rate with a credit score, income, employment history, debt ratio, approval threshold, or available offer; lender criteria vary.</p>
      <p>A lender may consider income and existing debts using its own definitions and limits. Before accepting an offer, learn <a href="/blog/compare-loan-offers">how to compare loan offers</a> and use our <a href="/blog/loan-calculator-explained">loan calculator guide</a> to check the payment math.</p>

      <h2>Using a $25,000 Loan for Debt Consolidation: Does the Math Work?</h2>
      <p>This illustrative debt-consolidation comparison uses selected credit-card and personal-loan assumptions. Compare the APR and itemized fees in written disclosures before deciding:</p>
      
      <ul>
        <li><strong>Consolidating 4 credit cards at 21% APR:</strong> Minimum payments of ~$625/month, paying off in ~9 years with ~$18,900 in total interest.</li>
        <li><strong>$25,000 Personal Loan at 8% (5 yrs):</strong> Lower monthly payment of $507/month, paying off 4 years faster with only $5,420 in total interest.</li>
      </ul>

      <p>The math results in a staggering ~$13,480 in interest savings. Learn more in our <a href="/blog/total-interest-explained">total interest explained</a> guide and verify your own savings with the <a href="/loan-calculator">loan calculator</a>. For comparison, also see our breakdown of a <a href="/calculator/10k-personal-loan-repayment-10-percent">$10,000 personal loan at 10%</a>.</p>

      <h2>Calculate Your Exact Repayment Schedule</h2>
      <p>Before you sign, enter $25,000 into the loan calculator above with your quoted APR. You can also model how different payments affect <a href="/blog/monthly-payment-formula">the monthly payment formula</a>. Use our <a href="/monthly-payment-calculator">monthly payment calculator</a> to find a term that leaves you with sufficient budget surplus.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12 text-center">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white shadow-xl">
          <h3 class="text-xl font-bold mb-4">Loan Calculator</h3>
          <p class="mb-6 opacity-90 text-sm">Verify any personal loan offer.</p>
          <a href="/loan-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Calculate Now →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm">
          <h3 class="text-xl font-bold mb-4">Lifetime Interest</h3>
          <p class="mb-6 opacity-70 text-sm">See your exact interest costs.</p>
          <a href="/total-interest-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Go to Tool →</a>
        </div>
      </div>
    `,
    customFaqs: [
      {
        question: "What is the monthly payment on a $25,000 loan at 8% interest?",
        answer: "On a 5-year term, your monthly payment is $507. For a **$25000 personal loan repayment 8 percent** scenario over a 3-year term, the payment increases to $783."
      },
      {
        question: "How much total interest do I pay on a $25,000 personal loan at 8%?",
        answer: "Over a 5-year term, you will pay a total of $5,420 in interest. Opting for a 3-year term reduces the total interest to $3,188."
      },
      {
        question: "What credit score do I need for an 8% personal loan rate?",
        answer: "The 8% rate is an editable scenario assumption, not a qualification or pricing prediction. Credit, income, debt, fees, and approval criteria vary by lender and loan product."
      },
      {
        question: "Is a $25,000 personal loan a good idea for debt consolidation?",
        answer: "In the displayed mathematical scenario, replacing four balances modeled at 21% with a five-year loan modeled at 8% reduces estimated interest by about $13,000. Replace the balances, rates, fees, and payoff behavior with your actual offers."
      }
    ]
  },

  // Wave 4 Personal Loans USD
  {
    slug: '5k-loan-monthly-payment-12-percent',
    type: 'loan',
    amount: 5000,
    rate: 12,
    term: 3,
    currency: 'USD',
    customTitle: "$5,000 Personal Loan at 12%: Payments, Costs & Timeline",
    customDescription: "Monthly payment on a $5,000 personal loan at 12% is $166 over 3 years: $976 total interest. Full term table, rate sensitivity, and offer-comparison guide.",
    customH1: "How Much Does a $5,000 Personal Loan at 12% Really Cost?",
    customIntro: "This illustrative scenario models a $5,000 personal loan at a 12% example annual interest rate. It compares payments and total interest across terms and rates. The rate is an input rather than an available offer, and approval criteria vary by lender. Use the <a href='/loan-calculator'>loan calculator</a> above to adjust the rate and term.",
    customContent: `
      <h2>Monthly Payments on a $5,000 Loan at 12%</h2>
      <p>Choosing your repayment term controls how much you pay each month and how much you pay overall. Here is the full breakdown for a $5,000 loan at 12% fixed APR:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Loan Term</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">1 year</td><td class="py-3 px-4 text-sm">$444</td><td class="py-3 px-4 text-sm">$328</td><td class="py-3 px-4 text-sm">$5,328</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">2 years</td><td class="py-3 px-4 text-sm">$235</td><td class="py-3 px-4 text-sm">$640</td><td class="py-3 px-4 text-sm">$5,640</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">3 years</td><td class="py-3 px-4 text-sm">$166</td><td class="py-3 px-4 text-sm">$976</td><td class="py-3 px-4 text-sm">$5,976</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">5 years</td><td class="py-3 px-4 text-sm">$111</td><td class="py-3 px-4 text-sm">$1,660</td><td class="py-3 px-4 text-sm">$6,660</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">7 years</td><td class="py-3 px-4 text-sm">$88</td><td class="py-3 px-4 text-sm">$2,392</td><td class="py-3 px-4 text-sm">$7,392</td></tr>
          </tbody>
        </table>
      </div>

      <p>At the selected 12% example rate over 3 years, the monthly payment is $166 and total interest is $976. The 5-year example lowers the payment by $55 per month and adds $684 in total interest. Use our <a href="/total-interest-calculator">total interest calculator</a> to compare the tradeoff with your budget.</p>

      <h2>How Your Rate Affects the Cost of a $5,000 Loan</h2>
      <p>Written offers may use different rates and fees. Here is what a 3-year term costs across selected example APRs:</p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">APR</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">6%</td><td class="py-3 px-4 text-sm">$152</td><td class="py-3 px-4 text-sm">$472</td><td class="py-3 px-4 text-sm">$5,472</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">8%</td><td class="py-3 px-4 text-sm">$157</td><td class="py-3 px-4 text-sm">$652</td><td class="py-3 px-4 text-sm">$5,652</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">10%</td><td class="py-3 px-4 text-sm">$161</td><td class="py-3 px-4 text-sm">$796</td><td class="py-3 px-4 text-sm">$5,796</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">12%</td><td class="py-3 px-4 text-sm">$166</td><td class="py-3 px-4 text-sm">$976</td><td class="py-3 px-4 text-sm">$5,976</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">15%</td><td class="py-3 px-4 text-sm">$173</td><td class="py-3 px-4 text-sm">$1,228</td><td class="py-3 px-4 text-sm">$6,228</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">20%</td><td class="py-3 px-4 text-sm">$186</td><td class="py-3 px-4 text-sm">$1,696</td><td class="py-3 px-4 text-sm">$6,696</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">25%</td><td class="py-3 px-4 text-sm">$202</td><td class="py-3 px-4 text-sm">$2,272</td><td class="py-3 px-4 text-sm">$7,272</td></tr>
          </tbody>
        </table>
      </div>
      <p>The selected 10% and 20% APR examples on a $5,000 loan over 3 years differ by $900 in total interest. Check your reports at <a href="https://www.annualcreditreport.com" target="_blank" rel="noopener noreferrer">AnnualCreditReport.com</a>, then replace the examples with quoted terms.</p>

      <h2>Inputs to Compare in Written Loan Offers</h2>
      <p>Compare the quoted interest rate, APR, itemized fees, term, payment schedule, and total repayment. This page does not associate its example rate with a credit score, income, employment history, debt ratio, approval threshold, or available offer; lender criteria vary.</p>

      <h2>$5,000 Personal Loan vs. Credit Card at 24%</h2>
      <p>The table compares a $5,000 balance using a 24% example credit-card APR with a 12% example personal-loan rate. At 24% over 36 months, the monthly payment is $196 and total interest is $2,056. At 12%, the payment is $166 and total interest is $976. These rates are assumptions rather than market averages. For another comparison, see our <a href="/calculator/10k-personal-loan-repayment-10-percent">$10,000 personal loan at 10%</a> breakdown or our <a href="/calculator/15k-loan-monthly-payment-10-percent">$15,000 loan at 10%</a> page.</p>

      <p>Use the <a href="/loan-calculator">loan calculator</a> to run your exact numbers, or check the <a href="/total-interest-calculator">total interest calculator</a> to see the full lifetime cost of any rate and term combination.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12 text-center">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white shadow-xl">
          <h3 class="text-xl font-bold mb-4">Calculate Your Loan</h3>
          <p class="mb-6 opacity-90 text-sm">Enter your amount, rate, and term.</p>
          <a href="/loan-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Calculate Now →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm">
          <h3 class="text-xl font-bold mb-4">See Total Interest</h3>
          <p class="mb-6 opacity-70 text-sm">Find your exact lifetime interest cost.</p>
          <a href="/total-interest-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Go to Tool →</a>
        </div>
      </div>
    `,
    customFaqs: [
      {
        question: "What is the monthly payment on a $5,000 loan at 12%?",
        answer: "On a 3-year term, your monthly payment is $166. Over 5 years it drops to $111 per month. The shorter term saves $684 in total interest."
      },
      {
        question: "How much total interest do I pay on a $5,000 personal loan at 12%?",
        answer: "On the selected 3-year term, total interest is $976. Extending the example to 5 years raises that to $1,660. Use the total interest calculator to model any term."
      },
      {
        question: "Is a personal loan better than a credit card for a $5,000 balance?",
        answer: "In the displayed scenario, a $5,000 balance modeled at 24% costs $2,056 in interest over three years, while a loan modeled at 12% costs $976. Replace the rates, fees, term, and payment behavior with your actual offers."
      },
      {
        question: "What credit score do I need for a $5,000 personal loan at 12%?",
        answer: "The 12% rate is an editable scenario assumption, not an approval prediction. Credit, income, debt, fees, and pricing criteria vary by lender."
      }
    ]
  },
  {
    slug: '15k-loan-monthly-payment-10-percent',
    type: 'loan',
    amount: 15000,
    rate: 10,
    term: 3,
    currency: 'USD',
    customTitle: "$15,000 Personal Loan at 10%: Full Repayment Breakdown",
    customDescription: "$15,000 personal loan at 10%: $484/month over 3 years and $2,424 total interest. Compare terms, example rates, and written offers.",
    customH1: "$15,000 Personal Loan at 10%: What You Will Actually Pay",
    customIntro: "This illustrative scenario models a $15,000 personal loan at a 10% example annual interest rate. It compares payments and total interest across terms and rates. The rate is an input rather than an available offer, and approval criteria vary by lender. Use the <a href='/loan-calculator'>loan calculator</a> above to adjust the rate and term.",
    customContent: `
      <h2>Monthly Payments on a $15,000 Loan at 10%</h2>
      <p>The repayment term you choose directly trades monthly payment against total interest cost. Here is the full breakdown for a $15,000 balance at 10% fixed APR:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Loan Term</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">1 year</td><td class="py-3 px-4 text-sm">$1,319</td><td class="py-3 px-4 text-sm">$828</td><td class="py-3 px-4 text-sm">$15,828</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">2 years</td><td class="py-3 px-4 text-sm">$692</td><td class="py-3 px-4 text-sm">$1,608</td><td class="py-3 px-4 text-sm">$16,608</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">3 years</td><td class="py-3 px-4 text-sm">$484</td><td class="py-3 px-4 text-sm">$2,424</td><td class="py-3 px-4 text-sm">$17,424</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">5 years</td><td class="py-3 px-4 text-sm">$319</td><td class="py-3 px-4 text-sm">$4,140</td><td class="py-3 px-4 text-sm">$19,140</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">7 years</td><td class="py-3 px-4 text-sm">$249</td><td class="py-3 px-4 text-sm">$5,916</td><td class="py-3 px-4 text-sm">$20,916</td></tr>
          </tbody>
        </table>
      </div>

      <p>At 10% over 3 years, the monthly payment is $484 and total interest is $2,424. Choosing a 5-year term instead saves $165 per month but adds $1,716 in interest over the life of the loan. If the budget can absorb $484 a month, the 3-year term wins. Use our <a href="/total-interest-calculator">total interest calculator</a> to see savings from paying extra each month.</p>

      <h2>How Your Rate Affects the Cost of a $15,000 Loan</h2>
      <p>Small APR differences compound quickly on a $15,000 balance. Here is what the full rate spectrum looks like over a 3-year term:</p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">APR</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">6%</td><td class="py-3 px-4 text-sm">$456</td><td class="py-3 px-4 text-sm">$1,416</td><td class="py-3 px-4 text-sm">$16,416</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">8%</td><td class="py-3 px-4 text-sm">$470</td><td class="py-3 px-4 text-sm">$1,920</td><td class="py-3 px-4 text-sm">$16,920</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">10%</td><td class="py-3 px-4 text-sm">$484</td><td class="py-3 px-4 text-sm">$2,424</td><td class="py-3 px-4 text-sm">$17,424</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">12%</td><td class="py-3 px-4 text-sm">$498</td><td class="py-3 px-4 text-sm">$2,928</td><td class="py-3 px-4 text-sm">$17,928</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">15%</td><td class="py-3 px-4 text-sm">$520</td><td class="py-3 px-4 text-sm">$3,720</td><td class="py-3 px-4 text-sm">$18,720</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">20%</td><td class="py-3 px-4 text-sm">$557</td><td class="py-3 px-4 text-sm">$5,052</td><td class="py-3 px-4 text-sm">$20,052</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">25%</td><td class="py-3 px-4 text-sm">$605</td><td class="py-3 px-4 text-sm">$6,780</td><td class="py-3 px-4 text-sm">$21,780</td></tr>
          </tbody>
        </table>
      </div>
      <p>In this illustrative scenario, moving the annual rate input from 10% to 20% on a $15,000 loan over three years adds $2,628 in total interest. The comparison does not associate either rate with a credit profile or predict pricing.</p>

      <h2>Inputs to Compare in Written Loan Offers</h2>
      <p>Compare the quoted interest rate, APR, itemized fees, term, payment schedule, and total repayment. This page does not associate its example rate with a credit score, income, employment history, debt ratio, approval threshold, or available offer; lender criteria vary.</p>

      <h2>Using a $15,000 Loan to Consolidate Credit Card Debt</h2>
      <p>Using a 22% example credit-card APR, paying $15,000 over 3 years would cost $573 per month and $5,628 in total interest. A 10% example personal-loan rate for the same term costs $484 per month and $2,424 in interest. These are mathematical assumptions rather than available offers. For comparison, see our breakdowns of a <a href="/calculator/10k-personal-loan-repayment-10-percent">$10,000 personal loan at 10%</a>, a <a href="/calculator/5k-loan-monthly-payment-12-percent">$5,000 loan at 12%</a>, and a <a href="/calculator/20k-loan-monthly-payment-10-percent">$20,000 loan at 10%</a>.</p>

      <p>Enter your numbers into the <a href="/loan-calculator">loan calculator</a> to verify your offer, or use the <a href="/total-interest-calculator">total interest calculator</a> to see your exact lifetime cost.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12 text-center">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white shadow-xl">
          <h3 class="text-xl font-bold mb-4">Calculate Your Loan</h3>
          <p class="mb-6 opacity-90 text-sm">Adjust rate, term, and amount.</p>
          <a href="/loan-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Calculate Now →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm">
          <h3 class="text-xl font-bold mb-4">See Total Interest</h3>
          <p class="mb-6 opacity-70 text-sm">Find your exact lifetime interest cost.</p>
          <a href="/total-interest-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Go to Tool →</a>
        </div>
      </div>
    `,
    customFaqs: [
      {
        question: "What is the monthly payment on a $15,000 loan at 10%?",
        answer: "On a 3-year term, your monthly payment is $484. Over 5 years it drops to $319. The 3-year term saves $1,716 in total interest compared to the 5-year option."
      },
      {
        question: "How much total interest do I pay on a $15,000 personal loan at 10%?",
        answer: "Over the selected 3-year term, total interest is $2,424. Choosing the 5-year example raises that to $4,140. The difference is $1,716 in exchange for $165 less per month."
      },
      {
        question: "Can I use a $15,000 personal loan to consolidate credit card debt?",
        answer: "Yes. If your cards carry a 22% APR, a personal loan at 10% saves roughly $3,204 in interest over 3 years and reduces your monthly obligation by about $89 compared to paying the cards directly."
      },
      {
        question: "What credit score do I need for a $15,000 personal loan at 10%?",
        answer: "The 10% rate is an editable scenario assumption, not an approval prediction. Credit, income, debt, fees, and pricing criteria vary by lender."
      }
    ]
  },
  {
    slug: '20k-loan-monthly-payment-10-percent',
    type: 'loan',
    amount: 20000,
    rate: 10,
    term: 5,
    currency: 'USD',
    customTitle: "$20,000 Personal Loan at 10%: Payment & Total Cost Guide",
    customDescription: "$20,000 personal loan at a 10% example rate: compare monthly payments, total interest, terms, and editable borrower assumptions.",
    customH1: "What Does a $20,000 Personal Loan at 10% Cost Over 5 Years?",
    customIntro: "This illustrative scenario models a $20,000 personal loan at a 10% example annual interest rate. It compares payments and total interest across terms and rates. The rate is an input rather than an available offer, and approval criteria vary by lender. Use the <a href='/loan-calculator'>loan calculator</a> above to adjust the rate and term.",
    customContent: `
      <h2>Monthly Payments on a $20,000 Loan at 10%</h2>
      <p>A $20,000 loan balance is large enough that the choice of term has a real impact on both your monthly budget and your total cost. Here is the full picture at 10% fixed APR:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Loan Term</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">1 year</td><td class="py-3 px-4 text-sm">$1,758</td><td class="py-3 px-4 text-sm">$1,096</td><td class="py-3 px-4 text-sm">$21,096</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">2 years</td><td class="py-3 px-4 text-sm">$923</td><td class="py-3 px-4 text-sm">$2,152</td><td class="py-3 px-4 text-sm">$22,152</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">3 years</td><td class="py-3 px-4 text-sm">$645</td><td class="py-3 px-4 text-sm">$3,220</td><td class="py-3 px-4 text-sm">$23,220</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">5 years</td><td class="py-3 px-4 text-sm">$425</td><td class="py-3 px-4 text-sm">$5,500</td><td class="py-3 px-4 text-sm">$25,500</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">7 years</td><td class="py-3 px-4 text-sm">$332</td><td class="py-3 px-4 text-sm">$7,888</td><td class="py-3 px-4 text-sm">$27,888</td></tr>
          </tbody>
        </table>
      </div>

      <p>At 10% over 5 years, a common term for this loan size, the monthly payment is $425 and total interest is $5,500. Choosing the 3-year term raises the monthly payment by $220 but saves $2,280 in interest. If your budget can handle $645 per month, the 3-year term is the better financial outcome. Use the <a href="/total-interest-calculator">total interest calculator</a> to see how much extra payments save you.</p>

      <h2>How Your Rate Affects the Cost of a $20,000 Loan</h2>
      <p>Your credit profile sets the rate ceiling you can reach. Here is what a 5-year repayment looks like across the full APR range for a $20,000 balance:</p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">APR</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">6%</td><td class="py-3 px-4 text-sm">$387</td><td class="py-3 px-4 text-sm">$3,220</td><td class="py-3 px-4 text-sm">$23,220</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">8%</td><td class="py-3 px-4 text-sm">$406</td><td class="py-3 px-4 text-sm">$4,360</td><td class="py-3 px-4 text-sm">$24,360</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">10%</td><td class="py-3 px-4 text-sm">$425</td><td class="py-3 px-4 text-sm">$5,500</td><td class="py-3 px-4 text-sm">$25,500</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">12%</td><td class="py-3 px-4 text-sm">$445</td><td class="py-3 px-4 text-sm">$6,700</td><td class="py-3 px-4 text-sm">$26,700</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">15%</td><td class="py-3 px-4 text-sm">$476</td><td class="py-3 px-4 text-sm">$8,560</td><td class="py-3 px-4 text-sm">$28,560</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">20%</td><td class="py-3 px-4 text-sm">$530</td><td class="py-3 px-4 text-sm">$11,800</td><td class="py-3 px-4 text-sm">$31,800</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">25%</td><td class="py-3 px-4 text-sm">$593</td><td class="py-3 px-4 text-sm">$15,580</td><td class="py-3 px-4 text-sm">$35,580</td></tr>
          </tbody>
        </table>
      </div>
      <p>Moving the selected APR input from 10% to 20% on a $20,000 loan over 5 years adds $6,300 in total interest. Replace both example rates with written offers before comparing options.</p>

      <h2>Inputs to Compare in Written Loan Offers</h2>
      <p>Compare the quoted interest rate, APR, itemized fees, term, payment schedule, and total repayment. This page does not associate its example rate with a credit score, income, employment history, debt ratio, approval threshold, or available offer; lender criteria vary.</p>

      <h2>Personal Loan vs. Home Equity Loan for $20,000</h2>
      <p>The mathematical comparison of a $20,000 balance at a 7% example rate with a 10% example personal-loan rate excludes product-specific fees, variable-rate terms, appraisal or closing requirements, timing, and the risk of securing debt with a home. Compare complete written offers rather than inferring that either product is cheaper or faster. For other selected scenarios, see <a href="/calculator/15k-loan-monthly-payment-10-percent">$15,000 at 10%</a>, <a href="/calculator/30k-loan-monthly-payment-9-percent">$30,000 at 9%</a>, and <a href="/calculator/25k-personal-loan-repayment-8-percent">$25,000 at 8%</a>.</p>

      <p>Use the <a href="/loan-calculator">loan calculator</a> to model your exact terms, or check the <a href="/total-interest-calculator">total interest calculator</a> to see your lifetime cost.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12 text-center">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white shadow-xl">
          <h3 class="text-xl font-bold mb-4">Calculate Your Loan</h3>
          <p class="mb-6 opacity-90 text-sm">Enter your rate, term, and amount.</p>
          <a href="/loan-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Calculate Now →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm">
          <h3 class="text-xl font-bold mb-4">See Total Interest</h3>
          <p class="mb-6 opacity-70 text-sm">Find your exact lifetime interest cost.</p>
          <a href="/total-interest-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Go to Tool →</a>
        </div>
      </div>
    `,
    customFaqs: [
      {
        question: "What is the monthly payment on a $20,000 loan at 10%?",
        answer: "On a 5-year term, your monthly payment is $425. For a 3-year term it rises to $645 per month, but you save $2,280 in total interest."
      },
      {
        question: "How much total interest do I pay on a $20,000 personal loan at 10%?",
        answer: "Over a 5-year term, total interest is $5,500. Choosing a 3-year term reduces that to $3,220: a saving of $2,280 in exchange for $220 more per month."
      },
      {
        question: "Should I use a personal loan or a home equity loan for a $20,000 home improvement?",
        answer: "The comparison uses a 7% example home-equity-loan rate and a 10% example personal-loan rate. Actual rates, fees, timelines, collateral terms, and eligibility vary by lender."
      },
      {
        question: "What credit score do I need for a $20,000 personal loan at 10%?",
        answer: "The 10% rate is an editable scenario assumption, not an approval prediction. Credit, income, debt, fees, and pricing criteria vary by lender."
      }
    ]
  },
  {
    slug: '30k-loan-monthly-payment-9-percent',
    type: 'loan',
    amount: 30000,
    rate: 9,
    term: 5,
    currency: 'USD',
    showPrefilledCalculator: true,
    customTitle: '$30,000 Loan at 9%: Three-Year vs Five-Year Cost',
    customDescription: 'Compare a $30,000 loan at a 9% selected annual note rate over three, five, and seven years using an editable calculator and finance-derived totals.',
    customH1: '$30,000 Loan at 9%: Choose a Term, Not Just a Payment',
    customIntro: 'This example starts with a $30,000 loan principal, a selected 9% nominal annual note interest rate, and a five-year term. It assumes equal end-of-month payments. Origination charges, application costs, late fees, optional products, and other fees are excluded.',
    scenarioQuestion: 'Is a three-year or five-year term better for a $30,000 loan?',
    directAnswer: `The five-year example produces a ${loanValue(30000, 9, 5, 'monthly')} monthly payment, ${loanValue(30000, 9, 5, 'totalInterest')} of interest, and ${loanValue(30000, 9, 5, 'totalPaid')} in total scheduled payments. The term comparison below shows the trade-off between monthly pressure and lifetime interest.`,
    calculatorDescription: 'The initial form uses a $30,000 principal, 9% nominal annual note rate, and five-year term. Change any input to recalculate the payment and total cost.',
    customContent: `
      <h2>Three years reduces interest but raises the required payment</h2>
      <p>The table holds the ${formatCurrency(30000, 0)} principal and selected 9% note rate constant. The three-year row repays principal faster; the seven-year row spreads repayment across more months. The calculation does not decide which payment fits your budget.</p>
      <div class="overflow-x-auto my-8 border border-outline-variant/30 rounded-2xl">
        ${loanTable(30000, [9], [3, 5, 7])}
      </div>
      <p>A three-year term requires <strong>${loanValue(30000, 9, 3, 'monthly')}</strong> per month and produces <strong>${loanValue(30000, 9, 3, 'totalInterest')}</strong> of scheduled interest. The selected five-year term requires <strong>${loanValue(30000, 9, 5, 'monthly')}</strong> per month and produces <strong>${loanValue(30000, 9, 5, 'totalInterest')}</strong> of interest. The lower payment of the seven-year row comes with more scheduled interest-bearing months.</p>

      <h2>Fees can change the decision even when the note rate is unchanged</h2>
      <p>The 9% input is the selected nominal annual note interest rate. Because fees are excluded, it is not an APR and the page does not estimate APR. Compare written offers using the amount actually disbursed, required payment, itemized fees, payment count, and total repayment. A shorter term is not universally better if its required payment is not workable, and products with different fees are not universally comparable from note rate alone.</p>

      <h2>What to change before making a decision</h2>
      <p>Replace the principal, note rate, and term with the terms of the offer. If a fee is financed, include it in the principal; if it is paid separately, add it to the displayed total when comparing cash cost. Review the separate <a href="/calculator/50k-loan-monthly-payment-8-percent">$50,000 loan payment-and-cost scenario</a> or use the <a href="/loan-calculator">full loan calculator</a>.</p>
    `,
    customFaqs: [
      {
        question: 'What is the payment on a $30,000 loan at 9% for five years?',
        answer: `The estimated payment is ${loanValue(30000, 9, 5, 'monthly')} per month across 60 scheduled payments.`,
      },
      {
        question: 'How much interest does the five-year example cost?',
        answer: `The calculation produces ${loanValue(30000, 9, 5, 'totalInterest')} of interest and ${loanValue(30000, 9, 5, 'totalPaid')} in total scheduled payments.`,
      },
      {
        question: 'Why does the three-year option cost less overall?',
        answer: `It repays principal across fewer interest-bearing months. Its scheduled payment is ${loanValue(30000, 9, 3, 'monthly')}, so the monthly obligation is higher than the five-year example.`,
      },
      {
        question: 'Is the selected 9% rate an APR?',
        answer: 'No. It is a nominal annual note interest-rate input. Fees are not modeled, so this page does not calculate APR.',
      },
    ],
  },
  {
    slug: '50k-loan-monthly-payment-8-percent',
    type: 'loan',
    amount: 50000,
    rate: 8,
    term: 7,
    currency: 'USD',
    showPrefilledCalculator: true,
    customTitle: '$50,000 Loan at 8%: Payment and Total Cost',
    customDescription: 'Calculate the payment, total interest, and total scheduled cost of a $50,000 loan at an 8% selected annual note rate over seven years.',
    customH1: '$50,000 Loan at 8%: Payment and Total-Cost Decision',
    customIntro: 'This example starts with a $50,000 loan principal, an 8% selected nominal annual note interest rate, and a seven-year term. It assumes equal end-of-month payments. Fees, optional products, penalties, and other charges are excluded.',
    scenarioQuestion: 'What is the payment and total cost of a $50,000 loan at 8%?',
    directAnswer: `The seven-year example requires ${loanValue(50000, 8, 7, 'monthly')} per month. Across 84 scheduled payments, total interest is ${loanValue(50000, 8, 7, 'totalInterest')} and total payments are ${loanValue(50000, 8, 7, 'totalPaid')}, before any fees.`,
    calculatorDescription: 'The initial form uses a $50,000 principal, 8% nominal annual note rate, and seven-year term. Edit any input to see how the payment and total scheduled cost change.',
    customContent: `
      <h2>Decide whether the lower payment justifies the longer term</h2>
      <p>The comparison keeps the ${formatCurrency(50000, 0)} principal and selected 8% note rate constant. Extending the term lowers the required monthly payment but adds interest-bearing months; shortening it does the reverse.</p>
      <div class="overflow-x-auto my-8 border border-outline-variant/30 rounded-2xl">
        ${loanTable(50000, [8], [5, 7, 10])}
      </div>
      <p>The five-year option totals <strong>${loanValue(50000, 8, 5, 'totalPaid')}</strong> in scheduled payments, compared with <strong>${loanValue(50000, 8, 7, 'totalPaid')}</strong> over seven years and <strong>${loanValue(50000, 8, 10, 'totalPaid')}</strong> over ten years. The table isolates term cost; it does not say which payment leaves enough room in your budget.</p>

      <h2>The selected note interest rate is not an APR</h2>
      <p>The 8% input is a nominal annual note interest rate used to amortize the stated principal. It is not an APR because origination charges and other fees are not modeled. A written offer can have the same note rate but a different cash cost or APR when fees differ. Compare the disclosed payment schedule, itemized fees, amount received, and total repayment.</p>

      <h2>What the calculation includes and excludes</h2>
      <p>Included: the ${formatCurrency(50000, 0)} principal, selected 8% annual note rate, selected term, and equal end-of-month payments. Excluded: origination charges, application costs, optional insurance or add-ons, prepayment charges, late fees, and taxes. If a fee is added to the balance, include it in the principal before comparing results.</p>
      <p>For a term-versus-interest decision on a smaller balance, see the <a href="/calculator/30k-loan-monthly-payment-9-percent">$30,000 loan term comparison</a>. Use the <a href="/loan-calculator">full loan calculator</a> to enter a written offer.</p>
    `,
    customFaqs: [
      {
        question: 'What is the payment on a $50,000 loan at 8% over seven years?',
        answer: `The estimated payment is ${loanValue(50000, 8, 7, 'monthly')} per month across 84 scheduled payments.`,
      },
      {
        question: 'What is the total scheduled cost?',
        answer: `Total scheduled payments are ${loanValue(50000, 8, 7, 'totalPaid')}, including ${loanValue(50000, 8, 7, 'totalInterest')} of interest, before fees.`,
      },
      {
        question: 'How does a five-year term change the result?',
        answer: `At the same selected note rate, the five-year payment is ${loanValue(50000, 8, 5, 'monthly')} and total scheduled payments are ${loanValue(50000, 8, 5, 'totalPaid')}.`,
      },
      {
        question: 'Does the page calculate APR?',
        answer: 'No. The selected rate is a nominal annual note interest rate. Fees are excluded, so an APR is not calculated.',
      },
    ],
  },
  { 
    slug: 'how-much-house-can-i-afford-100k-salary', 
    type: 'affordability', 
    amount: 0, 
    rate: 6.8, 
    term: 30, 
    currency: 'USD', 
    salary: 100000,
    customTitle: "How Much House Can I Afford on a $100k Salary in 2026?",
    customDescription: "Explore a $100,000 salary scenario with editable payment, debt, down-payment, rate, tax, and insurance assumptions.",
    customH1: "How Much House Can I Afford on a $100k Salary in 2026?",
    customIntro: "This illustrative U.S. planning scenario shows how a $100,000 salary, existing monthly debts, down payment, local costs, and a selected example interest rate affect the estimated home budget. It compares editable 28% housing-cost and 36% total-debt assumptions; neither is a lender approval rule. Use the <a href='/affordability-calculator'>affordability calculator</a> above to personalise every input.",
    customContent: `
      <h2>How Much House Can You Afford on $100k? The Core Numbers</h2>
      <p>This page compares a 28% housing-cost assumption with a 36% total-debt assumption for a $100,000 annual income at the selected 6.8% example rate. Neither ratio predicts approval.</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Selected Ratio</th>
              <th class="py-3 px-4 font-bold text-sm">Max Monthly PITI</th>
              <th class="py-3 px-4 font-bold text-sm">Taxes + Insurance Est.</th>
              <th class="py-3 px-4 font-bold text-sm">Max P&I</th>
              <th class="py-3 px-4 font-bold text-sm">Max Loan Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td>28% rule</td><td>$2,333</td><td>~$450</td><td>~$1,883</td><td>~$281,500</td></tr>
            <tr class="border-b border-outline-variant/30"><td>36% rule</td><td>$3,000</td><td>~$450</td><td>~$2,550</td><td>~$381,000</td></tr>
          </tbody>
        </table>
      </div>

      <p>This page compares a 28% housing-cost assumption with a 36% total-debt assumption. They are planning scenarios rather than approval limits. The gap illustrates how a selected ratio changes the estimate; lender requirements and personal comfort levels vary. For more detail, see our guide on the <a href="/blog/28-36-rule-explained">28/36 rule explained</a>.</p>

      <h2>How Existing Debts Reduce Your Buying Power</h2>
      <p>Your debt-to-income ratio (DTI) is the biggest variable in your affordability. Here is how common debt loads impact a $100,000 salary at a 6.8% interest rate:</p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Monthly Debt Load</th>
              <th class="py-3 px-4 font-bold text-sm">Max Mortgage Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Max Loan Amount</th>
              <th class="py-3 px-4 font-bold text-sm">Home Price (10% down)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td>$0 (debt free)</td><td>$2,333</td><td>~$281,500</td><td>~$313,000</td></tr>
            <tr class="border-b border-outline-variant/30"><td>$300 (one car)</td><td>$2,033</td><td>~$245,200</td><td>~$272,500</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5"><td>$600 (car + student)</td><td>$1,733</td><td>~$209,000</td><td>~$232,000</td></tr>
            <tr class="border-b border-outline-variant/30"><td>$900 (multiple debts)</td><td>$1,433</td><td>~$172,800</td><td>~$192,000</td></tr>
          </tbody>
        </table>
      </div>
      <p>Carrying $900/month in debt reduces your buying power by over $120,000. Use our <a href="/loan-calculator">loan calculator</a> to see how paying off specific debts before applying can unlock significantly more budget. Read more in our <a href="/blog/loan-eligibility-by-income">loan eligibility by income</a> guide.</p>

      <h2>How Your Down Payment Changes the Picture</h2>
      <p>Your down payment doesn't just change your loan amount: it also affects your monthly Private Mortgage Insurance (PMI) cost:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Down Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Home Price</th>
              <th class="py-3 px-4 font-bold text-sm">Loan Amount</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly PITI</th>
              <th class="py-3 px-4 font-bold text-sm">PMI</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td>3%</td><td>~$290,000</td><td>~$281,300</td><td>~$2,280</td><td>~$117/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td>5%</td><td>~$296,000</td><td>~$281,200</td><td>~$2,260</td><td>~$98/mo</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5 font-bold"><td>10%</td><td>~$313,000</td><td>~$281,700</td><td>~$2,333</td><td>~$49/mo</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td>20%</td><td>~$352,000</td><td>~$281,600</td><td>~$2,150</td><td>$0</td></tr>
          </tbody>
        </table>
      </div>
      <p>The 20% down scenario removes the page's mortgage-insurance input, changing the estimated home price at the same monthly budget. Actual insurance terms vary by loan and lender. See our <a href="/blog/down-payment-guide">down payment guide</a> or <a href="https://www.hud.gov" target="_blank" rel="noopener noreferrer">HUD</a> program information.</p>

      <h2>Your Full Monthly Budget at $100k Salary</h2>
      <p>What does the selected $300,000 home scenario cost per month on a $100,000 salary? Here is an illustrative breakdown at the 6.8% example rate:</p>
      
      <ul>
        <li><strong>Principal and Interest:</strong> $1,961</li>
        <li><strong>Property Tax (1.1%/yr):</strong> $275</li>
        <li><strong>Homeowners Insurance:</strong> $100</li>
        <li><strong>PMI (~0.5%):</strong> $125</li>
        <li><strong>Total Housing Cost:</strong> $2,461</li>
        <li><strong>As % of $100k Gross Income:</strong> 29.5%</li>
      </ul>

      <p>This result sits just above the selected 28% planning ratio. The model omits personal living expenses and savings goals, so test other ratios and replace the cost inputs in the <a href="/mortgage-calculator">mortgage calculator</a>. Our <a href="/blog/calculator-mistakes">calculator-mistakes guide</a> explains which costs to include.</p>

      <h2>Get Your Personalised Home Budget</h2>
      <p>Enter income and debts in the <a href="/affordability-calculator">affordability calculator</a> to produce a planning estimate. Compare the selected <a href="/calculator/300k-mortgage-monthly-payment-6-percent">$300,000 mortgage at 6%</a> and <a href="/calculator/400k-mortgage-monthly-payment-4-percent">$400,000 mortgage at 4%</a> scenarios, then review <a href="/blog/mortgage-payment-guide">how mortgage payments are calculated</a> and the <a href="/blog/home-purchase-budgeting">full home-purchase budget</a>.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12 text-center">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white shadow-xl">
          <h3 class="text-xl font-bold mb-4">Affordability Tool</h3>
          <p class="mb-6 opacity-90 text-sm">Find your max price in seconds.</p>
          <a href="/affordability-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Calculate Now →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm">
          <h3 class="text-xl font-bold mb-4">Mortgage Calculator</h3>
          <p class="mb-6 opacity-70 text-sm">Model your monthly PITI.</p>
          <a href="/mortgage-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Go to Calculator →</a>
        </div>
      </div>
    `,
    customFaqs: [
      {
        question: "How much house can I afford on a $100,000 salary?",
        answer: "The page's selected assumptions produce home-price scenarios from about $280,000 to $350,000 as down payment and existing debts change. These are planning outputs rather than a comfort or approval range."
      },
      {
        question: "What mortgage payment can I afford on $100k a year?",
        answer: "This page uses $2,333 per month as a 28% housing-cost example and $3,000 as a 36% total-debt example with no other debts. Neither is an approval estimate; lender requirements vary."
      },
      {
        question: "Can I afford a $400,000 house on $100k salary?",
        answer: "Using this page's 6.8% example rate and cost assumptions, a $400,000 house exceeds the displayed 28% planning ratio on a $100,000 salary. Change the rate, down payment, debts, taxes, and insurance to test your own scenario; this is not an approval estimate."
      },
      {
        question: "How much do I need for a down payment on a $100k salary?",
        answer: "The table compares 3%, 10%, and 20% down-payment inputs. A larger down payment reduces the modeled loan balance, and the 20% scenario sets its mortgage-insurance input to $0. Actual minimum down payments and insurance terms vary by loan program and lender."
      }
    ]
  },
  // Wave 2 Salary Affordability Pages
  {
    slug: 'how-much-house-can-i-afford-50k-salary',
    type: 'affordability',
    amount: 0,
    rate: 6.8,
    term: 30,
    currency: 'USD',
    salary: 50000,
    customTitle: "How Much House Can I Afford on a $50,000 Salary in 2026?",
    customDescription: "Explore a $50,000 salary scenario with editable payment, debt, down-payment, rate, tax, and insurance assumptions.",
    customH1: "How Much House Can I Afford on a $50,000 Salary in 2026?",
    customIntro: "This illustrative U.S. planning scenario applies editable 28% housing-cost and 36% total-debt assumptions to a $50,000 salary. It shows how an existing car payment, down payment, selected example rate, and local ownership costs change the estimate. These ratios are planning inputs rather than lender approval rules. Use the <a href='/affordability-calculator'>affordability calculator</a> above to personalise every figure.",
    customContent: `
      <h2>How Much House Can You Afford on $50k? The Core Numbers</h2>
      <p>The table compares a 28% housing-cost assumption with a 36% total-debt assumption for a $50,000 income at a 6.8% example annual interest rate. These are editable planning scenarios, not universal underwriting limits.</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Selected Ratio</th>
              <th class="py-3 px-4 font-bold text-sm">Max Monthly PITI</th>
              <th class="py-3 px-4 font-bold text-sm">Taxes + Insurance Est.</th>
              <th class="py-3 px-4 font-bold text-sm">Max P&amp;I</th>
              <th class="py-3 px-4 font-bold text-sm">Max Loan Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">28% rule</td><td class="py-3 px-4 text-sm">$1,167</td><td class="py-3 px-4 text-sm">~$280</td><td class="py-3 px-4 text-sm">~$887</td><td class="py-3 px-4 text-sm">~$136,000</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">36% rule</td><td class="py-3 px-4 text-sm">$1,500</td><td class="py-3 px-4 text-sm">~$352</td><td class="py-3 px-4 text-sm">~$1,148</td><td class="py-3 px-4 text-sm">~$176,000</td></tr>
          </tbody>
        </table>
      </div>

      <p>This page compares a 28% housing-cost assumption with a 36% total-debt assumption and zero other debts. They are illustrative planning inputs rather than lender limits. The gap between these scenarios is about $40,000 in estimated loan amount. See the <a href="/blog/28-36-rule-explained">28/36 rule explained</a> for more detail.</p>

      <h2>How Existing Debts Reduce Your Buying Power</h2>
      <p>At $50,000/year, debt management is critical. Here is how common debt loads affect your maximum mortgage at 6.8%:</p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Monthly Debt Load</th>
              <th class="py-3 px-4 font-bold text-sm">Max Housing Budget</th>
              <th class="py-3 px-4 font-bold text-sm">Max Loan Amount</th>
              <th class="py-3 px-4 font-bold text-sm">Home Price (10% down)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">$0 (debt free)</td><td class="py-3 px-4 text-sm">$1,167</td><td class="py-3 px-4 text-sm">~$136,000</td><td class="py-3 px-4 text-sm">~$150,000</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">$300 (one car)</td><td class="py-3 px-4 text-sm">$867</td><td class="py-3 px-4 text-sm">~$98,000</td><td class="py-3 px-4 text-sm">~$110,000</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5"><td class="py-3 px-4 text-sm">$600 (car + student)</td><td class="py-3 px-4 text-sm">$567</td><td class="py-3 px-4 text-sm">~$61,000</td><td class="py-3 px-4 text-sm">~$70,000</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">$900 (multiple debts)</td><td class="py-3 px-4 text-sm">$267</td><td class="py-3 px-4 text-sm">~$23,000</td><td class="py-3 px-4 text-sm">Not practical</td></tr>
          </tbody>
        </table>
      </div>
      <p>Within the selected ratio, adding a $300 monthly debt lowers the modeled loan by $38,000, while adding $600 lowers it further. Use our <a href="/loan-calculator">loan calculator</a> to model specific obligations, then compare the result with the <a href="/calculator/250k-mortgage-monthly-payment-3-5-percent">$250,000 mortgage example</a>. These calculations do not predict available properties or approval.</p>

      <h2>How Your Down Payment Changes the Picture</h2>
      <p>For a $50,000 earner, keeping the loan at or near $136,000, different down payments buy different home prices while keeping the monthly payment roughly stable:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Down Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Cash Needed</th>
              <th class="py-3 px-4 font-bold text-sm">Home Price</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly PITI</th>
              <th class="py-3 px-4 font-bold text-sm">PMI</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">3%</td><td class="py-3 px-4 text-sm">~$4,200</td><td class="py-3 px-4 text-sm">~$140,000</td><td class="py-3 px-4 text-sm">~$1,157</td><td class="py-3 px-4 text-sm">~$57/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">5%</td><td class="py-3 px-4 text-sm">~$7,150</td><td class="py-3 px-4 text-sm">~$143,000</td><td class="py-3 px-4 text-sm">~$1,159</td><td class="py-3 px-4 text-sm">~$57/mo</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5 font-bold"><td class="py-3 px-4 text-sm">10%</td><td class="py-3 px-4 text-sm">~$15,100</td><td class="py-3 px-4 text-sm">~$151,000</td><td class="py-3 px-4 text-sm">~$1,167</td><td class="py-3 px-4 text-sm">~$57/mo</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">20%</td><td class="py-3 px-4 text-sm">~$34,000</td><td class="py-3 px-4 text-sm">~$170,000</td><td class="py-3 px-4 text-sm">~$1,127</td><td class="py-3 px-4 text-sm">$0</td></tr>
          </tbody>
        </table>
      </div>
      <p>The 20% down scenario removes the selected mortgage-insurance input and displays a $170,000 home versus $140,000 at 3% down. Actual insurance and minimum down-payment terms vary. Check our <a href="/blog/down-payment-guide">down payment guide</a> and <a href="https://www.hud.gov" target="_blank" rel="noopener noreferrer">HUD program information</a>.</p>

      <h2>Your Full Monthly Budget on a $50,000 Salary</h2>
      <p>What does a $150,000 home actually cost per month on a $50,000 salary at 6.8%?</p>
      <ul>
        <li><strong>Principal and Interest ($136,000 loan):</strong> $887</li>
        <li><strong>Property Tax (1.1%/yr on $150k):</strong> $138</li>
        <li><strong>Homeowners Insurance:</strong> $85</li>
        <li><strong>PMI (~0.5%/yr):</strong> $57</li>
        <li><strong>Total Housing Cost:</strong> $1,167</li>
        <li><strong>As % of $50k Gross Income:</strong> 28.0%</li>
      </ul>
      <p>This result sits at the selected 28% boundary before home repairs, association fees, or unexpected costs. Test a lower ratio such as 20% or 25% to see how a larger budget buffer changes the estimate. You can also compare this scenario to a <a href="/calculator/250k-mortgage-monthly-payment-3-5-percent">$250,000 mortgage at 3.5%</a> to see how a rate difference affects the payment.</p>

      <h2>Get Your Personalised Home Budget</h2>
      <p>Ready to see your exact numbers? Use the <a href="/affordability-calculator">affordability calculator</a> above to enter your specific income, debts, and down payment. Also read our guide on <a href="/blog/how-much-house-can-i-afford">how much house you can afford</a> to understand all the variables lenders evaluate. Understanding <a href="/blog/mortgage-payment-guide">how mortgage payments are calculated</a> will help you compare loan options confidently.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12 text-center">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white shadow-xl">
          <h3 class="text-xl font-bold mb-4">Affordability Calculator</h3>
          <p class="mb-6 opacity-90 text-sm">Model a planning range.</p>
          <a href="/affordability-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Calculate Now →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm">
          <h3 class="text-xl font-bold mb-4">Mortgage Calculator</h3>
          <p class="mb-6 opacity-70 text-sm">Model your monthly PITI.</p>
          <a href="/mortgage-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Go to Calculator →</a>
        </div>
      </div>
    `,
    customFaqs: [
      {
        question: "How much house can I afford on a $50,000 salary?",
        answer: "With no other debts, the page's 28% planning assumption and 6.8% example rate produce an estimated $136,000 loan and a $150,000 home at 10% down. This is not an approval or market-availability claim."
      },
      {
        question: "Can I buy a home on $50,000 a year in 2026?",
        answer: "The page's selected assumptions produce home-price scenarios around $140,000–$170,000 as debts and down payment change. Compare that range with current listings and local costs; the page does not predict eligibility for FHA or any other financing."
      },
      {
        question: "What monthly mortgage payment can I afford on $50,000 a year?",
        answer: "Using the selected 28% housing-cost assumption produces $1,167 per month. Adding $300 in existing monthly debts to the page's comparison lowers the modeled housing budget to $867 and the loan estimate to roughly $98,000. These are planning outputs, not approval limits."
      },
      {
        question: "How much do I need for a down payment on a $50k salary?",
        answer: "With the page's $136,000 loan scenario, the examples use about $7,150 at 5% down, $15,100 at 10% down, and $34,000 at 20% down. The 20% example removes the model's mortgage-insurance input; actual terms vary."
      }
    ]
  },
  {
    slug: 'how-much-house-can-i-afford-60k-salary',
    type: 'affordability',
    amount: 0,
    rate: 6.8,
    term: 30,
    currency: 'USD',
    salary: 60000,
    customTitle: "How Much House Can I Afford on a $60,000 Salary in 2026?",
    customDescription: "Explore a $60,000 salary scenario with editable payment, debt, down-payment, rate, tax, and insurance assumptions.",
    customH1: "How Much House Can I Afford on a $60,000 Salary in 2026?",
    customIntro: "This illustrative U.S. planning scenario applies editable 28% housing-cost and 36% total-debt assumptions to a $60,000 salary. It shows how existing debts, down payment, a selected example rate, and local ownership costs change the estimated loan range. The results do not predict eligibility for FHA, conventional, or any other financing. Use the <a href='/affordability-calculator'>affordability calculator</a> to model your inputs.",
    customContent: `
      <h2>How Much House Can You Afford on $60k? The Core Numbers</h2>
      <p>The selected 28% housing-cost and 36% total-debt assumptions give different estimates when existing debt changes. Here is the illustrative base case at a 6.8% example annual interest rate for a $60,000 income; actual underwriting varies by lender and loan program.</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Selected Ratio</th>
              <th class="py-3 px-4 font-bold text-sm">Max Monthly PITI</th>
              <th class="py-3 px-4 font-bold text-sm">Taxes + Insurance Est.</th>
              <th class="py-3 px-4 font-bold text-sm">Max P&amp;I</th>
              <th class="py-3 px-4 font-bold text-sm">Max Loan Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">28% rule</td><td class="py-3 px-4 text-sm">$1,400</td><td class="py-3 px-4 text-sm">~$330</td><td class="py-3 px-4 text-sm">~$1,070</td><td class="py-3 px-4 text-sm">~$165,000</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">36% rule</td><td class="py-3 px-4 text-sm">$1,800</td><td class="py-3 px-4 text-sm">~$415</td><td class="py-3 px-4 text-sm">~$1,385</td><td class="py-3 px-4 text-sm">~$213,000</td></tr>
          </tbody>
        </table>
      </div>

      <p>This page compares a 28% housing-cost assumption with a 36% total-debt assumption and zero existing debts. They are illustrative planning inputs rather than lender limits. The calculator produces a $155,000–$185,000 example range under the displayed assumptions. Read our <a href="/blog/28-36-rule-explained">28/36 rule explained</a> guide for the framework.</p>

      <h2>How Existing Debts Reduce Your Buying Power</h2>
      <p>Debt management is especially important at the median income level. Here is how common monthly debt loads cut into your maximum mortgage at 6.8%:</p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Monthly Debt Load</th>
              <th class="py-3 px-4 font-bold text-sm">Max Housing Budget</th>
              <th class="py-3 px-4 font-bold text-sm">Max Loan Amount</th>
              <th class="py-3 px-4 font-bold text-sm">Home Price (10% down)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">$0 (debt free)</td><td class="py-3 px-4 text-sm">$1,400</td><td class="py-3 px-4 text-sm">~$165,000</td><td class="py-3 px-4 text-sm">~$185,000</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">$300 (one car)</td><td class="py-3 px-4 text-sm">$1,100</td><td class="py-3 px-4 text-sm">~$127,000</td><td class="py-3 px-4 text-sm">~$140,000</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5"><td class="py-3 px-4 text-sm">$600 (car + student)</td><td class="py-3 px-4 text-sm">$800</td><td class="py-3 px-4 text-sm">~$89,000</td><td class="py-3 px-4 text-sm">~$100,000</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">$900 (multiple debts)</td><td class="py-3 px-4 text-sm">$500</td><td class="py-3 px-4 text-sm">~$52,000</td><td class="py-3 px-4 text-sm">~$60,000</td></tr>
          </tbody>
        </table>
      </div>
      <p>Within the selected ratio, adding a $300 monthly debt lowers the modeled loan by $38,000. Use our <a href="/loan-calculator">loan calculator</a> to compare payoff scenarios, and compare the payment with the <a href="/calculator/250k-mortgage-monthly-payment-3-5-percent">$250,000 mortgage at a 3.5% example rate</a>.</p>

      <h2>How Your Down Payment Changes the Picture</h2>
      <p>With a fixed loan near $165,000, the down payment determines how expensive a home you can buy: not how much you borrow:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Down Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Cash Needed</th>
              <th class="py-3 px-4 font-bold text-sm">Home Price</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly PITI</th>
              <th class="py-3 px-4 font-bold text-sm">PMI</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">3%</td><td class="py-3 px-4 text-sm">~$5,100</td><td class="py-3 px-4 text-sm">~$170,000</td><td class="py-3 px-4 text-sm">~$1,390</td><td class="py-3 px-4 text-sm">~$69/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">5%</td><td class="py-3 px-4 text-sm">~$8,700</td><td class="py-3 px-4 text-sm">~$174,000</td><td class="py-3 px-4 text-sm">~$1,394</td><td class="py-3 px-4 text-sm">~$69/mo</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5 font-bold"><td class="py-3 px-4 text-sm">10%</td><td class="py-3 px-4 text-sm">~$18,300</td><td class="py-3 px-4 text-sm">~$183,000</td><td class="py-3 px-4 text-sm">~$1,402</td><td class="py-3 px-4 text-sm">~$69/mo</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">20%</td><td class="py-3 px-4 text-sm">~$41,200</td><td class="py-3 px-4 text-sm">~$206,000</td><td class="py-3 px-4 text-sm">~$1,355</td><td class="py-3 px-4 text-sm">$0</td></tr>
          </tbody>
        </table>
      </div>
      <p>Going from 3% to 20% down on the same $165,000 loan lets you buy a $206,000 home instead of $170,000: a $36,000 upgrade at the same loan amount. Check <a href="https://www.hud.gov" target="_blank" rel="noopener noreferrer">HUD's first-time buyer programs</a> for down payment assistance, and see our <a href="/blog/down-payment-guide">down payment guide</a> for savings strategies.</p>

      <h2>Your Full Monthly Budget on a $60,000 Salary</h2>
      <p>What does a $183,000 home actually cost per month on a $60,000 salary at 6.8%?</p>
      <ul>
        <li><strong>Principal and Interest ($165,000 loan):</strong> $1,076</li>
        <li><strong>Property Tax (1.1%/yr on $183k):</strong> $168</li>
        <li><strong>Homeowners Insurance:</strong> $90</li>
        <li><strong>PMI (~0.5%/yr):</strong> $69</li>
        <li><strong>Total Housing Cost:</strong> $1,403</li>
        <li><strong>As % of $60k Gross Income:</strong> 28.1%</li>
      </ul>
      <p>This result sits at the selected 28% planning ratio. FHA, conventional, and other loan programs use criteria that are outside this model and vary with the applicable program rules, lender, property, and borrower. Compare the payment with the <a href="/calculator/250k-mortgage-monthly-payment-3-5-percent">$250,000 mortgage at a 3.5% example rate</a>.</p>

      <h2>Get Your Personalised Home Budget</h2>
      <p>Use the <a href="/affordability-calculator">affordability calculator</a> above to enter your exact income, debts, and down payment. You can also read our full guide on <a href="/blog/how-much-house-can-i-afford">how much house you can afford</a> or compare this scenario to a <a href="/calculator/how-much-house-can-i-afford-100k-salary">$100,000 salary affordability analysis</a>.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12 text-center">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white shadow-xl">
          <h3 class="text-xl font-bold mb-4">Affordability Calculator</h3>
          <p class="mb-6 opacity-90 text-sm">Model a planning range.</p>
          <a href="/affordability-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Calculate Now →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm">
          <h3 class="text-xl font-bold mb-4">Mortgage Calculator</h3>
          <p class="mb-6 opacity-70 text-sm">Model your monthly PITI.</p>
          <a href="/mortgage-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Go to Calculator →</a>
        </div>
      </div>
    `,
    customFaqs: [
      {
        question: "How much house can I afford on a $60,000 salary?",
        answer: "With no existing debts, the page's 28% planning assumption and 6.8% example rate produce an estimated $165,000 loan and a $183,000 home at 10% down. This is not an approval or market-availability claim."
      },
      {
        question: "Does this $60k salary scenario predict FHA eligibility?",
        answer: "No. The displayed amount follows the page's editable planning assumptions. FHA eligibility and underwriting depend on the applicable program rules, lender, property, borrower, and full application."
      },
      {
        question: "What monthly housing budget does this $60,000 scenario show?",
        answer: "The selected 28% housing-cost assumption produces $1,400 per month. Adding $300 in existing monthly debts to the page's comparison lowers the modeled housing budget to $1,100 and the loan estimate to roughly $127,000. These are planning outputs, not approval limits."
      },
      {
        question: "Can I afford a $200,000 home on a $60k salary?",
        answer: "With the page's 10% down and local-cost assumptions, a $200,000 home produces about $1,520 per month, above the selected 28% planning budget of $1,400. The editable 36% scenario gives a different result, but neither ratio predicts approval."
      }
    ]
  },
  {
    slug: 'how-much-house-can-i-afford-70k-salary',
    type: 'affordability',
    amount: 0,
    rate: 6.8,
    term: 30,
    currency: 'USD',
    salary: 70000,
    customTitle: "How Much House Can I Afford on a $70,000 Salary in 2026?",
    customDescription: "How much house can you afford on a $70,000 salary? Compare editable rate, debt, down-payment, tax, and insurance scenarios.",
    customH1: "How Much House Can I Afford on a $70,000 Salary in 2026?",
    customIntro: "This illustrative U.S. planning scenario applies a 28% housing-cost assumption to a $70,000 salary, producing a $1,633 monthly budget and an estimated $193,000 loan before other debts. It also compares an editable 36% total-debt assumption and several down payments. The results do not predict conventional, FHA, or other loan eligibility. Use the <a href='/affordability-calculator'>affordability calculator</a> above for your inputs.",
    customContent: `
      <h2>How Much House Can You Afford on $70k? The Core Numbers</h2>
      <p>At $70,000 income, the 28% front-end and 36% back-end rules produce meaningfully different affordability ceilings. Here is the base case at 6.8% for 30 years:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Selected Ratio</th>
              <th class="py-3 px-4 font-bold text-sm">Max Monthly PITI</th>
              <th class="py-3 px-4 font-bold text-sm">Taxes + Insurance Est.</th>
              <th class="py-3 px-4 font-bold text-sm">Max P&amp;I</th>
              <th class="py-3 px-4 font-bold text-sm">Max Loan Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">28% rule</td><td class="py-3 px-4 text-sm">$1,633</td><td class="py-3 px-4 text-sm">~$375</td><td class="py-3 px-4 text-sm">~$1,258</td><td class="py-3 px-4 text-sm">~$193,000</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">36% rule</td><td class="py-3 px-4 text-sm">$2,100</td><td class="py-3 px-4 text-sm">~$480</td><td class="py-3 px-4 text-sm">~$1,620</td><td class="py-3 px-4 text-sm">~$250,000</td></tr>
          </tbody>
        </table>
      </div>

      <p>The page uses 28% and 36% as editable planning assumptions. The $57,000 gap between the resulting loan estimates shows how the selected ratio changes the output; neither figure is a comfort threshold or lender limit. See our <a href="/blog/28-36-rule-explained">28/36 rule explainer</a> for the model's limitations.</p>

      <h2>How Existing Debts Reduce Your Buying Power</h2>
      <p>The table shows how entered student-loan and car payments change the estimate at the selected 6.8% example rate:</p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Monthly Debt Load</th>
              <th class="py-3 px-4 font-bold text-sm">Max Housing Budget</th>
              <th class="py-3 px-4 font-bold text-sm">Max Loan Amount</th>
              <th class="py-3 px-4 font-bold text-sm">Home Price (10% down)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">$0 (debt free)</td><td class="py-3 px-4 text-sm">$1,633</td><td class="py-3 px-4 text-sm">~$193,000</td><td class="py-3 px-4 text-sm">~$215,000</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">$300 (one car)</td><td class="py-3 px-4 text-sm">$1,333</td><td class="py-3 px-4 text-sm">~$155,000</td><td class="py-3 px-4 text-sm">~$170,000</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5"><td class="py-3 px-4 text-sm">$600 (car + student)</td><td class="py-3 px-4 text-sm">$1,033</td><td class="py-3 px-4 text-sm">~$117,000</td><td class="py-3 px-4 text-sm">~$130,000</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">$900 (multiple debts)</td><td class="py-3 px-4 text-sm">$733</td><td class="py-3 px-4 text-sm">~$80,000</td><td class="py-3 px-4 text-sm">~$90,000</td></tr>
          </tbody>
        </table>
      </div>
      <p>A $300 car payment cuts $38,000 from your maximum loan: dropping you from a $215,000 home to a $170,000 home. Carrying $600 in monthly debts nearly halves your buying power. Use our <a href="/loan-calculator">loan calculator</a> to see how payoff scenarios shift your budget, and compare to a <a href="/calculator/250k-mortgage-monthly-payment-3-5-percent">$250,000 mortgage at 3.5%</a> to set realistic expectations.</p>

      <h2>How Your Down Payment Changes the Picture</h2>
      <p>With a fixed $193,000 loan, the selected down payment changes the modeled home price and mortgage-insurance input:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Down Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Cash Needed</th>
              <th class="py-3 px-4 font-bold text-sm">Home Price</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly PITI</th>
              <th class="py-3 px-4 font-bold text-sm">PMI</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">3%</td><td class="py-3 px-4 text-sm">~$5,970</td><td class="py-3 px-4 text-sm">~$199,000</td><td class="py-3 px-4 text-sm">~$1,621</td><td class="py-3 px-4 text-sm">~$80/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">5%</td><td class="py-3 px-4 text-sm">~$10,150</td><td class="py-3 px-4 text-sm">~$203,000</td><td class="py-3 px-4 text-sm">~$1,625</td><td class="py-3 px-4 text-sm">~$80/mo</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5 font-bold"><td class="py-3 px-4 text-sm">10%</td><td class="py-3 px-4 text-sm">~$21,400</td><td class="py-3 px-4 text-sm">~$214,000</td><td class="py-3 px-4 text-sm">~$1,635</td><td class="py-3 px-4 text-sm">~$80/mo</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">20%</td><td class="py-3 px-4 text-sm">~$48,200</td><td class="py-3 px-4 text-sm">~$241,000</td><td class="py-3 px-4 text-sm">~$1,579</td><td class="py-3 px-4 text-sm">$0</td></tr>
          </tbody>
        </table>
      </div>
      <p>The 20% down scenario removes the selected mortgage-insurance input and displays a $241,000 home versus $199,000 at 3% down, with a $42 lower modeled monthly cost. Actual insurance and down-payment terms vary. Review our <a href="/blog/down-payment-guide">down payment guide</a> and <a href="https://www.hud.gov" target="_blank" rel="noopener noreferrer">HUD</a> program information.</p>

      <h2>Your Full Monthly Budget on a $70,000 Salary</h2>
      <p>What does a $214,000 home actually cost per month on a $70,000 salary at 6.8%?</p>
      <ul>
        <li><strong>Principal and Interest ($193,000 loan):</strong> $1,258</li>
        <li><strong>Property Tax (1.1%/yr on $214k):</strong> $196</li>
        <li><strong>Homeowners Insurance:</strong> $100</li>
        <li><strong>PMI (~0.5%/yr):</strong> $80</li>
        <li><strong>Total Housing Cost:</strong> $1,634</li>
        <li><strong>As % of $70k Gross Income:</strong> 28.0%</li>
      </ul>
      <p>This result matches the selected 28% planning ratio. Compare the modeled price with current listings and documented local costs for the area you are considering, then compare the payment with the <a href="/calculator/250k-mortgage-monthly-payment-3-5-percent">$250,000 mortgage at a 3.5% example rate</a>.</p>

      <h2>Get Your Personalised Home Budget</h2>
      <p>Use the <a href="/affordability-calculator">affordability calculator</a> above to enter your exact income, debts, and down payment. Read our guide on <a href="/blog/how-much-house-can-i-afford">how much house you can afford</a> to understand all the factors lenders weigh, and compare to a <a href="/calculator/how-much-house-can-i-afford-100k-salary">$100,000 salary affordability</a> page to see how income growth expands your options.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12 text-center">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white shadow-xl">
          <h3 class="text-xl font-bold mb-4">Affordability Calculator</h3>
          <p class="mb-6 opacity-90 text-sm">Model a planning range.</p>
          <a href="/affordability-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Calculate Now →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm">
          <h3 class="text-xl font-bold mb-4">Mortgage Calculator</h3>
          <p class="mb-6 opacity-70 text-sm">Model your monthly PITI.</p>
          <a href="/mortgage-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Go to Calculator →</a>
        </div>
      </div>
    `,
    customFaqs: [
      {
        question: "How much house can I afford on a $70,000 salary?",
        answer: "With no existing debts, the page's 28% planning assumption and 6.8% example rate produce an estimated $193,000 loan and a $214,000 home at 10% down. This is not an approval or market-availability claim."
      },
      {
        question: "What loan amount does this $70,000 income scenario show?",
        answer: "Using a 28% housing-cost assumption produces roughly $193,000, while a 36% total-debt assumption with no other debts produces about $250,000. These are calculator scenarios, not approval limits; lender requirements vary."
      },
      {
        question: "How does a $400/month car payment affect my mortgage on $70,000?",
        answer: "A $400/month car payment reduces your available housing budget from $1,633 to $1,233, dropping your maximum loan from $193,000 to approximately $142,000: a $51,000 reduction in buying power."
      },
      {
        question: "How should I compare this $70,000 salary scenario with local listings?",
        answer: "Compare the page's modeled payment and ownership-cost assumptions with current listings, documented local taxes and insurance, your full budget, and lender-specific criteria. The page does not claim that a salary buys a particular property in any market."
      }
    ]
  },
  {
    slug: 'how-much-house-can-i-afford-80k-salary',
    type: 'affordability',
    amount: 0,
    rate: 6.8,
    term: 30,
    currency: 'USD',
    salary: 80000,
    showPrefilledCalculator: true,
    affordabilityInputs: {
      monthlyIncome: affordability80kBase.monthlyIncome,
      monthlyDebts: affordability80kBase.monthlyDebts,
      downPayment: affordability80kBase.downPayment,
      monthlyPropertyTax: affordability80kBase.monthlyPropertyTax,
      monthlyInsurance: affordability80kBase.monthlyInsurance,
    },
    customTitle: '$80,000 Salary Home Budget: Editable Assumptions',
    customDescription: 'See what an $80,000 salary permits under displayed planning assumptions, then test debt, down payment, rate, property tax, and insurance sensitivity.',
    customH1: 'How Much House Can an $80,000 Salary Support in This Example?',
    customIntro: 'This U.S.-dollar planning example converts an $80,000 annual gross income to monthly income and applies displayed 28% housing and 36% total-debt ratios. It starts with no other monthly debt, a $25,000 down payment, a selected 6.8% annual interest rate, a 30-year term, $225 monthly property tax, and $100 monthly property insurance. Maintenance, association fees, closing costs, and loan-specific mortgage insurance are excluded.',
    scenarioQuestion: 'What does this $80,000 salary example actually permit?',
    directAnswer: `Under the selected assumptions, the calculator estimates a ${affordabilityValue(affordability80kBase, 'maxPrice')} home price made up of a ${affordabilityValue(affordability80kBase, 'loanAmount')} loan principal and the selected down payment. The principal-and-interest allowance is ${affordabilityValue(affordability80kBase, 'monthlyPayment')} after the entered property tax and insurance are deducted from the example housing budget.`,
    calculatorDescription: 'Change income, debt, down payment, annual rate, term, monthly property tax, or monthly insurance. The displayed ratios are planning inputs, not underwriting criteria.',
    customContent: `
      <h2>The result follows the displayed inputs, not a lender decision</h2>
      <p>The base case uses ${formatCurrency(affordability80kBase.monthlyIncome, 2)} of monthly gross income, ${formatCurrency(affordability80kBase.monthlyDebts, 0)} of other monthly debt, a ${formatCurrency(affordability80kBase.downPayment, 0)} down payment, a ${affordability80kBase.rate}% selected annual rate, and a ${affordability80kBase.years}-year term. The entered monthly property costs are ${formatCurrency(affordability80kBase.monthlyPropertyTax, 0)} for tax and ${formatCurrency(affordability80kBase.monthlyInsurance, 0)} for insurance.</p>
      <p>The 28% housing and 36% total-debt ratios are user-selected planning examples. They are not lender limits, and this result does not predict lender approval. Actual underwriting, qualifying income, debts, reserves, property costs, and loan terms vary.</p>

      <h2>How debt, down payment, rate, tax, and insurance change the estimate</h2>
      <p>Each row changes one displayed assumption while holding the others at the base values. The estimates are recalculated with the same affordability and amortization functions as the editable form.</p>
      <div class="overflow-x-auto my-8 border border-outline-variant/30 rounded-2xl">
        ${affordabilityTable(affordability80kSensitivity)}
      </div>
      <ul>
        <li>Adding the selected monthly debt changes the estimated home price to <strong>${affordabilityValue(affordability80kSensitivity[1], 'maxPrice')}</strong>.</li>
        <li>Raising only the down payment changes the estimated home price to <strong>${affordabilityValue(affordability80kSensitivity[2], 'maxPrice')}</strong>; it does not create more modeled loan capacity.</li>
        <li>Raising only the selected rate changes the estimate to <strong>${affordabilityValue(affordability80kSensitivity[3], 'maxPrice')}</strong> because the same payment supports less principal.</li>
        <li>Increasing only the property-tax input changes the estimate to <strong>${affordabilityValue(affordability80kSensitivity[4], 'maxPrice')}</strong>.</li>
        <li>Increasing only the property-insurance input changes the estimate to <strong>${affordabilityValue(affordability80kSensitivity[5], 'maxPrice')}</strong>.</li>
      </ul>

      <h2>Use the estimate as a budget test</h2>
      <p>Replace every example input with documented figures for the property and financing you are considering. Keep maintenance, association fees, utilities, closing cash, and reserves outside the modeled ceiling unless you deliberately budget for them. Compare the result with the <a href="/calculator/300k-mortgage-monthly-payment-6-percent">$300,000 mortgage amortization example</a> or start from the <a href="/affordability-calculator">full affordability calculator</a>.</p>
    `,
    customFaqs: [
      {
        question: 'What home price does this $80,000 salary example produce?',
        answer: `The selected inputs produce an estimated home price of ${affordabilityValue(affordability80kBase, 'maxPrice')}, including the selected down payment and an estimated ${affordabilityValue(affordability80kBase, 'loanAmount')} loan principal.`,
      },
      {
        question: 'Are the 28% and 36% ratios lender rules?',
        answer: 'No. They are user-selected planning examples used to make the sensitivity calculation transparent. The result is not an approval estimate.',
      },
      {
        question: 'How do property tax and insurance affect the result?',
        answer: 'The entered monthly tax and insurance consume part of the selected housing budget, leaving less for principal and interest. Both fields are editable.',
      },
      {
        question: 'What costs are excluded?',
        answer: 'Maintenance, association fees, utilities, closing costs, reserves, and loan-specific mortgage insurance are excluded from the initial example.',
      },
    ],
  },
  {
    slug: 'how-much-house-can-i-afford-90k-salary',
    type: 'affordability',
    amount: 0,
    rate: 6.8,
    term: 30,
    currency: 'USD',
    salary: 90000,
    customTitle: "How Much House Can I Afford on a $90,000 Salary in 2026?",
    customDescription: "How much house can you afford on a $90,000 salary? Compare editable rate, debt, down-payment, tax, and insurance scenarios.",
    customH1: "How Much House Can I Afford on a $90,000 Salary in 2026?",
    customIntro: "This illustrative U.S. planning scenario applies a 28% housing-cost assumption to a $90,000 salary, producing a $2,100 monthly budget and an estimated $249,000 loan before other debts. It compares editable 28% and 36% ratios, down payments, a selected example rate, and local-cost assumptions. The results are not an affordability ceiling or approval prediction. Use the <a href='/affordability-calculator'>affordability calculator</a> above.",
    customContent: `
      <h2>How Much House Can You Afford on $90k? The Core Numbers</h2>
      <p>At $90,000, the 28% and 36% DTI rules produce a meaningful range of loan amounts. Here is the full picture at 6.8% for 30 years:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Selected Ratio</th>
              <th class="py-3 px-4 font-bold text-sm">Max Monthly PITI</th>
              <th class="py-3 px-4 font-bold text-sm">Taxes + Insurance Est.</th>
              <th class="py-3 px-4 font-bold text-sm">Max P&amp;I</th>
              <th class="py-3 px-4 font-bold text-sm">Max Loan Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">28% rule</td><td class="py-3 px-4 text-sm">$2,100</td><td class="py-3 px-4 text-sm">~$475</td><td class="py-3 px-4 text-sm">~$1,625</td><td class="py-3 px-4 text-sm">~$249,000</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">36% rule</td><td class="py-3 px-4 text-sm">$2,700</td><td class="py-3 px-4 text-sm">~$600</td><td class="py-3 px-4 text-sm">~$2,100</td><td class="py-3 px-4 text-sm">~$322,000</td></tr>
          </tbody>
        </table>
      </div>

      <p>The selected 28% and 36% planning assumptions produce a $73,000 gap in estimated loan amount when no other debts are entered. Neither ratio is a CFPB or lender maximum. See our <a href="/blog/28-36-rule-explained">28/36 rule guide</a> for the math and limitations.</p>

      <h2>How Existing Debts Reduce Your Buying Power</h2>
      <p>At $90,000, even modest debts are absorbed more gracefully than at lower income levels, but the impact remains significant in absolute dollar terms:</p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Monthly Debt Load</th>
              <th class="py-3 px-4 font-bold text-sm">Max Housing Budget</th>
              <th class="py-3 px-4 font-bold text-sm">Max Loan Amount</th>
              <th class="py-3 px-4 font-bold text-sm">Home Price (10% down)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">$0 (debt free)</td><td class="py-3 px-4 text-sm">$2,100</td><td class="py-3 px-4 text-sm">~$249,000</td><td class="py-3 px-4 text-sm">~$275,000</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">$300 (one car)</td><td class="py-3 px-4 text-sm">$1,800</td><td class="py-3 px-4 text-sm">~$211,000</td><td class="py-3 px-4 text-sm">~$235,000</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5"><td class="py-3 px-4 text-sm">$600 (car + student)</td><td class="py-3 px-4 text-sm">$1,500</td><td class="py-3 px-4 text-sm">~$173,000</td><td class="py-3 px-4 text-sm">~$190,000</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">$900 (multiple debts)</td><td class="py-3 px-4 text-sm">$1,200</td><td class="py-3 px-4 text-sm">~$136,000</td><td class="py-3 px-4 text-sm">~$150,000</td></tr>
          </tbody>
        </table>
      </div>
      <p>Under the selected ratio, rate, and cost inputs, changing monthly debt from $0 to $900 reduces the modeled home price from $275,000 to $150,000. This is a sensitivity result rather than an approval or market claim. Use the <a href="/loan-calculator">loan calculator</a> for debt scenarios and compare with the <a href="/calculator/300k-mortgage-monthly-payment-6-percent">$300,000 mortgage at 6%</a> example.</p>

      <h2>How Your Down Payment Changes the Picture</h2>
      <p>With a $249,000 loan, the selected down payment changes the modeled home price and mortgage-insurance input:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Down Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Cash Needed</th>
              <th class="py-3 px-4 font-bold text-sm">Home Price</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly PITI</th>
              <th class="py-3 px-4 font-bold text-sm">PMI</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">3%</td><td class="py-3 px-4 text-sm">~$7,710</td><td class="py-3 px-4 text-sm">~$257,000</td><td class="py-3 px-4 text-sm">~$2,083</td><td class="py-3 px-4 text-sm">~$104/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">5%</td><td class="py-3 px-4 text-sm">~$13,100</td><td class="py-3 px-4 text-sm">~$262,000</td><td class="py-3 px-4 text-sm">~$2,087</td><td class="py-3 px-4 text-sm">~$104/mo</td></tr>
            <tr class="border-b border-outline-variant/30 bg-primary/5 font-bold"><td class="py-3 px-4 text-sm">10%</td><td class="py-3 px-4 text-sm">~$27,700</td><td class="py-3 px-4 text-sm">~$277,000</td><td class="py-3 px-4 text-sm">~$2,101</td><td class="py-3 px-4 text-sm">~$104/mo</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">20%</td><td class="py-3 px-4 text-sm">~$62,200</td><td class="py-3 px-4 text-sm">~$311,000</td><td class="py-3 px-4 text-sm">~$2,028</td><td class="py-3 px-4 text-sm">$0</td></tr>
          </tbody>
        </table>
      </div>
      <p>In this table, changing the down-payment input from 3% to 20% changes the modeled home price from $257,000 to $311,000 and sets the $104 monthly mortgage-insurance assumption to $0. Actual minimum down payments and insurance terms vary. Read the <a href="/blog/down-payment-guide">down-payment guide</a> and compare the <a href="/calculator/250k-mortgage-monthly-payment-3-5-percent">$250,000 mortgage at a 3.5% example rate</a>.</p>

      <h2>Your Full Monthly Budget on a $90,000 Salary</h2>
      <p>What does a $275,000 home actually cost per month on a $90,000 salary at 6.8%?</p>
      <ul>
        <li><strong>Principal and Interest ($249,000 loan):</strong> $1,623</li>
        <li><strong>Property Tax (1.1%/yr on $275k):</strong> $252</li>
        <li><strong>Homeowners Insurance:</strong> $120</li>
        <li><strong>PMI (~0.5%/yr):</strong> $104</li>
        <li><strong>Total Housing Cost:</strong> $2,099</li>
        <li><strong>As % of $90k Gross Income:</strong> 28.0%</li>
      </ul>
      <p>This result matches the selected 28% planning ratio. The model does not determine whether that payment is comfortable for a household. The <a href="/calculator/how-much-house-can-i-afford-100k-salary">$100,000 salary scenario</a> produces roughly $313,000 under the same example inputs.</p>

      <h2>Get Your Personalised Home Budget</h2>
      <p>Use the <a href="/affordability-calculator">affordability calculator</a> above to model your exact income, debts, and down payment. Read our guide on <a href="/blog/how-much-house-can-i-afford">how much house you can afford</a> to understand every variable lenders scrutinise, and the <a href="/blog/mortgage-payment-guide">mortgage payment guide</a> to calculate your full cost from first payment to payoff.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12 text-center">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white shadow-xl">
          <h3 class="text-xl font-bold mb-4">Affordability Calculator</h3>
          <p class="mb-6 opacity-90 text-sm">Model a planning range.</p>
          <a href="/affordability-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Calculate Now →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm">
          <h3 class="text-xl font-bold mb-4">Mortgage Calculator</h3>
          <p class="mb-6 opacity-70 text-sm">Model your monthly PITI.</p>
          <a href="/mortgage-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Go to Calculator →</a>
        </div>
      </div>
    `,
    customFaqs: [
      {
        question: "How much house can I afford on a $90,000 salary?",
        answer: "With no existing debts, the page's 28% planning assumption and 6.8% example rate produce an estimated $249,000 loan and a $275,000 home at 10% down. This is not an approval or market-availability claim."
      },
      {
        question: "Can I afford a $350,000 home on a $90,000 salary?",
        answer: "With the page's 10% down and local-cost assumptions, a $350,000 home produces about $2,600 per month, above the selected 28% planning budget of $2,100. A 36% scenario gives a different result, but neither ratio predicts approval."
      },
      {
        question: "What is the monthly payment on a $249,000 mortgage at 6.8%?",
        answer: "The monthly principal and interest payment on a $249,000 mortgage at the 6.8% example rate over 30 years is $1,623. With the page's selected tax, insurance, and mortgage-insurance assumptions, the total scenario is approximately $2,099."
      },
      {
        question: "Is $90,000 enough to buy a home in most US metro areas in 2026?",
        answer: "The page does not predict market-level eligibility. Compare its calculated payment with current listings, local costs, your full budget, and lender-specific criteria for the property and jurisdiction you are considering."
      }
    ]
  },

  // ─── Wave 3: Income Required Pages ───────────────────────────────────────────

  {
    slug: 'income-required-for-200k-house',
    type: 'mortgage',
    amount: 180000,
    rate: 6.8,
    term: 30,
    currency: 'USD',
    customTitle: "What Income Do You Need to Buy a $200,000 House in 2026?",
    customDescription: "Planning to buy a $200,000 home? See illustrative income scenarios, an editable cost breakdown, and how existing debts change the selected planning ratios.",
    customH1: "What Income Do You Need to Buy a $200,000 House?",
    customIntro: "This illustrative U.S. scenario models a $200,000 home with 10% down, producing a $180,000 loan. At the selected 6.8% example annual interest rate over 30 years, principal and interest is $1,173 per month. The page's income figures use editable planning ratios and do not predict lender approval.",
    customContent: `
<h2>Illustrative Income for a $200,000 House</h2>
<p>The following illustrative scenarios use a 28% housing-cost assumption for a $200,000 home with 10% down ($20,000), resulting in a $180,000 loan at a 6.8% example rate over 30 years. This ratio is a planning input rather than an approval rule.</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Scenario</th>
        <th class="py-3 px-4 font-bold text-sm">Monthly Cost</th>
        <th class="py-3 px-4 font-bold text-sm">Illustrative Annual Income</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">P&amp;I only</td>
        <td class="py-3 px-4 text-sm">$1,173</td>
        <td class="py-3 px-4 text-sm">~$50,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30 font-bold bg-primary/5">
        <td class="py-3 px-4 text-sm">Full PITI (P&amp;I + tax $183 + insurance $80 + PMI $75)</td>
        <td class="py-3 px-4 text-sm">$1,511</td>
        <td class="py-3 px-4 text-sm">~$65,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">Full PITI + $500/mo existing debt</td>
        <td class="py-3 px-4 text-sm">$2,011</td>
        <td class="py-3 px-4 text-sm">~$67,000</td>
      </tr>
    </tbody>
  </table>
</div>

<p>This scenario applies a selected 0.5% annual mortgage-insurance cost ($75 per month) and 1.1% property-tax input. The 20% down scenario removes the insurance input; actual premiums and cancellation terms vary by loan and lender. Use the <a href="/mortgage-calculator">mortgage calculator</a> to enter your local tax rate for a more accurate figure.</p>

<h2>How Existing Debt Reduces Your Buying Power</h2>
<p>The table applies a selected 36% total-debt assumption to the $65,000 example income and shows how existing debt changes the available housing budget. It is a planning comparison rather than a lender limit.</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Monthly Debt</th>
        <th class="py-3 px-4 font-bold text-sm">Max Housing Budget</th>
        <th class="py-3 px-4 font-bold text-sm">Fits Selected Scenario?</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30 bg-primary/5">
        <td class="py-3 px-4 text-sm">$0</td>
        <td class="py-3 px-4 text-sm">$1,517/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Within selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$300/mo</td>
        <td class="py-3 px-4 text-sm">$1,650/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Near selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$600/mo</td>
        <td class="py-3 px-4 text-sm">$1,350/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Borderline</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$900/mo</td>
        <td class="py-3 px-4 text-sm">$1,050/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Unlikely</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>How Down Payment Size Changes Illustrative Income</h2>
<p>A larger down payment reduces the loan amount and monthly principal-and-interest estimate. In this example, the mortgage-insurance assumption is removed at 20% down, reducing the displayed cost by $75 per month. Actual insurance terms vary by loan and lender.</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Down Payment</th>
        <th class="py-3 px-4 font-bold text-sm">Down Amount</th>
        <th class="py-3 px-4 font-bold text-sm">Loan Amount</th>
        <th class="py-3 px-4 font-bold text-sm">Monthly P&amp;I</th>
        <th class="py-3 px-4 font-bold text-sm">Illustrative Income</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">3%</td>
        <td class="py-3 px-4 text-sm">$6,000</td>
        <td class="py-3 px-4 text-sm">$194,000</td>
        <td class="py-3 px-4 text-sm">$1,265</td>
        <td class="py-3 px-4 text-sm">~$54,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">5%</td>
        <td class="py-3 px-4 text-sm">$10,000</td>
        <td class="py-3 px-4 text-sm">$190,000</td>
        <td class="py-3 px-4 text-sm">$1,239</td>
        <td class="py-3 px-4 text-sm">~$53,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30 bg-primary/5 font-bold">
        <td class="py-3 px-4 text-sm">10% (this page)</td>
        <td class="py-3 px-4 text-sm">$20,000</td>
        <td class="py-3 px-4 text-sm">$180,000</td>
        <td class="py-3 px-4 text-sm">$1,173</td>
        <td class="py-3 px-4 text-sm">~$50,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">20%: insurance input $0</td>
        <td class="py-3 px-4 text-sm">$40,000</td>
        <td class="py-3 px-4 text-sm">$160,000</td>
        <td class="py-3 px-4 text-sm">$1,043</td>
        <td class="py-3 px-4 text-sm">~$45,000</td>
      </tr>
    </tbody>
  </table>
</div>

<p>In this model, moving to 20% down removes the $75 monthly mortgage-insurance assumption and reduces principal and interest by $130 per month, a combined scenario difference of $205.</p>

<h2>What Lenders Check Beyond Income</h2>
<p>This page does not estimate approval. Credit, income history, debt-to-income limits, documentation, down payment, and other criteria vary by lender and loan program. Treat the 28% and 36% ratios as editable planning assumptions.</p>

<h2>Related Calculators</h2>
<ul>
  <li>For a pure payment breakdown on a comparable loan, see the <a href="/calculator/250k-mortgage-monthly-payment-3-5-percent">$250,000 mortgage monthly payment page</a>.</li>
  <li>If you earn around $60,000, see <a href="/calculator/how-much-house-can-i-afford-60k-salary">how much house a $60k salary can afford</a>, or compare to a <a href="/calculator/how-much-house-can-i-afford-70k-salary">$70k salary affordability analysis</a>.</li>
  <li>Use the <a href="/affordability-calculator">affordability calculator</a> to model your exact income, debts, and down payment.</li>
  <li>Use the <a href="/mortgage-calculator">mortgage calculator</a> to adjust the rate, term, or loan amount.</li>
</ul>

<div class="flex flex-col md:flex-row gap-6 my-12 text-center">
  <div class="flex-1 bg-primary p-8 rounded-3xl text-white shadow-xl">
    <h3 class="text-xl font-bold mb-4">Check Your Affordability</h3>
    <p class="mb-6 opacity-90 text-sm">Enter your income and debts for a personalized result.</p>
    <a href="/affordability-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Check Affordability →</a>
  </div>
  <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm">
    <h3 class="text-xl font-bold mb-4">Calculate This Mortgage</h3>
    <p class="mb-6 opacity-70 text-sm">Adjust the rate, term, and down payment.</p>
    <a href="/mortgage-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Go to Calculator →</a>
  </div>
</div>
    `,
    customFaqs: [
      {
        question: "What income do I need for a $200,000 house?",
        answer: "With 10% down and a $180,000 loan at a 6.8% example rate, the displayed 28% assumption produces about $50,000 using principal and interest only, or $65,000 with the example local costs. Existing debts raise the scenario result. These are planning outputs, not lender requirements."
      },
      {
        question: "Can I buy a $200,000 house on a $50,000 salary?",
        answer: "A $50,000 salary covers the $1,173 principal-and-interest estimate under the displayed 28% assumption. Adding the page's example taxes, insurance, and mortgage insurance raises the cost to $1,511 and the illustrative income to about $65,000. This is not an approval estimate."
      },
      {
        question: "What is the monthly payment on a $180,000 mortgage at 6.8%?",
        answer: "The monthly principal and interest payment on a $180,000 mortgage at 6.8% over 30 years is $1,173. Adding property tax (1.1% annually = $183/mo), homeowners insurance ($80/mo), and PMI ($75/mo) brings the full PITI to approximately $1,511 per month for a buyer purchasing a $200,000 home with 10% down."
      },
      {
        question: "How much down payment do I need for a $200,000 home?",
        answer: "The table compares selected 3%, 10%, and 20% down-payment inputs. In the 20% scenario, removing the example mortgage-insurance cost and reducing the loan lowers the displayed monthly amount by about $205 versus the 10% scenario. Actual minimum down payments and insurance terms vary by loan program and lender."
      }
    ]
  },

  {
    slug: 'income-required-for-300k-house',
    type: 'mortgage',
    amount: 270000,
    rate: 6.8,
    term: 30,
    currency: 'USD',
    customTitle: "How Much Income Do You Need for a $300,000 Home in 2026?",
    customDescription: "What income do you need for a $300,000 house? See illustrative income scenarios, an editable cost breakdown, and how existing debts change the selected planning ratios.",
    customH1: "How Much Income Do You Need to Afford a $300,000 Home?",
    customIntro: "This illustrative U.S. scenario models a $300,000 home with 10% down, producing a $270,000 loan. At the selected 6.8% example annual interest rate over 30 years, principal and interest is $1,760 per month. The page's income figures use editable planning ratios and local-cost assumptions rather than current market statistics or approval rules.",
    customContent: `
<h2>Illustrative Income for a $300,000 House</h2>
<p>Below are three planning scenarios for a $300,000 home with 10% down, producing a $270,000 loan at a 6.8% example annual interest rate over 30 years. The income figures use editable 28% housing-cost and 36% total-debt assumptions rather than underwriting rules:</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Scenario</th>
        <th class="py-3 px-4 font-bold text-sm">Monthly Cost</th>
        <th class="py-3 px-4 font-bold text-sm">Illustrative Annual Income</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">P&amp;I only</td>
        <td class="py-3 px-4 text-sm">$1,760</td>
        <td class="py-3 px-4 text-sm">~$75,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30 font-bold bg-primary/5">
        <td class="py-3 px-4 text-sm">Full PITI (P&amp;I + tax $275 + insurance $100 + PMI $113)</td>
        <td class="py-3 px-4 text-sm">$2,248</td>
        <td class="py-3 px-4 text-sm">~$96,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">Full PITI + $500/mo existing debt</td>
        <td class="py-3 px-4 text-sm">$2,748</td>
        <td class="py-3 px-4 text-sm">~$92,000</td>
      </tr>
    </tbody>
  </table>
</div>

<p>The model applies a selected 1.1% property-tax input and 0.5% annual mortgage-insurance input ($113 per month). The 20% down scenario removes the insurance input. Dividing the displayed cost by the selected ratio produces a $96,000 illustrative income figure; it is not an approval threshold. See the <a href="/affordability-calculator">affordability calculator</a> to model your specific tax rate and debts.</p>

<h2>How Existing Debt Changes the $300,000 Planning Scenario</h2>
<p>The table uses the $96,000 illustrative income result as its baseline, then shows how entered car-loan, student-loan, and credit-card payments change the planning budget:</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Monthly Debt</th>
        <th class="py-3 px-4 font-bold text-sm">Max Housing Budget</th>
        <th class="py-3 px-4 font-bold text-sm">Fits Selected Scenario?</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30 bg-primary/5">
        <td class="py-3 px-4 text-sm">$0</td>
        <td class="py-3 px-4 text-sm">$2,240/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Near selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$300/mo</td>
        <td class="py-3 px-4 text-sm">$2,580/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Within selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$600/mo</td>
        <td class="py-3 px-4 text-sm">$2,280/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Near selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$900/mo</td>
        <td class="py-3 px-4 text-sm">$1,980/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Borderline</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>How Down Payment Size Changes Illustrative Income</h2>
<p>A larger down payment reduces the loan balance and principal-and-interest payment. The 20% scenario also removes the selected $113 monthly mortgage-insurance input, lowering the illustrative income result:</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Down Payment</th>
        <th class="py-3 px-4 font-bold text-sm">Down Amount</th>
        <th class="py-3 px-4 font-bold text-sm">Loan Amount</th>
        <th class="py-3 px-4 font-bold text-sm">Monthly P&amp;I</th>
        <th class="py-3 px-4 font-bold text-sm">Illustrative Income</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">3%</td>
        <td class="py-3 px-4 text-sm">$9,000</td>
        <td class="py-3 px-4 text-sm">$291,000</td>
        <td class="py-3 px-4 text-sm">$1,897</td>
        <td class="py-3 px-4 text-sm">~$81,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">5%</td>
        <td class="py-3 px-4 text-sm">$15,000</td>
        <td class="py-3 px-4 text-sm">$285,000</td>
        <td class="py-3 px-4 text-sm">$1,858</td>
        <td class="py-3 px-4 text-sm">~$80,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30 bg-primary/5 font-bold">
        <td class="py-3 px-4 text-sm">10% (this page)</td>
        <td class="py-3 px-4 text-sm">$30,000</td>
        <td class="py-3 px-4 text-sm">$270,000</td>
        <td class="py-3 px-4 text-sm">$1,760</td>
        <td class="py-3 px-4 text-sm">~$75,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">20%: insurance input $0</td>
        <td class="py-3 px-4 text-sm">$60,000</td>
        <td class="py-3 px-4 text-sm">$240,000</td>
        <td class="py-3 px-4 text-sm">$1,565</td>
        <td class="py-3 px-4 text-sm">~$67,000</td>
      </tr>
    </tbody>
  </table>
</div>

<p>In this model, moving from 10% to 20% down reduces principal and interest by $195 per month and removes the $113 monthly mortgage-insurance input. The combined $308 difference changes the illustrative income result from about $96,000 to $83,000.</p>

<h2>What Lenders Check Beyond Income</h2>
<p>This page does not estimate approval. Credit, debt, income, employment, documentation, and down-payment criteria vary by lender and loan program. Use the displayed ratios only as editable planning assumptions.</p>

<h2>Related Calculators</h2>
<ul>
  <li>See the exact monthly payment breakdown on the <a href="/calculator/300k-mortgage-monthly-payment-6-percent">$300,000 mortgage monthly payment page</a>.</li>
  <li>If you earn around $90,000, see <a href="/calculator/how-much-house-can-i-afford-90k-salary">how much house a $90k salary can afford</a>, or compare to a <a href="/calculator/how-much-house-can-i-afford-100k-salary">$100k salary affordability analysis</a>.</li>
  <li>Use the <a href="/affordability-calculator">affordability calculator</a> to enter your exact income, debts, and down payment.</li>
  <li>Use the <a href="/mortgage-calculator">mortgage calculator</a> to adjust the rate or term.</li>
</ul>

<div class="flex flex-col md:flex-row gap-6 my-12 text-center">
  <div class="flex-1 bg-primary p-8 rounded-3xl text-white shadow-xl">
    <h3 class="text-xl font-bold mb-4">Check Your Affordability</h3>
    <p class="mb-6 opacity-90 text-sm">Find your maximum purchase price based on your income.</p>
    <a href="/affordability-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Check Affordability →</a>
  </div>
  <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm">
    <h3 class="text-xl font-bold mb-4">Calculate This Mortgage</h3>
    <p class="mb-6 opacity-70 text-sm">Model the full payment with your specific rate and term.</p>
    <a href="/mortgage-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Go to Calculator →</a>
  </div>
</div>
    `,
    customFaqs: [
      {
        question: "What income do I need for a $300,000 house?",
        answer: "With 10% down and a $270,000 loan at the 6.8% example rate, the selected 28% planning ratio produces about $75,000 using principal and interest or $96,000 with the page's added tax, insurance, and mortgage-insurance inputs. These are illustrative results, not income requirements or approval thresholds."
      },
      {
        question: "Can I afford a $300,000 home on a single income?",
        answer: "Using the page's selected ratio and cost inputs, the full-cost scenario produces about $96,000 in illustrative annual income. A $75,000 input produces a different planning result. Neither figure predicts approval or represents a market-specific requirement."
      },
      {
        question: "What is the monthly PITI on a $300,000 house with 10% down?",
        answer: "The full PITI payment on a $300,000 purchase with 10% down at 6.8% over 30 years is approximately $2,248 per month: $1,760 principal and interest, $275 property tax (1.1% annual rate), $100 homeowners insurance, and $113 PMI. The page removes its selected mortgage-insurance input in the 20% down scenario; actual cancellation terms vary by loan."
      },
      {
        question: "How much is the monthly payment on a $270,000 mortgage at 6.8%?",
        answer: "The monthly principal and interest payment on a $270,000 mortgage at 6.8% over 30 years is $1,760. Over the life of the loan, you will pay approximately $363,600 in total interest in addition to repaying the $270,000 principal."
      }
    ]
  },

  {
    slug: 'income-required-for-400k-house',
    type: 'mortgage',
    amount: 360000,
    rate: 6.8,
    term: 30,
    currency: 'USD',
    customTitle: "What Annual Income Do You Need for a $400,000 House in 2026?",
    customDescription: "What income do you need for a $400,000 house? See illustrative income scenarios, an editable cost breakdown, and how debt changes the result at a 6.8% example rate.",
    customH1: "What Annual Salary Is Required for a $400,000 House?",
    customIntro: "This illustrative U.S. scenario models a $400,000 home with 10% down, producing a $360,000 loan. At the selected 6.8% example annual interest rate over 30 years, principal and interest is $2,347 per month. The page's income figures use editable planning ratios and do not describe a typical buyer or predict approval.",
    customContent: `
<h2>Illustrative Income for a $400,000 House</h2>
<p>The scenarios below assume 10% down ($40,000) on a $400,000 purchase, producing a $360,000 loan at the 6.8% example rate over 30 years. The income figures use editable 28% housing-cost and 36% total-debt planning assumptions:</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Scenario</th>
        <th class="py-3 px-4 font-bold text-sm">Monthly Cost</th>
        <th class="py-3 px-4 font-bold text-sm">Illustrative Annual Income</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">P&amp;I only</td>
        <td class="py-3 px-4 text-sm">$2,347</td>
        <td class="py-3 px-4 text-sm">~$101,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30 font-bold bg-primary/5">
        <td class="py-3 px-4 text-sm">Full PITI (P&amp;I + tax $367 + insurance $120 + PMI $150)</td>
        <td class="py-3 px-4 text-sm">$2,984</td>
        <td class="py-3 px-4 text-sm">~$128,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">Full PITI + $500/mo existing debt</td>
        <td class="py-3 px-4 text-sm">$3,484</td>
        <td class="py-3 px-4 text-sm">~$116,000</td>
      </tr>
    </tbody>
  </table>
</div>

<p>The model applies selected 1.1% property-tax and 0.5% annual mortgage-insurance inputs. The 20% down scenario removes the $150 monthly insurance input. Dividing the displayed cost by the selected ratio produces a $128,000 illustrative income figure, not an approval threshold. Use the <a href="/affordability-calculator">affordability calculator</a> for a figure tailored to your local tax rate.</p>

<h2>How Existing Debt Changes the $400,000 Planning Scenario</h2>
<p>At the $128,000 baseline income, here is how different levels of existing monthly debt affect the maximum housing budget available to you, and whether a $400,000 house fits:</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Monthly Debt</th>
        <th class="py-3 px-4 font-bold text-sm">Max Housing Budget</th>
        <th class="py-3 px-4 font-bold text-sm">Fits Selected Scenario?</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30 bg-primary/5">
        <td class="py-3 px-4 text-sm">$0</td>
        <td class="py-3 px-4 text-sm">$2,987/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Within selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$300/mo</td>
        <td class="py-3 px-4 text-sm">$3,540/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Within selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$600/mo</td>
        <td class="py-3 px-4 text-sm">$3,240/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Near selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$900/mo</td>
        <td class="py-3 px-4 text-sm">$2,940/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Borderline</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>How Down Payment Size Changes Illustrative Income</h2>
<p>A larger down payment reduces the loan and payment. In the 20% scenario, the model also removes its mortgage-insurance input and lowers the loan by $40,000 compared with 10% down:</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Down Payment</th>
        <th class="py-3 px-4 font-bold text-sm">Down Amount</th>
        <th class="py-3 px-4 font-bold text-sm">Loan Amount</th>
        <th class="py-3 px-4 font-bold text-sm">Monthly P&amp;I</th>
        <th class="py-3 px-4 font-bold text-sm">Illustrative Income</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">3%</td>
        <td class="py-3 px-4 text-sm">$12,000</td>
        <td class="py-3 px-4 text-sm">$388,000</td>
        <td class="py-3 px-4 text-sm">$2,529</td>
        <td class="py-3 px-4 text-sm">~$108,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">5%</td>
        <td class="py-3 px-4 text-sm">$20,000</td>
        <td class="py-3 px-4 text-sm">$380,000</td>
        <td class="py-3 px-4 text-sm">$2,477</td>
        <td class="py-3 px-4 text-sm">~$106,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30 bg-primary/5 font-bold">
        <td class="py-3 px-4 text-sm">10% (this page)</td>
        <td class="py-3 px-4 text-sm">$40,000</td>
        <td class="py-3 px-4 text-sm">$360,000</td>
        <td class="py-3 px-4 text-sm">$2,347</td>
        <td class="py-3 px-4 text-sm">~$101,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">20%: insurance input $0</td>
        <td class="py-3 px-4 text-sm">$80,000</td>
        <td class="py-3 px-4 text-sm">$320,000</td>
        <td class="py-3 px-4 text-sm">$2,086</td>
        <td class="py-3 px-4 text-sm">~$89,000</td>
      </tr>
    </tbody>
  </table>
</div>

<p>In this scenario, moving from 10% to 20% down reduces principal and interest by $261 per month and removes the $150 monthly mortgage-insurance assumption. The resulting $411 difference lowers the illustrative income figure; actual insurance terms vary.</p>

<h2>What Lenders Check Beyond Income</h2>
<p>Approval criteria can include credit history, total debt, income documentation, funds available to close, and the source of those funds. The required evidence and thresholds vary by lender and loan program, so use a written pre-approval or loan estimate rather than the page's illustrative ratios.</p>

<h2>Related Calculators</h2>
<ul>
  <li>For a full payment table at a similar loan amount, see the <a href="/calculator/400k-mortgage-monthly-payment-4-percent">$400,000 mortgage monthly payment page</a>.</li>
  <li>If you earn $100,000, see <a href="/calculator/how-much-house-can-i-afford-100k-salary">how much house a $100k salary can afford</a>, and compare it with the illustrative income result on this page.</li>
  <li>Use the <a href="/affordability-calculator">affordability calculator</a> to model your exact income, debts, and down payment.</li>
  <li>Use the <a href="/mortgage-calculator">mortgage calculator</a> to run your specific scenario.</li>
</ul>

<div class="flex flex-col md:flex-row gap-6 my-12 text-center">
  <div class="flex-1 bg-primary p-8 rounded-3xl text-white shadow-xl">
    <h3 class="text-xl font-bold mb-4">Check Your Affordability</h3>
    <p class="mb-6 opacity-90 text-sm">Get a personalized maximum home price based on your finances.</p>
    <a href="/affordability-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Check Affordability →</a>
  </div>
  <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm">
    <h3 class="text-xl font-bold mb-4">Calculate This Mortgage</h3>
    <p class="mb-6 opacity-70 text-sm">Adjust the rate, term, and down payment for your scenario.</p>
    <a href="/mortgage-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Go to Calculator →</a>
  </div>
</div>
    `,
    customFaqs: [
      {
        question: "What income do I need for a $400,000 house?",
        answer: "With 10% down and a $360,000 loan at the 6.8% example rate, the selected 28% planning ratio produces about $101,000 using principal and interest or $128,000 with the page's added tax, insurance, and mortgage-insurance inputs. These are illustrative results, not income requirements or approval thresholds."
      },
      {
        question: "Can I afford a $400k house on $100,000 salary?",
        answer: "At $100,000, the selected 28% planning ratio produces about $2,333 per month. The page's $400,000 home scenario with 10% down totals $2,984. Changing the down-payment or debt inputs changes the result; the model does not set an approval limit."
      },
      {
        question: "How much do I need down for a $400,000 home?",
        answer: "The table compares selected 3%, 10%, and 20% down-payment inputs. It applies a $194 monthly mortgage-insurance assumption at 3% and removes the insurance input at 20%. The resulting illustrative income changes from about $128,000 to $113,000; actual terms vary by loan and lender."
      },
      {
        question: "What is the monthly payment on a $400k house at 6.8%?",
        answer: "The monthly principal and interest on a $360,000 loan (10% down on a $400,000 home) at 6.8% over 30 years is $2,347. Adding property tax ($367/mo at 1.1% of $400,000), homeowners insurance ($120/mo), and PMI ($150/mo) brings the full PITI to $2,984 per month."
      }
    ]
  },

  {
    slug: 'income-required-for-500k-house',
    type: 'mortgage',
    amount: 450000,
    rate: 6.8,
    term: 30,
    currency: 'USD',
    customTitle: "What Income Is Required to Buy a $500,000 House in 2026?",
    customDescription: "Buying a $500,000 home takes strong income. See illustrative income scenarios, editable tax and insurance assumptions, and a down-payment impact analysis.",
    customH1: "What Income Do You Need for a $500,000 House?",
    customIntro: "This illustrative scenario models a $500,000 home with 10% down ($50,000), producing a $450,000 loan at a 6.8% example annual interest rate. The principal-and-interest estimate is $2,934 per month. Income figures on this page follow displayed planning assumptions and do not predict lender approval.",
    customContent: `
<h2>Illustrative Income for a $500,000 House</h2>
<p>These figures assume 10% down on a $500,000 purchase, creating a $450,000 loan at a 6.8% example annual interest rate over 30 years. The income results follow editable 28% housing-cost and 36% total-debt planning assumptions:</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Scenario</th>
        <th class="py-3 px-4 font-bold text-sm">Monthly Cost</th>
        <th class="py-3 px-4 font-bold text-sm">Illustrative Annual Income</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">P&amp;I only</td>
        <td class="py-3 px-4 text-sm">$2,934</td>
        <td class="py-3 px-4 text-sm">~$126,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30 font-bold bg-primary/5">
        <td class="py-3 px-4 text-sm">Full PITI (P&amp;I + tax $458 + insurance $140 + PMI $188)</td>
        <td class="py-3 px-4 text-sm">$3,720</td>
        <td class="py-3 px-4 text-sm">~$159,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">Full PITI + $500/mo existing debt</td>
        <td class="py-3 px-4 text-sm">$4,220</td>
        <td class="py-3 px-4 text-sm">~$141,000</td>
      </tr>
    </tbody>
  </table>
</div>

<p>The model applies selected 1.1% property-tax and 0.5% annual mortgage-insurance inputs. The 20% down scenario removes the $188 monthly insurance input. Replace the tax and insurance assumptions with documented local figures. The <a href="/affordability-calculator">affordability calculator</a> lets you enter your actual local tax rate.</p>

<h2>How Existing Debt Changes the $500,000 Planning Scenario</h2>
<p>At a $159,000 baseline income, the 36% back-end ratio allows substantial total debt: meaning moderate existing obligations still leave room for this mortgage:</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Monthly Debt</th>
        <th class="py-3 px-4 font-bold text-sm">Max Housing Budget</th>
        <th class="py-3 px-4 font-bold text-sm">Fits Selected Scenario?</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30 bg-primary/5">
        <td class="py-3 px-4 text-sm">$0</td>
        <td class="py-3 px-4 text-sm">$3,710/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Near selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$300/mo</td>
        <td class="py-3 px-4 text-sm">$4,470/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Within selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$600/mo</td>
        <td class="py-3 px-4 text-sm">$4,170/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Within selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$900/mo</td>
        <td class="py-3 px-4 text-sm">$3,870/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Near selected ratio</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>How Down Payment Size Changes Illustrative Income</h2>
<p>In this model, increasing the down payment from 10% to 20% removes the $188 monthly mortgage-insurance input and cuts principal and interest by $326 per month, lowering the illustrative income result by about $22,000:</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Down Payment</th>
        <th class="py-3 px-4 font-bold text-sm">Down Amount</th>
        <th class="py-3 px-4 font-bold text-sm">Loan Amount</th>
        <th class="py-3 px-4 font-bold text-sm">Monthly P&amp;I</th>
        <th class="py-3 px-4 font-bold text-sm">Illustrative Income</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">3%</td>
        <td class="py-3 px-4 text-sm">$15,000</td>
        <td class="py-3 px-4 text-sm">$485,000</td>
        <td class="py-3 px-4 text-sm">$3,162</td>
        <td class="py-3 px-4 text-sm">~$136,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">5%</td>
        <td class="py-3 px-4 text-sm">$25,000</td>
        <td class="py-3 px-4 text-sm">$475,000</td>
        <td class="py-3 px-4 text-sm">$3,097</td>
        <td class="py-3 px-4 text-sm">~$133,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30 bg-primary/5 font-bold">
        <td class="py-3 px-4 text-sm">10% (this page)</td>
        <td class="py-3 px-4 text-sm">$50,000</td>
        <td class="py-3 px-4 text-sm">$450,000</td>
        <td class="py-3 px-4 text-sm">$2,934</td>
        <td class="py-3 px-4 text-sm">~$126,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">20%: insurance input $0</td>
        <td class="py-3 px-4 text-sm">$100,000</td>
        <td class="py-3 px-4 text-sm">$400,000</td>
        <td class="py-3 px-4 text-sm">$2,608</td>
        <td class="py-3 px-4 text-sm">~$112,000</td>
      </tr>
    </tbody>
  </table>
</div>

<p>The 20% down scenario changes the illustrative income result from about $159,000 to $138,000 by reducing the loan and removing the selected mortgage-insurance input. It does not predict qualification.</p>

<h2>What Lenders Check Beyond Income</h2>
<p>This page does not model underwriting. Credit, debt treatment, income documentation, down payment, and approval criteria vary by lender, borrower, and loan program. Use the displayed ratios only as editable planning assumptions.</p>

<h2>Related Calculators</h2>
<ul>
  <li>For monthly payment details on a similar loan, see the <a href="/calculator/700k-mortgage-monthly-payment-7-percent">$700,000 mortgage monthly payment page</a>.</li>
  <li>Compare the <a href="/calculator/how-much-house-can-i-afford-100k-salary">$100,000 salary scenario</a> with the $159,000 illustrative income result shown here.</li>
  <li>Use the <a href="/affordability-calculator">affordability calculator</a> to model your full financial picture.</li>
  <li>Use the <a href="/mortgage-calculator">mortgage calculator</a> to adjust term and rate.</li>
</ul>

<div class="flex flex-col md:flex-row gap-6 my-12 text-center">
  <div class="flex-1 bg-primary p-8 rounded-3xl text-white shadow-xl">
    <h3 class="text-xl font-bold mb-4">Check Your Affordability</h3>
    <p class="mb-6 opacity-90 text-sm">Model a price range under editable planning assumptions.</p>
    <a href="/affordability-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Check Affordability →</a>
  </div>
  <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm">
    <h3 class="text-xl font-bold mb-4">Calculate This Mortgage</h3>
    <p class="mb-6 opacity-70 text-sm">Run your specific numbers with our full mortgage tool.</p>
    <a href="/mortgage-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Go to Calculator →</a>
  </div>
</div>
    `,
    customFaqs: [
      {
        question: "What income do I need for a $500,000 house?",
        answer: "With 10% down and a $450,000 loan at the 6.8% example rate, the selected 28% planning ratio produces about $126,000 using principal and interest or $159,000 with the page's added cost inputs. The 20% down scenario produces about $138,000. These are illustrative results, not approval requirements."
      },
      {
        question: "What does a $150,000 income imply in this $500,000 scenario?",
        answer: "At $150,000 income, the page's 28% assumption gives a $3,500 monthly housing budget, compared with $3,720 under the 10%-down cost assumptions. At 20% down, the displayed estimate falls to about $3,370. These are planning scenarios, not approval predictions."
      },
      {
        question: "What is the monthly payment on a $450,000 mortgage at 6.8%?",
        answer: "The monthly principal and interest on a $450,000 mortgage at 6.8% over 30 years is $2,934. Adding property tax ($458/mo at 1.1% of a $500,000 home), homeowners insurance ($140/mo), and PMI ($188/mo for 10% down) brings the full PITI to $3,720 per month."
      },
      {
        question: "How much down payment do I need for a $500k home?",
        answer: "The page compares 3%, 10%, and 20% down-payment assumptions. At 3%, it includes a $202 monthly mortgage-insurance estimate; at 20%, it removes that assumption. Actual down-payment and insurance terms vary by loan and lender."
      }
    ]
  },

  {
    slug: 'income-required-for-600k-house',
    type: 'mortgage',
    amount: 540000,
    rate: 6.8,
    term: 30,
    currency: 'USD',
    customTitle: "What Salary Do You Need to Afford a $600,000 Home in 2026?",
    customDescription: "What income do you need for a $600,000 house? See illustrative income scenarios, editable cost assumptions, debt sensitivity, and down-payment options.",
    customH1: "How Much Do You Need to Earn to Buy a $600,000 Home?",
    customIntro: "This illustrative U.S. scenario models a $600,000 home with 10% down, producing a $540,000 loan at the selected 6.8% example annual interest rate. The page compares editable cost, debt, down-payment, and income-ratio assumptions. It does not describe a typical buyer or predict approval.",
    customContent: `
<h2>Illustrative Income for a $600,000 House</h2>
<p>The calculations below assume 10% down ($60,000) on a $600,000 purchase, producing a $540,000 loan at a 6.8% example rate over 30 years. The 28% housing-cost and 36% total-debt ratios are illustrative planning inputs rather than approval rules.</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Scenario</th>
        <th class="py-3 px-4 font-bold text-sm">Monthly Cost</th>
        <th class="py-3 px-4 font-bold text-sm">Illustrative Annual Income</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">P&amp;I only</td>
        <td class="py-3 px-4 text-sm">$3,520</td>
        <td class="py-3 px-4 text-sm">~$151,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30 font-bold bg-primary/5">
        <td class="py-3 px-4 text-sm">Full PITI (P&amp;I + tax $550 + insurance $150 + PMI $225)</td>
        <td class="py-3 px-4 text-sm">$4,445</td>
        <td class="py-3 px-4 text-sm">~$191,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">Full PITI + $500/mo existing debt</td>
        <td class="py-3 px-4 text-sm">$4,945</td>
        <td class="py-3 px-4 text-sm">~$165,000</td>
      </tr>
    </tbody>
  </table>
</div>

<p>The model applies selected 1.1% property-tax and 0.5% annual mortgage-insurance inputs. The 20% down scenario removes the $225 monthly insurance input. Dividing the displayed cost by the selected ratio produces a $191,000 illustrative income figure, not an approval threshold. Use the <a href="/mortgage-calculator">mortgage calculator</a> to see how a 15-year term dramatically cuts total interest.</p>

<h2>How Existing Debt Changes the $600,000 Planning Scenario</h2>
<p>At the $191,000 baseline income, the 36% back-end ceiling is generous: meaning moderate existing debts still leave significant room for housing. The impact is less severe than at lower price points:</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Monthly Debt</th>
        <th class="py-3 px-4 font-bold text-sm">Max Housing Budget</th>
        <th class="py-3 px-4 font-bold text-sm">Fits Selected Scenario?</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30 bg-primary/5">
        <td class="py-3 px-4 text-sm">$0</td>
        <td class="py-3 px-4 text-sm">$4,457/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Within selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$300/mo</td>
        <td class="py-3 px-4 text-sm">$5,430/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Within selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$600/mo</td>
        <td class="py-3 px-4 text-sm">$5,130/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Within selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$900/mo</td>
        <td class="py-3 px-4 text-sm">$4,830/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Near selected ratio</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>How Down Payment Size Changes Illustrative Income</h2>
<p>In this model, moving from 10% to 20% down removes the $225 monthly mortgage-insurance input and lowers principal and interest by $391 per month, a combined scenario difference of $616:</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Down Payment</th>
        <th class="py-3 px-4 font-bold text-sm">Down Amount</th>
        <th class="py-3 px-4 font-bold text-sm">Loan Amount</th>
        <th class="py-3 px-4 font-bold text-sm">Monthly P&amp;I</th>
        <th class="py-3 px-4 font-bold text-sm">Illustrative Income</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">3%</td>
        <td class="py-3 px-4 text-sm">$18,000</td>
        <td class="py-3 px-4 text-sm">$582,000</td>
        <td class="py-3 px-4 text-sm">$3,794</td>
        <td class="py-3 px-4 text-sm">~$163,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">5%</td>
        <td class="py-3 px-4 text-sm">$30,000</td>
        <td class="py-3 px-4 text-sm">$570,000</td>
        <td class="py-3 px-4 text-sm">$3,716</td>
        <td class="py-3 px-4 text-sm">~$159,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30 bg-primary/5 font-bold">
        <td class="py-3 px-4 text-sm">10% (this page)</td>
        <td class="py-3 px-4 text-sm">$60,000</td>
        <td class="py-3 px-4 text-sm">$540,000</td>
        <td class="py-3 px-4 text-sm">$3,520</td>
        <td class="py-3 px-4 text-sm">~$151,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">20%: insurance input $0</td>
        <td class="py-3 px-4 text-sm">$120,000</td>
        <td class="py-3 px-4 text-sm">$480,000</td>
        <td class="py-3 px-4 text-sm">$3,129</td>
        <td class="py-3 px-4 text-sm">~$134,000</td>
      </tr>
    </tbody>
  </table>
</div>

<p>With 20% down, the selected cost inputs total $3,829 per month and the 28% planning ratio produces about $164,000 in illustrative annual income, compared with about $191,000 at 10% down. These are scenario outputs rather than approval requirements.</p>

<h2>What Lenders Check Beyond Income</h2>
<p>This page does not model underwriting. Credit, income sources, asset documentation, down-payment history, and pricing criteria vary by lender, borrower, and loan program.</p>

<h2>Related Calculators</h2>
<ul>
  <li>See the full payment table on the <a href="/calculator/700k-mortgage-monthly-payment-7-percent">$700,000 mortgage monthly payment page</a>.</li>
  <li>Compare with <a href="/calculator/how-much-house-can-i-afford-100k-salary">how much house a $100k salary can afford</a> to see how far below this price range that income falls.</li>
  <li>Use the <a href="/affordability-calculator">affordability calculator</a> to model your combined household income and debt profile.</li>
  <li>Use the <a href="/mortgage-calculator">mortgage calculator</a> to compare 15-year and 30-year scenarios.</li>
</ul>

<div class="flex flex-col md:flex-row gap-6 my-12 text-center">
  <div class="flex-1 bg-primary p-8 rounded-3xl text-white shadow-xl">
    <h3 class="text-xl font-bold mb-4">Check Your Affordability</h3>
    <p class="mb-6 opacity-90 text-sm">See how your combined income and debts translate to buying power.</p>
    <a href="/affordability-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Check Affordability →</a>
  </div>
  <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm">
    <h3 class="text-xl font-bold mb-4">Calculate This Mortgage</h3>
    <p class="mb-6 opacity-70 text-sm">Compare 15-year and 30-year total costs side by side.</p>
    <a href="/mortgage-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Go to Calculator →</a>
  </div>
</div>
    `,
    customFaqs: [
      {
        question: "What income do I need for a $600,000 house?",
        answer: "With 10% down and a $540,000 loan at the 6.8% example rate, the selected 28% ratio produces about $151,000 using principal and interest or $191,000 with the page's added cost inputs. The 20% scenario removes its mortgage-insurance input and produces about $164,000. These are illustrative results."
      },
      {
        question: "Can a dual income of $95,000 each afford a $600,000 home?",
        answer: "A $190,000 income is close to the model's $191,000 illustrative result for the 10% down scenario. Moving the down-payment input to 20% lowers that result to about $164,000 by reducing the loan and removing the $225 monthly mortgage-insurance assumption. Neither result predicts approval."
      },
      {
        question: "What is the monthly payment on a $600,000 house at 6.8%?",
        answer: "With 10% down ($60,000), the $540,000 loan at 6.8% over 30 years has a monthly P&I of $3,520. Adding property tax ($550/mo), homeowners insurance ($150/mo), and PMI ($225/mo) brings the total PITI to $4,445 per month. The 20% down scenario removes the selected mortgage-insurance input; actual cancellation terms vary by loan."
      },
      {
        question: "How does 20% down change the $600k planning scenario?",
        answer: "At 20% down, the loan drops to $480,000, principal and interest falls to $3,129 per month, and the model removes the $225 mortgage-insurance input. The displayed total becomes about $3,829 instead of $4,445, changing the illustrative income result from $191,000 to about $164,000."
      }
    ]
  },

  {
    slug: 'income-required-for-700k-house',
    type: 'mortgage',
    amount: 630000,
    rate: 6.8,
    term: 30,
    currency: 'USD',
    customTitle: "Illustrative Income for a $700,000 House",
    customDescription: "Buying a $700,000 home puts you in a top income bracket. See illustrative income scenarios, editable cost assumptions, a debt-impact table, and down-payment scenarios.",
    customH1: "What Income Does a $700,000 House Actually Require?",
    customIntro: "This illustrative U.S. scenario models a $700,000 home with 10% down, producing a $630,000 loan. At the selected 6.8% example annual interest rate, principal and interest is $4,107 per month. The page compares editable local-cost, debt, down-payment, and income-ratio assumptions and does not describe a typical buyer or predict approval.",
    customContent: `
<h2>Illustrative Income for a $700,000 House</h2>
<p>The figures below assume 10% down on a $700,000 purchase, creating a $630,000 loan at a 6.8% example annual interest rate over 30 years. The income results use editable 28% housing-cost and 36% total-debt planning assumptions:</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Scenario</th>
        <th class="py-3 px-4 font-bold text-sm">Monthly Cost</th>
        <th class="py-3 px-4 font-bold text-sm">Illustrative Annual Income</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">P&amp;I only</td>
        <td class="py-3 px-4 text-sm">$4,107</td>
        <td class="py-3 px-4 text-sm">~$176,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30 font-bold bg-primary/5">
        <td class="py-3 px-4 text-sm">Full PITI (P&amp;I + tax $642 + insurance $160 + PMI $263)</td>
        <td class="py-3 px-4 text-sm">$5,172</td>
        <td class="py-3 px-4 text-sm">~$222,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">Full PITI + $500/mo existing debt</td>
        <td class="py-3 px-4 text-sm">$5,672</td>
        <td class="py-3 px-4 text-sm">~$189,000</td>
      </tr>
    </tbody>
  </table>
</div>

<p>The model applies selected 1.1% property-tax and 0.5% annual mortgage-insurance inputs. The 20% down scenario removes the $263 monthly insurance input. Replace both assumptions with documented local tax figures and a written insurance quote in the <a href="/affordability-calculator">affordability calculator</a>.</p>

<h2>How Existing Debt Changes the $700,000 Planning Scenario</h2>
<p>This table holds income at $222,000 and shows how the selected 36% total-debt assumption changes the modeled housing budget as example debts increase. It does not predict approval or recommend a debt level:</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Monthly Debt</th>
        <th class="py-3 px-4 font-bold text-sm">Max Housing Budget</th>
        <th class="py-3 px-4 font-bold text-sm">Fits Selected Scenario?</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30 bg-primary/5">
        <td class="py-3 px-4 text-sm">$0</td>
        <td class="py-3 px-4 text-sm">$5,180/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Within selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$300/mo</td>
        <td class="py-3 px-4 text-sm">$6,360/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Within selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$600/mo</td>
        <td class="py-3 px-4 text-sm">$6,060/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Within selected ratio</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">$900/mo</td>
        <td class="py-3 px-4 text-sm">$5,760/mo</td>
        <td class="py-3 px-4 text-sm font-semibold">Within selected ratio</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>How Down Payment Size Changes Illustrative Income</h2>
<p>In this model, moving from 10% to 20% down reduces the loan and removes the selected mortgage-insurance input. The illustrative income result drops by about $27,000:</p>

<div class="overflow-x-auto my-8">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-surface-container-low border-b border-outline-variant">
        <th class="py-3 px-4 font-bold text-sm">Down Payment</th>
        <th class="py-3 px-4 font-bold text-sm">Down Amount</th>
        <th class="py-3 px-4 font-bold text-sm">Loan Amount</th>
        <th class="py-3 px-4 font-bold text-sm">Monthly P&amp;I</th>
        <th class="py-3 px-4 font-bold text-sm">Illustrative Income</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">3%</td>
        <td class="py-3 px-4 text-sm">$21,000</td>
        <td class="py-3 px-4 text-sm">$679,000</td>
        <td class="py-3 px-4 text-sm">$4,427</td>
        <td class="py-3 px-4 text-sm">~$190,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">5%</td>
        <td class="py-3 px-4 text-sm">$35,000</td>
        <td class="py-3 px-4 text-sm">$665,000</td>
        <td class="py-3 px-4 text-sm">$4,335</td>
        <td class="py-3 px-4 text-sm">~$186,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30 bg-primary/5 font-bold">
        <td class="py-3 px-4 text-sm">10% (this page)</td>
        <td class="py-3 px-4 text-sm">$70,000</td>
        <td class="py-3 px-4 text-sm">$630,000</td>
        <td class="py-3 px-4 text-sm">$4,107</td>
        <td class="py-3 px-4 text-sm">~$176,000</td>
      </tr>
      <tr class="border-b border-outline-variant/30">
        <td class="py-3 px-4 text-sm">20%: insurance input $0</td>
        <td class="py-3 px-4 text-sm">$140,000</td>
        <td class="py-3 px-4 text-sm">$560,000</td>
        <td class="py-3 px-4 text-sm">$3,651</td>
        <td class="py-3 px-4 text-sm">~$156,000</td>
      </tr>
    </tbody>
  </table>
</div>

<p>With 20% down, the selected cost inputs total $4,453 per month and the 28% planning ratio produces about $191,000 in illustrative annual income, compared with about $222,000 at 10% down. These are scenario outputs rather than approval requirements.</p>

<h2>What Lenders Check Beyond Income</h2>
<p>The page links to the FHFA's 2026 conforming-loan-limit release. Whether a loan is conforming and what documentation, reserves, insurance, or down payment it requires depend on the property and loan program. The 0.5% mortgage-insurance figure shown here is only an editable cost assumption.</p>

<h2>Related Calculators</h2>
<ul>
  <li>For a detailed payment breakdown on a similar loan, see the <a href="/calculator/700k-mortgage-monthly-payment-7-percent">$700,000 mortgage monthly payment page</a>.</li>
  <li>Compare the <a href="/calculator/how-much-house-can-i-afford-100k-salary">$100,000 salary scenario</a> with the $222,000 illustrative income result shown here.</li>
  <li>Use the <a href="/affordability-calculator">affordability calculator</a> to model your combined income, assets, and debts.</li>
  <li>Use the <a href="/mortgage-calculator">mortgage calculator</a> to compare 15-year and 30-year payoff scenarios.</li>
</ul>

<div class="flex flex-col md:flex-row gap-6 my-12 text-center">
  <div class="flex-1 bg-primary p-8 rounded-3xl text-white shadow-xl">
    <h3 class="text-xl font-bold mb-4">Check Your Affordability</h3>
    <p class="mb-6 opacity-90 text-sm">Find the price range that matches your household income and assets.</p>
    <a href="/affordability-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Check Affordability →</a>
  </div>
  <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant shadow-sm">
    <h3 class="text-xl font-bold mb-4">Calculate This Mortgage</h3>
    <p class="mb-6 opacity-70 text-sm">Run the full payment breakdown including interest saved at 15 years.</p>
    <a href="/mortgage-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Go to Calculator →</a>
  </div>
</div>
    `,
    customFaqs: [
      {
        question: "What income do I need for a $700,000 house?",
        answer: "With 10% down and a $630,000 loan at the 6.8% example rate, the selected 28% ratio produces about $176,000 using principal and interest or $222,000 with the page's added cost inputs. The 20% scenario removes its mortgage-insurance input and produces about $191,000. These are illustrative results."
      },
      {
        question: "What is the monthly payment on a $700,000 house at 6.8%?",
        answer: "With 10% down ($70,000), the $630,000 loan at 6.8% over 30 years carries a monthly principal and interest of $4,107. Adding property tax ($642/mo at 1.1% of $700,000), homeowners insurance ($160/mo), and PMI ($263/mo) brings the full PITI to $5,172 per month. The 20% down scenario removes the selected $263 mortgage-insurance input; actual cancellation terms vary by loan."
      },
      {
        question: "Is a $222,000 income enough for a $700,000 home?",
        answer: "At $222,000 annual income, the selected 28% planning ratio produces about $5,180 per month, close to the model's $5,172 total at 10% down. Changing the down-payment input to 20% lowers the modeled total to about $4,453 and the illustrative income result to about $191,000. These are scenarios, not recommendations or approval estimates."
      },
      {
        question: "How does a larger down payment change the income needed for $700k?",
        answer: "Moving from 10% to 20% down reduces the loan from $630,000 to $560,000, cutting principal and interest from $4,107 to $3,651 and removing the selected $263 mortgage-insurance input. The modeled total falls by $719 per month, changing the illustrative income result from about $222,000 to $191,000."
      }
    ]
  },

  // Mortgages EUR: Wave 5A
  {
    slug: '150k-mortgage-monthly-payment-3-5-percent-eur',
    type: 'mortgage',
    amount: 150000,
    rate: 3.5,
    term: 25,
    currency: 'EUR',
    customTitle: "€150,000 Mortgage at 3.5%: Monthly Payment & Affordability Guide",
    customDescription: "€150,000 mortgage at 3.5% over 25 years in. Exact monthly payment, rate table, illustrative affordability check, and Euribor vs fixed rate guidance.",
    customH1: "€150,000 Mortgage at 3.5%: Monthly Payments for European First-Time Buyers",
    customIntro: "This illustrative scenario models a €150,000 euro-denominated mortgage at a 3.5% example annual interest rate over 25 years. The rate is an editable input rather than a claim about available offers. Taxes, insurance, transaction costs, eligibility, and lender rules are excluded unless explicitly entered.",
    customContent: `
      <h2>Monthly Payment on a €150,000 Mortgage at 3.5%</h2>
      <p>Here is the full breakdown for a €150,000 loan at a 3.5% fixed rate across every common term:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Term</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">10 years</td><td class="py-3 px-4 text-sm">€1,483</td><td class="py-3 px-4 text-sm">€27,960</td><td class="py-3 px-4 text-sm">€177,960</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">15 years</td><td class="py-3 px-4 text-sm">€1,072</td><td class="py-3 px-4 text-sm">€42,960</td><td class="py-3 px-4 text-sm">€192,960</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">20 years</td><td class="py-3 px-4 text-sm">€870</td><td class="py-3 px-4 text-sm">€58,800</td><td class="py-3 px-4 text-sm">€208,800</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">25 years</td><td class="py-3 px-4 text-sm">€751</td><td class="py-3 px-4 text-sm">€75,300</td><td class="py-3 px-4 text-sm">€225,300</td></tr>
            <tr class="border-b border-outline-variant/30 text-sm text-on-surface/60"><td class="py-3 px-4 text-sm">30 years (comparison term)</td><td class="py-3 px-4 text-sm">€674</td><td class="py-3 px-4 text-sm">€92,640</td><td class="py-3 px-4 text-sm">€242,640</td></tr>
          </tbody>
        </table>
      </div>

      <p>At 3.5% over 25 years the monthly principal and interest payment is €751, and the total interest over the life of the loan is €75,300. Choosing the 20-year term instead adds €119 to the monthly payment but saves €16,500 in total interest. Use the <a href="/mortgage-calculator">mortgage calculator</a> above to run your exact scenario, or check our <a href="/affordability-calculator">affordability calculator</a> to confirm your buying power.</p>

      <h2>Fixed and Variable Rate Scenarios</h2>
      <p>The 3.5% rate is a selected calculator assumption. A quoted variable rate may change over time, while a fixed-rate quote follows its contract terms. The sensitivity table below compares mathematical inputs and does not claim that any rate or product is available in a particular country.</p>

      <h2>Rate Sensitivity: €150,000 Mortgage at 25 Years</h2>
      <p>How much does the rate actually matter? Here is the full picture for a €150,000 loan over 25 years across the displayed example range:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Rate</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">vs 3.5%</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">2.5%</td><td class="py-3 px-4 text-sm">€673</td><td class="py-3 px-4 text-sm">€51,900</td><td class="py-3 px-4 text-sm">-€78/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">3.0%</td><td class="py-3 px-4 text-sm">€711</td><td class="py-3 px-4 text-sm">€63,300</td><td class="py-3 px-4 text-sm">-€40/mo</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">3.5%</td><td class="py-3 px-4 text-sm">€751</td><td class="py-3 px-4 text-sm">€75,300</td><td class="py-3 px-4 text-sm">-</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">4.0%</td><td class="py-3 px-4 text-sm">€792</td><td class="py-3 px-4 text-sm">€87,600</td><td class="py-3 px-4 text-sm">+€41/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">4.5%</td><td class="py-3 px-4 text-sm">€834</td><td class="py-3 px-4 text-sm">€100,200</td><td class="py-3 px-4 text-sm">+€83/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">5.0%</td><td class="py-3 px-4 text-sm">€877</td><td class="py-3 px-4 text-sm">€113,100</td><td class="py-3 px-4 text-sm">+€126/mo</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Illustrative Affordability Check for a €150,000 Mortgage at 3.5%</h2>
      <p>The table uses a selected 33% payment-to-income assumption for stress testing. It is not a European or lender qualification rule. Approval criteria vary by jurisdiction, lender, loan product, and borrower.</p>
      <p><em>Local taxes, insurance, transaction costs, and loan-specific charges are editable example inputs and may be excluded. Replace them with documented local figures before using the estimate.</em></p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Scenario</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Cost</th>
              <th class="py-3 px-4 font-bold text-sm">Illustrative Annual Income</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">P&I only</td><td class="py-3 px-4 text-sm">€751</td><td class="py-3 px-4 text-sm">~€27,300</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">Payment plus example local costs</td><td class="py-3 px-4 text-sm">€843</td><td class="py-3 px-4 text-sm">~€30,700</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">With €300 other debts</td><td class="py-3 px-4 text-sm">€1,143</td><td class="py-3 px-4 text-sm">~€41,600</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Jurisdiction and Cost Scope</h2>
      <p>This euro-denominated page is a mathematical scenario rather than country-specific mortgage guidance. It does not estimate local eligibility, taxes, registration or notary fees, insurance, subsidies, or lender rules. Use a written local quote and local cost inputs for a real decision.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white text-center shadow-xl">
          <h3 class="text-xl font-bold mb-4">Calculate Your Euro Mortgage</h3>
          <p class="mb-6 opacity-90 text-sm">Model any rate, term, and deposit for a European property.</p>
          <a href="/mortgage-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Go to Calculator →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant text-center shadow-sm">
          <h3 class="text-xl font-bold mb-4">Check Affordability</h3>
          <p class="mb-6 opacity-70 text-sm">Find the price range that fits your income and savings.</p>
          <a href="/affordability-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Check Affordability →</a>
        </div>
      </div>
    `,
    customFaqs: euroScenarioFaqs(150000)
  },

  {
    slug: '200k-mortgage-monthly-payment-3-5-percent-eur',
    type: 'mortgage',
    amount: 200000,
    rate: 3.5,
    term: 25,
    currency: 'EUR',
    showPrefilledCalculator: true,
    customTitle: '€200,000 Mortgage at 3.5%: Term and Total Interest',
    customDescription: 'A €200,000 loan principal at a 3.5% selected annual rate: exact 25-year payment, editable euro calculator, and term sensitivity.',
    customH1: '€200,000 Mortgage at 3.5%: How the Term Changes Cost',
    customIntro: 'This euro-denominated mathematical example starts with a €200,000 property price and no deposit, so the loan principal is €200,000. It applies a selected 3.5% nominal annual interest rate over 25 years. Local taxes, insurance, recurring property charges, transaction costs, maintenance, subsidies, and loan-specific fees are excluded from the headline payment.',
    scenarioQuestion: 'How much does the term change a €200,000 mortgage?',
    directAnswer: `At the selected 25-year term, the estimated principal-and-interest payment is ${loanValue(200000, 3.5, 25, 'monthly', 'EUR')} and total scheduled interest is ${loanValue(200000, 3.5, 25, 'totalInterest', 'EUR')}. A shorter term raises the monthly payment but reduces the number of interest-bearing months.`,
    calculatorDescription: 'The initial property price and loan principal are both €200,000 because the selected deposit is €0. Edit the euro amount, deposit, annual rate, term, and any documented property-cost inputs.',
    customContent: `
      <h2>Compare the monthly payment with the full-term interest cost</h2>
      <p>The table holds the ${formatCurrency(200000, 0, 'EUR')} principal and selected 3.5% nominal annual rate constant. Every row uses equal end-of-month payments and the same amortization function as the editable calculator.</p>
      <div class="overflow-x-auto my-8 border border-outline-variant/30 rounded-2xl">
        ${loanTable(200000, [3.5], [15, 20, 25, 30], 'EUR')}
      </div>
      <p>The selected 25-year term requires <strong>${loanValue(200000, 3.5, 25, 'monthly', 'EUR')}</strong> per month. The 20-year term raises that payment to <strong>${loanValue(200000, 3.5, 20, 'monthly', 'EUR')}</strong>, while the 30-year comparison lowers it to <strong>${loanValue(200000, 3.5, 30, 'monthly', 'EUR')}</strong>. Use the total-interest column to judge the cost of extending the term rather than choosing on payment alone.</p>

      <h2>What is included and what remains local</h2>
      <p>The calculation includes only the stated euro loan principal, selected annual rate, selected term, and scheduled principal-and-interest payments. It excludes local taxes, insurance, recurring property charges, registration or notary costs, maintenance, valuation costs, subsidies, and lender fees.</p>
      <p>The table keeps one annual rate constant for the full modeled term. If a written contract permits later rate changes, test those contract-defined adjustments as separate scenarios rather than treating this fixed-input result as a forecast.</p>
      <p>This is not guidance for a single country or lending jurisdiction. Replace the assumptions with a written local offer and documented property costs. For a larger principal with a deposit comparison, see the <a href="/eur/calculator/300k-mortgage-monthly-payment-3-5-percent-eur">€300,000 mortgage scenario</a>; for a smaller amount, see the <a href="/eur/calculator/150k-mortgage-monthly-payment-3-5-percent-eur">€150,000 scenario</a>.</p>
    `,
    customFaqs: euroScenarioFaqs(200000),
  },

  {
    slug: '250k-mortgage-monthly-payment-3-5-percent-eur',
    type: 'mortgage',
    amount: 250000,
    rate: 3.5,
    term: 25,
    currency: 'EUR',
    customTitle: "€250,000 Mortgage at 3.5%: Monthly Payment & Affordability Guide",
    customDescription: "€250,000 mortgage at a 3.5% example rate for 25 years: €1,252 monthly principal and interest, an editable stress test, and rate sensitivity.",
    customH1: "€250,000 Mortgage at 3.5%: European Payment Breakdown and Affordability",
    customIntro: "This illustrative scenario models a €250,000 euro-denominated mortgage at a 3.5% example annual interest rate over 25 years. The rate is an editable input rather than a claim about available offers. Taxes, insurance, transaction costs, eligibility, and lender rules are excluded unless explicitly entered.",
    customContent: `
      <h2>Monthly Payment on a €250,000 Mortgage at 3.5%</h2>
      <p>At €250,000, term selection makes a significant difference to monthly affordability. Here is the breakdown for a 3.5% fixed rate across every common term:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Term</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">10 years</td><td class="py-3 px-4 text-sm">€2,472</td><td class="py-3 px-4 text-sm">€46,640</td><td class="py-3 px-4 text-sm">€296,640</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">15 years</td><td class="py-3 px-4 text-sm">€1,787</td><td class="py-3 px-4 text-sm">€71,660</td><td class="py-3 px-4 text-sm">€321,660</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">20 years</td><td class="py-3 px-4 text-sm">€1,450</td><td class="py-3 px-4 text-sm">€98,000</td><td class="py-3 px-4 text-sm">€348,000</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">25 years</td><td class="py-3 px-4 text-sm">€1,252</td><td class="py-3 px-4 text-sm">€125,600</td><td class="py-3 px-4 text-sm">€375,600</td></tr>
            <tr class="border-b border-outline-variant/30 text-sm text-on-surface/60"><td class="py-3 px-4 text-sm">30 years (comparison term)</td><td class="py-3 px-4 text-sm">€1,123</td><td class="py-3 px-4 text-sm">€154,280</td><td class="py-3 px-4 text-sm">€404,280</td></tr>
          </tbody>
        </table>
      </div>

      <p>At 3.5% over 25 years the monthly principal and interest payment is €1,252. Shortening the term to 20 years adds €198 per month but saves €27,600 in total interest. The difference between a 25-year and a 15-year term is €535 per month but saves €53,940 in interest over the life of the loan: a decision that depends heavily on monthly cash flow and income stability. Use the <a href="/mortgage-calculator">mortgage calculator</a> to compare scenarios, and verify your buying power with our <a href="/affordability-calculator">affordability calculator</a>.</p>

      <h2>Fixed and Variable Rate Scenarios</h2>
      <p>The 3.5% rate is a selected calculator assumption. A quoted variable rate may change over time, while a fixed-rate quote follows its contract terms. The sensitivity table below compares mathematical inputs and does not claim that any rate or product is available in a particular country.</p>

      <h2>Rate Sensitivity: €250,000 Mortgage at 25 Years</h2>
      <p>Here is what different rates cost on a €250,000 loan over the selected 25-year term:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Rate</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">vs 3.5%</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">2.5%</td><td class="py-3 px-4 text-sm">€1,122</td><td class="py-3 px-4 text-sm">€86,600</td><td class="py-3 px-4 text-sm">-€130/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">3.0%</td><td class="py-3 px-4 text-sm">€1,186</td><td class="py-3 px-4 text-sm">€105,800</td><td class="py-3 px-4 text-sm">-€66/mo</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">3.5%</td><td class="py-3 px-4 text-sm">€1,252</td><td class="py-3 px-4 text-sm">€125,600</td><td class="py-3 px-4 text-sm">-</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">4.0%</td><td class="py-3 px-4 text-sm">€1,320</td><td class="py-3 px-4 text-sm">€146,000</td><td class="py-3 px-4 text-sm">+€68/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">4.5%</td><td class="py-3 px-4 text-sm">€1,390</td><td class="py-3 px-4 text-sm">€167,000</td><td class="py-3 px-4 text-sm">+€138/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">5.0%</td><td class="py-3 px-4 text-sm">€1,461</td><td class="py-3 px-4 text-sm">€188,300</td><td class="py-3 px-4 text-sm">+€209/mo</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Illustrative Affordability Check for a €250,000 Mortgage at 3.5%</h2>
      <p>The table uses a selected 33% payment-to-income assumption for stress testing. It is not a European or lender qualification rule. Approval criteria vary by jurisdiction, lender, loan product, and borrower.</p>
      <p><em>Local taxes, insurance, transaction costs, and loan-specific charges are editable example inputs and may be excluded. Replace them with documented local figures before using the estimate.</em></p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Scenario</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Cost</th>
              <th class="py-3 px-4 font-bold text-sm">Illustrative Annual Income</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">P&I only</td><td class="py-3 px-4 text-sm">€1,252</td><td class="py-3 px-4 text-sm">~€45,500</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">Payment plus example local costs</td><td class="py-3 px-4 text-sm">€1,397</td><td class="py-3 px-4 text-sm">~€50,800</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">With €300 other debts</td><td class="py-3 px-4 text-sm">€1,697</td><td class="py-3 px-4 text-sm">~€61,700</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Jurisdiction and Cost Scope</h2>
      <p>This euro-denominated page is a mathematical scenario rather than country-specific mortgage guidance. It does not estimate local eligibility, taxes, registration or notary fees, insurance, subsidies, or lender rules. Use a written local quote and local cost inputs for a real decision.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white text-center shadow-xl">
          <h3 class="text-xl font-bold mb-4">Calculate Your Euro Mortgage</h3>
          <p class="mb-6 opacity-90 text-sm">Model any rate, term, and deposit for a European property.</p>
          <a href="/mortgage-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Go to Calculator →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant text-center shadow-sm">
          <h3 class="text-xl font-bold mb-4">Check Affordability</h3>
          <p class="mb-6 opacity-70 text-sm">Find the price range that fits your income and savings.</p>
          <a href="/affordability-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Check Affordability →</a>
        </div>
      </div>
    `,
    customFaqs: euroScenarioFaqs(250000)
  },

  // Mortgages EUR: Wave 5B
  {
    slug: '300k-mortgage-monthly-payment-3-5-percent-eur',
    type: 'mortgage',
    amount: 300000,
    rate: 3.5,
    term: 25,
    currency: 'EUR',
    showPrefilledCalculator: true,
    customTitle: '€300,000 Mortgage at 3.5%: Deposit and Loan Amount',
    customDescription: 'See how selected deposit assumptions change the loan principal, monthly payment, and total interest for a €300,000 property at 3.5% over 25 years.',
    customH1: '€300,000 Mortgage at 3.5%: Deposit Versus Loan Principal',
    customIntro: 'This euro-denominated mathematical example starts with a €300,000 property price and no deposit, so the initial loan principal is €300,000. It applies a selected 3.5% nominal annual interest rate over 25 years. Local taxes, insurance, recurring property charges, transaction costs, maintenance, subsidies, and lender fees are excluded from the headline payment.',
    scenarioQuestion: 'How does a down payment change a €300,000 mortgage?',
    directAnswer: `With no deposit, the selected property price and loan principal are both ${formatCurrency(300000, 0, 'EUR')}, producing an estimated principal-and-interest payment of ${loanValue(300000, 3.5, 25, 'monthly', 'EUR')}. A deposit reduces the amount financed; it is separate upfront cash rather than an extra loan payment.`,
    calculatorDescription: 'The initial property price and loan principal are both €300,000 because the selected deposit is €0. Edit the deposit to see the financed principal and monthly result update together.',
    customContent: `
      <h2>Compare deposit cash with the resulting loan principal</h2>
      <p>The table holds the ${formatCurrency(300000, 0, 'EUR')} property price, selected 3.5% nominal annual rate, and 25-year term constant. It changes only the selected deposit percentage, then recalculates the principal, monthly payment, and total interest with the shared finance functions.</p>
      <div class="overflow-x-auto my-8 border border-outline-variant/30 rounded-2xl">
        ${downPaymentTable(300000, [0, 10, 20], 3.5, 25, 'EUR')}
      </div>
      <p>A 10% selected deposit produces a <strong>${formatCurrency(270000, 2, 'EUR')}</strong> loan principal and a <strong>${loanValue(270000, 3.5, 25, 'monthly', 'EUR')}</strong> monthly payment. A 20% selected deposit produces a <strong>${formatCurrency(240000, 2, 'EUR')}</strong> principal and a <strong>${loanValue(240000, 3.5, 25, 'monthly', 'EUR')}</strong> payment. The lower payments must be weighed against the larger upfront cash contribution.</p>

      <h2>What the deposit comparison does not decide</h2>
      <p>The table does not model the return or liquidity of cash kept outside the purchase, local deposit requirements, transaction charges, taxes, insurance, maintenance, valuation costs, subsidies, or lender eligibility. It is a mathematical comparison rather than guidance for a particular country or loan product.</p>
      <p>Replace every assumption with a written local offer and documented costs. For a term-focused comparison, see the <a href="/eur/calculator/200k-mortgage-monthly-payment-3-5-percent-eur">€200,000 mortgage scenario</a>; for another principal comparison, see the <a href="/eur/calculator/350k-mortgage-monthly-payment-3-5-percent-eur">€350,000 scenario</a>.</p>
    `,
    customFaqs: euroScenarioFaqs(300000),
  },

  {
    slug: '350k-mortgage-monthly-payment-3-5-percent-eur',
    type: 'mortgage',
    amount: 350000,
    rate: 3.5,
    term: 25,
    currency: 'EUR',
    customTitle: "€350,000 Mortgage at 3.5%: Payments, Payments & Rate Guide",
    customDescription: "€350,000 mortgage at a 3.5% example rate for 25 years: €1,752 monthly principal and interest, an editable stress test, and rate sensitivity.",
    customH1: "€350,000 Mortgage at 3.5%: Monthly Costs for Established European Buyers",
    customIntro: "This illustrative scenario models a €350,000 euro-denominated mortgage at a 3.5% example annual interest rate over 25 years. The rate is an editable input rather than a claim about available offers. Taxes, insurance, transaction costs, eligibility, and lender rules are excluded unless explicitly entered.",
    customContent: `
      <h2>Monthly Payment on a €350,000 Mortgage at 3.5%</h2>
      <p>At this loan size, the choice of term materially shapes both monthly affordability and lifetime cost. Here is the full breakdown for a €350,000 loan at a 3.5% fixed rate:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Term</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">10 years</td><td class="py-3 px-4 text-sm">€3,461</td><td class="py-3 px-4 text-sm">€65,320</td><td class="py-3 px-4 text-sm">€415,320</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">15 years</td><td class="py-3 px-4 text-sm">€2,502</td><td class="py-3 px-4 text-sm">€100,360</td><td class="py-3 px-4 text-sm">€450,360</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">20 years</td><td class="py-3 px-4 text-sm">€2,030</td><td class="py-3 px-4 text-sm">€137,200</td><td class="py-3 px-4 text-sm">€487,200</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">25 years</td><td class="py-3 px-4 text-sm">€1,752</td><td class="py-3 px-4 text-sm">€175,600</td><td class="py-3 px-4 text-sm">€525,600</td></tr>
            <tr class="border-b border-outline-variant/30 text-sm text-on-surface/60"><td class="py-3 px-4 text-sm">30 years (comparison term)</td><td class="py-3 px-4 text-sm">€1,572</td><td class="py-3 px-4 text-sm">€215,920</td><td class="py-3 px-4 text-sm">€565,920</td></tr>
          </tbody>
        </table>
      </div>

      <p>At 3.5% over 25 years the monthly principal and interest payment is €1,752. Moving to a 20-year term adds €278 per month but saves €38,400 in total interest, while stretching to 30 years trims €180 off the monthly payment at the cost of an extra €40,320 in interest. Use the <a href="/mortgage-calculator">mortgage calculator</a> above to test your own scenario.</p>

      <h2>Fixed and Variable Rate Scenarios</h2>
      <p>The 3.5% rate is a selected calculator assumption. A quoted variable rate may change over time, while a fixed-rate quote follows its contract terms. The sensitivity table below compares mathematical inputs and does not claim that any rate or product is available in a particular country.</p>

      <h2>Rate Sensitivity: €350,000 Mortgage at 25 Years</h2>
      <p>Here is what different rates cost on a €350,000 loan over the selected 25-year term:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Rate</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">vs 3.5%</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">2.5%</td><td class="py-3 px-4 text-sm">€1,570</td><td class="py-3 px-4 text-sm">€121,000</td><td class="py-3 px-4 text-sm">-€182/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">3.0%</td><td class="py-3 px-4 text-sm">€1,660</td><td class="py-3 px-4 text-sm">€148,000</td><td class="py-3 px-4 text-sm">-€92/mo</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">3.5%</td><td class="py-3 px-4 text-sm">€1,752</td><td class="py-3 px-4 text-sm">€175,600</td><td class="py-3 px-4 text-sm">-</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">4.0%</td><td class="py-3 px-4 text-sm">€1,847</td><td class="py-3 px-4 text-sm">€204,100</td><td class="py-3 px-4 text-sm">+€95/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">4.5%</td><td class="py-3 px-4 text-sm">€1,945</td><td class="py-3 px-4 text-sm">€233,500</td><td class="py-3 px-4 text-sm">+€193/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">5.0%</td><td class="py-3 px-4 text-sm">€2,046</td><td class="py-3 px-4 text-sm">€263,800</td><td class="py-3 px-4 text-sm">+€294/mo</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Illustrative Affordability Check for a €350,000 Mortgage at 3.5%</h2>
      <p>The table uses a selected 33% payment-to-income assumption for stress testing. It is not a European or lender qualification rule. Approval criteria vary by jurisdiction, lender, loan product, and borrower.</p>
      <p><em>Local taxes, insurance, transaction costs, and loan-specific charges are editable example inputs and may be excluded. Replace them with documented local figures before using the estimate.</em></p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Scenario</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Cost</th>
              <th class="py-3 px-4 font-bold text-sm">Illustrative Annual Income</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">P&I only</td><td class="py-3 px-4 text-sm">€1,752</td><td class="py-3 px-4 text-sm">~€63,700</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">Payment plus example local costs</td><td class="py-3 px-4 text-sm">€1,964</td><td class="py-3 px-4 text-sm">~€71,400</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">With €400 other debts</td><td class="py-3 px-4 text-sm">€2,364</td><td class="py-3 px-4 text-sm">~€86,000</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Jurisdiction and Cost Scope</h2>
      <p>This euro-denominated page is a mathematical scenario rather than country-specific mortgage guidance. It does not estimate local eligibility, taxes, registration or notary fees, insurance, subsidies, or lender rules. Use a written local quote and local cost inputs for a real decision.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white text-center shadow-xl">
          <h3 class="text-xl font-bold mb-4">Calculate Your Euro Mortgage</h3>
          <p class="mb-6 opacity-90 text-sm">Model any rate, term, and deposit for a European property.</p>
          <a href="/mortgage-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Go to Calculator →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant text-center shadow-sm">
          <h3 class="text-xl font-bold mb-4">Check Affordability</h3>
          <p class="mb-6 opacity-70 text-sm">Find the price range that fits your income and savings.</p>
          <a href="/affordability-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Check Affordability →</a>
        </div>
      </div>
    `,
    customFaqs: euroScenarioFaqs(350000)
  },

  {
    slug: '400k-mortgage-monthly-payment-3-5-percent-eur',
    type: 'mortgage',
    amount: 400000,
    rate: 3.5,
    term: 25,
    currency: 'EUR',
    customTitle: "€400,000 Mortgage at 3.5%: Jumbo Loan Payment & Income Guide",
    customDescription: "€400,000 mortgage at 3.5% over 25 years in: monthly payment €2,002, illustrative affordability check, jumbo-loan notes, and full rate sensitivity table.",
    customH1: "€400,000 Mortgage at 3.5%: Payments and Illustrative Income for Premium Buyers",
    customIntro: "This illustrative scenario models a €400,000 euro-denominated mortgage at a 3.5% example annual interest rate over 25 years. The rate is an editable input rather than a claim about available offers. Taxes, insurance, transaction costs, eligibility, and lender rules are excluded unless explicitly entered.",
    customContent: `
      <h2>Monthly Payment on a €400,000 Mortgage at 3.5%</h2>
      <p>At this loan size, term selection has a substantial impact on both monthly cash flow and total cost. Here is the full breakdown for a €400,000 loan at a 3.5% fixed rate:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Term</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">10 years</td><td class="py-3 px-4 text-sm">€3,955</td><td class="py-3 px-4 text-sm">€74,600</td><td class="py-3 px-4 text-sm">€474,600</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">15 years</td><td class="py-3 px-4 text-sm">€2,860</td><td class="py-3 px-4 text-sm">€114,800</td><td class="py-3 px-4 text-sm">€514,800</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">20 years</td><td class="py-3 px-4 text-sm">€2,320</td><td class="py-3 px-4 text-sm">€156,800</td><td class="py-3 px-4 text-sm">€556,800</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">25 years</td><td class="py-3 px-4 text-sm">€2,002</td><td class="py-3 px-4 text-sm">€200,600</td><td class="py-3 px-4 text-sm">€600,600</td></tr>
            <tr class="border-b border-outline-variant/30 text-sm text-on-surface/60"><td class="py-3 px-4 text-sm">30 years (comparison term)</td><td class="py-3 px-4 text-sm">€1,796</td><td class="py-3 px-4 text-sm">€246,560</td><td class="py-3 px-4 text-sm">€646,560</td></tr>
          </tbody>
        </table>
      </div>

      <p>At 3.5% over 25 years the monthly principal and interest payment is €2,002. Choosing a 20-year term instead adds €318 per month but saves €43,800 in total interest: a meaningful sum at this loan size. Stretching to 30 years reduces the payment by €206 but adds €45,960 in interest over the full term. Run your own numbers with the <a href="/mortgage-calculator">mortgage calculator</a> above.</p>

      <h2>Fixed and Variable Rate Scenarios</h2>
      <p>The 3.5% rate is a selected calculator assumption. A quoted variable rate may change over time, while a fixed-rate quote follows its contract terms. The sensitivity table below compares mathematical inputs and does not claim that any rate or product is available in a particular country.</p>

      <h2>Rate Sensitivity: €400,000 Mortgage at 25 Years</h2>
      <p>Here is what different rates cost on a €400,000 loan over the selected 25-year term:</p>

      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Rate</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Payment</th>
              <th class="py-3 px-4 font-bold text-sm">Total Interest</th>
              <th class="py-3 px-4 font-bold text-sm">vs 3.5%</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">2.5%</td><td class="py-3 px-4 text-sm">€1,794</td><td class="py-3 px-4 text-sm">€138,200</td><td class="py-3 px-4 text-sm">-€208/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">3.0%</td><td class="py-3 px-4 text-sm">€1,897</td><td class="py-3 px-4 text-sm">€169,100</td><td class="py-3 px-4 text-sm">-€105/mo</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold text-primary"><td class="py-3 px-4 text-sm">3.5%</td><td class="py-3 px-4 text-sm">€2,002</td><td class="py-3 px-4 text-sm">€200,600</td><td class="py-3 px-4 text-sm">-</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">4.0%</td><td class="py-3 px-4 text-sm">€2,111</td><td class="py-3 px-4 text-sm">€233,300</td><td class="py-3 px-4 text-sm">+€109/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">4.5%</td><td class="py-3 px-4 text-sm">€2,223</td><td class="py-3 px-4 text-sm">€266,900</td><td class="py-3 px-4 text-sm">+€221/mo</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">5.0%</td><td class="py-3 px-4 text-sm">€2,338</td><td class="py-3 px-4 text-sm">€301,400</td><td class="py-3 px-4 text-sm">+€336/mo</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Illustrative Affordability Check for a €400,000 Mortgage at 3.5%</h2>
      <p>The table uses a selected 33% payment-to-income assumption for stress testing. It is not a European or lender qualification rule. Approval criteria vary by jurisdiction, lender, loan product, and borrower.</p>
      <p><em>Local taxes, insurance, transaction costs, and loan-specific charges are editable example inputs and may be excluded. Replace them with documented local figures before using the estimate.</em></p>

      <div class="overflow-x-auto my-8 border border-outline-variant rounded-xl overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant">
              <th class="py-3 px-4 font-bold text-sm">Scenario</th>
              <th class="py-3 px-4 font-bold text-sm">Monthly Cost</th>
              <th class="py-3 px-4 font-bold text-sm">Illustrative Annual Income</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">P&I only</td><td class="py-3 px-4 text-sm">€2,002</td><td class="py-3 px-4 text-sm">~€72,800</td></tr>
            <tr class="border-b border-outline-variant/30 font-bold bg-primary/5"><td class="py-3 px-4 text-sm">Payment plus example local costs</td><td class="py-3 px-4 text-sm">€2,243</td><td class="py-3 px-4 text-sm">~€81,600</td></tr>
            <tr class="border-b border-outline-variant/30"><td class="py-3 px-4 text-sm">With €400 other debts</td><td class="py-3 px-4 text-sm">€2,643</td><td class="py-3 px-4 text-sm">~€96,100</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Jurisdiction and Cost Scope</h2>
      <p>This euro-denominated page is a mathematical scenario rather than country-specific mortgage guidance. It does not estimate local eligibility, taxes, registration or notary fees, insurance, subsidies, or lender rules. Use a written local quote and local cost inputs for a real decision.</p>

      <div class="flex flex-col md:flex-row gap-6 my-12">
        <div class="flex-1 bg-primary p-8 rounded-3xl text-white text-center shadow-xl">
          <h3 class="text-xl font-bold mb-4">Calculate Your Euro Mortgage</h3>
          <p class="mb-6 opacity-90 text-sm">Model any rate, term, and deposit for a European property.</p>
          <a href="/mortgage-calculator" class="bg-white text-primary px-8 py-3 rounded-full inline-block font-bold no-underline hover:scale-105 transition-transform">Go to Calculator →</a>
        </div>
        <div class="flex-1 bg-surface-container p-8 rounded-3xl border border-outline-variant text-center shadow-sm">
          <h3 class="text-xl font-bold mb-4">Check Affordability</h3>
          <p class="mb-6 opacity-70 text-sm">Find the price range that fits your income and savings.</p>
          <a href="/affordability-calculator" class="bg-primary text-white px-8 py-3 rounded-full inline-block font-bold no-underline hover:bg-primary/90 transition-all">Check Affordability →</a>
        </div>
      </div>
    `,
    customFaqs: euroScenarioFaqs(400000)
  },
];

const affordability70kBase: AffordabilityTableRow = {
  label: 'No other monthly debt',
  monthlyIncome: 70000 / 12,
  monthlyDebts: 0,
  downPayment: 20000,
  rate: 6.8,
  years: 30,
  monthlyPropertyTax: 200,
  monthlyInsurance: 90,
};

const affordability70kDebtSensitivity: AffordabilityTableRow[] = [
  affordability70kBase,
  { ...affordability70kBase, label: '$400 other monthly debt', monthlyDebts: 400 },
  { ...affordability70kBase, label: '$800 other monthly debt', monthlyDebts: 800 },
  { ...affordability70kBase, label: '$1,200 other monthly debt', monthlyDebts: 1200 },
];

const affordability90kBase: AffordabilityTableRow = {
  label: '$30,000 down; 6.8% rate',
  monthlyIncome: 90000 / 12,
  monthlyDebts: 350,
  downPayment: 30000,
  rate: 6.8,
  years: 30,
  monthlyPropertyTax: 250,
  monthlyInsurance: 120,
};

const affordability90kSensitivity: AffordabilityTableRow[] = [
  affordability90kBase,
  { ...affordability90kBase, label: '$0 down payment', downPayment: 0 },
  { ...affordability90kBase, label: '$60,000 down payment', downPayment: 60000 },
  { ...affordability90kBase, label: '5.8% example rate', rate: 5.8 },
  { ...affordability90kBase, label: '7.8% example rate', rate: 7.8 },
];

const phase4bOverrides: Record<string, Partial<PSEOParams>> = {
  '350k-mortgage-monthly-payment-6-5-percent': {
    showPrefilledCalculator: true,
    customTitle: '$350,000 Mortgage at 6.5%: Term and Rate Trade-Offs',
    customDescription: 'A $350,000 mortgage principal at a 6.5% selected annual rate: exact payment, term and rate comparisons, assumptions, and an editable calculator.',
    customH1: '$350,000 Mortgage at 6.5%: Term or Rate?',
    customIntro: 'This mathematical scenario starts with a $350,000 home price and no down payment, so the loan principal is $350,000. It uses a selected 6.5% nominal annual rate and 30-year term. The headline includes principal and interest only.',
    scenarioQuestion: 'Would a shorter term or a different rate change this $350,000 mortgage more?',
    directAnswer: `The 30-year principal-and-interest payment is ${loanValue(350000, 6.5, 30, 'monthly')}, with ${loanValue(350000, 6.5, 30, 'totalInterest')} of scheduled interest if every payment is made. A 15-year term raises the payment to ${loanValue(350000, 6.5, 15, 'monthly')} but reduces the number of interest-bearing months.`,
    calculatorDescription: 'Edit the $350,000 price, zero down payment, 6.5% annual rate, 30-year term, and any property-cost inputs. The result updates from the shared amortization calculation.',
    customContent: `
      <h2>Term and rate answer different questions</h2>
      <p>A shorter term concentrates principal repayment into fewer payments. A different rate changes the interest charged on the declining balance. The comparison below holds the $350,000 principal constant so those two decisions can be inspected without mixing in a different loan amount.</p>
      <div class="overflow-x-auto my-8 border border-outline-variant/30 rounded-2xl">${loanTable(350000, [5.5, 6.5, 7.5], [15, 30])}</div>
      <p>At the selected 6.5% rate, the 15-year payment is <strong>${loanValue(350000, 6.5, 15, 'monthly')}</strong>, versus <strong>${loanValue(350000, 6.5, 30, 'monthly')}</strong> over 30 years. At 30 years, changing the selected rate to 5.5% produces <strong>${loanValue(350000, 5.5, 30, 'monthly')}</strong>; changing it to 7.5% produces <strong>${loanValue(350000, 7.5, 30, 'monthly')}</strong>.</p>
      <h2>What is included and excluded?</h2>
      <p>The table includes equal end-of-month principal-and-interest payments under the displayed nominal annual rates. Property tax, insurance, mortgage insurance, association dues, maintenance, closing costs, points, and lender fees are excluded unless entered in the calculator. Compare the nearby <a href="/calculator/300k-mortgage-monthly-payment-6-percent">$300,000 at 6% scenario</a> or the protected <a href="/calculator/400k-mortgage-monthly-payment-6-5-percent">$400,000 at 6.5% scenario</a>.</p>
    `,
    customFaqs: [
      { question: 'What is the payment on a $350,000 mortgage at 6.5% for 30 years?', answer: `The estimated principal-and-interest payment is ${loanValue(350000, 6.5, 30, 'monthly')} per month.` },
      { question: 'How much scheduled interest does the 30-year example produce?', answer: `The shared amortization calculation produces ${loanValue(350000, 6.5, 30, 'totalInterest')} of interest if the loan runs for the full term.` },
      { question: 'Are ownership costs included?', answer: 'No. The headline and table exclude property tax, insurance, mortgage insurance, association dues, maintenance, closing costs, points, and lender fees.' },
    ],
  },
  '700k-mortgage-monthly-payment-7-percent': {
    showPrefilledCalculator: true,
    customTitle: '$700,000 Mortgage at 7%: Payment Versus Total Interest',
    customDescription: 'A $700,000 mortgage principal at a 7% selected annual rate: compare monthly cash flow with cumulative interest using an editable calculator.',
    customH1: '$700,000 Mortgage at 7%: Cash Flow Versus Interest',
    customIntro: 'This mathematical scenario uses a $700,000 home price, no down payment, a $700,000 loan principal, a selected 7% nominal annual rate, and a 30-year term. The headline excludes ownership and transaction costs.',
    scenarioQuestion: 'How much monthly cash flow buys lower cumulative interest on a $700,000 mortgage?',
    directAnswer: `The 30-year principal-and-interest payment is ${loanValue(700000, 7, 30, 'monthly')}, and scheduled interest totals ${loanValue(700000, 7, 30, 'totalInterest')} if the loan runs for all 360 payments. Shorter terms increase the required monthly payment while reducing cumulative interest.`,
    calculatorDescription: 'The initial property price and principal are both $700,000 because the selected down payment is zero. Edit the annual rate, term, contribution, and entered property costs to recalculate.',
    customContent: `
      <h2>Compare the monthly obligation with the interest horizon</h2>
      <p>The same $700,000 principal and 7% selected annual rate produce different cash-flow requirements when the repayment horizon changes. The table is generated by the shared amortization function.</p>
      <div class="overflow-x-auto my-8 border border-outline-variant/30 rounded-2xl">${loanTable(700000, [7], [15, 20, 30])}</div>
      <p>The 15-year payment is <strong>${loanValue(700000, 7, 15, 'monthly')}</strong> with <strong>${loanValue(700000, 7, 15, 'totalInterest')}</strong> of scheduled interest. The 20-year payment is <strong>${loanValue(700000, 7, 20, 'monthly')}</strong>. The 30-year payment falls to <strong>${loanValue(700000, 7, 30, 'monthly')}</strong>, while scheduled interest rises to <strong>${loanValue(700000, 7, 30, 'totalInterest')}</strong>.</p>
      <h2>Use the comparison as a capacity test</h2>
      <p>No term is presented as universally preferable. The calculation includes principal and interest only and excludes property tax, insurance, mortgage insurance, association dues, maintenance, closing costs, points, and lender fees. Use the <a href="/amortization-schedule">amortization schedule</a> to inspect balance changes, or compare the retained <a href="/calculator/350k-mortgage-monthly-payment-6-5-percent">$350,000 mortgage scenario</a>.</p>
    `,
    customFaqs: [
      { question: 'What is the payment on a $700,000 mortgage at 7% for 30 years?', answer: `The estimated principal-and-interest payment is ${loanValue(700000, 7, 30, 'monthly')} per month.` },
      { question: 'What is the total scheduled interest?', answer: `The 30-year amortization produces ${loanValue(700000, 7, 30, 'totalInterest')} of interest if the loan runs for the full term.` },
      { question: 'Does this estimate include the full cost of owning a property?', answer: 'No. Taxes, insurance, maintenance, association dues, transaction costs, and loan-specific fees are excluded unless entered separately.' },
    ],
  },
  '20k-loan-monthly-payment-10-percent': {
    showPrefilledCalculator: true,
    customTitle: '$20,000 Loan at 10%: Term, Payment and Total Cost',
    customDescription: 'A $20,000 loan principal at a 10% selected nominal annual note rate: exact payment, term sensitivity, total cost, and an editable calculator.',
    customH1: '$20,000 Loan at 10%: How Term Changes Cost',
    customIntro: 'This mathematical example uses a $20,000 principal, a selected 10% nominal annual note rate, and a five-year term. It includes scheduled principal and interest but excludes origination charges and other fees.',
    scenarioQuestion: 'How much does extending a $20,000 loan reduce the payment and increase total interest?',
    directAnswer: `The five-year payment is ${loanValue(20000, 10, 5, 'monthly')}, with ${loanValue(20000, 10, 5, 'totalInterest')} of scheduled interest. A longer term reduces the monthly payment but keeps the balance outstanding for more interest-bearing months.`,
    calculatorDescription: 'Edit the $20,000 principal, 10% nominal annual note rate, or five-year term. Fees are not modeled, so the selected rate is not an APR when a real product charges fees.',
    customContent: `
      <h2>Three repayment horizons for the same principal and rate</h2>
      <p>The comparison keeps the $20,000 principal and 10% nominal annual note rate fixed, changing only the repayment term.</p>
      <div class="overflow-x-auto my-8 border border-outline-variant/30 rounded-2xl">${loanTable(20000, [10], [3, 5, 7])}</div>
      <p>A three-year term requires <strong>${loanValue(20000, 10, 3, 'monthly')}</strong> per month. Extending to seven years lowers that to <strong>${loanValue(20000, 10, 7, 'monthly')}</strong>, while scheduled interest rises to <strong>${loanValue(20000, 10, 7, 'totalInterest')}</strong>. This is a term trade-off, not a claim that one loan product is universally better.</p>
      <h2>Note rate is not necessarily APR</h2>
      <p>The calculator applies the selected note interest rate to the principal and does not model origination charges, documentation costs, optional products, or other fees. If a quoted loan includes fees, its APR can differ from the 10% note rate. Compare the retained <a href="/calculator/30k-loan-monthly-payment-9-percent">$30,000 loan</a> and <a href="/calculator/50k-loan-monthly-payment-8-percent">$50,000 loan</a> decision examples without assuming the products are otherwise equivalent.</p>
    `,
    customFaqs: [
      { question: 'What is the payment on a $20,000 loan at 10% for five years?', answer: `The estimated scheduled payment is ${loanValue(20000, 10, 5, 'monthly')} per month.` },
      { question: 'How much interest is paid over five years?', answer: `The shared loan calculation produces ${loanValue(20000, 10, 5, 'totalInterest')} of scheduled interest.` },
      { question: 'Is the selected 10% rate an APR?', answer: 'It is a nominal annual note-rate input. Because fees are excluded, it should not be treated as APR when a real loan includes fees.' },
    ],
  },
  'how-much-house-can-i-afford-70k-salary': {
    showPrefilledCalculator: true,
    affordabilityInputs: {
      monthlyIncome: affordability70kBase.monthlyIncome,
      monthlyDebts: affordability70kBase.monthlyDebts,
      downPayment: affordability70kBase.downPayment,
      monthlyPropertyTax: affordability70kBase.monthlyPropertyTax,
      monthlyInsurance: affordability70kBase.monthlyInsurance,
    },
    customTitle: '$70,000 Salary Home Estimate: How Monthly Debt Changes It',
    customDescription: 'A $70,000 salary planning example with editable debt, down payment, rate, tax and insurance inputs, plus a finance-derived debt sensitivity.',
    customH1: 'How Monthly Debt Changes a $70,000 Salary Home Estimate',
    customIntro: 'This U.S.-dollar planning scenario starts with $70,000 annual gross income, no other monthly debt, a $20,000 down payment, a selected 6.8% annual rate for 30 years, $200 monthly property tax, and $90 monthly insurance. The displayed 28% housing and 36% total-debt ratios are selected examples, not lender rules.',
    scenarioQuestion: 'When do monthly debts start reducing the $70,000 salary estimate?',
    directAnswer: `With the selected inputs, the estimated home price is ${affordabilityValue(affordability70kBase, 'maxPrice')}. The housing-ratio example binds before modest debt does; at $800 of other monthly debt, the total-debt example reduces the estimate to ${affordabilityValue(affordability70kDebtSensitivity[2], 'maxPrice')}.`,
    calculatorDescription: 'Edit income, monthly debts, down payment, selected annual rate, term, property tax, and insurance. The result is a planning estimate and does not predict approval.',
    customContent: `
      <h2>Debt can be irrelevant at first, then become the binding constraint</h2>
      <p>The calculation uses the lower of the selected 28% housing budget and 36% total-debt budget, then subtracts the entered tax and insurance costs. With no other debt the estimate is <strong>${affordabilityValue(affordability70kDebtSensitivity[0], 'maxPrice')}</strong>. At $400 of other monthly debt it remains <strong>${affordabilityValue(affordability70kDebtSensitivity[1], 'maxPrice')}</strong> because the housing ratio still binds. At $800, the debt budget becomes tighter.</p>
      <div class="overflow-x-auto my-8 border border-outline-variant/30 rounded-2xl">${affordabilityTable(affordability70kDebtSensitivity)}</div>
      <h2>What the estimate does not decide</h2>
      <p>It does not model closing costs, maintenance, association dues, loan-specific insurance, utilities, taxes beyond the entered amount, or lender underwriting. The ratios are user-selected planning examples and do not guarantee approval. Compare the retained <a href="/calculator/how-much-house-can-i-afford-80k-salary">$80,000 salary sensitivity</a>, the <a href="/calculator/how-much-house-can-i-afford-90k-salary">$90,000 salary scenario</a>, or the consolidated <a href="/income-needed-for-a-house">income-needed planning table</a>.</p>
    `,
    customFaqs: [
      { question: 'What home price does this $70,000 salary example estimate?', answer: `The selected inputs produce ${affordabilityValue(affordability70kBase, 'maxPrice')}. Changing debts or any other input changes the result.` },
      { question: 'Why does $400 of monthly debt not change the selected result?', answer: 'Under these particular inputs, the selected 28% housing ratio remains tighter than the selected 36% total-debt ratio. More debt eventually makes the total-debt example binding.' },
      { question: 'Does the result predict approval?', answer: 'No. It is a mathematical planning example using displayed assumptions, not a lender qualification or approval decision.' },
    ],
  },
  'how-much-house-can-i-afford-90k-salary': {
    showPrefilledCalculator: true,
    affordabilityInputs: {
      monthlyIncome: affordability90kBase.monthlyIncome,
      monthlyDebts: affordability90kBase.monthlyDebts,
      downPayment: affordability90kBase.downPayment,
      monthlyPropertyTax: affordability90kBase.monthlyPropertyTax,
      monthlyInsurance: affordability90kBase.monthlyInsurance,
    },
    customTitle: '$90,000 Salary Home Estimate: Down Payment and Rate Sensitivity',
    customDescription: 'A $90,000 salary planning example showing how the entered down payment and selected annual rate change the estimated home price.',
    customH1: '$90,000 Salary: Down Payment or Rate?',
    customIntro: 'This U.S.-dollar planning scenario uses $90,000 annual gross income, $350 of other monthly debt, a $30,000 down payment, a selected 6.8% annual rate for 30 years, $250 monthly property tax, and $120 monthly insurance. The selected 28% and 36% ratios are examples rather than lender criteria.',
    scenarioQuestion: 'Does a larger down payment or a lower rate move this $90,000 salary estimate further?',
    directAnswer: `The selected inputs produce an estimated home price of ${affordabilityValue(affordability90kBase, 'maxPrice')}. A $60,000 down payment changes it to ${affordabilityValue(affordability90kSensitivity[2], 'maxPrice')}; a selected 5.8% annual rate with the original down payment changes it to ${affordabilityValue(affordability90kSensitivity[3], 'maxPrice')}.`,
    calculatorDescription: 'Edit the salary, debt, down payment, annual rate, term, property tax, and insurance. This planning estimate is not a comfort threshold or approval prediction.',
    customContent: `
      <h2>Down payment adds equity; rate changes financed capacity</h2>
      <p>Within this model, changing the down payment directly changes the difference between estimated loan principal and estimated home price. Changing the selected rate changes how much principal fits the same monthly principal-and-interest allowance.</p>
      <div class="overflow-x-auto my-8 border border-outline-variant/30 rounded-2xl">${affordabilityTable(affordability90kSensitivity)}</div>
      <p>With no down payment the estimate is <strong>${affordabilityValue(affordability90kSensitivity[1], 'maxPrice')}</strong>; with $60,000 down it is <strong>${affordabilityValue(affordability90kSensitivity[2], 'maxPrice')}</strong>. Holding the $30,000 down payment constant, a 5.8% selected rate produces <strong>${affordabilityValue(affordability90kSensitivity[3], 'maxPrice')}</strong>, while 7.8% produces <strong>${affordabilityValue(affordability90kSensitivity[4], 'maxPrice')}</strong>.</p>
      <h2>Planning boundary</h2>
      <p>Closing costs, maintenance, association dues, loan-specific insurance, utilities, and costs beyond the entered tax and insurance values are excluded. These are adjustable mathematical assumptions and do not predict lender approval. Compare the retained <a href="/calculator/how-much-house-can-i-afford-70k-salary">$70,000 debt sensitivity</a> or <a href="/calculator/how-much-house-can-i-afford-80k-salary">$80,000 multi-input sensitivity</a>.</p>
    `,
    customFaqs: [
      { question: 'What price does this $90,000 salary example estimate?', answer: `The selected inputs produce ${affordabilityValue(affordability90kBase, 'maxPrice')}. It is a planning output rather than an approval limit.` },
      { question: 'How does the down payment change this example?', answer: `Keeping the other selected assumptions fixed, a $60,000 down payment produces ${affordabilityValue(affordability90kSensitivity[2], 'maxPrice')}.` },
      { question: 'Does a lower selected rate guarantee more borrowing capacity?', answer: 'No. The table shows mathematical sensitivity only. Available rates, fees, underwriting and approval depend on an actual product and lender.' },
    ],
  },
  '250k-mortgage-monthly-payment-3-5-percent-eur': {
    showPrefilledCalculator: true,
    customTitle: '€250,000 Mortgage at 3.5%: Term and Amount Borrowed',
    customDescription: 'A €250,000 euro-denominated mortgage at a 3.5% selected annual rate: exact payment, term and deposit comparisons, and an editable calculator.',
    customH1: '€250,000 Mortgage at 3.5%: Term or Smaller Principal?',
    customIntro: 'This euro-denominated mathematical scenario starts with a €250,000 property price, no deposit, a €250,000 loan principal, a selected 3.5% nominal annual rate, and a 25-year term. The headline includes principal and interest only.',
    scenarioQuestion: 'Should this €250,000 scenario shorten the term or reduce the amount borrowed?',
    directAnswer: `The 25-year principal-and-interest payment is ${loanValue(250000, 3.5, 25, 'monthly', 'EUR')}. A shorter term raises the payment and reduces scheduled interest; a deposit reduces the principal before the same rate and term are applied.`,
    calculatorDescription: 'Edit the €250,000 property price, deposit, 3.5% selected annual rate, 25-year term, and entered property costs. This is not guidance for a particular European jurisdiction.',
    customContent: `
      <h2>Term sensitivity on the full €250,000 principal</h2>
      <p>The first table holds the loan principal and selected 3.5% annual rate constant while changing only the number of scheduled payments.</p>
      <div class="overflow-x-auto my-8 border border-outline-variant/30 rounded-2xl">${loanTable(250000, [3.5], [15, 20, 25, 30], 'EUR')}</div>
      <p>The payment is <strong>${loanValue(250000, 3.5, 15, 'monthly', 'EUR')}</strong> over 15 years, <strong>${loanValue(250000, 3.5, 20, 'monthly', 'EUR')}</strong> over 20 years, and <strong>${loanValue(250000, 3.5, 30, 'monthly', 'EUR')}</strong> over 30 years.</p>
      <h2>Reducing the principal with a deposit</h2>
      <p>The second comparison keeps the selected 3.5% annual rate and 25-year term fixed while changing the deposit and therefore the amount borrowed.</p>
      <div class="overflow-x-auto my-8 border border-outline-variant/30 rounded-2xl">${downPaymentTable(250000, [0, 10, 20], 3.5, 25, 'EUR')}</div>
      <p>A 10% deposit reduces the principal to €225,000 and the payment to <strong>${loanValue(225000, 3.5, 25, 'monthly', 'EUR')}</strong>. Taxes, insurance, registration or notary costs, maintenance, transaction charges, subsidies, and loan-specific fees are excluded unless entered. Rules vary by country and product, so this page makes no paneuropean approval claim. Compare the retained <a href="/eur/calculator/200k-mortgage-monthly-payment-3-5-percent-eur">€200,000 term scenario</a> or <a href="/eur/calculator/300k-mortgage-monthly-payment-3-5-percent-eur">€300,000 deposit scenario</a>.</p>
    `,
    customFaqs: euroScenarioFaqs(250000),
  },
};

export const pseoData: PSEOParams[] = basePseoData.map((scenario) => ({
  ...scenario,
  ...phase4bOverrides[scenario.slug],
}));

assertPseoPublicationInventory(pseoData);

function getSimpleHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function applyPseoEditorialLinks(content?: string) {
  if (!content) return content;
  return content.replace(
    /<a(\s+[^>]*?)href=(["'])(\/(?:eur\/)?calculator\/([^"']+))\2([^>]*)>([\s\S]*?)<\/a>/g,
    (match, before: string, quote: string, _path: string, slug: string, after: string, label: string) => {
      const decision = getPseoEditorialDecision(slug);
      if (decision.status === 'noindex') return label;
      if (decision.status === 'redirect' && decision.destination) {
        return `<a${before}href=${quote}${decision.destination}${quote}${after}>${label}</a>`;
      }
      return match;
    },
  );
}



export function getPSEOContent(params: PSEOParams, targetCurrency?: 'USD' | 'EUR') {
  const currency = targetCurrency || params.currency;
  const amount = convertCurrency(params.amount, params.currency, currency);
  const salary = params.salary ? convertCurrency(params.salary, params.currency, currency) : undefined;
  
  const formattedAmount = formatCurrency(amount, 0, currency);
  const formattedSalary = salary ? formatCurrency(salary, 0, currency) : '';

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
        intro: `This illustrative scenario applies a ${params.rate}% example annual interest rate to a ${formattedSalary} income. The rate is an editable input and does not represent today's market.`,
      },
      {
        h1: `How Much House Can I Buy with a ${formattedSalary} Salary?`,
        intro: `With a gross annual income of ${formattedSalary}, the estimated housing budget changes with the selected planning ratio, debts, costs, and ${params.rate}% example rate. This does not predict lender approval.`,
      },
      {
        h1: `Budgeting for a Home on ${formattedSalary} a Year`,
        intro: `This example limits housing costs to 28% of gross income as an editable planning assumption. If you earn ${formattedSalary}, here is the resulting estimate rather than a universal affordability limit.`,
      }
    ]
  };

  const selectedPhrasing = phrasing[params.type][variantIdx];

  const tips = {
    mortgage: [
      "Enter the down payment and any quoted mortgage-insurance cost for the loan you are considering.",
      "Use the interest rate and fees from a written quote; pricing criteria vary by lender and loan program.",
      "Consider a 15-year term if you want to save massively on total interest.",
      "Add closing costs from a written estimate for your loan and jurisdiction."
    ],
    loan: [
      "Look for loans with no prepayment penalties to save on interest by paying early.",
      "Compare APRs, not just interest rates, to see the true cost including fees.",
      "Test a 36% total-debt ratio as one planning scenario, then compare it with the lender's actual criteria.",
      "Automate your payments to avoid late fees and protect your credit score."
    ],
    affordability: [
      "Use 28% for housing and 36% for total debt only as editable planning assumptions.",
      "Pre-approval is not a guarantee; keep your spending stable before closing.",
      "Add a maintenance allowance that reflects the property rather than assuming one universal percentage.",
      "Confirm how a prospective lender defines income and debt for its debt-to-income calculation."
    ]
  };

  const relatedBlog = {
    mortgage: { title: "How to Calculate Mortgage Payments", href: "/blog/mortgage-payment-guide" },
    loan: { title: "Understanding Total Loan Interest", href: "/blog/total-interest-explained" },
    affordability: { title: "Understanding Debt-to-Income Ratio", href: "/blog/28-36-rule-explained" }
  }[params.type];

  const similarPages = pseoData
    .filter(p => (
      p.type === params.type
      && p.currency === params.currency
      && p.slug !== params.slug
      && getPseoEditorialStatus(p.slug) === 'indexable'
    ))
    .slice(0, 2)
    .map(p => {
      const pAmount = convertCurrency(p.amount, p.currency, currency);
      const pSalary = p.salary ? convertCurrency(p.salary, p.currency, currency) : undefined;
      return {
        title: p.type === 'affordability' 
          ? `${formatCurrency(pSalary || 0, 0, currency)} Salary Affordability`
          : `${formatCurrency(pAmount, 0, currency)} ${p.type === 'mortgage' ? 'Mortgage' : 'Loan'}`,
        href: canonicalScenarioPath(p)
      };
    });

  return {
    title: params.customTitle || (params.type === 'affordability' 
      ? `How Much House Can I Afford with a ${formattedSalary} Salary?`
      : `${formattedAmount} ${params.type === 'mortgage' ? 'Mortgage' : 'Loan'} Monthly Payment at ${params.rate}%`),
    h1: params.customH1 || selectedPhrasing.h1,
    description: params.customDescription || `Detailed calculation for a ${formattedAmount} ${params.type} at ${params.rate}% interest. See monthly payments, total cost, and expert tips.`,
    intro: params.customIntro || selectedPhrasing.intro,
    body: applyPseoEditorialLinks(params.customContent),
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
