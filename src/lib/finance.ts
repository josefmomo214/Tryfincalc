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

/** Rates are nominal annual percentage points; terms are years in whole months.
 * End-of-month payments, full precision internally, currency rounding at display only.
 * Legacy payment/schedule helpers return 0/[] on invalid input; composite models throw.
 */
export function calculateLoan(principal: number, annualRate: number, years: number) {
  const error = validateLoan(principal, annualRate, years);
  if (error) throw new RangeError(error);
  const monthly = calculateAmortizedPayment(principal, annualRate, years);
  const totalPaid = monthly * Math.round(years * 12);
  return { monthly, totalPaid, totalInterest: Math.max(0, totalPaid - principal) };
}

function requireAmounts(...values: number[]) {
  if (!values.every(v => Number.isFinite(v) && v >= 0 && v <= 1e12))
    throw new RangeError('Enter finite non-negative amounts up to 1 trillion.');
}

export function loanFromPayment(payment: number, rate: number, years: number) {
  requireAmounts(payment);
  const unit = calculateLoan(1, rate, years).monthly;
  return payment / unit;
}

export const PLANNING_HOUSING_RATIO = 0.28;
export const PLANNING_TOTAL_DEBT_RATIO = 0.36;

// Illustrative US gross-income budget; currency never selects underwriting rules.
export function calculateAffordability(income: number, debts: number, downPayment: number, rate: number, years: number, currency: 'USD' | 'EUR', monthlyOwnershipCosts = 0) {
  requireAmounts(income, debts, downPayment, monthlyOwnershipCosts);
  const housingBudget = Math.max(0, Math.min(income * PLANNING_HOUSING_RATIO, income * PLANNING_TOTAL_DEBT_RATIO - debts));
  const monthlyPayment = Math.max(0, housingBudget - monthlyOwnershipCosts);
  const loanAmount = loanFromPayment(monthlyPayment, rate, years);
  return { monthlyPayment, loanAmount, maxPrice: loanAmount + downPayment };
}

export function calculateIncomeRequired(
  homePrice: number,
  monthlyDebts: number,
  downPayment: number,
  rate: number,
  years: number,
  monthlyPropertyTax: number,
  monthlyInsurance: number,
) {
  requireAmounts(homePrice, monthlyDebts, downPayment, monthlyPropertyTax, monthlyInsurance);
  if (downPayment > homePrice) throw new RangeError('Down payment must not exceed the home price.');
  const principal = homePrice - downPayment;
  const monthlyPrincipalAndInterest = calculateLoan(principal, rate, years).monthly;
  const monthlyHousingCost = monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyInsurance;
  const housingRatioIncome = monthlyHousingCost / PLANNING_HOUSING_RATIO;
  const totalDebtRatioIncome = (monthlyHousingCost + monthlyDebts) / PLANNING_TOTAL_DEBT_RATIO;
  const requiredMonthlyIncome = Math.max(housingRatioIncome, totalDebtRatioIncome);
  return {
    principal,
    monthlyPrincipalAndInterest,
    monthlyHousingCost,
    requiredMonthlyIncome,
    requiredAnnualIncome: requiredMonthlyIncome * 12,
    bindingRatio: housingRatioIncome >= totalDebtRatioIncome ? 'housing' as const : 'total-debt' as const,
  };
}

export function calculateRefinancing(balance: number, currentRate: number, yearsRemaining: number, newRate: number, newTerm: number, fees: number) {
  requireAmounts(fees);
  const current = calculateLoan(balance, currentRate, yearsRemaining);
  const proposed = calculateLoan(balance, newRate, newTerm);
  const monthlySavings = current.monthly - proposed.monthly;
  const recoveryMonths = monthlySavings > 0 ? fees / monthlySavings : null;
  return {
    currentMonthly: current.monthly, monthlySavings, newMonthly: proposed.monthly,
    currentTotal: current.totalPaid, newTotal: proposed.totalPaid + fees,
    lifetimeSavings: current.totalPaid - proposed.totalPaid - fees,
    // Simple payment savings only; do not extrapolate beyond either loan term.
    breakEven: recoveryMonths !== null && recoveryMonths <= Math.min(yearsRemaining, newTerm) * 12 ? recoveryMonths : null,
  };
}

