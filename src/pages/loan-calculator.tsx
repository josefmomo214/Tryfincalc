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
  const currency = (locale?.toUpperCase() as 'USD' | 'EUR') || 'EUR';

  const [loanAmount, setLoanAmount] = useState(15000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(5);

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
        title="Personal Loan Calculator - Monthly Payment Estimator"
        description="Estimate your monthly personal loan payments, total interest costs, and repayment schedule for various loan amounts and interest rates."
        canonicalUrl="https://tryfincalc.com/loan-calculator"
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
              <Input type="number" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Interest Rate (APR %)</label>
              <Input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Loan Term (Years)</label>
              <Input type="number" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} />
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
              <div className="text-5xl font-manrope font-extrabold text-primary">
                {formatCurrency(results.monthly, 2, currency)}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white rounded-3xl border border-outline-variant/10">
                <h4 className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Total Interest</h4>
                <div className="text-2xl font-bold text-primary">{formatCurrency(results.totalInterest, 2, currency)}</div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-outline-variant/10">
                <h4 className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Total Paid</h4>
                <div className="text-2xl font-bold text-primary">{formatCurrency(results.totalPaid, 2, currency)}</div>
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
            <p>Personal loans are typically unsecured, meaning you don't need to provide collateral like a home or car. The interest rate you receive is heavily influenced by your credit history and current market conditions.</p>
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
              { label: "Loan Amount", value: currency === 'EUR' ? "€20,000" : "$20,000" },
              { label: "APR", value: "6.5%" },
              { label: "Term", value: "60 Months" },
              { label: "Monthly Payment", value: currency === 'EUR' ? "€391.32" : "$391.32" }
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
