import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from "@/components/calculator/CalculatorContainer";

import { Input } from "@/components/ui/Input";

import { formatCurrency, convertCurrency, validateLoan, calculateRefinancing } from "@/lib/finance";
import { CalculatorSEOSection } from "@/components/calculator/CalculatorSEOSection";
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
  const [isCalculated, setIsCalculated] = useState(false);

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

  const [results, setResults] = useState({
    monthlySavings: 0,
    lifetimeSavings: 0,
    breakEven: 0,
    newMonthly: 0
  });

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

  useEffect(() => {
    if (validationError) return;
    setResults(calculateRefinancing(balance, currentRate, yearsRemaining, newRate, newTerm, fees));
  }, [validationError, balance, currentRate, yearsRemaining, newRate, newTerm, fees]);


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
          {validationError && <p id="calculator-error" role="alert" className="mb-4 text-red-700 dark:text-red-300">{validationError}</p>}
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="balance" className="block text-sm font-semibold text-on-surface">Remaining Loan Balance ({currency === 'EUR' ? '€' : '$'})</label>
              <Input id="balance" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={balance} onChange={(e) => { setIsCalculated(true); setBalance(e.target.valueAsNumber); }} />
            </div>

            <div className="border border-outline-variant/30 rounded-xl p-4 bg-surface-container-low">
              <h3 className="text-sm font-bold text-primary mb-3">Current Mortgage</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="currentRate" className="block text-xs font-semibold text-on-surface">Current Rate (%)</label>
                  <Input max={100} id="currentRate" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" step="0.1" value={currentRate} onChange={(e) => { setIsCalculated(true); setCurrentRate(e.target.valueAsNumber); }} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="yearsRemaining" className="block text-xs font-semibold text-on-surface">Years Remaining</label>
                  <Input min={1/12} max={100} step="any" id="yearsRemaining" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={yearsRemaining} onChange={(e) => { setIsCalculated(true); setYearsRemaining(e.target.valueAsNumber); }} />
                </div>
              </div>
            </div>

            <div className="border border-primary/20 rounded-xl p-4 bg-primary-fixed/10">
              <h3 className="text-sm font-bold text-primary mb-3">New Offer</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="newRate" className="block text-xs font-semibold text-on-surface">New Rate (%)</label>
                  <Input max={100} id="newRate" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" step="0.1" value={newRate} onChange={(e) => { setIsCalculated(true); setNewRate(e.target.valueAsNumber); }} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="newTerm" className="block text-xs font-semibold text-on-surface">New Term (Years)</label>
                  <Input min={1/12} max={100} step="any" id="newTerm" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={newTerm} onChange={(e) => { setIsCalculated(true); setNewTerm(e.target.valueAsNumber); }} />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <label htmlFor="fees" className="block text-xs font-semibold text-on-surface text-primary font-bold">Total Closing / Refi Costs ({currency === 'EUR' ? '€' : '$'})</label>
                <Input id="fees" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={fees} onChange={(e) => { setIsCalculated(true); setFees(e.target.valueAsNumber); }} />
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
            <div className="text-center p-6 bg-primary/5 rounded-3xl border border-primary/10">
              <h3 className="text-sm font-semibold tracking-wider text-primary uppercase mb-2">Monthly Savings</h3>
              {(isCalculated && !validationError) ? (
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
                  {(isCalculated && !validationError) ? formatCurrency(results.lifetimeSavings, 0, currency) : "—"}
                </div>
              </div>
              <div className="p-6 bg-surface-container-lowest border-t-4 border-tertiary rounded-3xl text-center shadow-sm">
                <h3 className="text-xs font-semibold text-tertiary uppercase mb-1">Break-even Point</h3>
                <div className="text-3xl font-bold text-primary">
                  {(isCalculated && !validationError) ? (
                    <>
                      {results.monthlySavings > 0 && Number.isFinite(results.breakEven) ? `${Math.ceil(results.breakEven)} Mo.` : 'No measurable monthly savings'}
                    </>
                  ) : "—"}
                </div>
              </div>
            </div>
          </div>
        </CalculatorResultsArea>
      </CalculatorContainer>


      <CalculatorSEOSection 
        title="Mortgage Refinancing: When to Refinance Your Home?"
        intro={
          <>
            <p>Refinancing your mortgage can be a powerful financial move to lower your monthly payments, shorten your loan term, or access cash from your home's equity. Determining if the numbers work in your favor requires a clear-eyed look at the current interest rates versus your original loan terms.</p>
            <p>Use our Refinancing Calculator to see your potential monthly savings, total lifetime savings, and most importantly, how many months it will take to break even on the closing costs.</p>
            <p>See specific scenarios: <Link href="/calculator/400k-mortgage-monthly-payment-4-percent" className="text-primary underline">$400k mortgage at 4%</Link> · <Link href="/calculator/income-required-for-400k-house" className="text-primary underline">Income required for $400k house</Link></p>
          </>
        }
        howItWorks={
          <>
            <p>Refinancing typically involves paying off your original mortgage and starting a new one. The process mirrors the original home purchase, requiring an application, credit check, appraisal, and closing costs.</p>
            <ul>
              <li><strong>Interest Rate Savings:</strong> The most common goal is to secure a lower rate to reduce the monthly principal and interest (P&I) payment.</li>
              <li><strong>Closing Costs:</strong> You will typically pay between 2% and 5% of the loan amount in closing costs, which affects your break-even period.</li>
              <li><strong>Term Changes:</strong> Moving from a 30-year to a 15-year mortgage can save significant amounts in interest over the life of the loan, even if the monthly payment increases.</li>
            </ul>
          </>
        }
        examples={[
          {
            title: "Monthly Budget Optimization",
            items: [
              { label: "Current Payment", value: currency === 'USD' ? "$2,150" : "€2,150" },
              { label: "New Rate", value: "5.5%" },
              { label: "Monthly Savings", value: currency === 'USD' ? "$285" : "€285" },
              { label: "Break-even", value: "28 Months" }
            ],
            description: "Typically achieved when market rates drop significantly below your locked rate."
          },
          {
            title: "Term Reduction Strategy",
            items: [
              { label: "Remaining Balance", value: currency === 'USD' ? "$280,000" : "€280,000" },
              { label: "Current Rate (30yr)", value: "7.0%" },
              { label: "New Rate (15yr)", value: "6.2%" },
              { label: "Monthly Payment Increase", value: "+$412" },
              { label: "Total Interest Saved", value: "$143,600" },
              { label: "Break-Even Point", value: "14 months" }
            ],
            description: "Refinancing from 30yr to 15yr"
          }
        ]}
        tips={[
          "Calculate your break-even point before committing to any new loan.",
          "Check for prepayment penalties on your current mortgage agreement.",
          "Consider 'rolling' closing costs into the new loan if upfront cash is limited.",
          "Shop at least three lenders to compare different APRs and fee structures."
        ]}
        faqs={[
          {
            question: "Is there a limit on how many times I can refinance?",
            answer: "Theoretically no, but you should always ensure the new loan's savings exceed the closing costs of the previous one to maintain financial growth."
          },
          {
            question: "Can I refinance if I have low equity in my home?",
            answer: "It is often more challenging but possible. Most lenders require at least 5-10% equity, though specific government-backed programs may allow for lower thresholds."
          }
        ]}
        relatedCalculators={[
          { label: "Mortgage", href: "/mortgage-calculator" },
          { label: "Total Interest", href: "/total-interest-calculator" },
          { label: "Amortization", href: "/amortization-schedule" }
        ]}
        relatedBlogs={[
          { title: "When to Refinance", href: "/blog/when-to-refinance" },
          { title: "Refinance Calculator Guide", href: "/blog/refinance-calculator-guide" }
        ]}
        ctaText="See your potential savings"
        ctaHref="#calculator-top"
        ctaButtonText="Calculate Break-Even Point"
      />
    </MainLayout>
  );
}
