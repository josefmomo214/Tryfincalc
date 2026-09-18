import { AmortizationTable } from "@/components/calculator/AmortizationTable";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from "@/components/calculator/CalculatorContainer";

import { Input } from "@/components/ui/Input";

import { formatCurrency, convertCurrency, validateLoan, generateAmortizationSchedule } from "@/lib/finance";
import { CalculatorSEOSection } from "@/components/calculator/CalculatorSEOSection";

export default function AmortizationSchedule() {
  const router = useRouter();
  const { locale } = router;
  const currency = (locale?.toUpperCase() as 'USD' | 'EUR') || 'USD';

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
      "description": "Professional-grade amortization schedule generator for 2026. See the exact split between principal and interest for every payment over the life of your loan.",
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
                  {isCalculated && !validationError && schedule.length > 0 ? formatCurrency(schedule[0].principal, 2, currency) : "—"}
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-surface-container-lowest rounded-3xl border border-outline-variant/10 text-center sm:text-left">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase mb-2">First Pmt Interest</h3>
                <div className="text-3xl font-bold text-primary">
                  {isCalculated && !validationError && schedule.length > 0 ? formatCurrency(schedule[0].interest, 2, currency) : "—"}
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
      <CalculatorSEOSection 
        title="Amortization Schedule: Your Path to Full Ownership"
        intro={
          <>
            <p>Every month, when you pay your mortgage installment, that money is split into two parts: principal repayment and interest. Our <strong>Amortization Schedule</strong> provides the visual roadmap of your journey from deep debt to full home ownership.</p>
            <p>Understanding this breakdown is essential for deciding when to refinance, when to make extra repayments, or simply for managing your long-term personal wealth across any global market.</p>
          </>
        }
        howItWorks={
          <>
            <p>Amortization is the process of paying off a debt over time through regular installments. With a fixed-rate loan, your total monthly payment (P&I) stays the same, but the mix of interest and principal changes every month.</p>
            <ul>
              <li><strong>Interest-Heavy Start:</strong> In the first few years, your balance is high, so a larger portion of your payment goes to interest. This is why your debt seems to decrease slowly at first.</li>
              <li><strong>Principal Acceleration:</strong> As the years go by, the interest portion shrinks, and more of your payment goes directly into building equity in your home.</li>
              <li><strong>Full Debt Freedom:</strong> By the end of the term, your payments are almost entirely principal, leading to a zero balance and full ownership.</li>
            </ul>
          </>
        }
        examples={[
          {
            title: "Your First Payment",
            items: [
              { label: "Principal", value: schedule[0] ? formatCurrency(schedule[0].principal, 2, currency) : '—' },
              { label: "Interest", value: schedule[0] ? formatCurrency(schedule[0].interest, 2, currency) : '—' }
            ],
            description: "Calculated from the loan amount, interest rate and term entered above."
          },
          {
            title: "Your Final Payment",
            items: [
              { label: "Principal", value: schedule.length ? formatCurrency(schedule[schedule.length - 1].principal, 2, currency) : '—' },
              { label: "Interest", value: schedule.length ? formatCurrency(schedule[schedule.length - 1].interest, 2, currency) : '—' },
              { label: "Remaining Balance", value: schedule.length ? formatCurrency(schedule[schedule.length - 1].balance, 2, currency) : '—' }
            ],
            description: "The final payment clears the remaining balance, with a small adjustment for floating-point precision."
          }
        ]}
        tips={[
          "Track your equity growth monthly to stay motivated.",
          "Identify when your loan-to-value ratio allows you to remove mortgage insurance.",
          "See the massive long-term impact of making even small extra principal payments.",
          "Keep your schedule for annual tax preparation and overall financial planning."
        ]}
        faqs={[
          {
            question: "How does a variable rate affect my schedule?",
            answer: "If your interest rate is variable, your schedule will be recalculated by your lender at each revision date based on the new rate and remaining balance."
          },
          {
            question: "Can I use this for a car loan?",
            answer: "Yes! Most installment loans for vehicles use the same base amortization math, showing how each payment reduces your total balance."
          }
        ]}
        relatedCalculators={[
          { label: "Monthly Payment", href: "/monthly-payment-calculator" },
          { label: "Total Interest", href: "/total-interest-calculator" },
          { label: "Refinancing", href: "/refinancing-calculator" }
        ]}
        ctaText="Ready to lower your monthly cost?"
        ctaHref="/refinancing-calculator"
        ctaButtonText="Compare refinancing scenarios"
      />
    </MainLayout>
  );
}
