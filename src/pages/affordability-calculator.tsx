import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from "@/components/calculator/CalculatorContainer";

import { Input } from "@/components/ui/Input";

import { formatCurrency, convertCurrency, validateLoan, calculateAffordability } from "@/lib/finance";
import { CalculatorSEOSection } from "@/components/calculator/CalculatorSEOSection";
import { Search, PieChart, Wallet } from "lucide-react";

export default function AffordabilityCalculator() {
  const router = useRouter();
  const { locale } = router;
  const currency = (locale?.toUpperCase() as 'USD' | 'EUR') || 'USD';
  const [monthlyIncome, setMonthlyIncome] = useState(7500);
  const [monthlyDebts, setMonthlyDebts] = useState(0);
  const [downPayment, setDownPayment] = useState(50000);
  const [interestRate, setInterestRate] = useState(3.75);
  const [loanTerm, setLoanTerm] = useState(25);
  const [isCalculated, setIsCalculated] = useState(false);

  const affordabilitySchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Home Affordability Calculator",
      "url": "https://tryfincalc.com/affordability-calculator",
      "description": "Find out how much house you can afford based on your income, debts, and down payment. Free affordability calculator supporting USD and EUR.",
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

  const [results, setResults] = useState({
    maxPrice: 0,
    monthlyPayment: 0,
    loanAmount: 0
  });

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

  useEffect(() => {
    if (validationError) return;
    setResults(calculateAffordability(monthlyIncome, monthlyDebts, downPayment, interestRate, loanTerm, currency));
  }, [validationError, monthlyIncome, monthlyDebts, downPayment, interestRate, loanTerm, currency]);


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
          Find out your ideal home price range based on your income and standard debt-to-income limits.
        </p>
      </header>

      <CalculatorContainer 
        title="Affordability Calculator" 
        description="Find out how much house you can afford based on your income and debts. Plan your budget with confidence. Free and requires no sign-up. Try it at TryFinCalc."
      >
        <CalculatorInputArea>
          {validationError && <p id="calculator-error" role="alert" className="mb-4 text-red-700 dark:text-red-300">{validationError}</p>}
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="monthlyIncome" className="block text-sm font-semibold text-on-surface">
                Monthly Household Income ({currency === 'EUR' ? '€' : '$'})
              </label>
              <Input id="monthlyIncome" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={monthlyIncome} onChange={(e) => { setIsCalculated(true); setMonthlyIncome(e.target.valueAsNumber); }} />
              <p className="text-xs text-on-surface-variant">Include base salary and any recurring income sources.</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="monthlyDebts" className="block text-sm font-semibold text-on-surface">Other Monthly Debts ({currency === 'EUR' ? '€' : '$'})</label>
              <Input id="monthlyDebts" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={monthlyDebts} onChange={(e) => { setIsCalculated(true); setMonthlyDebts(e.target.valueAsNumber); }} />
              <p className="text-xs text-on-surface-variant">Auto loans, personal loans, or other commitments.</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="downPayment" className="block text-sm font-semibold text-on-surface">Personal Contribution / Down Payment ({currency === 'EUR' ? '€' : '$'})</label>
              <Input id="downPayment" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={downPayment} onChange={(e) => { setIsCalculated(true); setDownPayment(e.target.valueAsNumber); }} />
              <p className="text-xs text-on-surface-variant">Savings used for the purchase.</p>
            </div>
            
            <div className="pt-4 border-t border-outline-variant/30 mt-6">
              <h3 className="text-sm font-bold text-primary mb-4">Market Assumptions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="interestRate" className="block text-xs font-semibold text-on-surface">Interest Rate (%)</label>
                  <Input max={100} id="interestRate" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" step="0.1" value={interestRate} onChange={(e) => { setIsCalculated(true); setInterestRate(e.target.valueAsNumber); }} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="loanTerm" className="block text-xs font-semibold text-on-surface">Loan Term (Years)</label>
                  <Input min={1/12} max={100} step="any" id="loanTerm" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={loanTerm} onChange={(e) => { setIsCalculated(true); setLoanTerm(e.target.valueAsNumber); }} />
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
              {(isCalculated && !validationError) ? (
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
                  {(isCalculated && !validationError) ? formatCurrency(results.monthlyPayment, 0, currency) : "—"}
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-surface-container-lowest rounded-3xl border border-outline-variant/10 text-center sm:text-left">
                <h3 className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Max Loan Amount</h3>
                <div className="text-2xl font-bold text-primary">
                  {(isCalculated && !validationError) ? formatCurrency(results.loanAmount, 0, currency) : "—"}
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


      <CalculatorSEOSection 
        title="Mortgage Affordability: How Much House Can You Afford?"
        intro={
          <>
            <p>Determining your borrowing capacity is the crucial first step in your home-buying journey. Lenders look closely at your monthly disposable income and your ability to maintain a comfortable standard of living after the mortgage is paid.</p>
            <p>Our Affordability Calculator applies standard industry estimates used by global lenders to give you a realistic target price for your next home search.</p>
            <p>See specific scenarios: <Link href="/calculator/how-much-house-can-i-afford-80k-salary" className="text-primary underline">$80k salary affordability</Link> · <Link href="/calculator/how-much-house-can-i-afford-70k-salary" className="text-primary underline">$70k salary affordability</Link></p>
          </>
        }
        howItWorks={
          <>
            <p>Affordability is generally calculated using Debt-to-Income (DTI) ratios. Standard conservative limits ensure your total monthly installments for all loans stay under a sustainable portion of your income.</p>
            <ul>
              <li><strong>Residual Income:</strong> Beyond fixed ratios, banks also check for a minimum residual income to cover essential living expenses for your household.</li>
              <li><strong>Closing Costs:</strong> Remember to budget for registration duties, notary fees, and administrative costs, which are often paid upfront from your own savings.</li>
              <li><strong>Down Payment:</strong> A larger down payment reduces your loan amount, which lowers your monthly payment and significantly increases the total price you can afford.</li>
            </ul>
          </>
        }
        examples={[
          {
            title: "Solo Professional",
            items: [
              { label: "Monthly Income", value: currency === 'EUR' ? "€3,500" : "$3,500" },
              { label: "Existing Debts", value: currency === 'EUR' ? "€200" : "$200" },
              { label: "Estimated Budget", value: currency === 'EUR' ? "€950" : "$950" },
              { label: "Approx. Loan", value: currency === 'EUR' ? "€195,000" : "$195,000" }
            ],
            description: "A typical solo buyer scenario with manageable recurring debt."
          },
          {
            title: "Dual-Income Household",
            items: [
              { label: "Combined Gross Income", value: "$120,000/yr" },
              { label: "Monthly Gross Income", value: "$10,000" },
              { label: "28% Housing Budget", value: "$2,800/mo" },
              { label: "Estimated Max Loan", value: "~$417,000 at 6.8%" },
              { label: "Recommended Home Price", value: "~$463,000 (10% down)" }
            ],
            description: "Combined household income of $120,000/yr"
          }
        ]}
        tips={[
          "Get pre-approved to understand your exact borrowing limit before you offer.",
          "Include all reliable sources of income when calculating your budget.",
          "Try to consolidate or reduce recurring debts before applying for a mortgage.",
          "Ensure you have enough liquid savings to cover closing costs and taxes."
        ]}
        faqs={[
          {
            question: "How does my credit score affect affordability?",
            answer: "A higher score usually unlocks lower interest rates, which lowers your monthly payment and allows you to afford a more expensive home with the same budget."
          },
          {
            question: "Should I spend the maximum amount I can afford?",
            answer: "Not necessarily. Financial experts recommend leaving room in your budget for unexpected maintenance, personal savings, and fluctuating living expenses."
          }
        ]}
        relatedCalculators={[
          { label: "Mortgage Calculator", href: "/mortgage-calculator" },
          { label: "Rent vs Buy", href: "/rent-vs-buy" },
          { label: "Monthly Payment", href: "/monthly-payment-calculator" }
        ]}
        relatedBlogs={[
          { title: "How Much Can I Borrow?", href: "/blog/how-much-can-i-borrow" },
          { title: "How Much House Can I Afford?", href: "/blog/how-much-house-can-i-afford" }
        ]}
        ctaText="Find your price range today"
        ctaHref="#calculator-top"
        ctaButtonText="Check Your Affordability"
      />
    </MainLayout>
  );
}
