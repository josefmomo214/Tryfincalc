import { AmortizationTable } from "@/components/calculator/AmortizationTable";
import React, { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from "@/components/calculator/CalculatorContainer";

import { Input } from "@/components/ui/Input";

import { formatCurrency, convertCurrency, validateLoan, generateAmortizationSchedule } from "@/lib/finance";
import { CalculationGuide } from "@/components/calculator/CalculationGuide";
import { useDisplayCurrency } from "@/lib/currency";

export default function AmortizationSchedule() {
  const { currency } = useDisplayCurrency();

  const [loanAmount, setLoanAmount] = useState(250000);
  const [interestRate, setInterestRate] = useState(3.75);
  const [loanTerm, setLoanTerm] = useState(20);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const schedule = generateAmortizationSchedule(loanAmount, interestRate, loanTerm);
  const [isCalculated, setIsCalculated] = useState(true);

  const amortizationSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Amortization Calculator | TryFinCalc",
      "url": "https://tryfincalc.com/amortization-schedule",
      "description": "Generate an estimated fixed-rate amortization schedule showing principal, interest and remaining balance for each payment.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://tryfincalc.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Amortization Schedule",
          "item": "https://tryfincalc.com/amortization-schedule"
        }
      ]
    }
  ];

  const previousCurrency = useRef(currency);

  // Sync state when currency changes
  useEffect(() => {
    const prevCurrency = previousCurrency.current;
    if (prevCurrency === currency) return;
    previousCurrency.current = currency;
    setLoanAmount(prev => Math.round(convertCurrency(prev, prevCurrency, currency) * 100) / 100);
  }, [currency]);

  const validationError = validateLoan(loanAmount, interestRate, loanTerm) || (![loanAmount, interestRate, loanTerm].every(value => Number.isFinite(value) && value >= 0 && value <= 1e12) ? 'Enter a non-negative number up to 1 trillion in every field.' : '');

  return (
    <MainLayout>
      <SEOHandler 
        title="Amortization Schedule 2026: Loan Payoff Details | TryFinCalc"
        description="Generate a month-by-month amortization schedule showing principal, interest, and remaining balance for every payment."
        canonicalUrl="https://tryfincalc.com/amortization-schedule"
        structuredData={amortizationSchema}
      />

      <header className="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-display-md font-manrope font-bold text-primary mb-4">
          Amortization Schedule
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl">
          Understand exactly where your monthly payments go over the life of your mortgage or loan.
        </p>
      </header>

      <CalculatorContainer 
        title="Amortization Schedule" 
        description="Understand exactly where your monthly payments go over the life of your mortgage."
      >
        <CalculatorInputArea>
          {validationError && <p id="calculator-error" role="alert" className="mb-4 text-red-700 dark:text-red-300">{validationError}</p>}
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="loanAmount" className="block text-sm font-semibold text-on-surface">Loan Amount ({currency === 'EUR' ? '€' : '$'})</label>
              <Input id="loanAmount" aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={loanAmount} onChange={(e) => { setIsCalculated(true); setLoanAmount(e.target.valueAsNumber); }} />
            </div>
            <div className="space-y-2">
              <label htmlFor="interestRate" className="block text-sm font-semibold text-on-surface">Interest Rate (%)</label>
              <Input max={100} id="interestRate" aria-describedby={validationError ? "calculator-error" : undefined} type="number" step="0.1" value={interestRate} onChange={(e) => { setIsCalculated(true); setInterestRate(e.target.valueAsNumber); }} />
            </div>
            <div className="space-y-2">
              <label htmlFor="loanTerm" className="block text-sm font-semibold text-on-surface">Loan Term (Years)</label>
              <Input min={1/12} max={100} step="any" id="loanTerm" aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={loanTerm} onChange={(e) => { setIsCalculated(true); setLoanTerm(e.target.valueAsNumber); }} />
            </div>
          </div>
        </CalculatorInputArea>

        <CalculatorResultsArea>
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-primary/5 rounded-3xl border border-primary/20 text-center sm:text-left">
                <h3 className="text-xs font-bold text-primary uppercase mb-2">First Pmt Principal</h3>
                <div className="text-3xl font-bold text-primary">
                  {isCalculated && !validationError && schedule.length > 0 ? formatCurrency(schedule[0].principal, 2, currency) : "-"}
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-surface-container-lowest rounded-3xl border border-outline-variant/10 text-center sm:text-left">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase mb-2">First Pmt Interest</h3>
                <div className="text-3xl font-bold text-primary">
                  {isCalculated && !validationError && schedule.length > 0 ? formatCurrency(schedule[0].interest, 2, currency) : "-"}
                </div>
              </div>
            </div>
            <div className="p-6 bg-surface-container-high rounded-3xl border border-outline-variant/10 text-center">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase mb-1">Estimated Monthly Payment</h3>
              {isCalculated && !validationError && schedule.length > 0 ? (
                <div className="text-4xl font-manrope font-extrabold text-primary animate-in fade-in duration-700">
                  {formatCurrency(schedule[0].payment, 2, currency)}
                </div>
              ) : (
                <div className="py-2 text-lg font-medium text-on-surface-variant/40 italic">
                  Enter details to see schedule
                </div>
              )}
            </div>
          </div>
        </CalculatorResultsArea>
      </CalculatorContainer>

      <AmortizationTable schedule={schedule} currency={currency} showFullSchedule={showFullSchedule}
        validationError={validationError} onToggle={() => setShowFullSchedule(value => !value)} />
      <CalculationGuide tool="amortization" currency={currency} />
    </MainLayout>
  );
}
