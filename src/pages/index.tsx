import React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { Button } from "@/components/ui/Button";

const CALCULATORS = [
  {
    name: "Mortgage Calculator",
    href: "/mortgage-calculator",
    problem: "Calculate your exact monthly payment including taxes, insurance, and PMI.",
    output: "Full PITI breakdown, 15 vs 30-year comparison",
  },
  {
    name: "Loan Calculator",
    href: "/loan-calculator",
    problem: "See the real cost of a personal or auto loan before you sign.",
    output: "Monthly payment, total interest, full amortization",
  },
  {
    name: "Affordability Calculator",
    href: "/affordability-calculator",
    problem: "Find your actual home price range based on your income and current debt.",
    output: "Max home price, required down payment, safe payment range",
  },
  {
    name: "Refinancing Calculator",
    href: "/refinancing-calculator",
    problem: "Find out if refinancing your mortgage actually saves you money.",
    output: "Monthly savings, lifetime savings, break-even in months",
  },
  {
    name: "Rent vs. Buy",
    href: "/rent-vs-buy",
    problem: "Compare the true 10-year cost of renting versus buying.",
    output: "Financial verdict with total cost and break-even year",
  },
  {
    name: "Amortization Schedule",
    href: "/amortization-schedule",
    problem: "See exactly how every payment splits between principal and interest.",
    output: "Full month-by-month schedule, year summaries",
  },
  {
    name: "Monthly Payment Calculator",
    href: "/monthly-payment-calculator",
    problem: "Quickly estimate any loan payment by amount and rate.",
    output: "Instant payment estimate, total cost over term",
  },
  {
    name: "Total Interest Calculator",
    href: "/total-interest-calculator",
    problem: "Find out how much a loan actually costs over its full lifetime.",
    output: "Total interest paid, cost-per-year, term comparison",
  },
];

const TRUST_POINTS = [
  "All calculations run in your browser — your data never leaves your screen",
  "Formulas validated against CFPB and Federal Reserve standards",
  "Supports USD and EUR — built for US and European users",
  "No sign-up. No email. No paywall. Free forever.",
];

const USE_CASES = [
  {
    label: "What's the monthly payment on a $400,000 mortgage?",
    href: "/calculator/400k-mortgage-monthly-payment-6-5-percent",
  },
  {
    label: "How much house can I afford on an $80,000 salary?",
    href: "/calculator/how-much-house-can-i-afford-80k-salary",
  },
  {
    label: "Should I refinance at today's rates?",
    href: "/refinancing-calculator",
  },
  {
    label: "How much total interest will I pay over 30 years?",
    href: "/total-interest-calculator",
  },
  {
    label: "Is it cheaper to rent or buy in 2026?",
    href: "/rent-vs-buy",
  },
  {
    label: "What does my amortization schedule look like?",
    href: "/amortization-schedule",
  },
  {
    label: "What's the monthly payment on a $100,000 mortgage?",
    href: "/calculator/100k-mortgage-monthly-payment-6-5-percent",
  },
  {
    label: "How much house can I afford on a $60,000 salary?",
    href: "/calculator/how-much-house-can-i-afford-60k-salary",
  },
];

