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
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "When does it make sense to refinance a mortgage?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Refinancing generally makes sense when you can lower your interest rate by at least 0.75% to 1%, or if you want to switch from an adjustable-rate to a fixed-rate mortgage for stability. The key is ensuring you will stay in the home long enough to reach the 'break-even' point where your monthly savings cover the closing costs."
          }
        },
        {
          "@type": "Question",
          "name": "How is the refinancing break-even point calculated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The break-even point is calculated by dividing the total closing costs of the new loan by your monthly savings. For example, if refinancing costs $5,000 and saves you $200 per month, your break-even point is 25 months ($5,000 / $200)."
          }
        },
        {
          "@type": "Question",
          "name": "What are typical closing costs for refinancing in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Closing costs for refinancing typically range from 2% to 5% of the loan principal. These costs often include application fees, home appraisal fees, title search and insurance, and lender attorney fees."
          }
        }
      ]
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

  // Sync state when currency changes
  useEffect(() => {
    const prevCurrency = currency === 'USD' ? 'EUR' : 'USD';
    setBalance(prev => Math.round(convertCurrency(prev, prevCurrency, currency)));
    setFees(prev => Math.round(convertCurrency(prev, prevCurrency, currency)));
  }, [currency]);

  useEffect(() => {
    const currentMonthly = calculateAmortizedPayment(balance, currentRate, yearsRemaining);
    const newMonthly = calculateAmortizedPayment(balance, newRate, newTerm);
    const mSavings = currentMonthly - newMonthly;
    
    const totalCurrentRemaining = currentMonthly * (yearsRemaining * 12);
    const totalNew = (newMonthly * (newTerm * 12)) + fees;
    
    setResults({
      monthlySavings: mSavings,
      lifetimeSavings: totalCurrentRemaining - totalNew,
      breakEven: mSavings > 0 ? fees / mSavings : 0,
      newMonthly: newMonthly
    });
  }, [balance, currentRate, yearsRemaining, newRate, newTerm, fees]);

  return (
    <MainLayout>
      <SEOHandler 
        title="Refinancing Calculator - Save on Your Monthly Payments"
        description="Calculate how much you can save by refinancing your mortgage or loan. Find your break-even point today. Free and requires no sign-up. Compare rates now."
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
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Remaining Loan Balance ({currency === 'EUR' ? '€' : '$'})</label>
              <Input type="number" value={balance} onChange={(e) => { setIsCalculated(true); setBalance(Number(e.target.value)); }} />
            </div>

            <div className="border border-outline-variant/30 rounded-xl p-4 bg-surface-container-low">
              <h4 className="text-sm font-bold text-primary mb-3">Current Mortgage</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-on-surface">Current Rate (%)</label>
                  <Input type="number" step="0.1" value={currentRate} onChange={(e) => { setIsCalculated(true); setCurrentRate(Number(e.target.value)); }} />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-on-surface">Years Remaining</label>
                  <Input type="number" value={yearsRemaining} onChange={(e) => { setIsCalculated(true); setYearsRemaining(Number(e.target.value)); }} />
                </div>
              </div>
            </div>

            <div className="border border-primary/20 rounded-xl p-4 bg-primary-fixed/10">
              <h4 className="text-sm font-bold text-primary mb-3">New Offer</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-on-surface">New Rate (%)</label>
                  <Input type="number" step="0.1" value={newRate} onChange={(e) => { setIsCalculated(true); setNewRate(Number(e.target.value)); }} />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-on-surface">New Term (Years)</label>
                  <Input type="number" value={newTerm} onChange={(e) => { setIsCalculated(true); setNewTerm(Number(e.target.value)); }} />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <label className="block text-xs font-semibold text-on-surface text-primary font-bold">Total Closing / Refi Costs ({currency === 'EUR' ? '€' : '$'})</label>
                <Input type="number" value={fees} onChange={(e) => { setIsCalculated(true); setFees(Number(e.target.value)); }} />
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
              title: "Refi Rates",
              description: "Compare today's best refinancing rates.",
              icon: RefreshCw,
              href: "/contact"
            },
            {
              title: "Closing Costs",
              description: "Learn how to estimate and reduce refi fees.",
              icon: ArrowLeftRight,
              href: "/blog"
            },
            {
              title: "Save Monthly",
              description: "Strategies to maximize your refinancing savings.",
              icon: TrendingDown,
              href: "/blog/reduce-personal-loan-costs"
            }
          ]}
        >
          <div className="space-y-8">
            <div className="text-center p-6 bg-primary/5 rounded-3xl border border-primary/10">
              <h3 className="text-sm font-semibold tracking-wider text-primary uppercase mb-2">Monthly Savings</h3>
              {isCalculated ? (
                <div className="text-5xl font-manrope font-extrabold text-primary animate-in fade-in duration-700">
                  {formatCurrency(Math.max(0, results.monthlySavings), 0, currency)}
                </div>
              ) : (
                <div className="py-4 text-lg font-medium text-on-surface-variant/40 italic">
                  Enter details to calculate savings
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white rounded-3xl border border-outline-variant/10 text-center sm:text-left">
                <h4 className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Lifetime Savings</h4>
                <div className="text-2xl font-bold text-primary">
                  {isCalculated ? formatCurrency(results.lifetimeSavings, 0, currency) : "—"}
                </div>
              </div>
              <div className="p-6 bg-surface-container-lowest border-t-4 border-tertiary rounded-3xl text-center shadow-sm">
                <h4 className="text-xs font-semibold text-tertiary uppercase mb-1">Break-even Point</h4>
                <div className="text-3xl font-bold text-primary">
                  {isCalculated ? (
                    <>
                      {Math.max(0, Math.ceil(results.breakEven))} <span className="text-sm font-normal">Mo.</span>
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
                  { label: "Home Price", value: currency === 'USD' ? "$500,000" : "€500,000" },
                  { label: "Down Payment (20%)", value: currency === 'USD' ? "$100,000" : "€100,000" },
                  { label: "Interest Rate", value: "6.5%" },
                  { label: "PITI Payment", value: currency === 'USD' ? "$3,850" : "€3,850" }
                ],
            description: "Prioritizing debt freedom and long-term interest savings."
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
          { title: "Refinancing Strategy", href: "/blog" },
          { title: "Understanding Market Rates", href: "/blog" }
        ]}
        ctaText="See your potential savings"
        ctaHref="/amortization-schedule"
      />
    </MainLayout>
  );
}
