import { calculateAffordability, calculateLoan, formatCurrency, generateAmortizationSchedule } from './finance';
export function loanValue(principal:number,rate:number,years:number,field:'monthly'|'totalInterest'|'totalPaid',currency:'USD'|'EUR'='USD') {
  return formatCurrency(calculateLoan(principal,rate,years)[field],2,currency);
}
export function loanTable(principal:number,rates:number[],terms:number[],currency:'USD'|'EUR'='USD') {
  return `<table class="w-full text-left"><caption>Estimated principal and interest for ${formatCurrency(principal,0,currency)}. Fixed nominal annual rates; end-of-month payments; fees, tax and insurance excluded.</caption><thead><tr><th>Rate</th><th>Years</th><th>Monthly payment</th><th>Total interest</th><th>Total paid</th></tr></thead><tbody>${rates.flatMap(rate=>terms.map(term=>`<tr><td>${rate}%</td><td>${term}</td><td>${loanValue(principal,rate,term,'monthly',currency)}</td><td>${loanValue(principal,rate,term,'totalInterest',currency)}</td><td>${loanValue(principal,rate,term,'totalPaid',currency)}</td></tr>`)).join('')}</tbody></table>`;
}

export function amortizationValue(
  principal: number,
  rate: number,
  years: number,
  paymentIndex: number,
  field: 'payment' | 'principal' | 'interest' | 'balance',
  currency: 'USD' | 'EUR' = 'USD',
) {
  const row = generateAmortizationSchedule(principal, rate, years)[paymentIndex];
  return row ? formatCurrency(row[field], 2, currency) : '-';
}

export function downPaymentTable(
  homePrice: number,
  downPaymentPercents: number[],
  rate: number,
  years: number,
  currency: 'USD' | 'EUR' = 'USD',
) {
  const rows = downPaymentPercents.map((downPaymentPercent) => {
    const downPayment = homePrice * downPaymentPercent / 100;
    const principal = homePrice - downPayment;
    const result = calculateLoan(principal, rate, years);
    return `<tr><td>${downPaymentPercent}%</td><td>${formatCurrency(downPayment, 2, currency)}</td><td>${formatCurrency(principal, 2, currency)}</td><td>${formatCurrency(result.monthly, 2, currency)}</td><td>${formatCurrency(result.totalInterest, 2, currency)}</td></tr>`;
  }).join('');
  return `<table class="w-full text-left"><caption>Selected deposit assumptions for a ${formatCurrency(homePrice, 0, currency)} property at a ${rate}% nominal annual rate over ${years} years. Property costs and transaction fees are excluded.</caption><thead><tr><th>Deposit</th><th>Upfront deposit</th><th>Loan principal</th><th>Monthly payment</th><th>Total interest</th></tr></thead><tbody>${rows}</tbody></table>`;
}

export interface AffordabilityTableRow {
  label: string;
  monthlyIncome: number;
  monthlyDebts: number;
  downPayment: number;
  rate: number;
  years: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
}

function calculateAffordabilityRow(row: AffordabilityTableRow, currency: 'USD' | 'EUR') {
  return calculateAffordability(
    row.monthlyIncome,
    row.monthlyDebts,
    row.downPayment,
    row.rate,
    row.years,
    currency,
    row.monthlyPropertyTax + row.monthlyInsurance,
  );
}

export function affordabilityValue(
  row: AffordabilityTableRow,
  field: 'monthlyPayment' | 'loanAmount' | 'maxPrice',
  currency: 'USD' | 'EUR' = 'USD',
) {
  return formatCurrency(calculateAffordabilityRow(row, currency)[field], field === 'monthlyPayment' ? 2 : 0, currency);
}

export function affordabilityTable(rows: AffordabilityTableRow[], currency: 'USD' | 'EUR' = 'USD') {
  const body = rows.map((row) => {
    const result = calculateAffordabilityRow(row, currency);
    return `<tr><td>${row.label}</td><td>${formatCurrency(result.monthlyPayment, 2, currency)}</td><td>${formatCurrency(result.loanAmount, 0, currency)}</td><td>${formatCurrency(result.maxPrice, 0, currency)}</td></tr>`;
  }).join('');
  return `<table class="w-full text-left"><caption>Illustrative affordability sensitivities calculated with the displayed 28% housing and 36% total-debt planning ratios. These are user-selected examples, not approval criteria.</caption><thead><tr><th>Selected assumption</th><th>Monthly principal-and-interest allowance</th><th>Estimated loan principal</th><th>Estimated home price</th></tr></thead><tbody>${body}</tbody></table>`;
}
