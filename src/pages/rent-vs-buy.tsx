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
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is it better to rent or buy a home in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The answer depends on your 'break-even' point — the number of years you must stay in the home for the benefits of equity and appreciation to outweigh the closing costs of buying. In many European and US markets, the break-even point currently ranges from 3 to 6 years."
          }
        },
        {
          "@type": "Question",
          "name": "What are 'sunk costs' when comparing renting and buying?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sunk costs are expenses that do not build equity. For renters, the entire rent payment is a sunk cost. For buyers, sunk costs include mortgage interest, property taxes, home insurance, maintenance, and initial closing costs."
          }
        },
        {
          "@type": "Question",
          "name": "How does inflation affect the rent vs buy decision?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Inflation typically favors buyers. While rent often increases every year with inflation, a fixed-rate mortgage payment stays constant. Over time, the 'real' cost of a fixed mortgage payment decreases compared to rising rental prices."
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

  // Sync state when currency changes
  useEffect(() => {
    const prevCurrency = currency === 'USD' ? 'EUR' : 'USD';
    setRent(prev => Math.round(convertCurrency(prev, prevCurrency, currency)));
    setHomePrice(prev => Math.round(convertCurrency(prev, prevCurrency, currency)));
  }, [currency]);

  useEffect(() => {
    // Rent calculation
    let currentRent = rent;
    let rentSum = 0;
    for (let i = 0; i < years; i++) {
      rentSum += currentRent * 12;
      currentRent *= (1 + rentIncrease / 100);
    }

    // Buy calculation
    const upfrontCosts = (homePrice * (closingCosts / 100)) + (currency === 'EUR' ? 3000 : 3000);
    const downPayment = homePrice * (downPercent / 100);
    const loan = homePrice - downPayment;
    const monthlyM = calculateAmortizedPayment(loan, interestRate, 25);
    
    // Sunk costs of buying: Interest + Maintenance + Taxes + Upfront
    const totalPayments = monthlyM * years * 12;
    
    // Estimate principal remaining after 'years'
    const r = interestRate / 100 / 12;
    const n = 25 * 12;
    const p = years * 12;
    const remainingBalance = r === 0 ? loan * (1 - p/n) : loan * (Math.pow(1 + r, n) - Math.pow(1 + r, p)) / (Math.pow(1 + r, n) - 1);
    const principalPaid = loan - remainingBalance;
    const interestPaid = totalPayments - principalPaid;

    const taxesInsurance = (homePrice * 0.01) * years; // 1% per year for tax/insurance
    const maintenance = (homePrice * 0.01) * years; // 1% for maintenance
    const appreciation = homePrice * (Math.pow(1.02, years) - 1); // 2% annual appreciation

    const buySum = interestPaid + taxesInsurance + maintenance + upfrontCosts - appreciation;
    
    setResults({
      totalRent: rentSum,
      totalBuy: buySum,
      verdict: buySum < rentSum ? "Buying is better" : "Renting is better",
      difference: Math.abs(buySum - rentSum)
    });
  }, [rent, rentIncrease, homePrice, downPercent, interestRate, years, closingCosts, currency]);

  return (
    <MainLayout>
      <SEOHandler 
        title="Rent vs Buy Calculator" 
        description="Compare renting versus buying a home to see which makes more financial sense. Use our realistic guide. It is free and requires no sign-up for your journey."
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
          <div className="space-y-8">
            <div className="border-l-4 border-primary pl-6 py-2">
              <h4 className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">Scenario: Renting</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-on-surface">Monthly Rent ({currency === 'EUR' ? '€' : '$'})</label>
                  <Input type="number" value={rent} onChange={(e) => { setIsCalculated(true); setRent(Number(e.target.value)); }} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-on-surface">Annual Increase (%)</label>
                  <Input type="number" step="0.1" value={rentIncrease} onChange={(e) => { setIsCalculated(true); setRentIncrease(Number(e.target.value)); }} />
                </div>
              </div>
            </div>

            <div className="border-l-4 border-accent pl-6 py-2">
              <h4 className="text-xs font-bold text-accent mb-4 uppercase tracking-widest">Scenario: Buying</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-on-surface">Home Price ({currency === 'EUR' ? '€' : '$'})</label>
                    <Input type="number" value={homePrice} onChange={(e) => { setIsCalculated(true); setHomePrice(Number(e.target.value)); }} />
                  </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-on-surface">Closing Costs (%)</label>
                      <Input type="number" step="0.1" value={closingCosts} onChange={(e) => { setIsCalculated(true); setClosingCosts(Number(e.target.value)); }} />
                      <p className="text-[10px] text-on-surface-variant">Estimated taxes, notary, and administrative fees.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-on-surface">Down Pmt (%)</label>
                    <Input type="number" value={downPercent} onChange={(e) => { setIsCalculated(true); setDownPercent(Number(e.target.value)); }} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-on-surface">Mortgage Rate (%)</label>
                    <Input type="number" step="0.1" value={interestRate} onChange={(e) => { setIsCalculated(true); setInterestRate(Number(e.target.value)); }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-4 border-t border-outline-variant/20">
              <label className="text-sm font-semibold text-on-surface">Time Horizon (Years)</label>
              <Input type="number" value={years} onChange={(e) => { setIsCalculated(true); setYears(Number(e.target.value)); }} />
              <p className="text-xs text-on-surface-variant italic">How long will you live in this property?</p>
            </div>
          </div>
        </CalculatorInputArea>

        <CalculatorResultsArea 
          nextSteps={[
            {
              title: "Market Search",
              description: "Find available properties in your budget.",
              icon: Search,
              href: "/contact"
            },
            {
              title: "Home Value",
              description: "Learn how to project future home appreciation.",
              icon: TrendingUp,
              href: "/blog"
            },
            {
              title: "Buyer's Guide",
              description: "Everything you need to know about starting your home search.",
              icon: Home,
              href: "/blog"
            }
          ]}
        >
          <div className="space-y-8">
            <div className={`text-center p-8 rounded-[2.5rem] border transition-all ${results.verdict.includes("Buying") ? 'bg-primary text-white border-primary shadow-xl' : 'bg-surface border-primary/20 text-primary'}`}>
              <h3 className="text-sm font-semibold tracking-widest uppercase mb-4 opacity-80">The Financial Verdict</h3>
              <div className="text-4xl md:text-5xl font-manrope font-extrabold mb-2">
                {results.verdict}
              </div>
              <p className="text-lg opacity-90">
                Potential savings over {years} years: <span className="font-bold">{formatCurrency(results.difference, 0, currency)}</span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-3xl p-6 border border-outline-variant/10 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-on-surface-variant uppercase mb-1">Total Rent Paid</h4>
                  <p className="text-sm text-on-surface-variant italic leading-tight">Sunk costs of leasing.</p>
                </div>
                <span className="text-2xl font-bold text-primary">{formatCurrency(results.totalRent, 0, currency)}</span>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-outline-variant/10 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-on-surface-variant uppercase mb-1">Total Ownership Cost</h4>
                  <p className="text-sm text-on-surface-variant italic leading-tight">Sunk costs (Interest, Tax) - Appreciation.</p>
                </div>
                <span className="text-2xl font-bold text-primary">{formatCurrency(results.totalBuy, 0, currency)}</span>
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
          { title: "Smart Home Buying", href: "/blog" }
        ]}
        ctaText="Is it time to own?"
        ctaHref="/affordability-calculator"
      />
    </MainLayout>
  );
}
