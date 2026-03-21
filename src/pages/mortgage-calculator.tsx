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

export default function MortgageCalculator() {
  const router = useRouter();
  const { locale } = router;
  const currency = (locale?.toUpperCase() as 'USD' | 'EUR') || 'EUR';

  // State reflects the value in the CURRENT currency
  const [homePrice, setHomePrice] = useState<number>(450000);
  const [downPayment, setDownPayment] = useState<number>(90000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(3.5);
  const [loanTerm, setLoanTerm] = useState<number>(25);
  const [propertyTax, setPropertyTax] = useState<number>(1200);
  const [insurance, setInsurance] = useState<number>(800);
  const [hoa, setHoa] = useState<number>(0);

  // Sync state when currency changes
  useEffect(() => {
    const prevCurrency = currency === 'USD' ? 'EUR' : 'USD';
    setHomePrice(prev => Math.round(convertCurrency(prev, prevCurrency, currency)));
    setDownPayment(prev => Math.round(convertCurrency(prev, prevCurrency, currency)));
    setPropertyTax(prev => Math.round(convertCurrency(prev, prevCurrency, currency)));
    setInsurance(prev => Math.round(convertCurrency(prev, prevCurrency, currency)));
    setHoa(prev => Math.round(convertCurrency(prev, prevCurrency, currency)));
  }, [currency]);

  const [results, setResults] = useState({
    monthlyPayment: 0,
    principalInterest: 0,
    tax: 0,
    insurance: 0,
    pmi: 0,
    hoa: 0,
    loanAmount: 0
  });

  useEffect(() => {
    const loanAmount = homePrice - downPayment;
    const monthlyPI = calculateAmortizedPayment(loanAmount, interestRate, loanTerm);
    
    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = insurance / 12;
    const monthlyPMI = calculatePMI(loanAmount, downPayment, homePrice);
    
    setResults({
      monthlyPayment: monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + hoa,
      principalInterest: monthlyPI,
      tax: monthlyTax,
      insurance: monthlyInsurance,
      pmi: monthlyPMI,
      hoa: hoa,
      loanAmount: loanAmount
    });
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTax, insurance, hoa]);

  const handlePriceChange = (value: number) => {
    setHomePrice(value);
    const newDown = (value * downPaymentPercent) / 100;
    setDownPayment(newDown);
  };

  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
    setDownPaymentPercent((value / homePrice) * 100);
  };

  const handleDownPercentChange = (value: number) => {
    setDownPaymentPercent(value);
    setDownPayment((homePrice * value) / 100);
  };

  return (
    <MainLayout>
      <SEOHandler 
        title="Mortgage Calculator" 
        description="Calculate your monthly mortgage payments with taxes and insurance. Adjust rates, terms, and down payments instantly."
        canonicalUrl="https://tryfincalc.com/mortgage-calculator"
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
          <CalculatorContainer 
            title="Mortgage Calculator" 
            description="Get a detailed breakdown of your monthly mortgage payment, including principal, interest, taxes, and insurance."
          >
            <CalculatorInputArea>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-on-surface">Home Price ({currency === 'EUR' ? '€' : '$'})</label>
                    <Input type="number" value={homePrice} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceChange(Number(e.target.value))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-on-surface">Down ({currency === 'EUR' ? '€' : '$'})</label>
                      <Input type="number" value={downPayment} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDownPaymentChange(Number(e.target.value))} />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-on-surface">Down (%)</label>
                      <Input type="number" value={downPaymentPercent} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDownPercentChange(Number(e.target.value))} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-on-surface">Interest Rate (%)</label>
                    <Input type="number" step="0.1" value={interestRate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInterestRate(Number(e.target.value))} />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-on-surface">Loan Term (Years)</label>
                    <select 
                      className="w-full h-12 px-4 rounded-xl border border-outline-variant/30 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface"
                      value={loanTerm} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLoanTerm(Number(e.target.value))}
                    >
                      {[10, 15, 20, 25, 30].map(term => (
                        <option key={term} value={term}>{term} Years</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-8 border-t border-outline-variant/20">
                  <h3 className="text-lg font-bold text-primary mb-6">Out-of-Pocket monthly costs</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tax / yr</label>
                      <Input type="number" value={propertyTax} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPropertyTax(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Insurance / yr</label>
                      <Input type="number" value={insurance} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInsurance(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">HOA / mo</label>
                      <Input type="number" value={hoa} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHoa(Number(e.target.value))} />
                    </div>
                  </div>
                </div>
              </div>
            </CalculatorInputArea>

            <CalculatorResultsArea 
              nextSteps={[
                {
                  title: "Compare Lenders",
                  description: "Find the best mortgage rates for your profile from top providers.",
                  icon: Search,
                  href: "/blog"
                },
                {
                  title: "Down Payment",
                  description: "See how increasing your contribution reduces your long-term interest.",
                  icon: PieChart,
                  href: "#calculator-top"
                },
                {
                  title: "Reduce Costs",
                  description: "Strategies to minimize monthly insurance and taxes.",
                  icon: TrendingDown,
                  href: "/blog"
                }
              ]}
            >
              <div className="space-y-12">
                <div className="text-center">
                  <h3 className="text-sm font-semibold tracking-wider text-primary uppercase mb-4">Estimated Monthly Payment</h3>
                  <div className="text-6xl md:text-7xl font-manrope font-extrabold text-primary mb-2">
                    {formatCurrency(results.monthlyPayment, 0, currency)}
                    <span className="text-2xl font-medium text-on-surface-variant ml-2">/ mo</span>
                  </div>
                </div>

                <div className="bg-surface rounded-3xl p-8 border border-outline-variant/10">
                  <h4 className="text-xs font-semibold tracking-widest text-on-surface-variant uppercase mb-6">Monthly Breakdown</h4>
                  <div className="space-y-4">
                    <ResultCard title="Principal & Interest" value={formatCurrency(results.principalInterest, 0, currency)} />
                    <ResultCard title="Property Taxes" value={formatCurrency(results.tax, 0, currency)} />
                    <ResultCard title="Homeowners Insurance" value={formatCurrency(results.insurance, 0, currency)} />
                    {results.pmi > 0 && <ResultCard title="PMI" value={formatCurrency(results.pmi, 0, currency)} />}
                    {results.hoa > 0 && <ResultCard title="HOA Fees" value={formatCurrency(results.hoa, 0, currency)} />}
                    <div className="pt-4 border-t border-outline-variant/10">
                      <ResultCard title="Total Loan Amount" value={formatCurrency(results.loanAmount, 0, currency)} highlighted={true} />
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-3xl p-8 flex items-center justify-center min-h-[200px] border border-outline-variant/10">
                  <div className="text-center text-on-surface-variant">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-medium">Your payment breakdown will appear here once calculated</p>
                  </div>
                </div>
              </div>
            </CalculatorResultsArea>
          </CalculatorContainer>

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
                title: "Starter Home",
                items: [
                  { label: "Home Price", value: currency === 'EUR' ? "€250,000" : "$250,000" },
                  { label: "Down Payment (10%)", value: currency === 'EUR' ? "€25,000" : "$25,000" },
                  { label: "Interest Rate", value: "3.75%" },
                  { label: "Monthly Payment", value: currency === 'EUR' ? "€1,332" : "$1,332" }
                ],
                description: "Typical scenario for first-time buyers entering the market with a moderate down payment."
              },
              {
                title: "Family Residence",
                items: [
                  { label: "Home Price", value: currency === 'EUR' ? "€500,000" : "$500,000" },
                  { label: "Down Payment (20%)", value: currency === 'EUR' ? "€100,000" : "$100,000" },
                  { label: "Interest Rate", value: "3.5%" },
                  { label: "Monthly Payment", value: currency === 'EUR' ? "€2,001" : "$2,001" }
                ],
                description: "A long-term scenario reflecting the benefits of higher equity and larger contributions."
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
