import React, { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from "@/components/calculator/CalculatorContainer";

import { Input } from "@/components/ui/Input";

import { formatCurrency, calculateLoan, convertCurrency, validateLoan } from "@/lib/finance";
import { CalculationGuide } from "@/components/calculator/CalculationGuide";
import { useDisplayCurrency } from "@/lib/currency";
import { generateWebApplicationSchema } from "@/lib/schema";

export default function TotalInterestCalculator() {
  const { currency } = useDisplayCurrency();

  const [principal, setPrincipal] = useState(50000);
  const [rate, setRate] = useState(5.0);
  const [years, setYears] = useState(10);



  const validationError = validateLoan(principal, rate, years) || (![principal, rate, years].every(value => Number.isFinite(value) && value >= 0 && value <= 1e12) ? 'Enter a non-negative number up to 1 trillion in every field.' : '');

  const previousCurrency = useRef(currency);

  // Sync state when currency changes
  useEffect(() => {
    const prevCurrency = previousCurrency.current;
    if (prevCurrency === currency) return;
    previousCurrency.current = currency;
    setPrincipal(prev => Math.round(convertCurrency(prev, prevCurrency, currency) * 100) / 100);
  }, [currency]);

  const results = validationError ? calculateLoan(0, 0, 1) : calculateLoan(principal, rate, years);


  return (
    <MainLayout>
      <SEOHandler 
        title="Total Interest Calculator: Lifetime Loan Cost | TryFinCalc"
        description="Calculate total interest and total repayment for a fixed-rate loan from its principal, annual interest rate and term."
        canonicalUrl="https://tryfincalc.com/total-interest-calculator"
        structuredData={generateWebApplicationSchema({
          name: 'Total Interest Calculator',
          path: '/total-interest-calculator',
          description: 'Estimate total interest and total repayment for a fixed-rate loan from its principal, annual interest rate and term.',
          currency,
        })}
      />

      <header className="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-display-md font-manrope font-bold text-primary mb-4">
          Total Interest Calculator
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl">
          Don't just look at the monthly payment. See the true cost of your loan over its lifetime.
        </p>
      </header>

      <CalculatorContainer 
        title="Total Interest Calculator" 
        description="Don't just look at the monthly payment. See the true cost of your loan over its lifetime."
      >
        <CalculatorInputArea>
          {validationError && <p id="calculator-error" role="alert" className="mb-4 text-red-700 dark:text-red-300">{validationError}</p>}
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="principal" className="block text-sm font-semibold text-on-surface">Principal Amount ({currency === 'EUR' ? '€' : '$'})</label>
              <Input id="principal" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={principal} onChange={(e) => { setPrincipal(e.target.valueAsNumber); }} />
            </div>
            <div className="space-y-2">
              <label htmlFor="rate" className="block text-sm font-semibold text-on-surface">Annual interest rate (%)</label>
              <Input max={100} id="rate" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" step="0.1" value={rate} onChange={(e) => { setRate(e.target.valueAsNumber); }} />
            </div>
            <div className="space-y-2">
              <label htmlFor="years" className="block text-sm font-semibold text-on-surface">Time Period (Years)</label>
              <Input min={1/12} max={100} step="any" id="years" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={years} onChange={(e) => { setYears(e.target.valueAsNumber); }} />
            </div>
          </div>
        </CalculatorInputArea>

        <CalculatorResultsArea>
          <div className="space-y-8">
            <div className="text-center p-8 bg-primary/5 rounded-3xl border border-primary/10">
              <h3 className="text-sm font-semibold tracking-wider text-primary uppercase mb-2">Total Interest Paid</h3>
              {(!validationError) ? (
                <div className="text-5xl md:text-6xl font-manrope font-extrabold text-primary animate-in fade-in duration-700">
                  {formatCurrency(results.totalInterest, 0, currency)}
                </div>
              ) : (
                <div className="py-4 text-lg font-medium text-on-surface-variant/40 italic">
                  Enter details to see total interest
                </div>
              )}
            </div>
            <div className="p-6 bg-white dark:bg-surface-container-lowest rounded-3xl border border-outline-variant/10 text-center">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1">Total Amount (Principal + Interest)</h3>
              <div className="text-3xl font-bold text-primary">
                {(!validationError) ? formatCurrency(results.totalPaid, 0, currency) : "-"}
              </div>
            </div>
          </div>
        </CalculatorResultsArea>
      </CalculatorContainer>
      <CalculationGuide tool="total-interest" currency={currency} />
    </MainLayout>
  );
}
