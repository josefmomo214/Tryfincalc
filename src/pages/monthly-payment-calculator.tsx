import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from "@/components/calculator/CalculatorContainer";

import { Input } from "@/components/ui/Input";

import { formatCurrency, calculateLoan, convertCurrency, validateLoan } from "@/lib/finance";
import { CalculationGuide } from "@/components/calculator/CalculationGuide";

export default function MonthlyPaymentCalculator() {
  const router = useRouter();
  const { locale } = router;
  const currency = (locale?.toUpperCase() as 'USD' | 'EUR') || 'USD';

  const [amount, setAmount] = useState(250000);
  const [rate, setRate] = useState(3.75);
  const [years, setYears] = useState(25);



  const validationError = validateLoan(amount, rate, years) || (![amount, rate, years].every(value => Number.isFinite(value) && value >= 0 && value <= 1e12) ? 'Enter a non-negative number up to 1 trillion in every field.' : '');

  const previousCurrency = useRef(currency);

  // Sync state when currency changes
  useEffect(() => {
    const prevCurrency = previousCurrency.current;
    if (prevCurrency === currency) return;
    previousCurrency.current = currency;
    setAmount(prev => Math.round(convertCurrency(prev, prevCurrency, currency) * 100) / 100);
  }, [currency]);

  const results = validationError ? calculateLoan(0, 0, 1) : calculateLoan(amount, rate, years);


  return (
    <MainLayout>
      <SEOHandler 
        title="Monthly Payment Calculator: Fast Loan Estimates | TryFinCalc"
        description="Get an instant breakdown of your monthly obligation for any loan. See your monthly payment in seconds with our 2026 calculator. No sign-up required."
        canonicalUrl="https://tryfincalc.com/monthly-payment-calculator"
      />

      <header className="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-display-md font-manrope font-bold text-primary mb-4">
          Monthly Payment Calculator
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl">
          A streamlined tool to quickly find out what your monthly obligation will be for any fixed-rate loan.
        </p>
      </header>

      <CalculatorContainer 
        title="Monthly Payment Calculator" 
        description="A streamlined tool to quickly find out your monthly repayment obligation."
      >
        <CalculatorInputArea>
          {validationError && <p id="calculator-error" role="alert" className="mb-4 text-red-700 dark:text-red-300">{validationError}</p>}
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-semibold text-on-surface">Total Loan Amount ({currency === 'EUR' ? '€' : '$'})</label>
              <Input id="amount" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={amount} onChange={(e) => { setAmount(e.target.valueAsNumber); }} />
            </div>
            <div className="space-y-2">
              <label htmlFor="rate" className="block text-sm font-semibold text-on-surface">Interest Rate (%)</label>
              <Input max={100} id="rate" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" step="0.1" value={rate} onChange={(e) => { setRate(e.target.valueAsNumber); }} />
            </div>
            <div className="space-y-2">
              <label htmlFor="years" className="block text-sm font-semibold text-on-surface">Term (Years)</label>
              <Input min={1/12} max={100} step="any" id="years" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={years} onChange={(e) => { setYears(e.target.valueAsNumber); }} />
            </div>
          </div>
        </CalculatorInputArea>

        <CalculatorResultsArea>
          <div className="space-y-8">
            <div className="text-center p-8 bg-primary/5 rounded-3xl border border-primary/10">
              <h3 className="text-sm font-semibold tracking-wider text-primary uppercase mb-2">Estimated Monthly Payment</h3>
              {(!validationError) ? (
                <div className="text-5xl md:text-6xl font-manrope font-extrabold text-primary animate-in fade-in duration-700">
                  {formatCurrency(results.monthly, 2, currency)}
                </div>
              ) : (
                <div className="py-4 text-lg font-medium text-on-surface-variant/40 italic">
                  Enter details to see payment
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Principal</span>
                  <span className="font-bold text-primary">{(!validationError) ? formatCurrency(amount, 0, currency) : "—"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Total Interest</span>
                  <span className="font-bold text-primary">{(!validationError) ? formatCurrency(results.totalInterest, 2, currency) : "—"}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-outline-variant/10">
                  <span className="text-on-surface font-bold">Total Cost</span>
                  <span className="font-bold text-primary">{(!validationError) ? formatCurrency(results.totalPaid, 2, currency) : "—"}</span>
                </div>
              </div>
            </div>
          </div>
        </CalculatorResultsArea>
      </CalculatorContainer>


      <CalculationGuide tool="monthly-payment" currency={currency} />
    </MainLayout>
  );
}
