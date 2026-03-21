import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from "@/components/calculator/CalculatorContainer";
import { ResultCard } from "@/components/calculator/ResultCard";
import { Input } from "@/components/ui/Input";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { formatCurrency, calculateAmortizedPayment, convertCurrency } from "@/lib/finance";
import { CalculatorSEOSection } from "@/components/calculator/CalculatorSEOSection";

export default function TotalInterestCalculator() {
  const router = useRouter();
  const { locale } = router;
  const currency = (locale?.toUpperCase() as 'USD' | 'EUR') || 'EUR';

  const [principal, setPrincipal] = useState(50000);
  const [rate, setRate] = useState(5.0);
  const [years, setYears] = useState(10);

  const [results, setResults] = useState({
    totalInterest: 0,
    totalPaid: 0
  });

  // Sync state when currency changes
  useEffect(() => {
    const prevCurrency = currency === 'USD' ? 'EUR' : 'USD';
    setPrincipal(prev => Math.round(convertCurrency(prev, prevCurrency, currency)));
  }, [currency]);

  useEffect(() => {
    const monthly = calculateAmortizedPayment(principal, rate, years);
    const total = monthly * (years * 12);
    setResults({
      totalPaid: total,
      totalInterest: total - principal
    });
  }, [principal, rate, years]);

  return (
    <MainLayout>
      <SEOHandler 
        title="Total Interest Calculator - The True Cost of Borrowing"
        description="Calculate the total interest you will pay on any loan or mortgage. Understand the long-term impact of interest rates on your financial future."
        canonicalUrl="https://tryfincalc.com/total-interest-calculator"
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
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Principal Amount ({currency === 'EUR' ? '€' : '$'})</label>
              <Input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Interest Rate (APR %)</label>
              <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Time Period (Years)</label>
              <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
            </div>
          </div>
        </CalculatorInputArea>

        <CalculatorResultsArea>
          <div className="space-y-8">
            <div className="text-center p-8 bg-primary/5 rounded-3xl border border-primary/10">
              <h3 className="text-sm font-semibold tracking-wider text-primary uppercase mb-2">Total Interest Paid</h3>
              <div className="text-5xl md:text-6xl font-manrope font-extrabold text-primary">
                {formatCurrency(results.totalInterest, 0, currency)}
              </div>
            </div>
            <div className="p-6 bg-white rounded-3xl border border-outline-variant/10 text-center">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1">Total Amount (Principal + Interest)</h4>
              <div className="text-3xl font-bold text-primary">{formatCurrency(results.totalPaid, 0, currency)}</div>
            </div>
          </div>
        </CalculatorResultsArea>
      </CalculatorContainer>
      <CalculatorSEOSection 
        title="Total Interest Calculator: The True Cost of Debt"
        intro={
          <>
            <p>When taking out a loan, it's easy to fixate on the monthly payment. While that's important, it doesn't tell the whole story. The <strong>Total Interest</strong> is the actual price you are paying for the privilege of borrowing money. Over long terms, this amount can equal or even exceed the amount you originally borrowed.</p>
            <p>Our Total Interest Calculator reveals exactly how much of your hard-earned money is going toward interest and how small changes in your term or rate can save you tens of thousands in lifetime costs.</p>
          </>
        }
        howItWorks={
          <>
            <p>Total interest is calculated as the sum of all monthly payments minus the original principal borrowed. In a standard amortized loan, you pay more interest at the beginning and more principal at the end.</p>
            <ul>
              <li><strong>The Rule of Costs:</strong> The higher the interest rate and the longer the term, the more total interest you pay over the life of the debt.</li>
              <li><strong>Term Sensitivity:</strong> Extending a mortgage from 15 to 30 years can nearly double your total interest cost, even though it lowers your monthly payment.</li>
              <li><strong>Rate Impact:</strong> On a large loan, even a quarter-point difference in interest rate can add or subtract thousands from your lifetime financial obligations.</li>
            </ul>
          </>
        }
        examples={[
          {
            title: "The $300,000 Mortgage Lesson",
            items: [
              { label: "Interest Rate", value: "7.0%" },
              { label: "30 Year Total Interest", value: currency === 'EUR' ? "€418,527" : "$418,527" },
              { label: "15 Year Total Interest", value: currency === 'EUR' ? "€185,426" : "$185,426" },
              { label: "Total Savings", value: currency === 'EUR' ? "€233,101" : "$233,101" }
            ],
            description: "A stark look at how loan term length affects long-term sustainability."
          },
          {
            title: "Auto Loan Term Comparison",
            items: [
              { label: "Loan Amount", value: currency === 'EUR' ? "€35,000" : "$35,000" },
              { label: "Interest Rate", value: "8.0%" },
              { label: "60 Month Interest", value: currency === 'EUR' ? "€7,575" : "$7,575" },
              { label: "72 Month Interest", value: currency === 'EUR' ? "€9,228" : "$9,228" }
            ],
            description: "Choosing a shorter term often saves thousands in interest alone."
          }
        ]}
        tips={[
          "Always compare loan offers based on total interest, not just monthly payments.",
          "Consider bi-weekly payments to reduce interest faster if your lender allows it.",
          "Shorten your loan term whenever your monthly budget and savings allow.",
          "Check for prepayment penalties before making extra principal payments."
        ]}
        faqs={[
          {
            question: "How can I pay less total interest?",
            answer: "By securing a lower interest rate, choosing a shorter term, or making extra principal payments consistently during the life of the loan."
          },
          {
            question: "Is total interest tax-deductible?",
            answer: "In many regions, mortgage interest is partially deductible, but personal loan interest usually is not. Check your local tax regulations for details."
          }
        ]}
        relatedCalculators={[
          { label: "Monthly Payment", href: "/monthly-payment-calculator" },
          { label: "Refinancing", href: "/refinancing-calculator" },
          { label: "Amortization", href: "/amortization-schedule" }
        ]}
        relatedBlogs={[
          { title: "Debt Management Guide", href: "/blog" }
        ]}
        ctaText="Ready to lower your costs?"
        ctaHref="/refinancing-calculator"
      />
    </MainLayout>
  );
}
