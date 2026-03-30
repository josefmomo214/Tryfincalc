import React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { Button } from "@/components/ui/Button";
import { Shield, Target, Calculator, BookOpen, Users, Lock, Mail, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <MainLayout>
      <SEOHandler 
        title="About TryFinCalc | Free Financial Calculators for Smart Decisions" 
        description="Learn about TryFinCalc — who we are, why we built free financial calculators, how we ensure accuracy, and our commitment to transparent, unbiased financial information."
        canonicalUrl="https://tryfincalc.com/about"
        noindex={false}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
        <header className="mb-16 text-center">
          <h1 className="text-display-lg font-manrope font-bold text-primary tracking-tight mb-8">
            About TryFinCalc
          </h1>
          <div className="prose prose-lg prose-teal max-w-none text-on-surface-variant leading-relaxed">
            <p className="text-xl font-medium text-primary/80 mb-6">
              TryFinCalc was built on one simple belief: everyone deserves access to accurate financial tools without paywalls, sign-ups, or hidden agendas.
            </p>
            <p>
              We are a small, independent team of finance and technology professionals who got tired of financial calculators that were either too simple to be useful, buried behind email capture forms, or quietly designed to push users toward sponsored products.
            </p>
            <p>
              Every calculator on this site is free, runs entirely in your browser, and never sends your financial data to any server. Your numbers stay on your screen.
            </p>
          </div>
        </header>

        <section className="space-y-24">
          {/* Section 2: What We Build */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-1 hidden md:flex justify-center pt-2">
              <Calculator className="w-8 h-8 text-primary opacity-30" />
            </div>
            <div className="md:col-span-11">
              <h2 className="text-3xl font-manrope font-bold text-primary mb-6">What We Build</h2>
              <div className="prose prose-teal max-w-none text-on-surface-variant">
                <p>
                  TryFinCalc provides a suite of <Link href="/mortgage-calculator" className="font-semibold text-primary hover:underline">mortgage calculators</Link> covering personal loans, <Link href="/affordability-calculator" className="font-semibold text-primary hover:underline">affordability</Link>, <Link href="/refinancing-calculator" className="font-semibold text-primary hover:underline">refinancing</Link>, <Link href="/amortization-schedule" className="font-semibold text-primary hover:underline">amortization breakdown</Link>, and <Link href="/rent-vs-buy" className="font-semibold text-primary hover:underline">rent vs. buy</Link> decisions. Our tools support both USD and EUR — making us one of the only English-language financial calculator sites designed for both US and European users.
                </p>
                <p>
                  Every tool is built to show the full picture: not just the monthly payment, but the total interest cost, the amortization breakdown, and the real long-term financial impact of each decision. We believe in showing you the uncomfortable numbers as clearly as the comfortable ones.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: How We Ensure Accuracy */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-1 hidden md:flex justify-center pt-2">
              <Target className="w-8 h-8 text-primary opacity-30" />
            </div>
            <div className="md:col-span-11 bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
              <h2 className="text-3xl font-manrope font-bold text-primary mb-6">How We Ensure Accuracy</h2>
              <div className="prose prose-teal max-w-none text-on-surface-variant">
                <p>
                  All calculations on TryFinCalc use industry-standard financial formulas validated against outputs from the <a href="https://www.consumerfinance.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Consumer Financial Protection Bureau</a>, <a href="https://fred.stlouisfed.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Federal Reserve Economic Data</a> published rate data, and established actuarial standards. Our mortgage calculations use the standard amortization formula:
                </p>
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 my-8 flex items-center justify-center">
                  <code className="text-xl font-manrope font-bold text-primary">
                    M = P × [r(1+r)^n] / [(1+r)^n − 1]
                  </code>
                </div>
                <p className="text-sm italic mb-6">
                  Where M is the monthly payment, P is the principal, r is the monthly interest rate, and n is the total number of payments.
                </p>
                <p>
                  We review and update our calculators regularly to reflect current market conditions and regulatory changes. Rate benchmarks referenced in our guides are sourced from the FRED database and the <a href="https://www.ecb.europa.eu" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">European Central Bank</a>.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Our Editorial Standards */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-1 hidden md:flex justify-center pt-2">
              <BookOpen className="w-8 h-8 text-primary opacity-30" />
            </div>
            <div className="md:col-span-11">
              <h2 className="text-3xl font-manrope font-bold text-primary mb-6">Our Editorial Standards</h2>
              <div className="prose prose-teal max-w-none text-on-surface-variant">
                <p>
                  All <Link href="/blog" className="font-semibold text-primary hover:underline">financial guides</Link> and articles published on TryFinCalc follow these principles:
                </p>
                <ul className="space-y-4">
                  <li>We cite authoritative sources: CFPB, Federal Reserve, HUD, European Central Bank, and peer-reviewed financial research</li>
                  <li>We present both sides of financial decisions — we never tell you what to do, only what the numbers show</li>
                  <li>We do not accept payment to feature or promote specific financial products</li>
                  <li>Where we include affiliate links to financial products or services, we disclose this clearly</li>
                  <li>All content is reviewed for mathematical accuracy before publication</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5: Who This Site Is For */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-1 hidden md:flex justify-center pt-2">
              <Users className="w-8 h-8 text-primary opacity-30" />
            </div>
            <div className="md:col-span-11">
              <h2 className="text-3xl font-manrope font-bold text-primary mb-6">Who This Site Is For</h2>
              <div className="prose prose-teal max-w-none text-on-surface-variant">
                <p>
                  TryFinCalc is built for anyone making a significant financial decision — buying a home, refinancing a mortgage, comparing <Link href="/loan-calculator" className="font-semibold text-primary hover:underline">loan offers</Link>, or deciding whether to rent or buy. Our primary audience is English-speaking adults in the United States and Western Europe, particularly Belgium, France, the Netherlands, Germany, and Ireland.
                </p>
                <p>
                  We design for financial literacy at every level — whether you are calculating your first mortgage or stress-testing a refinance scenario on a loan you have held for fifteen years.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6: Our Commitment to Privacy */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-1 hidden md:flex justify-center pt-2">
              <Lock className="w-8 h-8 text-primary opacity-30" />
            </div>
            <div className="md:col-span-11">
              <h2 className="text-3xl font-manrope font-bold text-primary mb-6">Our Commitment to Privacy</h2>
              <div className="prose prose-teal max-w-none text-on-surface-variant">
                <p>
                  TryFinCalc calculators are fully client-side. When you enter your income, loan amount, or interest rate into any of our tools, that data is processed entirely in your browser and is never transmitted to our servers, stored in any database, or shared with any third party.
                </p>
                <p>
                  We use standard analytics to understand how people use the site in aggregate — page views, popular tools, general traffic sources. We never track individual financial inputs. Full details are in our <Link href="/privacy-policy" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Section 7: Get in Touch */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-1 hidden md:flex justify-center pt-2">
              <Mail className="w-8 h-8 text-primary opacity-30" />
            </div>
            <div className="md:col-span-11 bg-surface-container p-8 sm:p-12 rounded-3xl border border-outline-variant/10">
              <h2 className="text-3xl font-manrope font-bold text-primary mb-6">Get in Touch</h2>
              <div className="prose prose-teal max-w-none text-on-surface-variant">
                <p>
                  We welcome feedback, corrections, and suggestions. If you find a calculation error, a broken tool, or a topic you would like us to cover, please reach out via our <Link href="/contact" className="font-bold text-primary hover:underline">contact page</Link>. We read every message and respond to substantive questions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: CTA section at the bottom */}
        <section className="mt-32 pt-20 border-t border-outline-variant/20 text-center">
          <h2 className="text-4xl font-manrope font-bold text-primary mb-6">Start Calculating</h2>
          <p className="text-lg text-on-surface-variant mb-12 max-w-2xl mx-auto">
            Everything on TryFinCalc is free, instant, and requires no sign-up. Pick the tool that matches your next financial decision.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/mortgage-calculator">
              <Button size="xl" className="w-full sm:w-auto">
                Mortgage Calculator <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/affordability-calculator">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                Affordability Calculator <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/loan-calculator">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                Loan Calculator <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
