import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHandler } from "@/components/seo/SEOHandler";
import { Accordion } from "@/components/ui/Accordion";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

export default function FAQPage() {
  const mortgageFaqs = [
    { question: "What is an amortization schedule?", answer: "An amortization schedule is a complete table of periodic loan payments, showing the amount of principal and the amount of interest that comprise each payment until the loan is paid off at the end of its term." },
    { question: "What is PMI (Private Mortgage Insurance)?", answer: "PMI is a type of mortgage insurance you might be required to pay for if you have a conventional loan and make a down payment of less than 20% of the home's purchase price." },
    { question: "Should I choose a 15-year or 30-year mortgage?", answer: "A 15-year mortgage has higher monthly payments but lower total interest over the life of the loan. A 30-year mortgage has lower monthly payments (providing more cash flow) but you will pay significantly more interest over 30 years." }
  ];

  const loanFaqs = [
    { question: "How does my credit score affect my loan?", answer: "Your credit score heavily influences the interest rate lenders will offer you. A higher score signifies lower risk to the lender, resulting in a lower interest rate, which saves you money over the life of the loan." },
    { question: "What is a fixed-rate vs variable-rate loan?", answer: "A fixed-rate loan has an interest rate that remains the same for the entire term of the loan. A variable-rate (or adjustable-rate) loan has an interest rate that can change periodically based on a benchmark interest rate." }
  ];

  return (
    <MainLayout>
      <SEOHandler 
        title="Financial FAQ: Mortgage & Loan Questions Answered | TryFinCalc"
        description="Get expert answers to common questions about mortgages, loans, and interest. Learn how to see your monthly payment in seconds using our free toolkit."
        canonicalUrl="https://tryfincalc.com/faq"
      />

      <section className="md:w-3/4 max-w-4xl pt-20 pb-12 px-4 sm:px-6 lg:px-8 mx-auto text-center">
        <h1 className="text-display-lg font-manrope font-bold text-primary tracking-tight mb-6">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-on-surface-variant leading-relaxed mb-0">
          Everything you need to know about navigating your financial tools and making sense of the numbers.
        </p>
      </section>

      <AdPlaceholder format="horizontal" />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <h2 className="text-2xl font-manrope font-bold text-primary mb-6 pb-2 border-b border-outline-variant/20">Mortgages & Home Buying</h2>
          <Accordion items={mortgageFaqs} />
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-manrope font-bold text-primary mb-6 pb-2 border-b border-outline-variant/20">Personal Loans & Debt</h2>
          <Accordion items={loanFaqs} />
        </div>
      </section>

    </MainLayout>
  );
}
