import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from "@/components/calculator/CalculatorContainer";

import { Input } from "@/components/ui/Input";

import { formatCurrency, convertCurrency, validateLoan, calculateRentVsBuy } from "@/lib/finance";
import { CalculatorSEOSection } from "@/components/calculator/CalculatorSEOSection";
import { Home, Search, TrendingUp } from "lucide-react";

export default function RentVsBuy() {
  const router = useRouter();
  const { locale } = router;
  const currency = (locale?.toUpperCase() as 'USD' | 'EUR') || 'USD';

  const [rent, setRent] = useState(1200);
  const [rentIncrease, setRentIncrease] = useState(3.0);
  const [homePrice, setHomePrice] = useState(350000);
  const [downPercent, setDownPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(3.5);
  const [years, setYears] = useState(10);
  const [closingCosts, setClosingCosts] = useState(3.0); 
  const [isCalculated, setIsCalculated] = useState(false);

  const rentVsBuySchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Rent vs Buy Calculator",
      "url": "https://tryfincalc.com/rent-vs-buy",
      "description": "Compare the total cost of renting versus buying a home. Factor in appreciation, interest, taxes, and maintenance to see which makes more financial sense for your timeline.",
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
          "name": "Rent vs Buy Calculator",
          "item": "https://tryfincalc.com/rent-vs-buy"
        }
      ]
    }
  ];
  const [results, setResults] = useState({
    totalRent: 0,
    totalBuy: 0,
    verdict: "",
    difference: 0
  });

  const validationError = validateLoan(homePrice, interestRate, years) || (![rent, rentIncrease, homePrice, downPercent, interestRate, years, closingCosts].every(value => Number.isFinite(value) && value >= 0 && value <= 1e12) ? 'Enter a non-negative number up to 1 trillion in every field.' : '') || (downPercent > 100 || closingCosts > 100 || rentIncrease > 100 ? 'Percentages must not exceed 100%.' : '');

  const previousCurrency = useRef(currency);

  // Sync state when currency changes
  useEffect(() => {
    const prevCurrency = previousCurrency.current;
    if (prevCurrency === currency) return;
    previousCurrency.current = currency;
    setRent(prev => Math.round(convertCurrency(prev, prevCurrency, currency) * 100) / 100);
    setHomePrice(prev => Math.round(convertCurrency(prev, prevCurrency, currency) * 100) / 100);
  }, [currency]);

  useEffect(() => {
    if (validationError) return;
    setResults(calculateRentVsBuy(rent, rentIncrease, homePrice, downPercent, interestRate, years, closingCosts));
  }, [validationError, rent, rentIncrease, homePrice, downPercent, interestRate, years, closingCosts, currency]);


  return (
    <MainLayout>
      <SEOHandler 
        title="Rent vs Buy Calculator 2026: Financial Verdict | TryFinCalc"
        description="Compare estimated rent and net ownership costs over your chosen time horizon, including mortgage interest, upkeep and assumed appreciation."
        canonicalUrl="https://tryfincalc.com/rent-vs-buy"
        structuredData={rentVsBuySchema}
      />

      <header className="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-display-md font-manrope font-bold text-primary mb-4">
          Rent vs Buy Calculator
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl">
          Is it better to keep renting or jump into homeownership? Compare the true costs for your future financial success.
        </p>
      </header>

      <CalculatorContainer 
        title="Rent vs Buy Calculator" 
        description="Compare the financial costs of renting and buying over time."
      >
        <CalculatorInputArea>
          {validationError && <p id="calculator-error" role="alert" className="mb-4 text-red-700 dark:text-red-300">{validationError}</p>}
          <div className="space-y-8">
            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">Scenario: Renting</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="rent" className="text-sm font-semibold text-on-surface">Monthly Rent ({currency === 'EUR' ? '€' : '$'})</label>
                  <Input id="rent" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={rent} onChange={(e) => { setIsCalculated(true); setRent(e.target.valueAsNumber); }} />
                </div>
                <div className="space-y-1">
                  <label htmlFor="rentIncrease" className="text-sm font-semibold text-on-surface">Annual Increase (%)</label>
                  <Input max={100} id="rentIncrease" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" step="0.1" value={rentIncrease} onChange={(e) => { setIsCalculated(true); setRentIncrease(e.target.valueAsNumber); }} />
                </div>
              </div>
            </div>

            <div className="border-l-4 border-accent pl-6 py-2">
              <h3 className="text-xs font-bold text-accent mb-4 uppercase tracking-widest">Scenario: Buying</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="homePrice" className="text-sm font-semibold text-on-surface">Home Price ({currency === 'EUR' ? '€' : '$'})</label>
                    <Input id="homePrice" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={homePrice} onChange={(e) => { setIsCalculated(true); setHomePrice(e.target.valueAsNumber); }} />
                  </div>
                    <div className="space-y-1">
                      <label htmlFor="closingCosts" className="text-sm font-semibold text-on-surface">Closing Costs (%)</label>
                      <Input max={100} id="closingCosts" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" step="0.1" value={closingCosts} onChange={(e) => { setIsCalculated(true); setClosingCosts(e.target.valueAsNumber); }} />
                      <p className="text-[10px] text-on-surface-variant">Estimated taxes, notary, and administrative fees.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="downPercent" className="text-sm font-semibold text-on-surface">Down Pmt (%)</label>
                    <Input max={100} id="downPercent" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={downPercent} onChange={(e) => { setIsCalculated(true); setDownPercent(e.target.valueAsNumber); }} />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="interestRate" className="text-sm font-semibold text-on-surface">Mortgage Rate (%)</label>
                    <Input max={100} id="interestRate" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" step="0.1" value={interestRate} onChange={(e) => { setIsCalculated(true); setInterestRate(e.target.valueAsNumber); }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-4 border-t border-outline-variant/20">
              <label htmlFor="years" className="text-sm font-semibold text-on-surface">Time Horizon (Years)</label>
              <Input min={1/12} max={100} step="any" id="years" aria-invalid={!!validationError} aria-describedby={validationError ? "calculator-error" : undefined} type="number" value={years} onChange={(e) => { setIsCalculated(true); setYears(e.target.valueAsNumber); }} />
              <p className="text-xs text-on-surface-variant italic">How long will you live in this property? Assumptions: 25-year mortgage, 2% annual appreciation, 1% annual tax/insurance, 1% maintenance, and 3,000 additional upfront costs in the selected currency. Excludes selling costs and the opportunity cost of your deposit.</p>
            </div>
          </div>
        </CalculatorInputArea>

        <CalculatorResultsArea 
          nextSteps={[
            {
              title: "Plan a home purchase budget",
              description: "Read about upfront and ongoing homeownership costs.",
              icon: Search,
              href: "/blog/home-purchase-budgeting"
            },
            {
              title: "Home Value",
              description: "Learn how to project future home appreciation.",
              icon: TrendingUp,
              href: "/blog/rent-vs-buy-2026"
            },
            {
              title: "Buyer's Guide",
              description: "Everything you need to know about starting your home search.",
              icon: Home,
              href: "/blog/rent-vs-buy-2026"
            }
          ]}
        >
          <div className="space-y-8">
            <div className={`text-center p-8 rounded-[2.5rem] border transition-all ${results.verdict.includes("Buying") ? 'bg-primary text-white border-primary shadow-xl' : 'bg-surface border-primary/20 text-primary'}`}>
              <h3 className="text-sm font-semibold tracking-widest uppercase mb-4 opacity-80">The Financial Verdict</h3>
              <div className="text-4xl md:text-5xl font-manrope font-extrabold mb-2">
                {validationError ? 'Enter valid inputs' : results.verdict}
              </div>
              <p className="text-lg opacity-90">
                Potential savings over {Number.isFinite(years) ? years : '—'} years: <span className="font-bold">{!validationError && formatCurrency(results.difference, 0, currency)}</span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white dark:bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold text-on-surface-variant uppercase mb-1">Total Rent Paid</h3>
                  <p className="text-sm text-on-surface-variant italic leading-tight">Sunk costs of leasing.</p>
                </div>
                <span className="text-2xl font-bold text-primary">{!validationError && formatCurrency(results.totalRent, 0, currency)}</span>
              </div>
              <div className="bg-white dark:bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold text-on-surface-variant uppercase mb-1">Total Ownership Cost</h3>
                  <p className="text-sm text-on-surface-variant italic leading-tight">Sunk costs (Interest, Tax) - Appreciation.</p>
                </div>
                <span className="text-2xl font-bold text-primary">{!validationError && formatCurrency(results.totalBuy, 0, currency)}</span>
              </div>
            </div>
          </div>
        </CalculatorResultsArea>
      </CalculatorContainer>


      <CalculatorSEOSection 
        title="Rent vs. Buy: Is Homeownership Right for You?"
        intro={
          <>
            <p>The decision to rent or buy a home is one of the biggest financial choices you will ever make. While homeownership is often touted as the ultimate goal, it comes with significant upfront costs and ongoing maintenance responsibilities that can affect your long-term wealth.</p>
            <p>Our Rent vs. Buy Calculator compares the total cost of renting with the net cost of owning, factoring in appreciation, taxes, and interest to help you decide which path is right for your financial timeline across any market.</p>
            <p>See specific scenarios: <Link href="/calculator/how-much-house-can-i-afford-80k-salary" className="text-primary underline">$80k salary affordability</Link> · <Link href="/calculator/income-required-for-300k-house" className="text-primary underline">Income required for $300k house</Link></p>
          </>
        }
        howItWorks={
          <>
            <p>Comparing rent and buy requires looking at "sunk costs"—money you pay that doesn't go toward equity. For renters, this is the entire rent payment. For owners, it includes interest, property taxes, maintenance, and the initial closing costs.</p>
            <ul>
              <li><strong>Closing Costs:</strong> Usually range from 2% to 6% of the purchase price and are paid at the beginning of the transaction.</li>
              <li><strong>Home Appreciation:</strong> If the home value increases over time, the gain can eventually offset the interest and taxes paid, making buying more profitable in the long run.</li>
              <li><strong>Time Horizon:</strong> The longer you stay in a home, the more time you have to recoup your initial closing costs through appreciation and principal reduction.</li>
            </ul>
          </>
        }
        examples={[
          {
            title: "Short-Term Residency",
            items: [
              { label: "Home Price", value: currency === 'USD' ? "$350,000" : "€350,000" },
              { label: "Down Payment", value: "10%" },
              { label: "Rent", value: currency === 'USD' ? "$1,350/mo" : "€1,350/mo" },
              { label: "Break-even", value: "4.2 Years" }
,
              { label: "Verdict", value: "Rent is Cheaper" }
            ],
            description: "High upfront costs often make short-term owning difficult to justify financially."
          },
          {
            title: "Long-Term Investment",
            items: [
              { label: "Home Price", value: currency === 'USD' ? "$450,000" : "€450,000" },
              { label: "Down Payment", value: "20%" },
              { label: "Rent", value: currency === 'USD' ? "$1,600/mo" : "€1,600/mo" },
              { label: "Break-even", value: "3.5 Years" }
,
              { label: "Verdict", value: "Buying is Cheaper" }
            ],
            description: "Extended timelines allow equity building and appreciation to overcome initial fees."
          }
        ]}
        tips={[
          "Compare the total cost of ownership, not just the monthly mortgage payment.",
          "Factor in annual maintenance costs (typically 1% of home value).",
          "Consider the 'opportunity cost' of your down payment funds.",
          "Check local tax incentives for first-time home buyers in your area."
        ]}
        faqs={[
          {
            question: "Is it always better to buy if interest rates are low?",
            answer: "Not necessarily. If closing costs are high or you plan to move within a few years, renting can still be the financially wiser choice even with historically low rates."
          },
          {
            question: "What are 'sunk costs' in homeownership?",
            answer: "These are costs that do not build equity, such as property taxes, home insurance, maintenance, and mortgage interest."
          }
        ]}
        relatedCalculators={[
          { label: "Affordability", href: "/affordability-calculator" },
          { label: "Mortgage Calculator", href: "/mortgage-calculator" }
        ]}
        relatedBlogs={[
          { title: "Rent vs Buy 2026", href: "/blog/rent-vs-buy-2026" },
          { title: "Home Purchase Budgeting", href: "/blog/home-purchase-budgeting" }
        ]}
        ctaText="Is it time to own?"
        ctaHref="/affordability-calculator"
        ctaButtonText="Estimate home affordability"
      />
    </MainLayout>
  );
}
