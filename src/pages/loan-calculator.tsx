import React, { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from "@/components/calculator/CalculatorContainer";

import { Input } from "@/components/ui/Input";

import { formatCurrency, calculateLoan, convertCurrency, validateLoan } from "@/lib/finance";
import { CalculationGuide } from "@/components/calculator/CalculationGuide";
import { ArrowLeftRight, BarChart3, TrendingDown } from "lucide-react";
import { useDisplayCurrency } from "@/lib/currency";
import Link from "next/link";

export default function LoanCalculator() {
  const { currency } = useDisplayCurrency();

  const [loanAmount, setLoanAmount] = useState(15000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(5);


  const loanSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Loan Calculator",
      "url": "https://tryfincalc.com/loan-calculator",
      "description": "Free loan calculator — calculate monthly payments, total interest, and total repayment for fixed-rate personal or auto loans.",
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
          "name": "Loan Calculator",
          "item": "https://tryfincalc.com/loan-calculator"
        }
      ]
    }
  ];


  const validationError = validateLoan(loanAmount, interestRate, loanTerm) || (![loanAmount, interestRate, loanTerm].every(value => Number.isFinite(value) && value >= 0 && value <= 1e12) ? 'Enter a non-negative number up to 1 trillion in every field.' : '');

  const previousCurrency = useRef(currency);

  // Sync state when currency changes
  useEffect(() => {
    const prevCurrency = previousCurrency.current;
    if (prevCurrency === currency) return;
    previousCurrency.current = currency;
    setLoanAmount(prev => Math.round(convertCurrency(prev, prevCurrency, currency) * 100) / 100);
  }, [currency]);

  const results = validationError ? calculateLoan(0, 0, 1) : calculateLoan(loanAmount, interestRate, loanTerm);


  return (
    <MainLayout>
      <SEOHandler 
        title="Personal Loan Calculator: Estimator & FAQ | TryFinCalc"
        description="Estimate installments for any personal or auto loan. See your monthly payment in seconds and compare total interest costs across various 2026 terms."
        canonicalUrl="https://tryfincalc.com/loan-calculator"
        structuredData={loanSchema}
      />

      <header className="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-display-md font-manrope font-bold text-primary mb-4">
          Personal Loan Calculator
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl">
          Find out your monthly payments and the total cost of your personal loan over time.
        </p>
      </header>

      <CalculatorContainer 
        title="Personal Loan Calculator" 
        description="Find out your monthly payments and the total cost of your personal loan over time."
      >
        <CalculatorInputArea>
          {validationError && <p id="calculator-error" role="alert" className="mb-4 text-red-700 dark:text-red-300">{validationError}</p>}
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="loanAmount" className="block text-sm font-semibold text-on-surface">Loan Amount ({currency === 'EUR' ? '€' : '$'})</label>
               <Input id="loanAmount" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={loanAmount} onChange={(e) => { setLoanAmount(e.target.valueAsNumber); }} />
            </div>
            <div className="space-y-2">
              <label htmlFor="interestRate" className="block text-sm font-semibold text-on-surface">Annual interest rate (%)</label>
               <Input max={100} id="interestRate" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" step="0.1" value={interestRate} onChange={(e) => { setInterestRate(e.target.valueAsNumber); }} />
            </div>
            <div className="space-y-2">
              <label htmlFor="loanTerm" className="block text-sm font-semibold text-on-surface">Loan Term (Years)</label>
               <Input min={1/12} max={100} step="any" id="loanTerm" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={loanTerm} onChange={(e) => { setLoanTerm(e.target.valueAsNumber); }} />
            </div>
          </div>
        </CalculatorInputArea>

        <CalculatorResultsArea 
          nextSteps={[
            {
              title: "Learn how to compare loan offers",
              description: "Learn how to compare APR, fees and repayment terms.",
              icon: ArrowLeftRight,
              href: "/blog/compare-loan-offers"
            },
            {
              title: "Explore Scenarios",
              description: "Try different amounts and terms to optimize your budget.",
              icon: BarChart3,
              href: "#calculator-top"
            },
            {
              title: "Reduce Costs",
              description: "Tips to lower your APR and total interest paid.",
              icon: TrendingDown,
              href: "/blog/compare-loan-offers"
            }
          ]}
        >
          <div className="space-y-8">
             <div className="text-center p-6 bg-primary/5 rounded-3xl border border-primary/10">
               <h3 className="text-sm font-semibold tracking-wider text-primary uppercase mb-2">Estimated Monthly Payment</h3>
               {(!validationError) ? (
                 <div className="text-5xl font-manrope font-extrabold text-primary animate-in fade-in duration-700">
                   {formatCurrency(results.monthly, 2, currency)}
                 </div>
               ) : (
                 <div className="py-4 text-lg font-medium text-on-surface-variant/40 italic">
                   Enter details to calculate
                 </div>
               )}
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="p-6 bg-white dark:bg-surface-container-lowest rounded-3xl border border-outline-variant/10 text-center sm:text-left">
                 <h3 className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Total Interest</h3>
                 <div className="text-2xl font-bold text-primary">
                   {(!validationError) ? formatCurrency(results.totalInterest, 2, currency) : "—"}
                 </div>
               </div>
               <div className="p-6 bg-white dark:bg-surface-container-lowest rounded-3xl border border-outline-variant/10 text-center sm:text-left">
                 <h3 className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Total Paid</h3>
                 <div className="text-2xl font-bold text-primary">
                   {(!validationError) ? formatCurrency(results.totalPaid, 2, currency) : "—"}
                 </div>
               </div>
             </div>
          </div>
        </CalculatorResultsArea>
      </CalculatorContainer>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-16">
        <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-8">
          <h2 className="text-2xl font-manrope font-bold text-primary mb-3">Worked loan decisions</h2>
          <p className="text-on-surface-variant mb-5">Compare payment, term, and total scheduled cost using editable note-rate assumptions.</p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
            <Link className="font-semibold text-primary hover:underline" href="/calculator/20k-loan-monthly-payment-10-percent">
              $20,000 loan: term and note-rate cost
            </Link>
            <Link className="font-semibold text-primary hover:underline" href="/calculator/30k-loan-monthly-payment-9-percent">
              $30,000 loan: three years versus five
            </Link>
            <Link className="font-semibold text-primary hover:underline" href="/calculator/50k-loan-monthly-payment-8-percent">
              $50,000 loan: payment and total cost
            </Link>
          </div>
        </div>
      </section>


      <CalculationGuide tool="loan" currency={currency} />
    </MainLayout>
  );
}
