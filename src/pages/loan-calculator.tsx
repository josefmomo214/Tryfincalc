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
      "description": "Free loan calculator — calculate monthly payments, total interest, and full amortization schedule for any personal loan, auto loan, or mortgage.",
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
          "name": "How does a loan calculator work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A loan calculator uses the standard amortization formula M = P[r(1+r)^n]/[(1+r)^n-1] to calculate your monthly payment based on the loan amount, interest rate, and term. It then shows the total interest paid and full repayment schedule over the life of the loan."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between APR and interest rate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The interest rate is the base cost of borrowing the principal. The APR (Annual Percentage Rate) includes the interest rate plus all lender fees and charges, expressed as a yearly rate. Always compare APRs — not nominal rates — when evaluating loan offers from different lenders."
          }
        },
        {
          "@type": "Question",
          "name": "Is it better to take a shorter or longer loan term?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A shorter loan term means higher monthly payments but significantly less total interest paid. A longer term lowers your monthly payment but costs more overall. For example, a $25,000 loan at 8% over 3 years costs $3,188 in interest. The same loan over 7 years costs $7,676 — more than double."
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

  // Sync state when currency changes
  useEffect(() => {
    const prevCurrency = currency === 'USD' ? 'EUR' : 'USD';
    setLoanAmount(prev => Math.round(convertCurrency(prev, prevCurrency, currency)));
  }, [currency]);

  useEffect(() => {
    const monthly = calculateAmortizedPayment(loanAmount, interestRate, loanTerm);
    const totalPaid = monthly * (loanTerm * 12);
    setResults({
      monthly,
      totalPaid,
      totalInterest: totalPaid - loanAmount
    });
  }, [loanAmount, interestRate, loanTerm]);

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
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Loan Amount ({currency === 'EUR' ? '€' : '$'})</label>
               <Input type="number" value={loanAmount} onChange={(e) => { setIsCalculated(true); setLoanAmount(Number(e.target.value)); }} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Interest Rate (APR %)</label>
               <Input type="number" step="0.1" value={interestRate} onChange={(e) => { setIsCalculated(true); setInterestRate(Number(e.target.value)); }} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Loan Term (Years)</label>
               <Input type="number" value={loanTerm} onChange={(e) => { setIsCalculated(true); setLoanTerm(Number(e.target.value)); }} />
            </div>
          </div>
        </CalculatorInputArea>

        <CalculatorResultsArea 
          nextSteps={[
            {
              title: "Compare Rates",
              description: "See the latest personal loan offers from top lenders.",
              icon: ArrowLeftRight,
              href: "/blog"
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
              href: "/blog/reduce-personal-loan-costs"
            }
          ]}
        >
          <div className="space-y-8">
             <div className="text-center p-6 bg-primary/5 rounded-3xl border border-primary/10">
               <h3 className="text-sm font-semibold tracking-wider text-primary uppercase mb-2">Estimated Monthly Payment</h3>
               {isCalculated ? (
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
               <div className="p-6 bg-white rounded-3xl border border-outline-variant/10 text-center sm:text-left">
                 <h4 className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Total Interest</h4>
                 <div className="text-2xl font-bold text-primary">
                   {isCalculated ? formatCurrency(results.totalInterest, 2, currency) : "—"}
                 </div>
               </div>
               <div className="p-6 bg-white rounded-3xl border border-outline-variant/10 text-center sm:text-left">
                 <h4 className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Total Paid</h4>
                 <div className="text-2xl font-bold text-primary">
                   {isCalculated ? formatCurrency(results.totalPaid, 2, currency) : "—"}
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
          { title: "Compound Interest Guide", href: "/blog/compound-interest-explained" },
          { title: "DTI Ratio Standards", href: "/blog/debt-to-income-ratio" }
        ]}
        ctaText="Plan your budget with confidence"
        ctaHref="/contact"
      />
    </MainLayout>
  );
}