export interface RentBuyInputs {
  rent: number; rentGrowth: number; homePrice: number; downPercent: number;
  rate: number; term: number; years: number; purchaseCostPercent: number;
  saleCostPercent: number; appreciation: number; maintenancePercent: number;
  propertyTaxPercent: number; annualInsurance: number; investmentReturn: number;
}

export const RENT_BUY_DEFAULTS: RentBuyInputs = {
  rent: 2000, rentGrowth: 3, homePrice: 350000, downPercent: 20,
  rate: 6.5, term: 30, years: 10, purchaseCostPercent: 3,
  saleCostPercent: 6, appreciation: 2, maintenancePercent: 1,
  propertyTaxPercent: 1.1, annualInsurance: 1500, investmentReturn: 4,
};

export function validateRentBuy(i: RentBuyInputs): string {
  if (!Object.values(i).every(Number.isFinite)) return 'Enter a number in every field.';
  const loanError = validateLoan(i.homePrice, i.rate, i.term) || validateLoan(0, 0, i.years);
  if (loanError) return loanError;
  if ([i.rent, i.annualInsurance].some(v => v < 0 || v > 1e12)) return 'Rent and insurance must be non-negative amounts up to 1 trillion.';
  if ([i.downPercent,i.purchaseCostPercent,i.saleCostPercent,i.maintenancePercent,i.propertyTaxPercent].some(v=>v<0 || v>100)) return 'Cost and down-payment percentages must be between 0 and 100.';
  if ([i.rentGrowth,i.appreciation,i.investmentReturn].some(v=>v < -50 || v > 50)) return 'Growth and return assumptions must be between -50% and 50% per year.';
  return '';
}

/** Compare present values of monthly cash costs, with net sale equity at horizon.
 * Discounting both alternatives by the assumed after-tax investment return accounts
 * for opportunity cost of down payment AND differences in monthly spending.
 * Tax benefits, HOA, moving costs and rent deposits are excluded.
 */
export function compareRentBuy(i: RentBuyInputs) {
  const error = validateRentBuy(i); if (error) throw new RangeError(error);
  const months = Math.round(i.years * 12);
  const loan = i.homePrice * (1 - i.downPercent / 100);
  const schedule = generateAmortizationSchedule(loan, i.rate, i.term);
  const discount = (month: number) => Math.pow(1 + i.investmentReturn / 100, month / 12);
  let rentPV = 0;
  let buyPV = i.homePrice * (i.downPercent + i.purchaseCostPercent) / 100;
  for (let month=1; month<=months; month++) {
    const year = Math.floor((month-1)/12);
    rentPV += i.rent * Math.pow(1 + i.rentGrowth/100,year) / discount(month);
    const value = i.homePrice * Math.pow(1+i.appreciation/100,year);
    const costs = value * (i.maintenancePercent+i.propertyTaxPercent)/1200 + i.annualInsurance/12;
    buyPV += ((schedule[month-1]?.payment ?? 0) + costs) / discount(month);
  }
  const homeValue = i.homePrice * Math.pow(1+i.appreciation/100,i.years);
  const balance = months >= schedule.length ? 0 : schedule[months-1].balance;
  const saleEquity = homeValue * (1-i.saleCostPercent/100) - balance;
  const totalBuy = buyPV - saleEquity / discount(months);
  return { totalRent: rentPV, totalBuy, saleEquity, balance, difference: totalBuy-rentPV };
}

export function rentBuySensitivity(i: RentBuyInputs) {
  return [-1,0,1].map(change => {
    const scenario = {...i, appreciation: Math.min(50,Math.max(-50,i.appreciation+change)), investmentReturn: Math.min(50,Math.max(-50,i.investmentReturn-change))};
    let crossing: number | null = null;
    for (let year=1; year<=Math.ceil(i.years); year++) {
      const horizon=Math.min(year,i.years);
      if (compareRentBuy({...scenario,years:horizon}).difference<=0) { crossing=horizon; break; }
    }
    return { change, appreciation:scenario.appreciation, investmentReturn:scenario.investmentReturn, crossing, ...compareRentBuy(scenario) };
  });
}
