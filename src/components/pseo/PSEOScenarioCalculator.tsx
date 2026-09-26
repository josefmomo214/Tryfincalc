import React, { useState } from 'react';
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from '@/components/calculator/CalculatorContainer';
import { MortgageCalculatorWidget } from '@/components/calculator/MortgageCalculatorWidget';
import { ResultCard } from '@/components/calculator/ResultCard';
import { Input } from '@/components/ui/Input';
import { calculateAffordability, calculateLoan, formatCurrency, validateLoan } from '@/lib/finance';
import type { PSEOParams } from '@/lib/pseo-data';

function LoanScenarioCalculator({ params }: { params: PSEOParams }) {
  const [loanAmount, setLoanAmount] = useState(params.amount);
  const [interestRate, setInterestRate] = useState(params.rate);
  const [loanTerm, setLoanTerm] = useState(params.term);
  const values = [loanAmount, interestRate, loanTerm];
  const validationError = validateLoan(loanAmount, interestRate, loanTerm)
    || (!values.every((value) => Number.isFinite(value) && value >= 0 && value <= 1e12)
      ? 'Enter a non-negative number up to 1 trillion in every field.'
      : '');
  const results = validationError ? null : calculateLoan(loanAmount, interestRate, loanTerm);

  return (
    <CalculatorContainer
      title={`Adjust the ${formatCurrency(params.amount, 0, params.currency)} loan scenario`}
      description={params.calculatorDescription}
    >
      <CalculatorInputArea>
        <p className="mb-4 text-sm">
          The rate is a nominal annual note rate. Fees are excluded, so this calculator does not calculate APR.
        </p>
        {validationError && <p id="scenario-loan-error" role="alert" className="mb-4 text-red-700 dark:text-red-300">{validationError}</p>}
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="loanAmount" className="block text-sm font-semibold text-on-surface">
              Loan principal ({params.currency === 'EUR' ? '€' : '$'})
            </label>
            <Input id="loanAmount" type="number" value={loanAmount} aria-invalid={!!validationError} aria-describedby={validationError ? 'scenario-loan-error' : undefined} onChange={(event) => setLoanAmount(event.target.valueAsNumber)} />
          </div>
          <div className="space-y-2">
            <label htmlFor="interestRate" className="block text-sm font-semibold text-on-surface">Annual note interest rate (%)</label>
            <Input id="interestRate" type="number" max={100} step="0.1" value={interestRate} aria-invalid={!!validationError} aria-describedby={validationError ? 'scenario-loan-error' : undefined} onChange={(event) => setInterestRate(event.target.valueAsNumber)} />
          </div>
          <div className="space-y-2">
            <label htmlFor="loanTerm" className="block text-sm font-semibold text-on-surface">Loan term (years)</label>
            <Input id="loanTerm" type="number" min={1 / 12} max={100} value={loanTerm} aria-invalid={!!validationError} aria-describedby={validationError ? 'scenario-loan-error' : undefined} onChange={(event) => setLoanTerm(event.target.valueAsNumber)} />
          </div>
        </div>
      </CalculatorInputArea>
      <CalculatorResultsArea>
        <div className="space-y-6">
          <ResultCard title="Monthly payment" value={results ? formatCurrency(results.monthly, 2, params.currency) : '—'} highlighted />
          <div className="grid sm:grid-cols-2 gap-4">
            <ResultCard title="Total interest" value={results ? formatCurrency(results.totalInterest, 2, params.currency) : '—'} />
            <ResultCard title="Total of payments" value={results ? formatCurrency(results.totalPaid, 2, params.currency) : '—'} />
          </div>
        </div>
      </CalculatorResultsArea>
    </CalculatorContainer>
  );
}

