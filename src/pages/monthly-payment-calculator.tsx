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

export default function MonthlyPaymentCalculator() {
  const router = useRouter();
  const { locale } = router;
  const currency = (locale?.toUpperCase() as 'USD' | 'EUR') || 'EUR';

  const [amount, setAmount] = useState(250000);
  const [rate, setRate] = useState(3.75);
  const [years, setYears] = useState(25);

  const [results, setResults] = useState({
    monthly: 0,
    totalInterest: 0,
    totalPaid: 0
  });

  // Sync state when currency changes
  useEffect(() => {
    const prevCurrency = currency === 'USD' ? 'EUR' : 'USD';
    setAmount(prev => Math.round(convertCurrency(prev, prevCurrency, currency)));
  }, [currency]);

  useEffect(() => {
    const monthly = calculateAmortizedPayment(amount, rate, years);
    const totalPaid = monthly * (years * 12);
    setResults({
      monthly,
      totalPaid,
      totalInterest: totalPaid - amount
    });
  }, [amount, rate, years]);

  return (
    <MainLayout>
      <SEOHandler 
        title="Monthly Payment Calculator - Loan & Mortgage Estimator"
        description="Estimate your monthly payments for any loan or mortgage. Clear, simple monthly payment results for your home or car loan."
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
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Total Loan Amount ({currency === 'EUR' ? '€' : '$'})</label>
              <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Interest Rate (%)</label>
              <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Term (Years)</label>
              <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
            </div>
          </div>
        </CalculatorInputArea>

        <CalculatorResultsArea>
          <div className="space-y-8">
            <div className="text-center p-8 bg-primary/5 rounded-3xl border border-primary/10">
              <h3 className="text-sm font-semibold tracking-wider text-primary uppercase mb-2">Estimated Monthly Payment</h3>
              <div className="text-5xl md:text-6xl font-manrope font-extrabold text-primary">
                {formatCurrency(results.monthly, 2, currency)}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-outline-variant/10">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Summary</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Principal</span>
                  <span className="font-bold text-primary">{formatCurrency(amount, 0, currency)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Total Interest</span>
                  <span className="font-bold text-primary">{formatCurrency(results.totalInterest, 2, currency)}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-outline-variant/10">
                  <span className="text-on-surface font-bold">Total Cost</span>
                  <span className="font-bold text-primary">{formatCurrency(results.totalPaid, 2, currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </CalculatorResultsArea>
      </CalculatorContainer>


      <CalculatorSEOSection 
        title="Monthly Payment Calculator: Mastering Your Monthly Budget"
        intro={
          <>
            <p>When you take out a loan, the single most important number for your day-to-day life is the monthly payment. This amount determines how much room you have in your budget for other essentials, savings, and discretionary spending.</p>
            <p>Our Monthly Payment Calculator helps you see exactly how much you’ll owe each month, allowing you to plan ahead with certainty and avoid over-extending your finances across any currency or market.</p>
          </>
        }
        howItWorks={
          <>
            <p>Monthly payments on most fixed-rate loans are determined by an amortization formula. This formula ensures that over the life of the loan, you pay back the entire principal plus the interest charged by the lender in equal installments.</p>
            <ul>
              <li><strong>Fixed-Rate Benefits:</strong> With a fixed-rate loan, your monthly principal and interest (P&I) payment never changes, providing financial predictability for years to come.</li>
              <li><strong>Amortization Schedule:</strong> Early in the loan, a larger portion of your payment goes toward interest. As the balance decreases, more and more of each payment goes toward the principal.</li>
              <li><strong>Taxes and Insurance:</strong> Remember that if you are calculating a mortgage payment, your total monthly cost might also include property taxes and homeowners insurance.</li>
            </ul>
          </>
        }
        examples={[
          {
            title: "Starter Home Mortgage",
            items: [
              { label: "Loan Amount", value: currency === 'EUR' ? "€300,000" : "$300,000" },
              { label: "Interest Rate", value: "5.5%" },
              { label: "Term", value: "30 Years" },
              { label: "Monthly P&I", value: currency === 'EUR' ? "€1,703" : "$1,703" }
            ],
            description: "A typical 30-year fixed-rate mortgage scenario."
          },
          {
            title: "Vehicle Financing",
            items: [
              { label: "Loan Amount", value: currency === 'EUR' ? "€35,000" : "$35,000" },
              { label: "Interest Rate", value: "6.0%" },
              { label: "Term", value: "5 Years" },
              { label: "Monthly Payment", value: currency === 'EUR' ? "€677" : "$677" }
            ],
            description: "Choosing a shorter term for personal or auto loans."
          }
        ]}
        tips={[
          "Try to keep your total housing payment under 28% of your gross income.",
          "Check if your lender allows bi-weekly payments to pay off the loan faster.",
          "Factor in PMI or mortgage insurance if your down payment is less than 20%.",
          "Automate your payments to ensure you never miss a deadline and protect your credit."
        ]}
        faqs={[
          {
            question: "Does my monthly payment include property taxes?",
            answer: "The base calculation here is for Principal and Interest (P&I). Depending on your loan, you may need to add monthly property taxes and insurance to this total for a full escrow estimate."
          },
          {
            question: "Can I lower my monthly payment after the loan starts?",
            answer: "Usually, you would need to refinance your loan to a lower interest rate or a longer term to reduce the monthly obligation."
          }
        ]}
        relatedCalculators={[
          { label: "Mortgage", href: "/mortgage-calculator" },
          { label: "Loan Calculator", href: "/loan-calculator" },
          { label: "Total Interest", href: "/total-interest-calculator" }
        ]}
        relatedBlogs={[
          { title: "Interest Rates Guide", href: "/blog" }
        ]}
        ctaText="See your total lifetime costs"
        ctaHref="/total-interest-calculator"
      />
    </MainLayout>
  );
}
