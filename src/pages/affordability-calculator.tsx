import React, { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from "@/components/calculator/CalculatorContainer";

import { Input } from "@/components/ui/Input";

import { formatCurrency, convertCurrency, validateLoan, calculateAffordability } from "@/lib/finance";
import { CalculationGuide } from "@/components/calculator/CalculationGuide";
import { Search, PieChart, Wallet } from "lucide-react";
import { useDisplayCurrency } from "@/lib/currency";
import Link from "next/link";

export default function AffordabilityCalculator() {
  const { currency } = useDisplayCurrency();
  const [monthlyIncome, setMonthlyIncome] = useState(7500);
  const [monthlyDebts, setMonthlyDebts] = useState(0);
  const [downPayment, setDownPayment] = useState(50000);
  const [interestRate, setInterestRate] = useState(3.75);
  const [loanTerm, setLoanTerm] = useState(25);


  const affordabilitySchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Home Affordability Calculator",
      "url": "https://tryfincalc.com/affordability-calculator",
      "description": "Explore a home-price estimate using displayed income, debt, down-payment, rate and illustrative US housing-budget assumptions.",
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
          "name": "Home Affordability Calculator",
          "item": "https://tryfincalc.com/affordability-calculator"
        }
      ]
    }
  ];


  const validationError = validateLoan(downPayment, interestRate, loanTerm) || (![monthlyIncome, monthlyDebts, downPayment, interestRate, loanTerm].every(value => Number.isFinite(value) && value >= 0 && value <= 1e12) ? 'Enter a non-negative number up to 1 trillion in every field.' : '');

  const previousCurrency = useRef(currency);

  // Sync state when currency changes
  useEffect(() => {
    const prevCurrency = previousCurrency.current;
    if (prevCurrency === currency) return;
    previousCurrency.current = currency;
    setMonthlyIncome(prev => Math.round(convertCurrency(prev, prevCurrency, currency) * 100) / 100);
    setMonthlyDebts(prev => Math.round(convertCurrency(prev, prevCurrency, currency) * 100) / 100);
    setDownPayment(prev => Math.round(convertCurrency(prev, prevCurrency, currency) * 100) / 100);
  }, [currency]);

  const results = validationError ? calculateAffordability(0, 0, 0, 0, 1, currency) : calculateAffordability(monthlyIncome, monthlyDebts, downPayment, interestRate, loanTerm, currency);


  return (
    <MainLayout>
      <SEOHandler 
        title="Home Affordability Calculator: How Much House? | TryFinCalc"
        description="Estimate a home price range and loan amount from your monthly income, debts, down payment, interest rate and loan term."
        canonicalUrl="https://tryfincalc.com/affordability-calculator"
        structuredData={affordabilitySchema}
      />

      <header className="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-display-md font-manrope font-bold text-primary mb-4">
          Affordability Calculator
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl">
          Find out your ideal home price range based on your income and illustrative US budgeting assumptions.
        </p>
      </header>

      <CalculatorContainer 
        title="Affordability Calculator" 
        description="Find out how much house you can afford based on your income and debts. Plan your budget with confidence. Free and requires no sign-up. Try it at TryFinCalc."
      >
        <CalculatorInputArea>
          <p className="mb-4 text-sm">Illustrative US budget: housing capped at 28% of gross income and housing plus other debt at 36%. These are documented planning assumptions, not universal lender rules or approval estimates. Tax, insurance, HOA and PMI are excluded here, so the displayed ceiling can overstate a usable purchase budget. Currency changes do not change these assumptions.</p>
          {validationError && <p id="calculator-error" role="alert" className="mb-4 text-red-700 dark:text-red-300">{validationError}</p>}
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="monthlyIncome" className="block text-sm font-semibold text-on-surface">
                Monthly Gross Household Income ({currency === 'EUR' ? '€' : '$'})
              </label>
              <Input id="monthlyIncome" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={monthlyIncome} onChange={(e) => { setMonthlyIncome(e.target.valueAsNumber); }} />
              <p className="text-xs text-on-surface-variant">Include base salary and any recurring income sources.</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="monthlyDebts" className="block text-sm font-semibold text-on-surface">Other Monthly Debts ({currency === 'EUR' ? '€' : '$'})</label>
              <Input id="monthlyDebts" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={monthlyDebts} onChange={(e) => { setMonthlyDebts(e.target.valueAsNumber); }} />
              <p className="text-xs text-on-surface-variant">Auto loans, personal loans, or other commitments.</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="downPayment" className="block text-sm font-semibold text-on-surface">Personal Contribution / Down Payment ({currency === 'EUR' ? '€' : '$'})</label>
              <Input id="downPayment" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={downPayment} onChange={(e) => { setDownPayment(e.target.valueAsNumber); }} />
              <p className="text-xs text-on-surface-variant">Savings used for the purchase.</p>
            </div>
            
            <div className="pt-4 border-t border-outline-variant/30 mt-6">
              <h3 className="text-sm font-bold text-primary mb-4">Market Assumptions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="interestRate" className="block text-xs font-semibold text-on-surface">Interest Rate (%)</label>
                  <Input max={100} id="interestRate" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" step="0.1" value={interestRate} onChange={(e) => { setInterestRate(e.target.valueAsNumber); }} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="loanTerm" className="block text-xs font-semibold text-on-surface">Loan Term (Years)</label>
                  <Input min={1/12} max={100} step="any" id="loanTerm" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={loanTerm} onChange={(e) => { setLoanTerm(e.target.valueAsNumber); }} />
                </div>
              </div>
            </div>
          </div>
        </CalculatorInputArea>

        <CalculatorResultsArea 
          nextSteps={[
            {
              title: "Understand debt-to-income ratios",
              description: "Learn how income and debts affect a housing budget.",
              icon: Search,
              href: "/blog/28-36-rule-explained"
            },
            {
              title: "Debt-to-Income",
              description: "Understand how lenders view your finances.",
              icon: PieChart,
              href: "/blog/28-36-rule-explained"
            },
            {
              title: "Savings Plan",
              description: "Maximize your borrowing power through savings.",
              icon: Wallet,
              href: "/blog/down-payment-guide"
            }
          ]}
        >
          <div className="space-y-8">
            <div className="text-center p-8 bg-primary/5 rounded-3xl border border-primary/10">
              <h3 className="text-sm font-semibold tracking-wider text-primary uppercase mb-2">Estimated Home Price</h3>
              {(!validationError) ? (
                <div className="text-5xl md:text-6xl font-manrope font-extrabold text-primary animate-in fade-in duration-700">
                  {formatCurrency(results.maxPrice, 0, currency)}
                </div>
              ) : (
                <div className="py-6 text-xl font-medium text-on-surface-variant/40 italic">
                  Enter your income details above to see results
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white dark:bg-surface-container-lowest rounded-3xl border border-outline-variant/10 text-center sm:text-left">
                <h3 className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Max Monthly Budget</h3>
                <div className="text-2xl font-bold text-primary">
                  {(!validationError) ? formatCurrency(results.monthlyPayment, 0, currency) : "—"}
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-surface-container-lowest rounded-3xl border border-outline-variant/10 text-center sm:text-left">
                <h3 className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Max Loan Amount</h3>
                <div className="text-2xl font-bold text-primary">
                  {(!validationError) ? formatCurrency(results.loanAmount, 0, currency) : "—"}
                </div>
              </div>
            </div>
            
            <div className="bg-primary shadow-sm rounded-3xl p-6 text-white">
              <h3 className="font-bold mb-2">Housing Affordability Standards</h3>
              <p className="text-sm opacity-90 leading-relaxed mb-0">
                Lenders typically evaluate your budget based on stable debt-to-income (DTI) ratios. This ensures you have enough residual income for living expenses, maintenance, and future savings after your mortgage is paid.
              </p>
            </div>
          </div>
        </CalculatorResultsArea>
      </CalculatorContainer>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-16">
        <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-8">
          <h2 className="text-2xl font-manrope font-bold text-primary mb-3">Worked affordability assumptions</h2>
          <p className="text-on-surface-variant mb-5">See how debt, down payment, rate, property tax, and insurance change one transparent planning example.</p>
          <Link className="font-semibold text-primary hover:underline" href="/calculator/how-much-house-can-i-afford-80k-salary">
            $80,000 salary affordability sensitivity
          </Link>
        </div>
      </section>


      <CalculationGuide tool="affordability" currency={currency} />
    </MainLayout>
  );
}
