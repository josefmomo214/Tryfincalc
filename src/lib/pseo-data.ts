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
  { slug: '300k-mortgage-monthly-payment-6-percent', type: 'mortgage', amount: 300000, rate: 6, term: 30, currency: 'USD' },
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
  { slug: '400k-mortgage-monthly-payment-4-percent', type: 'mortgage', amount: 400000, rate: 4, term: 25, currency: 'EUR' },

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