function AffordabilityScenarioCalculator({ params }: { params: PSEOParams }) {
  const defaults = params.affordabilityInputs ?? {
    monthlyIncome: (params.salary ?? 0) / 12,
    monthlyDebts: 0,
    downPayment: 0,
    monthlyPropertyTax: 0,
    monthlyInsurance: 0,
  };

  const [monthlyIncome, setMonthlyIncome] = useState(defaults.monthlyIncome);
  const [monthlyDebts, setMonthlyDebts] = useState(defaults.monthlyDebts);
  const [downPayment, setDownPayment] = useState(defaults.downPayment);
  const [monthlyPropertyTax, setMonthlyPropertyTax] = useState(defaults.monthlyPropertyTax);
  const [monthlyInsurance, setMonthlyInsurance] = useState(defaults.monthlyInsurance);
  const [interestRate, setInterestRate] = useState(params.rate);
  const [loanTerm, setLoanTerm] = useState(params.term);
  const values = [monthlyIncome, monthlyDebts, downPayment, monthlyPropertyTax, monthlyInsurance, interestRate, loanTerm];
  const validationError = validateLoan(downPayment, interestRate, loanTerm)
    || (!values.every((value) => Number.isFinite(value) && value >= 0 && value <= 1e12)
      ? 'Enter a non-negative number up to 1 trillion in every field.'
      : '');
  const results = validationError ? null : calculateAffordability(
    monthlyIncome,
    monthlyDebts,
    downPayment,
    interestRate,
    loanTerm,
    params.currency,
    monthlyPropertyTax + monthlyInsurance,
  );

  return (
    <CalculatorContainer title={`Adjust the ${formatCurrency(params.salary ?? 0, 0, params.currency)} salary planning example`} description={params.calculatorDescription}>
      <CalculatorInputArea>
        <p className="mb-4 text-sm">
          The 28% housing and 36% total-debt ratios are user-selected planning examples, not lender rules. This estimate does not predict lender approval.
        </p>
        {validationError && <p id="scenario-affordability-error" role="alert" className="mb-4 text-red-700 dark:text-red-300">{validationError}</p>}
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="monthlyIncome" className="block text-sm font-semibold text-on-surface">Monthly gross income ($)</label>
            <Input id="monthlyIncome" type="number" value={monthlyIncome} aria-invalid={!!validationError} aria-describedby={validationError ? 'scenario-affordability-error' : undefined} onChange={(event) => setMonthlyIncome(event.target.valueAsNumber)} />
          </div>
          <div className="space-y-2">
            <label htmlFor="monthlyDebts" className="block text-sm font-semibold text-on-surface">Other monthly debts ($)</label>
            <Input id="monthlyDebts" type="number" value={monthlyDebts} aria-invalid={!!validationError} aria-describedby={validationError ? 'scenario-affordability-error' : undefined} onChange={(event) => setMonthlyDebts(event.target.valueAsNumber)} />
          </div>
          <div className="space-y-2">
            <label htmlFor="downPayment" className="block text-sm font-semibold text-on-surface">Down payment ($)</label>
            <Input id="downPayment" type="number" value={downPayment} aria-invalid={!!validationError} aria-describedby={validationError ? 'scenario-affordability-error' : undefined} onChange={(event) => setDownPayment(event.target.valueAsNumber)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="monthlyPropertyTax" className="block text-sm font-semibold text-on-surface">Monthly property tax ($)</label>
              <Input id="monthlyPropertyTax" type="number" value={monthlyPropertyTax} aria-invalid={!!validationError} aria-describedby={validationError ? 'scenario-affordability-error' : undefined} onChange={(event) => setMonthlyPropertyTax(event.target.valueAsNumber)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="monthlyInsurance" className="block text-sm font-semibold text-on-surface">Monthly property insurance ($)</label>
              <Input id="monthlyInsurance" type="number" value={monthlyInsurance} aria-invalid={!!validationError} aria-describedby={validationError ? 'scenario-affordability-error' : undefined} onChange={(event) => setMonthlyInsurance(event.target.valueAsNumber)} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="interestRate" className="block text-sm font-semibold text-on-surface">Annual interest rate (%)</label>
              <Input id="interestRate" type="number" max={100} step="0.1" value={interestRate} aria-invalid={!!validationError} aria-describedby={validationError ? 'scenario-affordability-error' : undefined} onChange={(event) => setInterestRate(event.target.valueAsNumber)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="loanTerm" className="block text-sm font-semibold text-on-surface">Loan term (years)</label>
              <Input id="loanTerm" type="number" min={1 / 12} max={100} value={loanTerm} aria-invalid={!!validationError} aria-describedby={validationError ? 'scenario-affordability-error' : undefined} onChange={(event) => setLoanTerm(event.target.valueAsNumber)} />
            </div>
          </div>
        </div>
      </CalculatorInputArea>
      <CalculatorResultsArea>
        <div className="space-y-6">
          <ResultCard title="Estimated home price" value={results ? formatCurrency(results.maxPrice, 0, params.currency) : '—'} highlighted />
          <div className="grid sm:grid-cols-2 gap-4">
            <ResultCard title="Estimated loan principal" value={results ? formatCurrency(results.loanAmount, 0, params.currency) : '—'} />
            <ResultCard title="Monthly principal-and-interest allowance" value={results ? formatCurrency(results.monthlyPayment, 2, params.currency) : '—'} />
          </div>
          <p className="text-sm text-on-surface-variant">
            Entered property tax and insurance consume part of the selected housing budget. Maintenance, association fees, closing costs and loan-specific insurance are excluded.
          </p>
        </div>
      </CalculatorResultsArea>
    </CalculatorContainer>
  );
}

export function PSEOScenarioCalculator({ params }: { params: PSEOParams }) {
  if (params.type === 'mortgage') {
    return (
      <MortgageCalculatorWidget
        initialHomePrice={params.amount}
        initialDownPaymentPercent={0}
        initialInterestRate={params.rate}
        initialLoanTerm={params.term}
        initialAnnualPropertyTax={0}
        initialAnnualInsurance={0}
        currency={params.currency}
        title={`Adjust the ${formatCurrency(params.amount, 0, params.currency)} mortgage scenario`}
        description={params.calculatorDescription}
      />
    );
  }
  if (params.type === 'loan') return <LoanScenarioCalculator params={params} />;
  return <AffordabilityScenarioCalculator params={params} />;
}