export default function HomePage() {
  return (
    <MainLayout>
      <SEOHandler
        title="Free Mortgage & Loan Calculators | TryFinCalc"
        description="Calculate your exact monthly payment, total interest, and home affordability in seconds. Free calculators for the US and Europe. No sign-up required."
        canonicalUrl="https://tryfincalc.com"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "TryFinCalc",
          "url": "https://tryfincalc.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://tryfincalc.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />

      {/* SECTION 1: HERO */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-8 lg:pt-24 lg:pb-10 bg-surface overflow-hidden">
        {/* Dot texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-outline-variant) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.35,
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Headline + CTAs */}
            <div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-on-surface leading-[1.08] tracking-tight mb-6">
                Free Mortgage &amp; Loan Calculators —{" "}
                <span className="text-primary">See the Real Numbers</span>
              </h1>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-8 max-w-lg">
                Calculate your monthly payment, total interest, affordability, and
                break-even point in seconds. No sign-up. No paywall.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/mortgage-calculator">
                  <Button size="lg" className="w-full sm:w-auto">
                    Calculate Your Mortgage
                  </Button>
                </Link>
                <Link href="#tools">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    See All Calculators
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Stat block */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-widest text-on-surface-variant uppercase mb-6">
                Example: $400k at 6.5% for 30 years
              </p>
              <div className="divide-y divide-outline-variant/20">
                <div className="pb-5">
                  <div className="font-display text-[2.5rem] font-bold text-primary tabular-nums leading-none">
                    $2,528{" "}
                    <span className="text-2xl font-medium text-on-surface-variant">/mo</span>
                  </div>
                  <div className="text-sm text-on-surface-variant mt-2">
                    Monthly principal &amp; interest
                  </div>
                </div>
                <div className="py-5">
                  <div className="font-display text-[2.5rem] font-bold text-on-surface tabular-nums leading-none">
                    $510,080
                  </div>
                  <div className="text-sm text-on-surface-variant mt-2">Total interest paid</div>
                </div>
                <div className="pt-5">
                  <div className="font-display text-[2.5rem] font-bold text-on-surface tabular-nums leading-none">
                    $138k{" "}
                    <span className="text-2xl font-medium text-on-surface-variant">/yr</span>
                  </div>
                  <div className="text-sm text-on-surface-variant mt-2">
                    Income needed to qualify
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADSENSE SLOT 1: below hero */}

      {/* SECTION 2: CALCULATOR DIRECTORY */}
      <section id="tools" className="bg-surface-container-low px-4 sm:px-6 lg:px-8 pt-6 pb-16 lg:pt-8 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-surface mb-10">
            Which calculator do you need?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CALCULATORS.map((calc) => (
              <div
                key={calc.href}
                className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/20 hover:border-primary/30 transition-all duration-200 hover:shadow-[0_4px_20px_var(--shadow-color)] group"
              >
                <h3 className="font-display text-base font-semibold text-on-surface mb-2">
                  <Link
                    href={calc.href}
                    className="hover:text-primary transition-colors"
                  >
                    {calc.name}
                  </Link>
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                  {calc.problem}
                </p>
                <p className="text-xs text-on-surface-variant/70 font-medium mb-4 leading-relaxed">
                  {calc.output}
                </p>
                <Link
                  href={calc.href}
                  className="text-sm font-semibold text-primary hover:underline underline-offset-4"
                >
                  Use calculator →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: TRUST SIGNALS */}
      <section className="bg-surface border-y border-outline-variant/20 px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_POINTS.map((point, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                <p className="text-sm text-on-surface-variant leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: SEO CONTENT BLOCK */}
      <section className="bg-surface-container-low px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-surface mb-10">
            What most people get wrong about borrowing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div>
              <h3 className="font-display text-lg font-semibold text-on-surface mb-3">
                Monthly payment isn&apos;t the full story
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                Most people negotiate on monthly payment, but that&apos;s the wrong
                number to optimize. A 30-year mortgage at 6.5% on a $400,000 home
                costs $510,080 in interest alone — more than the home itself.
                Stretching to a longer term lowers your monthly bill, but the
                lifetime cost is dramatically higher. The honest number to look at
                is total cost of financing, not just what hits your bank account
                each month.
              </p>
              <Link
                href="/total-interest-calculator"
                className="text-sm font-semibold text-primary hover:underline underline-offset-4"
              >
                Calculate your total interest →
              </Link>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold text-on-surface mb-3">
                The 28% rule: what lenders actually check
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                Lenders use a front-end debt-to-income ratio to decide if you
                qualify. The standard is 28%: your monthly housing payment
                shouldn&apos;t exceed 28% of your gross monthly income. On an
                $80,000 salary, that&apos;s $1,867/month max for housing. But
                lenders also check back-end DTI — all your debts combined. If you
                carry car loans or student debt, your effective buying power is
                lower than the 28% rule suggests.
              </p>
              <Link
                href="/affordability-calculator"
                className="text-sm font-semibold text-primary hover:underline underline-offset-4"
              >
                Check your affordability →
              </Link>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold text-on-surface mb-3">
                Refinancing: the break-even math most people skip
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                Refinancing to a lower rate saves money monthly — but closing costs
                erase those savings up front. If refinancing costs $6,000 and saves
                $200/month, you need 30 months just to break even. Move before then
                and you&apos;ve lost money. The break-even calculation is simple,
                but most people skip it and refinance based on rate alone. Run the
                numbers before you commit to new closing costs.
              </p>
              <Link
                href="/refinancing-calculator"
                className="text-sm font-semibold text-primary hover:underline underline-offset-4"
              >
                Find your break-even →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ADSENSE SLOT 2: below SEO content block */}

      {/* SECTION 5: POPULAR USE CASES */}
      <section className="bg-surface px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-on-surface mb-8">
            What are you trying to figure out?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {USE_CASES.map((uc) => (
              <Link
                key={uc.href + uc.label}
                href={uc.href}
                className="flex items-center gap-3 rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface hover:text-primary hover:border-primary/30 hover:bg-surface-container-low transition-all duration-150 group"
              >
                <span
                  className="text-primary flex-shrink-0 font-semibold"
                  aria-hidden="true"
                >
                  →
                </span>
                <span className="group-hover:underline underline-offset-4">{uc.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
