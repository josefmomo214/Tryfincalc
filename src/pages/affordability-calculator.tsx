import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from "@/components/calculator/CalculatorContainer";
import { ResultCard } from "@/components/calculator/ResultCard";
import { Input } from "@/components/ui/Input";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { formatCurrency, convertCurrency } from "@/lib/finance";
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
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much house can I afford on a $75,000 salary?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "On a $75,000 salary, applying the 28% rule, your maximum monthly housing cost is approximately $1,750. At current rates around 6.8% on a 30-year mortgage, this supports a loan amount of approximately $261,000 — meaning a home price of around $290,000 with a 10% down payment, assuming no other significant debts."
          }
        },
        {
          "@type": "Question",
          "name": "What is the 28/36 rule for mortgage affordability?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The 28/36 rule states that your monthly housing costs should not exceed 28% of your gross monthly income, and your total monthly debt payments should not exceed 36% of your gross monthly income. Most conventional lenders use these thresholds to evaluate mortgage applications."
          }
        },
        {
          "@type": "Question",
          "name": "How much do I need for a down payment in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The minimum down payment depends on the loan type. Conventional loans allow as little as 3% down. FHA loans require 3.5%. VA loans require no down payment for eligible veterans. A 20% down payment eliminates private mortgage insurance (PMI) and produces the lowest monthly payment."
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

  // Sync state when currency changes
  useEffect(() => {
    const prevCurrency = currency === 'USD' ? 'EUR' : 'USD';
    setMonthlyIncome(prev => Math.round(convertCurrency(prev, prevCurrency, currency)));
    setMonthlyDebts(prev => Math.round(convertCurrency(prev, prevCurrency, currency)));
    setDownPayment(prev => Math.round(convertCurrency(prev, prevCurrency, currency)));
  }, [currency]);

  useEffect(() => {
    // Standard rule: 33% for EUR markets, 28% for USD/Global housing rule
    const rule = currency === 'EUR' ? 0.33 : 0.28;
    const maxMonthlyBudget = Math.max(0, (monthlyIncome * rule) - monthlyDebts);
    
    // Inverse amortization to find loan amount
    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;
    
    let p = 0;
    if (r === 0) {
      p = maxMonthlyBudget * n;
    } else {
      p = maxMonthlyBudget * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    }

    setResults({
      monthlyPayment: maxMonthlyBudget,
      loanAmount: p,
      maxPrice: p + downPayment
    });
  }, [monthlyIncome, monthlyDebts, downPayment, interestRate, loanTerm, currency]);

  return (
    <MainLayout>
      <SEOHandler 
        title="Affordability Calculator - How Much House Can I Buy?"
        description="Find out how much home you can afford based on your income and debts. Get a realistic estimate in seconds. Free tool, no sign-up. Start your home search."
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
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">
                Monthly Household Income ({currency === 'EUR' ? '€' : '$'})
              </label>
              <Input type="number" value={monthlyIncome} onChange={(e) => { setIsCalculated(true); setMonthlyIncome(Number(e.target.value)); }} />
              <p className="text-xs text-on-surface-variant">Include base salary and any recurring income sources.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Other Monthly Debts ({currency === 'EUR' ? '€' : '$'})</label>
              <Input type="number" value={monthlyDebts} onChange={(e) => { setIsCalculated(true); setMonthlyDebts(Number(e.target.value)); }} />
              <p className="text-xs text-on-surface-variant">Auto loans, personal loans, or other commitments.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Personal Contribution / Down Payment ({currency === 'EUR' ? '€' : '$'})</label>
              <Input type="number" value={downPayment} onChange={(e) => { setIsCalculated(true); setDownPayment(Number(e.target.value)); }} />
              <p className="text-xs text-on-surface-variant">Savings used for the purchase.</p>
            </div>
            
            <div className="pt-4 border-t border-outline-variant/30 mt-6">
              <h4 className="text-sm font-bold text-primary mb-4">Market Assumptions</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-on-surface">Interest Rate (%)</label>
                  <Input type="number" step="0.1" value={interestRate} onChange={(e) => { setIsCalculated(true); setInterestRate(Number(e.target.value)); }} />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-on-surface">Loan Term (Years)</label>
                  <Input type="number" value={loanTerm} onChange={(e) => { setIsCalculated(true); setLoanTerm(Number(e.target.value)); }} />
                </div>
              </div>
            </div>
          </div>
        </CalculatorInputArea>

        <CalculatorResultsArea 
          nextSteps={[
            {
              title: "Prequalify",
              description: "Get a custom rate based on your budget.",
              icon: Search,
              href: "/contact"
            },
            {
              title: "Debt-to-Income",
              description: "Understand how lenders view your finances.",
              icon: PieChart,
              href: "/blog/debt-to-income-ratio"
            },
            {
              title: "Savings Plan",
              description: "Maximize your borrowing power through savings.",
              icon: Wallet,
              href: "/blog"
            }
          ]}
        >
          <div className="space-y-8">
            <div className="text-center p-8 bg-primary/5 rounded-3xl border border-primary/10">
              <h3 className="text-sm font-semibold tracking-wider text-primary uppercase mb-2">Estimated Home Price</h3>
              {isCalculated ? (
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
              <div className="p-6 bg-white rounded-3xl border border-outline-variant/10 text-center sm:text-left">
                <h4 className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Max Monthly Budget</h4>
                <div className="text-2xl font-bold text-primary">
                  {isCalculated ? formatCurrency(results.monthlyPayment, 0, currency) : "—"}
                </div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-outline-variant/10 text-center sm:text-left">
                <h4 className="text-xs font-semibold text-on-surface-variant uppercase mb-1">Max Loan Amount</h4>
                <div className="text-2xl font-bold text-primary">
                  {isCalculated ? formatCurrency(results.loanAmount, 0, currency) : "—"}
                </div>
              </div>
            </div>
            
            <div className="bg-primary shadow-sm rounded-3xl p-6 text-white">
              <h4 className="font-bold mb-2">Housing Affordability Standards</h4>
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
              { label: "Loan Amount", value: currency === 'USD' ? "$250,000" : "€250,000" },
              { label: "Interest Rate", value: "4.0%" },
              { label: "Month 1 Interest", value: currency === 'USD' ? "$833" : "€833" },
              { label: "Month 1 Principal", value: currency === 'USD' ? "$681" : "€681" }
            ],
            description: "A strong dual-income scenario for a family-sized residence."
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
          { title: "Understanding Limits", href: "/blog" },
          { title: "Managing Debt Ratios", href: "/blog" }
        ]}
        ctaText="Find your price range today"
        ctaHref="/contact"
      />
    </MainLayout>
  );
}
