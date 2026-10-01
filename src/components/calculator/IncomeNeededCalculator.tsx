import React, { useState } from 'react';
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from '@/components/calculator/CalculatorContainer';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Input } from '@/components/ui/Input';
import { calculateIncomeRequired, formatCurrency, validateLoan } from '@/lib/finance';

export const INCOME_NEEDED_DEFAULTS = {
  homePrice: 400000,
  annualIncome: 110000,
  monthlyDebts: 500,
  downPayment: 80000,
  interestRate: 6.5,
  loanTerm: 30,
  monthlyPropertyTax: 400,
  monthlyInsurance: 150,
} as const;

export function IncomeNeededCalculator() {
  const [homePrice, setHomePrice] = useState<number>(INCOME_NEEDED_DEFAULTS.homePrice);
  const [annualIncome, setAnnualIncome] = useState<number>(INCOME_NEEDED_DEFAULTS.annualIncome);
  const [monthlyDebts, setMonthlyDebts] = useState<number>(INCOME_NEEDED_DEFAULTS.monthlyDebts);
  const [downPayment, setDownPayment] = useState<number>(INCOME_NEEDED_DEFAULTS.downPayment);
  const [interestRate, setInterestRate] = useState<number>(INCOME_NEEDED_DEFAULTS.interestRate);
  const [loanTerm, setLoanTerm] = useState<number>(INCOME_NEEDED_DEFAULTS.loanTerm);
  const [monthlyPropertyTax, setMonthlyPropertyTax] = useState<number>(INCOME_NEEDED_DEFAULTS.monthlyPropertyTax);
  const [monthlyInsurance, setMonthlyInsurance] = useState<number>(INCOME_NEEDED_DEFAULTS.monthlyInsurance);

  const values = [homePrice, annualIncome, monthlyDebts, downPayment, interestRate, loanTerm, monthlyPropertyTax, monthlyInsurance];
  const validationError = downPayment > homePrice
    ? 'Down payment must not exceed the home price.'
    : validateLoan(homePrice - downPayment, interestRate, loanTerm)
      || (!values.every((value) => Number.isFinite(value) && value >= 0 && value <= 1e12)
        ? 'Enter a non-negative number up to 1 trillion in every field.'
        : '');
  const results = validationError ? null : calculateIncomeRequired(
    homePrice,
    monthlyDebts,
    downPayment,
    interestRate,
    loanTerm,
    monthlyPropertyTax,
    monthlyInsurance,
  );
  const annualDifference = results ? annualIncome - results.requiredAnnualIncome : 0;

  return (
    <CalculatorContainer
      title="Adjust the income-needed assumptions"
      description="Change the target price, selected income, debts, down payment, annual rate, term, tax, and insurance. Results update immediately."
    >
      <CalculatorInputArea>
        <p className="mb-4 text-sm">
          This planning model uses selected 28% housing and 36% total-debt ratios. They are editable-scenario assumptions, not lender rules or an approval guarantee.
        </p>
        {validationError && <p id="income-needed-error" role="alert" className="mb-4 text-red-700 dark:text-red-300">{validationError}</p>}
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="homePrice" className="block text-sm font-semibold text-on-surface">Target home price ($)</label>
              <Input id="homePrice" type="number" value={homePrice} aria-invalid={!!validationError} aria-describedby={validationError ? 'income-needed-error' : undefined} onChange={(event) => setHomePrice(event.target.valueAsNumber)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="annualIncome" className="block text-sm font-semibold text-on-surface">Selected annual gross income ($)</label>
              <Input id="annualIncome" type="number" value={annualIncome} aria-invalid={!!validationError} aria-describedby={validationError ? 'income-needed-error' : undefined} onChange={(event) => setAnnualIncome(event.target.valueAsNumber)} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="monthlyDebts" className="block text-sm font-semibold text-on-surface">Other monthly debts ($)</label>
              <Input id="monthlyDebts" type="number" value={monthlyDebts} aria-invalid={!!validationError} aria-describedby={validationError ? 'income-needed-error' : undefined} onChange={(event) => setMonthlyDebts(event.target.valueAsNumber)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="downPayment" className="block text-sm font-semibold text-on-surface">Down payment ($)</label>
              <Input id="downPayment" type="number" value={downPayment} aria-invalid={!!validationError} aria-describedby={validationError ? 'income-needed-error' : undefined} onChange={(event) => setDownPayment(event.target.valueAsNumber)} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="interestRate" className="block text-sm font-semibold text-on-surface">Annual note interest rate (%)</label>
              <Input id="interestRate" type="number" max={100} step="0.1" value={interestRate} aria-invalid={!!validationError} aria-describedby={validationError ? 'income-needed-error' : undefined} onChange={(event) => setInterestRate(event.target.valueAsNumber)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="loanTerm" className="block text-sm font-semibold text-on-surface">Loan term (years)</label>
              <Input id="loanTerm" type="number" min={1 / 12} max={100} value={loanTerm} aria-invalid={!!validationError} aria-describedby={validationError ? 'income-needed-error' : undefined} onChange={(event) => setLoanTerm(event.target.valueAsNumber)} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="monthlyPropertyTax" className="block text-sm font-semibold text-on-surface">Monthly property tax ($)</label>
              <Input id="monthlyPropertyTax" type="number" value={monthlyPropertyTax} aria-invalid={!!validationError} aria-describedby={validationError ? 'income-needed-error' : undefined} onChange={(event) => setMonthlyPropertyTax(event.target.valueAsNumber)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="monthlyInsurance" className="block text-sm font-semibold text-on-surface">Monthly property insurance ($)</label>
              <Input id="monthlyInsurance" type="number" value={monthlyInsurance} aria-invalid={!!validationError} aria-describedby={validationError ? 'income-needed-error' : undefined} onChange={(event) => setMonthlyInsurance(event.target.valueAsNumber)} />
            </div>
          </div>
        </div>
      </CalculatorInputArea>
      <CalculatorResultsArea>
        <div className="space-y-6">
          <div className="rounded-3xl border border-primary/10 bg-primary/5 p-8 text-center">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Illustrative annual income needed</h3>
            <div className="font-manrope text-5xl font-extrabold text-primary">
              {results ? formatCurrency(results.requiredAnnualIncome, 0) : '-'}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <ResultCard title="Loan principal" value={results ? formatCurrency(results.principal, 0) : '-'} />
            <ResultCard title="Monthly principal and interest" value={results ? formatCurrency(results.monthlyPrincipalAndInterest, 2) : '-'} />
            <ResultCard title="Entered monthly housing cost" value={results ? formatCurrency(results.monthlyHousingCost, 2) : '-'} />
            <ResultCard
              title={annualDifference >= 0 ? 'Selected income above estimate' : 'Selected income below estimate'}
              value={results ? formatCurrency(Math.abs(annualDifference), 0) : '-'}
              highlighted
            />
          </div>
          {results && (
            <p className="text-sm text-on-surface-variant">
              The {results.bindingRatio === 'housing' ? 'selected housing ratio' : 'selected total-debt ratio'} is binding for these inputs. Maintenance, association dues, closing costs, loan-specific insurance, utilities, taxes beyond the entered amount, and other expenses are excluded.
            </p>
          )}
        </div>
      </CalculatorResultsArea>
    </CalculatorContainer>
  );
}
