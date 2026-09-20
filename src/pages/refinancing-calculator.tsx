import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from "@/components/calculator/CalculatorContainer";

import { Input } from "@/components/ui/Input";

import { formatCurrency, convertCurrency, validateLoan, calculateRefinancing } from "@/lib/finance";
import { CalculationGuide } from "@/components/calculator/CalculationGuide";
import { ArrowLeftRight, TrendingDown, RefreshCw } from "lucide-react";

export default function RefinancingCalculator() {
  const router = useRouter();
  const { locale } = router;
  const currency = (locale?.toUpperCase() as 'USD' | 'EUR') || 'USD';

  const [balance, setBalance] = useState(250000);
  const [currentRate, setCurrentRate] = useState(4.5);
  const [yearsRemaining, setYearsRemaining] = useState(20);
  const [newRate, setNewRate] = useState(3.2);
  const [newTerm, setNewTerm] = useState(20);
  const [fees, setFees] = useState(5500);


  const refinancingSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Refinancing Calculator",
      "url": "https://tryfincalc.com/refinancing-calculator",
      "description": "Calculate your potential savings from refinancing your mortgage. Estimate monthly and lifetime savings, and find your break-even point.",
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
          "name": "Refinancing Calculator",
          "item": "https://tryfincalc.com/refinancing-calculator"
        }
      ]
    }
  ];


  const validationError = validateLoan(balance, currentRate, yearsRemaining) || validateLoan(balance, newRate, newTerm) || (![balance, currentRate, yearsRemaining, newRate, newTerm, fees].every(value => Number.isFinite(value) && value >= 0 && value <= 1e12) ? 'Enter a non-negative number up to 1 trillion in every field.' : '');

  const previousCurrency = useRef(currency);

  // Sync state when currency changes
  useEffect(() => {
    const prevCurrency = previousCurrency.current;
    if (prevCurrency === currency) return;
    previousCurrency.current = currency;
    setBalance(prev => Math.round(convertCurrency(prev, prevCurrency, currency) * 100) / 100);
    setFees(prev => Math.round(convertCurrency(prev, prevCurrency, currency) * 100) / 100);
  }, [currency]);

  const results = validationError ? calculateRefinancing(0, 0, 1, 0, 1, 0) : calculateRefinancing(balance, currentRate, yearsRemaining, newRate, newTerm, fees);


  return (
    <MainLayout>
      <SEOHandler 
        title="Mortgage Refinance Calculator: Break-Even Tool | TryFinCalc"
        description="Compare current and proposed loan payments, estimated lifetime savings and the time needed to recover refinancing costs."
        canonicalUrl="https://tryfincalc.com/refinancing-calculator"
        structuredData={refinancingSchema}
      />

      <header className="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-display-md font-manrope font-bold text-primary mb-4">
          Refinancing Calculator
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl">
          Compare your current mortgage with a new offer to see if refinancing saves you money.
        </p>
      </header>

      <CalculatorContainer 
        title="Refinancing Calculator" 
        description="Compare your current mortgage with a new offer to see if refinancing is right for you."
      >
        <CalculatorInputArea>
          <p className="mb-4 text-sm">Estimates assume closing costs are paid upfront, fixed rates, end-of-month payments and no prepayments. Simple fee recovery measures payment savings only; it is not an equity-adjusted break-even. Taxes, insurance and prepayment penalties are excluded.</p>
          {validationError && <p id="calculator-error" role="alert" className="mb-4 text-red-700 dark:text-red-300">{validationError}</p>}
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="balance" className="block text-sm font-semibold text-on-surface">Remaining Loan Balance ({currency === 'EUR' ? '€' : '$'})</label>
              <Input id="balance" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={balance} onChange={(e) => { setBalance(e.target.valueAsNumber); }} />
            </div>

            <div className="border border-outline-variant/30 rounded-xl p-4 bg-surface-container-low">
              <h3 className="text-sm font-bold text-primary mb-3">Current Mortgage</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="currentRate" className="block text-xs font-semibold text-on-surface">Current Rate (%)</label>
                  <Input max={100} id="currentRate" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" step="0.1" value={currentRate} onChange={(e) => { setCurrentRate(e.target.valueAsNumber); }} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="yearsRemaining" className="block text-xs font-semibold text-on-surface">Years Remaining</label>
                  <Input min={1/12} max={100} step="any" id="yearsRemaining" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={yearsRemaining} onChange={(e) => { setYearsRemaining(e.target.valueAsNumber); }} />
                </div>
              </div>
            </div>

            <div className="border border-primary/20 rounded-xl p-4 bg-primary-fixed/10">
              <h3 className="text-sm font-bold text-primary mb-3">New Offer</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="newRate" className="block text-xs font-semibold text-on-surface">New Rate (%)</label>
                  <Input max={100} id="newRate" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" step="0.1" value={newRate} onChange={(e) => { setNewRate(e.target.valueAsNumber); }} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="newTerm" className="block text-xs font-semibold text-on-surface">New Term (Years)</label>
                  <Input min={1/12} max={100} step="any" id="newTerm" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={newTerm} onChange={(e) => { setNewTerm(e.target.valueAsNumber); }} />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <label htmlFor="fees" className="block text-xs font-semibold text-on-surface text-primary font-bold">Total Closing / Refi Costs ({currency === 'EUR' ? '€' : '$'})</label>
                <Input id="fees" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={fees} onChange={(e) => { setFees(e.target.valueAsNumber); }} />
                <p className="text-[10px] text-on-surface-variant italic">
                  Include bank fees, appraisal, and typical closing costs.
                </p>
              </div>
            </div>
          </div>
        </CalculatorInputArea>

        <CalculatorResultsArea 
          nextSteps={[
            {
              title: "Explore the refinancing guide",
              description: "Understand refinancing costs and the break-even calculation.",
              icon: RefreshCw,
              href: "/blog/refinance-calculator-guide"
            },
            {
              title: "Closing Costs",
              description: "Learn how to estimate and reduce refi fees.",
              icon: ArrowLeftRight,
              href: "/blog/closing-costs-breakdown"
            },
            {
              title: "Save Monthly",
              description: "Strategies to maximize your refinancing savings.",
              icon: TrendingDown,
              href: "/blog/compare-loan-offers"
            }
          ]}
        >
          <div className="space-y-8">
            {!validationError && <p>Estimated remaining scheduled payments: {formatCurrency(results.currentTotal,2,currency)}. New scheduled payments plus upfront costs: {formatCurrency(results.newTotal,2,currency)}.</p>}
            <div className="text-center p-6 bg-primary/5 rounded-3xl border border-primary/10">
              <h3 className="text-sm font-semibold tracking-wider text-primary uppercase mb-2">Monthly Savings</h3>
              {(!validationError) ? (
                <div className="text-5xl font-manrope font-extrabold text-primary animate-in fade-in duration-700">
                  {formatCurrency(results.monthlySavings, 0, currency)}
                </div>
              ) : (
                <div className="py-4 text-lg font-medium text-on-surface-variant/40 italic">
                  Enter details to calculate savings
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white dark:bg-surface-container-lowest rounded-3xl border border-outline-variant/10 text-center sm:text-left">
                <h3 className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Lifetime Savings</h3>
                <div className="text-2xl font-bold text-primary">
                  {(!validationError) ? formatCurrency(results.lifetimeSavings, 0, currency) : "—"}
                </div>
              </div>
              <div className="p-6 bg-surface-container-lowest border-t-4 border-tertiary rounded-3xl text-center shadow-sm">
                <h3 className="text-xs font-semibold text-tertiary uppercase mb-1">Break-even Point</h3>
                <div className="text-3xl font-bold text-primary">
                  {(!validationError) ? (
                    <>
                      {results.monthlySavings > 0 && Number.isFinite(results.breakEven) ? `${Math.ceil(results.breakEven ?? 0)} Mo.` : 'No fee recovery within both loan terms'}
                    </>
                  ) : "—"}
                </div>
              </div>
            </div>
          </div>
        </CalculatorResultsArea>
      </CalculatorContainer>


      <CalculationGuide tool="refinancing" currency={currency} />
    </MainLayout>
  );
}
