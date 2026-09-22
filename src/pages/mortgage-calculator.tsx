import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";






import { CalculationGuide } from "@/components/calculator/CalculationGuide";


import { MortgageCalculatorWidget } from "@/components/calculator/MortgageCalculatorWidget";
import { useDisplayCurrency } from "@/lib/currency";
import Link from "next/link";

export default function MortgageCalculator() {
  const { currency } = useDisplayCurrency();

  const mortgageSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Mortgage Calculator | TryFinCalc",
      "url": "https://tryfincalc.com/mortgage-calculator",
      "description": "Estimate principal, interest, property tax, homeowners insurance and HOA costs from the inputs shown. PMI, fees and maintenance are excluded.",
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
        description="Calculate your monthly mortgage payment with taxes and insurance. Compare rate scenarios and see your estimated monthly payment with our free 2026 tool."
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

          <section className="mt-16 rounded-3xl border border-outline-variant/20 bg-surface-container-low p-8">
            <h2 className="text-2xl font-manrope font-bold text-primary mb-3">Worked mortgage scenarios</h2>
            <p className="text-on-surface-variant mb-5">
              Compare two fixed-rate examples with full-term interest and editable assumptions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link className="font-semibold text-primary hover:underline" href="/calculator/400k-mortgage-monthly-payment-6-5-percent">
                $400,000 mortgage at 6.5%
              </Link>
              <Link className="font-semibold text-primary hover:underline" href="/calculator/300k-mortgage-monthly-payment-6-percent">
                $300,000 mortgage at 6%
              </Link>
            </div>
          </section>

          {/* Expert Guidance Section */}
          <section className="mt-24 mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-manrope font-bold text-primary mb-6">Expert Mortgage Planning</h2>
                <p className="text-xl text-on-surface-variant leading-relaxed">
                  Planning your mortgage requires a full picture of your out-of-pocket expenses. Our advanced calculator helps you factor in the often-forgotten costs like property taxes and insurance fees across any market.
                </p>
              </div>
            </div>
          </section>

          <CalculationGuide tool="mortgage" currency={currency} />
        </div>
      </div>
    </MainLayout>
  );
}
