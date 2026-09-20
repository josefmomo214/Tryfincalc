import React from "react";
import { useRouter } from "next/router";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";






import { CalculationGuide } from "@/components/calculator/CalculationGuide";


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
