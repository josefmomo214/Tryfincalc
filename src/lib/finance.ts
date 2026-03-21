export const EXCHANGE_RATE = 1.08; // 1 EUR = 1.08 USD

export const convertCurrency = (amount: number, from: 'USD' | 'EUR', to: 'USD' | 'EUR') => {
  if (from === to) return amount;
  if (from === 'EUR' && to === 'USD') return amount * EXCHANGE_RATE;
  return amount / EXCHANGE_RATE;
};

export const formatCurrency = (val: number, decimals: number = 0, currency: 'USD' | 'EUR' = 'EUR') => {
  const locale = currency === 'USD' ? 'en-US' : 'en-GB';
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency: currency, 
    maximumFractionDigits: decimals 
  }).format(val);
};

export const calculateAmortizedPayment = (principal: number, annualRate: number, years: number) => {
  if (annualRate === 0) return principal / (years * 12);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

export const calculatePMI = (loanAmount: number, downPayment: number, homePrice: number) => {
  if (downPayment / homePrice >= 0.2) return 0;
  return (loanAmount * 0.005) / 12; // 0.5% annual estimate
};
