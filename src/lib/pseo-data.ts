import { EXCHANGE_RATE, convertCurrency } from "./finance";

export interface PSEOParams {
  slug: string;
  type: 'mortgage' | 'loan' | 'affordability';
  amount: number;
  rate: number;
  term: number;
  currency: 'USD' | 'EUR';
  salary?: number;
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
  { slug: '400k-mortgage-monthly-payment-6-5-percent', type: 'mortgage', amount: 400000, rate: 6.5, term: 30, currency: 'USD' },
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
    title: params.type === 'affordability' 
      ? `How Much House Can I Afford with a ${formattedSalary} Salary?`
      : `${formattedAmount} ${params.type === 'mortgage' ? 'Mortgage' : 'Loan'} Monthly Payment at ${params.rate}%`,
    h1: selectedPhrasing.h1,
    description: `Detailed calculation for a ${formattedAmount} ${params.type} at ${params.rate}% interest. See monthly payments, total cost, and expert tips.`,
    intro: selectedPhrasing.intro,
    tips: tips[params.type],
    relatedBlog,
    similarPages,
    faqs: [
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
