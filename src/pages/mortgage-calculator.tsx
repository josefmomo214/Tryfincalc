import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from "@/components/calculator/CalculatorContainer";
import { Input } from "@/components/ui/Input";
import { ResultCard } from "@/components/calculator/ResultCard";
import { Star, BarChart3 } from "lucide-react";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { formatCurrency, calculateAmortizedPayment, calculatePMI, EXCHANGE_RATE, convertCurrency } from "@/lib/finance";
import { CalculatorSEOSection } from "@/components/calculator/CalculatorSEOSection";
import { Search, PieChart, TrendingDown } from "lucide-react";

import { MortgageCalculatorWidget } from "@/components/calculator/MortgageCalculatorWidget";

export default function MortgageCalculator() {
  const router = useRouter();
  const { locale } = router;
  const currency = (locale?.toUpperCase() as 'USD' | 'EUR') || 'USD';

  const mortgageSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Mortgage Calculator | TryFinCalc",
      "url": "https://tryfincalc.com/mortgage-calculator",
      "description": "Premium mortgage calculator for 2026. Estimate monthly payments including PITI (Principal, Interest, Taxes, and Insurance) with real-time accuracy.",
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
          "name": "How much should I save for a down payment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "While 20% is the gold standard to avoid mortgage insurance, many programs allow as little as 3-10% down. A larger down payment always lowers your monthly obligation and reduces total interest paid."
          }
        },
        {
          "@type": "Question",
          "name": "What is an Agreement in Principle?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An Agreement in Principle is an initial assessment from a lender indicating how much they might be willing to lend you. It strengthens your position when making an offer to sellers."
          }
        },
        {
          "@type": "Question",
          "name": "Can I pay off my mortgage early?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most modern mortgages allow for extra payments or early payoff, but some may have prepayment penalties. Check your agreement for specifics on overpayments."
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
          "name": "Mortgage Calculator",
          "item": "https://tryfincalc.com/mortgage-calculator"
        }
      ]
    }
  ];

  return (
    <MainLayout>
      <SEOHandler 
        title="Mortgage Calculator 2026: Monthly Payment Tool | TryFinCalc"
        description="Calculate your monthly mortgage payment with taxes and insurance. Compare rates and see your monthly payment in seconds with our free 2026 tool."
        canonicalUrl="https://tryfincalc.com/mortgage-calculator"
        structuredData={mortgageSchema}
      />
      
      <div className="bg-surface pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <header className="max-w-7xl mx-auto mb-16">
          <h1 className="text-display-md font-manrope font-bold text-primary mb-4">
            Mortgage Calculator
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl">
            Get a detailed breakdown of your monthly mortgage payment, including principal, interest, taxes, and insurance.
          </p>
        </header>

        <div className="max-w-7xl mx-auto">
          <MortgageCalculatorWidget currency={currency} />

          {/* Expert Guidance Section */}
          <section className="mt-24 mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-manrope font-bold text-primary mb-6">Expert Mortgage Planning</h2>
                <p className="text-xl text-on-surface-variant leading-relaxed">
                  Planning your mortgage requires a full picture of your out-of-pocket expenses. Our advanced calculator helps you factor in the often-forgotten costs like property taxes and insurance fees across any market.
                </p>
              </div>
              <div className="bg-primary shadow-2xl p-12 rounded-[3rem] text-white">
                <div className="flex gap-1 mb-8">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-6 h-6 fill-primary-fixed text-primary-fixed" />
                  ))}
                </div>
                <blockquote className="text-2xl font-medium leading-relaxed mb-8">
                  "The most transparent calculator I've used. Seeing the impact of various down payment levels really helped me decide on my financing strategy with confidence."
                </blockquote>
                <cite className="not-italic font-bold text-primary-fixed">
                  — Sarah J., Homeowner
                </cite>
              </div>
            </div>
          </section>

          <CalculatorSEOSection 
            title="Mortgage Calculator: Plan Your Home Purchase"
            intro={
              <>
                <p>Navigating the real estate market requires more than just finding the perfect home. It requires a clear understanding of your long-term financial commitment. Our Mortgage Calculator is designed to help you estimate the true cost of homeownership beyond the sticker price, providing clarity across various currencies and markets.</p>
                <p>From initial purchase price to long-term interest costs, we provide the data you need to sign your contract with absolute confidence.</p>
              </>
            }
            howItWorks={
              <>
                <p>Lenders typically evaluate your application based on established Debt-to-Income (DTI) ratios. This ensures that your total monthly housing costs and other debt obligations are sustainable relative to your income.</p>
                <ul>
                  <li><strong>Loan-to-Value (LTV):</strong> Most financial institutions require a 10% to 20% down payment to secure the best possible interest rates.</li>
                  <li><strong>Taxes & Fees:</strong> Closing costs, registration duties, and notary fees vary by region but are a critical part of your upfront cash requirement.</li>
                  <li><strong>Insurance:</strong> Property insurance and, in many cases, mortgage insurance (PMI) are standard requirements for loans with lower down payments.</li>
                </ul>
              </>
            }
            examples={[
              {
                title: "Family Residence",
                items: [
                  { label: "Home Price", value: currency === 'USD' ? "$500,000" : "€500,000" },
                  { label: "Down Payment (20%)", value: currency === 'USD' ? "$100,000" : "€100,000" },
                  { label: "Interest Rate", value: "6.5%" },
                  { label: "PITI Payment", value: currency === 'USD' ? "$3,850" : "€3,850" }
                ],
                description: "A long-term scenario reflecting the benefits of higher equity and larger contributions."
              },
              {
                title: "Starter Home",
                items: [
                  { label: "Home Price", value: currency === 'USD' ? "$250,000" : "€250,000" },
                  { label: "Down Payment (10%)", value: currency === 'USD' ? "$25,000" : "€25,000" },
                  { label: "Interest Rate", value: "7.0%" },
                  { label: "PITI Payment", value: currency === 'USD' ? "$1,700" : "€1,700" }
                ],
                description: "Typical scenario for first-time buyers entering the market with a moderate down payment."
              }
            ]}
            tips={[
              "Shop around for the best rates from multiple providers.",
              "Look for energy-efficient home discounts from lenders.",
              "Consider how a 15-year term could save you thousands in interest.",
              "Always keep an emergency fund for unexpected maintenance."
            ]}
            faqs={[
              {
                question: "How much should I save for a down payment?",
                answer: "While 20% is the gold standard to avoid mortgage insurance, many programs allow as little as 3-10%. However, a larger contribution always lowers your monthly obligation."
              },
              {
                question: "What is an 'Agreement in Principle'?",
                answer: "It is an initial assessment from a lender indicating how much they might be willing to lend you. It strengthens your position when making an offer to sellers."
              },
              {
                question: "Can I pay off my mortgage early?",
                answer: "Most modern mortgages allow for extra payments or early payoff, but some may have prepayment penalties. Check your agreement for specifics on 'overpayments'."
              }
            ]}
            relatedCalculators={[
              { label: "Affordability", href: "/affordability-calculator" },
              { label: "Rent vs Buy", href: "/rent-vs-buy" },
              { label: "Refinancing", href: "/refinancing-calculator" }
            ]}
            relatedBlogs={[
              { title: "Understanding Rates", href: "/blog" },
              { title: "Payment Calculation Guide", href: "/blog" }
            ]}
            ctaText="Ready to take the next step?"
            ctaHref="/contact"
          />
        </div>
      </div>
    </MainLayout>
  );
}
