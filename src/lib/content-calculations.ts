import { calculateLoan, formatCurrency } from './finance';
export function loanValue(principal:number,rate:number,years:number,field:'monthly'|'totalInterest'|'totalPaid',currency:'USD'|'EUR'='USD') {
  return formatCurrency(calculateLoan(principal,rate,years)[field],2,currency);
}
export function loanTable(principal:number,rates:number[],terms:number[],currency:'USD'|'EUR'='USD') {
  return `<table class="w-full text-left"><caption>Estimated principal and interest for ${formatCurrency(principal,0,currency)}. Fixed nominal annual rates; end-of-month payments; fees, tax and insurance excluded.</caption><thead><tr><th>Rate</th><th>Years</th><th>Monthly payment</th><th>Total interest</th><th>Total paid</th></tr></thead><tbody>${rates.flatMap(rate=>terms.map(term=>`<tr><td>${rate}%</td><td>${term}</td><td>${loanValue(principal,rate,term,'monthly',currency)}</td><td>${loanValue(principal,rate,term,'totalInterest',currency)}</td><td>${loanValue(principal,rate,term,'totalPaid',currency)}</td></tr>`)).join('')}</tbody></table>`;
}
