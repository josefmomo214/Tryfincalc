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

interface ScheduleItem {
  no: number;
  payment: number;
  principal: number;
  interest: number;
  totalInterest: number;
  balance: number;
}

export default function AmortizationSchedule() {
  const router = useRouter();
  const { locale } = router;
  const currency = (locale?.toUpperCase() as 'USD' | 'EUR') || 'USD';

  const [loanAmount, setLoanAmount] = useState(250000);
  const [interestRate, setInterestRate] = useState(3.75);
  const [loanTerm, setLoanTerm] = useState(20);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);

  const amortizationSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Amortization Calculator",
      "url": "https://tryfincalc.com/amortization-schedule",
      "description": "Generate a full loan amortization schedule. See how each payment is split between principal and interest over the life of your mortgage or personal loan.",
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
          "name": "What is an amortization schedule?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An amortization schedule is a complete table of periodic loan payments, showing the amount of principal and the amount of interest that comprise each payment until the loan is paid off at the end of its term."
          }
        },
        {
          "@type": "Question",
          "name": "How does extra principal affect amortization?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Making extra principal payments reduces the outstanding balance faster, which in turn reduces the amount of interest calculated for future periods. This can significantly shorten the loan term and save thousands in total interest costs."
          }
        },
        {
          "@type": "Question",
          "name": "Why is more interest paid at the beginning of a loan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Because interest is calculated based on the remaining loan balance, and the balance is highest at the start of the loan. As you pay down the principal, the interest portion of each subsequent payment decreases, and the principal portion increases."
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
          "name": "Amortization Schedule",
          "item": "https://tryfincalc.com/amortization-schedule"
        }
      ]
    }
  ];

  // Sync state when currency changes
  useEffect(() => {
    const prevCurrency = currency === 'USD' ? 'EUR' : 'USD';
    setLoanAmount(prev => Math.round(convertCurrency(prev, prevCurrency, currency)));
  }, [currency]);

  useEffect(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment = calculateAmortizedPayment(principal, interestRate, loanTerm);

    let currentBalance = principal;
    let accumulatedInterest = 0;
    const newSchedule: ScheduleItem[] = [];

    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = currentBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      accumulatedInterest += interestPayment;
      currentBalance -= principalPayment;

      newSchedule.push({
        no: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        totalInterest: accumulatedInterest,
        balance: Math.max(0, currentBalance)
      });
    }

    setSchedule(newSchedule);
  }, [loanAmount, interestRate, loanTerm]);

  return (
    <MainLayout>
      <SEOHandler 
        title="Amortization Schedule 2026: Loan Payoff Details | TryFinCalc"
        description="Track your loan progress with a full amortization schedule. See your monthly payment in seconds and understand how interest and principal change over time."
        canonicalUrl="https://tryfincalc.com/amortization-schedule"
        structuredData={amortizationSchema}
      />

      <header className="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-display-md font-manrope font-bold text-primary mb-4">
          Amortization Schedule
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl">
          Understand exactly where your monthly payments go over the life of your mortgage or loan.
        </p>
      </header>

      <CalculatorContainer 
        title="Amortization Schedule" 
        description="Understand exactly where your monthly payments go over the life of your mortgage."
      >
        <CalculatorInputArea>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Loan Amount ({currency === 'EUR' ? '€' : '$'})</label>
              <Input type="number" value={loanAmount} onChange={(e) => { setIsCalculated(true); setLoanAmount(Number(e.target.value)); }} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Interest Rate (%)</label>
              <Input type="number" step="0.1" value={interestRate} onChange={(e) => { setIsCalculated(true); setInterestRate(Number(e.target.value)); }} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface">Loan Term (Years)</label>
              <Input type="number" value={loanTerm} onChange={(e) => { setIsCalculated(true); setLoanTerm(Number(e.target.value)); }} />
            </div>
          </div>
        </CalculatorInputArea>

        <CalculatorResultsArea>
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-primary/5 rounded-3xl border border-primary/20 text-center sm:text-left">
                <h3 className="text-xs font-bold text-primary uppercase mb-2">First Pmt Principal</h3>
                <div className="text-3xl font-bold text-primary">
                  {isCalculated && schedule.length > 0 ? formatCurrency(schedule[0].principal, 2, currency) : "—"}
                </div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-outline-variant/10 text-center sm:text-left">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase mb-2">First Pmt Interest</h3>
                <div className="text-3xl font-bold text-primary">
                  {isCalculated && schedule.length > 0 ? formatCurrency(schedule[0].interest, 2, currency) : "—"}
                </div>
              </div>
            </div>
            <div className="p-6 bg-surface-container-high rounded-3xl border border-outline-variant/10 text-center">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase mb-1">Estimated Monthly Payment</h3>
              {isCalculated && schedule.length > 0 ? (
                <div className="text-4xl font-manrope font-extrabold text-primary animate-in fade-in duration-700">
                  {formatCurrency(schedule[0].payment, 2, currency)}
                </div>
              ) : (
                <div className="py-2 text-lg font-medium text-on-surface-variant/40 italic">
                  Enter details to see schedule
                </div>
              )}
            </div>
          </div>
        </CalculatorResultsArea>
      </CalculatorContainer>

      {/* Table section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-surface rounded-3xl overflow-hidden border border-outline-variant/20 shadow-xl">
          <div className="px-8 py-6 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
            <h3 className="text-xl font-manrope font-bold text-primary">Detailed Amortization Table</h3>
            <span className="text-xs font-bold text-on-surface-variant uppercase bg-white px-3 py-1 rounded-full border border-outline-variant/20">{loanTerm * 12} Payments</span>
          </div>
          <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-primary/20">
            {isCalculated ? (
              <table className="min-w-full divide-y divide-outline-variant/10">
                <thead className="bg-surface sticky top-0 z-10 shadow-sm border-b border-outline-variant/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">No.</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">Principal</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">Interest</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Interest</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">Balance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-outline-variant/10">
                  {schedule.filter((_, i) => i < 36 || i >= schedule.length - 12).map((row, idx) => (
                    <React.Fragment key={row.no}>
                      {idx === 36 && (
                        <tr className="bg-surface-container-lowest">
                          <td colSpan={6} className="px-6 py-3 text-center text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em]">... Intermediate Years Omitted ...</td>
                        </tr>
                      )}
                      <tr className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-on-surface-variant">{row.no}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary font-bold">{formatCurrency(row.payment, 2, currency)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">{formatCurrency(row.principal, 2, currency)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">{formatCurrency(row.interest, 2, currency)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">{formatCurrency(row.totalInterest, 2, currency)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface font-bold">{formatCurrency(row.balance, 2, currency)}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-40 text-center">
                <p className="text-xl font-medium text-on-surface-variant/40 italic">
                  Complete the form to generate your full amortization roadmap
                </p>
              </div>
            )}
          </div>
          <div className="px-8 py-4 bg-surface-container-lowest text-center">
            <p className="text-xs text-on-surface-variant italic">Showing first 3 years and final year for brevity. Access full breakdown upon request.</p>
          </div>
        </div>
      </section>
      <CalculatorSEOSection 
        title="Amortization Schedule: Your Path to Full Ownership"
        intro={
          <>
            <p>Every month, when you pay your mortgage installment, that money is split into two parts: principal repayment and interest. Our <strong>Amortization Schedule</strong> provides the visual roadmap of your journey from deep debt to full home ownership.</p>
            <p>Understanding this breakdown is essential for deciding when to refinance, when to make extra repayments, or simply for managing your long-term personal wealth across any global market.</p>
          </>
        }
        howItWorks={
          <>
            <p>Amortization is the process of paying off a debt over time through regular installments. With a fixed-rate loan, your total monthly payment (P&I) stays the same, but the mix of interest and principal changes every month.</p>
            <ul>
              <li><strong>Interest-Heavy Start:</strong> In the first few years, your balance is high, so a larger portion of your payment goes to interest. This is why your debt seems to decrease slowly at first.</li>
              <li><strong>Principal Acceleration:</strong> As the years go by, the interest portion shrinks, and more of your payment goes directly into building equity in your home.</li>
              <li><strong>Full Debt Freedom:</strong> By the end of the term, your payments are almost entirely principal, leading to a zero balance and full ownership.</li>
            </ul>
          </>
        }
        examples={[
          {
            title: "Standard Home Mortgage",
            items: [
              { label: "Loan Amount", value: currency === 'USD' ? "$250,000" : "€250,000" },
              { label: "Interest Rate", value: "4.0%" },
              { label: "Month 1 Interest", value: currency === 'USD' ? "$833" : "€833" },
              { label: "Month 1 Principal", value: currency === 'USD' ? "$681" : "€681" }
            ],
            description: "Showing how early mortgage payments are heavily weighted toward interest."
          },
          {
            title: "Final Year Milestone",
            items: [
              { label: "Loan Balance", value: currency === 'USD' ? "$15,000" : "€15,000" },
              { label: "Final Interest", value: currency === 'USD' ? "$50" : "€50" },
              { label: "Final Principal", value: currency === 'USD' ? "$14,950" : "€14,950" },
              { label: "Total Debt", value: "$0 / €0" }
            ],
            description: "At the end of the term, almost every cent goes to your equity."
          }
        ]}
        tips={[
          "Track your equity growth monthly to stay motivated.",
          "Identify when your loan-to-value ratio allows you to remove mortgage insurance.",
          "See the massive long-term impact of making even small extra principal payments.",
          "Keep your schedule for annual tax preparation and overall financial planning."
        ]}
        faqs={[
          {
            question: "How does a variable rate affect my schedule?",
            answer: "If your interest rate is variable, your schedule will be recalculated by your lender at each revision date based on the new rate and remaining balance."
          },
          {
            question: "Can I use this for a car loan?",
            answer: "Yes! Most installment loans for vehicles use the same base amortization math, showing how each payment reduces your total balance."
          }
        ]}
        relatedCalculators={[
          { label: "Monthly Payment", href: "/monthly-payment-calculator" },
          { label: "Total Interest", href: "/total-interest-calculator" },
          { label: "Refinancing", href: "/refinancing-calculator" }
        ]}
        ctaText="Ready to lower your monthly cost?"
        ctaHref="/refinancing-calculator"
      />
    </MainLayout>
  );
}
