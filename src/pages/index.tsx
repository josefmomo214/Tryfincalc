import React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { ArrowRight, Calculator, Home, PiggyBank, Briefcase, ChevronRight } from "lucide-react";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

export default function Home_Page() {
  const calculators = [
    { title: "Loan Calculator", desc: "Estimate monthly payments for personal loans.", href: "/loan-calculator", icon: <Calculator className="w-6 h-6 text-primary" /> },
    { title: "Mortgage Calculator", desc: "Calculate home loan payments with taxes & insurance.", href: "/mortgage-calculator", icon: <Home className="w-6 h-6 text-primary" /> },
    { title: "Refinancing Calculator", desc: "See if refinancing your current loan makes sense.", href: "/refinancing-calculator", icon: <Briefcase className="w-6 h-6 text-primary" /> },
    { title: "Affordability", desc: "Find out how much house you can afford.", href: "/affordability-calculator", icon: <PiggyBank className="w-6 h-6 text-primary" /> },
  ];

  return (
    <MainLayout>
      <SEOHandler 
        title="Mortgage & Loan Calculator 2026 | TryFinCalc"
        description="Use our free mortgage and loan calculators to plan your home purchase. See your monthly payment in seconds with accurate 2026 rate estimates."
        canonicalUrl="https://tryfincalc.com"
      />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32 overflow-hidden bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-primary bg-primary-fixed mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            TryFinCalc: Precision in Finance
          </div>
          <h1 className="text-display-lg font-manrope font-bold text-primary tracking-tight mb-6 max-w-4xl">
            Clarity in every calculation. <br className="hidden md:block"/> Confidence in every financial decision.
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mb-10 leading-relaxed">
            Our premium suite of financial calculators provides the exact numbers you need, presented in a beautifully simple interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/mortgage-calculator">
              <Button size="xl" className="w-full sm:w-auto">
                Start Calculating <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/rent-vs-buy">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Rent vs. Buy Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AdSense Placement: Below Hero */}
      {/* <ins className="adsbygoogle" style={{display: 'block'}} data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX" data-ad-format="auto" data-full-width-responsive="true"></ins> */}
      <AdPlaceholder format="horizontal" className="my-0 mb-16" />

      {/* Featured Calculators Grid */}
      <section id="tools" className="bg-surface-container-low py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-manrope font-bold text-primary mb-2">Featured Tools</h2>
              <p className="text-lg text-on-surface-variant">Everything you need to plan your financial future.</p>
            </div>
            <Link href="#tools" className="hidden md:flex items-center text-primary font-medium hover:text-primary-container transition-colors">
              Explore all tools <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {calculators.map((calc, idx) => (
              <Link key={idx} href={calc.href} className="group outline-none">
                <Card className="h-full transition-transform duration-300 group-hover:-translate-y-2 group-focus-visible:ring-2 ring-primary">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary-fixed transition-colors decoration-0">
                      {calc.icon}
                    </div>
                    <CardTitle className="text-xl">{calc.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{calc.desc}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / Benefits */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-manrope font-bold text-primary mb-4">How it works</h2>
            <p className="text-lg text-on-surface-variant">We&apos;ve removed the clutter so you can focus on what matters: the numbers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Input your data", desc: "No sign-ups required. Enter your numbers directly into our secure, client-side calculators." },
              { step: "02", title: "View the breakdown", desc: "Instantly see your amortizations, monthly payments, and total interest separated intuitively." },
              { step: "03", title: "Make the decision", desc: "Use our tailored advice and visual charts to decide the best path forward for your wallet." }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-6xl font-manrope font-extrabold text-surface-container-high mb-6">{item.step}</span>
                <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense Placement: Between Sections */}
      {/* <ins className="adsbygoogle" style={{display: 'block'}} data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX" data-ad-format="auto" data-full-width-responsive="true"></ins> */}
      <AdPlaceholder format="horizontal" />

      {/* SEO Educational Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-manrope font-bold text-primary mb-6">Understanding Your Finances</h2>
          <div className="prose prose-teal max-w-none text-on-surface-variant">
            <p>
              Whether you are buying a home, paying off debt, or simply trying to understand how interest works, having the right tools is essential. Our calculators are designed to provide transparency into the complex world of personal finance. 
            </p>
            <p>
              <strong>Why use a loan calculator?</strong> By calculating your expected monthly payments and understanding the total interest you will pay over the life of a loan, you can make informed decisions about whether a specific financial product is right for you. It helps you ensure that your borrowing fits comfortably within your budget alongside other obligations.
            </p>
            <p className="text-sm italic">
              * Interest rates can vary depending on market conditions. You can follow general trends through sources like the Federal Reserve.
            </p>
          </div>
          <div className="mt-8">
            <Link href="/blog">
              <Button variant="secondary">Read more guides</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value-Focused CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-manrope font-bold mb-4 italic">Empowering your financial journey.</h2>
          <p className="text-primary-fixed-dim text-lg mb-10 max-w-2xl mx-auto">
            Explore our financial tools and guides to make better decisions for your future.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#tools">
              <Button size="lg" className="bg-primary-fixed text-primary-fixed-variant hover:bg-white rounded-xl h-12 w-full sm:w-auto">
                Try Our Calculators
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 rounded-xl h-12 w-full sm:w-auto">
                Read Financial Guides
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
