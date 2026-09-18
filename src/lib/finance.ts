export const EXCHANGE_RATE = 1.08; // 1 EUR = 1.08 USD

export const convertCurrency = (amount: number, from: 'USD' | 'EUR', to: 'USD' | 'EUR') => {
  if (from === to) return amount;
  if (from === 'EUR' && to === 'USD') return amount * EXCHANGE_RATE;
  return amount / EXCHANGE_RATE;
};

export const formatCurrency = (val: number, decimals: number = 0, currency: 'USD' | 'EUR' = 'USD') => {
  if (!Number.isFinite(val)) return '—';
  if (Math.abs(val) < 0.5 * 10 ** -decimals) val = 0;
  const locale = currency === 'USD' ? 'en-US' : 'en-GB';
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency: currency, 
    maximumFractionDigits: decimals 
  }).format(val);
};

export const calculateAmortizedPayment = (principal: number, annualRate: number, years: number) => {
  if (validateLoan(principal, annualRate, years)) return 0;
  if (annualRate === 0) return principal / Math.round(years * 12);
  const r = annualRate / 1200;
  const n = Math.round(years * 12);
  // Stable for very small rates and long terms; avoids exponent overflow.
  return principal * r / -Math.expm1(-n * Math.log1p(r));
};

export const calculatePMI = (loanAmount: number, downPayment: number, homePrice: number) => {
  if (downPayment / homePrice >= 0.2) return 0;
  return (loanAmount * 0.005) / 12; // 0.5% annual estimate
};

export function validateLoan(principal: number, annualRate: number, years: number): string {
  if (![principal, annualRate, years].every(Number.isFinite)) return 'Enter a number in every field.';
  if (principal < 0 || annualRate < 0) return 'Amounts and interest rates must be zero or greater.';
  if (principal > 1e12 || annualRate > 100) return 'Enter an amount up to 1 trillion and a rate up to 100%.';
  const months = years * 12;
  if (months < 1 || months > 1200 || Math.abs(months - Math.round(months)) > 1e-8)
    return 'Enter a term of 1 to 1,200 whole months (up to 100 years).';
  return '';
}

export interface ScheduleItem {
  no: number;
  payment: number;
  principal: number;
  interest: number;
  totalInterest: number;
  balance: number;
}

export function generateAmortizationSchedule(principal: number, annualRate: number, years: number): ScheduleItem[] {
  if (validateLoan(principal, annualRate, years)) return [];
  const payment = calculateAmortizedPayment(principal, annualRate, years);
  const months = Math.round(years * 12);
  let balance = principal;
  let totalInterest = 0;
  return Array.from({ length: months }, (_, index) => {
    const interest = balance * annualRate / 1200;
    const principalPaid = index === months - 1 ? balance : Math.min(balance, Math.max(0, payment - interest));
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;
    return { no: index + 1, payment: principalPaid + interest, principal: principalPaid, interest, totalInterest, balance };
  });
}

export function calculateAffordability(income: number, debts: number, downPayment: number, rate: number, years: number, currency: 'USD' | 'EUR') {
  const monthlyPayment = Math.max(0, income * (currency === 'EUR' ? .33 : .28) - debts);
  const unitPayment = calculateAmortizedPayment(1, rate, years);
  const loanAmount = unitPayment > 0 ? monthlyPayment / unitPayment : 0;
  return { monthlyPayment, loanAmount, maxPrice: loanAmount + downPayment };
}

export function calculateRefinancing(balance: number, currentRate: number, yearsRemaining: number, newRate: number, newTerm: number, fees: number) {
  const currentMonthly = calculateAmortizedPayment(balance, currentRate, yearsRemaining);
  const newMonthly = calculateAmortizedPayment(balance, newRate, newTerm);
  const monthlySavings = currentMonthly - newMonthly;
  return {
    monthlySavings, newMonthly,
    lifetimeSavings: currentMonthly * Math.round(yearsRemaining * 12) - newMonthly * Math.round(newTerm * 12) - fees,
    breakEven: monthlySavings > 0 ? fees / monthlySavings : 0,
  };
}

export function calculateRentVsBuy(rent: number, rentIncrease: number, homePrice: number, downPercent: number, rate: number, years: number, closingCosts: number) {
  let currentRent = rent;
  let totalRent = 0;
  for (let month = 0; month < Math.min(1200, Math.round(years * 12)); month++) {
    if (month > 0 && month % 12 === 0) currentRent *= 1 + rentIncrease / 100;
    totalRent += currentRent;
  }
  const loan = homePrice * (1 - downPercent / 100);
  const interestPaid = generateAmortizationSchedule(loan, rate, 25)
    .slice(0, Math.round(years * 12)).reduce((sum, row) => sum + row.interest, 0);
  const totalBuy = interestPaid + homePrice * .02 * years + homePrice * closingCosts / 100 + 3000
    - homePrice * (Math.pow(1.02, years) - 1);
  return { totalRent, totalBuy, difference: Math.abs(totalBuy - totalRent),
    verdict: totalBuy < totalRent ? 'Buying costs less in this model' : totalBuy > totalRent ? 'Renting costs less in this model' : 'Costs are equal in this model' };
}
