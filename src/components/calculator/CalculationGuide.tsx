import Link from 'next/link';
import { calculateLoan, calculateAffordability, calculateRefinancing, formatCurrency } from '@/lib/finance';
import { ASSUMPTIONS_VERSION } from '@/lib/trust';

type Tool = 'mortgage'|'loan'|'monthly-payment'|'total-interest'|'refinancing'|'affordability'|'amortization';
const guides: Record<Tool,{heading:string; paragraphs:string[]; cases:[number,number,number][]; links:[string,string][]}> = {
  mortgage:{heading:'Separate the loan payment from the cost of owning', paragraphs:[
    'Principal and interest are only part of the monthly budget. Enter property tax, homeowners insurance and HOA separately; the calculator spreads annual tax and insurance evenly across twelve months. Escrow changes can alter the bill even when the mortgage rate stays fixed.',
    'PMI, closing costs, repairs and maintenance are excluded. If your lender requires mortgage insurance, add its quote to the displayed payment before judging affordability. A lower down payment increases principal, but this tool does not estimate the separate insurance premium.',
    'Compare the same borrowed amount over different terms. A shorter term generally raises the scheduled payment while reducing interest. Keep an emergency reserve separate from the down payment; the lowest-interest scenario may not leave a workable monthly budget.'
  ],cases:[[400000,6.5,30],[400000,6.5,15]],links:[['Mortgage payment guide','/blog/mortgage-payment-guide'],['Affordability budget','/affordability-calculator']]},
  loan:{heading:'Compare loan costs on equal terms', paragraphs:[
    'This tool amortizes a fixed principal at a nominal annual interest rate. It does not calculate fee-inclusive APR. Enter the interest rate from the offer, then compare origination fees, optional insurance and other charges separately.',
    'A smaller monthly payment can come from extending the term rather than lowering the cost. Compare total interest as well as the installment, and check whether fees are paid upfront, deducted from proceeds or added to the borrowed amount.',
    'For a fee financed into the loan, include that amount in principal to model the payments. That does not turn the displayed rate into APR; APR requires the actual timing and amount of cash received and paid.'
  ],cases:[[10000,8,3],[5000,9.9,2]],links:[['Compare loan offers','/blog/compare-loan-offers'],['Total interest','/total-interest-calculator']]},
  'monthly-payment':{heading:'What a fixed monthly payment means',paragraphs:[
    'Each payment covers that month’s interest and some principal. The balance declines, so the interest share falls over time even though the scheduled payment remains fixed. Dividing principal by the number of months is correct only at zero interest.',
    'The annual nominal rate is divided by twelve. This differs from converting an effective annual rate and from calculating APR with fees. Payments are assumed to occur at month end; daily accrual and irregular first-payment dates are excluded.',
    'Use the result as a starting installment estimate. For a home loan, use the mortgage calculator to add entered tax, insurance and HOA. For any loan, compare the written repayment schedule before committing.'
  ],cases:[[80000,6,30],[80000,0,30]],links:[['Payment formula','/blog/monthly-payment-formula'],['Mortgage costs','/mortgage-calculator']]},
  'total-interest':{heading:'The lifetime cost behind a smaller installment',paragraphs:[
    'Total interest is the sum of scheduled payments less principal, assuming the rate and payment schedule remain unchanged. Fees, insurance, penalties and taxes are outside this result.',
    'Changing the term affects both monthly cash flow and cumulative interest. Compare a shorter and longer term using the same principal and rate so that the tradeoff is visible. A lower installment does not necessarily mean a cheaper loan.',
    'The totals use unrounded payments internally. Multiplying a rounded monthly display by the number of months may differ by a few cents. A lender may also adjust the final payment or use daily interest.'
  ],cases:[[50000,5,10],[50000,5,5]],links:[['Interest explained','/blog/total-interest-explained'],['Amortization schedule','/amortization-schedule']]},
  refinancing:{heading:'Payment savings and lifetime savings answer different questions',paragraphs:[
    'Compare the same remaining balance with its existing remaining term and a proposed new term. Closing costs are paid upfront in this model. Include lender charges and other nonrefundable transaction costs; taxes, insurance, prepayment penalties and cash-out borrowing are excluded.',
    'Simple fee recovery divides upfront costs by positive monthly payment savings. It is shown only within both loan terms. This does not compare equity at a sale date: a term extension can recover fees through smaller installments while leaving a larger balance.',
    'The full-term comparison sums each loan’s remaining scheduled payments and adds closing costs to the new loan. It does not discount future dollars. If you expect to sell or refinance again, ask for both balances and all costs at that horizon before deciding.'
  ],cases:[],links:[['Refinance guide','/blog/refinance-calculator-guide'],['Remaining balance schedule','/amortization-schedule']]},
  affordability:{heading:'A budgeting ceiling is not lender approval',paragraphs:[
    'This is an illustrative US gross-income budget: the smaller of 28% of monthly gross income and 36% of gross income minus other monthly debts, floored at zero. The remaining payment budget is converted into principal at the chosen rate and term, then the down payment is added.',
    'The core tool excludes tax, insurance, HOA and PMI from its ceiling. Those costs consume part of a real housing budget, so the displayed amount can overstate a usable price. Use the mortgage tool and local quotes to test a specific property.',
    'Different lenders and loan products use different DTI limits and also evaluate credit, assets and other factors. The 28/36 values are planning assumptions, not universal qualification limits. Displaying euros does not make them European underwriting rules.'
  ],cases:[],links:[['Debt and income guide','/blog/28-36-rule-explained'],['Add property costs','/mortgage-calculator']]},
  amortization:{heading:'Read the balance as well as the interest column',paragraphs:[
    'Each row starts with the previous balance, charges one month’s interest and applies the remainder of the payment to principal. The last payment clears the remaining balance. The initial view shows twelve payments; Show full schedule reveals the entire term.',
    'Early payments contain more interest because the outstanding balance is larger. This is a consequence of interest on the balance, not an extra fee. Compare the remaining balance at the date you expect to move with the price you might receive after selling costs.',
    'This schedule assumes a fixed rate, equal monthly payments and no extra payments, late fees or payment holidays. Tax, insurance and mortgage insurance do not reduce the loan balance and are excluded. Display rounding may produce small differences when adding rows.'
  ],cases:[[315000,6.8,30]],links:[['Read an amortization schedule','/blog/amortization-schedule-explained'],['Payment formula','/blog/monthly-payment-formula']]},
};
export function CalculationGuide({tool,currency='USD'}:{tool:Tool;currency?:'USD'|'EUR'}) {
 const guide=guides[tool]; const money=(value:number)=>formatCurrency(value,2,currency);
 const refinance=tool==='refinancing'?calculateRefinancing(250000,6.5,20,5.5,20,5500):null;
 return <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">
  <h2 className="text-3xl font-bold text-primary">{guide.heading}</h2>
  {guide.paragraphs.map(p=><p key={p}>{p}</p>)}
  {guide.cases.length>0 && <div className="overflow-x-auto"><table className="w-full text-left"><caption className="mb-3 text-left">Illustrative principal-and-interest estimates. No fees, taxes or insurance.</caption><thead><tr><th>Principal</th><th>Rate / years</th><th>Monthly</th><th>Total interest</th></tr></thead><tbody>{guide.cases.map(([p,r,y])=>{const loan=calculateLoan(p,r,y);return <tr key={`${p}-${r}-${y}`}><td className="py-3">{money(p)}</td><td>{r}% / {y}</td><td>{money(loan.monthly)}</td><td>{money(loan.totalInterest)}</td></tr>})}</tbody></table></div>}
  {refinance && <p>Example: {money(250000)} remaining, 6.5% with 20 years left, refinanced to 5.5% over 20 years with {money(5500)} upfront costs. Estimated payment savings: {money(refinance.monthlySavings)} per month; full-term savings after costs: {money(refinance.lifetimeSavings)}; simple fee recovery: {refinance.breakEven?.toFixed(1)} months.</p>}
  {tool==='affordability' && <div className="overflow-x-auto"><table className="w-full text-left"><caption className="mb-3 text-left">Same illustrative budget with different debts: gross income {money(7500)}/month, down payment {money(50000)}, 6.5%, 30 years. Tax, insurance, HOA and PMI excluded.</caption><thead><tr><th>Other monthly debt</th><th>P&amp;I budget</th><th>Price ceiling</th></tr></thead><tbody>{[0,500,1000].map(debt=>{const r=calculateAffordability(7500,debt,50000,6.5,30,currency);return <tr key={debt}><td className="py-3">{money(debt)}</td><td>{money(r.monthlyPayment)}</td><td>{money(r.maxPrice)}</td></tr>})}</tbody></table></div>}
  <p className="text-sm">Assumptions {ASSUMPTIONS_VERSION}. <Link href="/methodology" className="underline">Formulas, rounding, tests and primary sources</Link>. These estimates do not provide financial advice or predict approval.</p>
  <nav aria-label="Related calculation guides" className="flex flex-wrap gap-4">{guide.links.map(([label,href])=><Link className="underline" key={href} href={href}>{label}</Link>)}</nav>
 </section>;
}
