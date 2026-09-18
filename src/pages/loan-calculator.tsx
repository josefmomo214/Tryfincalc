import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from "@/components/calculator/CalculatorContainer";

import { Input } from "@/components/ui/Input";

import { formatCurrency, calculateAmortizedPayment, convertCurrency, validateLoan } from "@/lib/finance";
import { CalculatorSEOSection } from "@/components/calculator/CalculatorSEOSection";
import { ArrowLeftRight, BarChart3, TrendingDown } from "lucide-react";

export default function LoanCalculator() {
  const router = useRouter();
  const { locale } = router;
  const currency = (locale?.toUpperCase() as 'USD' | 'EUR') || 'USD';

  const [loanAmount, setLoanAmount] = useState(15000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(5);
  const [isCalculated, setIsCalculated] = useState(false);

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

  const [results, setResults] = useState({
    monthly: 0,
    totalInterest: 0,
    totalPaid: 0
  });

  const validationError = validateLoan(loanAmount, interestRate, loanTerm) || (![loanAmount, interestRate, loanTerm].every(value => Number.isFinite(value) && value >= 0 && value <= 1e12) ? 'Enter a non-negative number up to 1 trillion in every field.' : '');

  const previousCurrency = useRef(currency);

  // Sync state when currency changes
  useEffect(() => {
    const prevCurrency = previousCurrency.current;
    if (prevCurrency === currency) return;
    previousCurrency.current = currency;
    setLoanAmount(prev => Math.round(convertCurrency(prev, prevCurrency, currency) * 100) / 100);
  }, [currency]);

  useEffect(() => {
    if (validationError) return;
    const monthly = calculateAmortizedPayment(loanAmount, interestRate, loanTerm);
    const totalPaid = monthly * (loanTerm * 12);
    setResults({
      monthly,
      totalPaid,
      totalInterest: totalPaid - loanAmount
    });
  }, [validationError, loanAmount, interestRate, loanTerm]);


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
               <Input id="loanAmount" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={loanAmount} onChange={(e) => { setIsCalculated(true); setLoanAmount(e.target.valueAsNumber); }} />
            </div>
            <div className="space-y-2">
              <label htmlFor="interestRate" className="block text-sm font-semibold text-on-surface">Interest Rate (APR %)</label>
               <Input max={100} id="interestRate" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" step="0.1" value={interestRate} onChange={(e) => { setIsCalculated(true); setInterestRate(e.target.valueAsNumber); }} />
            </div>
            <div className="space-y-2">
              <label htmlFor="loanTerm" className="block text-sm font-semibold text-on-surface">Loan Term (Years)</label>
               <Input min={1/12} max={100} step="any" id="loanTerm" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={loanTerm} onChange={(e) => { setIsCalculated(true); setLoanTerm(e.target.valueAsNumber); }} />
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
               {(isCalculated && !validationError) ? (
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
                   {(isCalculated && !validationError) ? formatCurrency(results.totalInterest, 2, currency) : "—"}
                 </div>
               </div>
               <div className="p-6 bg-white dark:bg-surface-container-lowest rounded-3xl border border-outline-variant/10 text-center sm:text-left">
                 <h3 className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Total Paid</h3>
                 <div className="text-2xl font-bold text-primary">
                   {(isCalculated && !validationError) ? formatCurrency(results.totalPaid, 2, currency) : "—"}
                 </div>
               </div>
             </div>
          </div>
        </CalculatorResultsArea>
      </CalculatorContainer>


      <CalculatorSEOSection 
        title="Personal Loan Calculator: Plan Your Borrowing"
        intro={
          <>
            <p>Borrowing money effectively requires a clear understanding of the long-term impact on your financial health. Whether you are funding a major purchase, consolidating debt, or covering an emergency expense, our Personal Loan Calculator provides the clarity you need to make an informed decision.</p>
            <p>Calculate your monthly installments, total interest paid, and the overall cost of your loan with mathematical precision across both Dollars and Euros.</p>
            <p>See specific scenarios: <Link href="/calculator/25k-personal-loan-repayment-8-percent" className="text-primary underline">$25k loan at 8%</Link> · <Link href="/calculator/30k-loan-monthly-payment-9-percent" className="text-primary underline">$30k loan at 9%</Link></p>
          </>
        }
        howItWorks={
          <>
            <p>Personal loans are typically unsecured, meaning you don&apos;t need to provide collateral like a home or car. The interest rate you receive is heavily influenced by your credit history and current market conditions.</p>
            <ul>
              <li><strong>Fixed installments:</strong> Most personal loans come with a fixed interest rate, ensuring your monthly payments stay the same throughout the term.</li>
              <li><strong>APR vs. Interest Rate:</strong> The APR (Annual Percentage Rate) includes both the interest rate and any mandatory fees, representing the true annual cost of borrowing.</li>
              <li><strong>Repayment Terms:</strong> Loan durations typically range from 1 to 7 years. Choosing a longer term lowers your monthly payment but increases the total interest paid.</li>
            </ul>
          </>
        }
        examples={[
          {
            title: "Major Project",
            items: [
              { label: "Loan Amount", value: currency === 'USD' ? "$10,000" : "€10,000" },
              { label: "Interest Rate", value: "8.0%" },
              { label: "Term", value: "3 Years" },
              { label: "Monthly Payment", value: currency === 'USD' ? "$313.36" : "€313.36" }
            ],
            description: "Typical scenario for a significant home improvement or high-value purchase."
          },
          {
            title: "Small Emergency",
            items: [
              { label: "Loan Amount", value: currency === 'EUR' ? "€5,000" : "$5,000" },
              { label: "APR", value: "9.9%" },
              { label: "Term", value: "24 Months" },
              { label: "Monthly Payment", value: currency === 'EUR' ? "€230.54" : "$230.54" }
            ],
            description: "Short-term financing for unexpected expenses or consolidating small debts."
          }
        ]}
        tips={[
          "Compare the APR, not just the interest rate, to see the true cost.",
          "Check for prepayment fees before signing your agreement.",
          "Keep your total monthly debt-to-income ratio under 36% for financial health.",
          "A higher credit score often unlocks significantly lower interest rates."
        ]}
        faqs={[
          {
            question: "What is a good APR for a personal loan?",
            answer: "A 'good' rate depends on the current market and your credit profile. Top-tier applicants often see rates below 10%, while others may see rates ranging from 15% to 25% or more."
          },
          {
            question: "Can I repay my personal loan early?",
            answer: "In many jurisdictions, you have the right to repay your loan early. Some lenders may charge a small prepayment fee, so it's essential to check your specific contract terms."
          },
          {
            question: "How fast can I receive my funds?",
            answer: "Online lenders can often approve and fund loans within 1 to 3 business days, while traditional banks might take a bit longer for processing."
          }
        ]}
        relatedCalculators={[
          { label: "Mortgage", href: "/mortgage-calculator" },
          { label: "Total Interest", href: "/total-interest-calculator" },
          { label: "Affordability", href: "/affordability-calculator" }
        ]}
        relatedBlogs={[
          { title: "Loan Calculator Explained", href: "/blog/loan-calculator-explained" },
          { title: "Compare Loan Offers", href: "/blog/compare-loan-offers" }
        ]}
        ctaText="Plan your budget with confidence"
        ctaHref="#calculator-top"
        ctaButtonText="Open Loan Calculator"
      />
    </MainLayout>
  );
}
