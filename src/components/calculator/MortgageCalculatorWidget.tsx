import React, { useState, useEffect } from "react";
import { CalculatorContainer, CalculatorInputArea, CalculatorResultsArea } from "@/components/calculator/CalculatorContainer";
import { Input } from "@/components/ui/Input";
import { ResultCard } from "@/components/calculator/ResultCard";
import { Star, BarChart3, Search, PieChart, TrendingDown } from "lucide-react";
import { formatCurrency, calculateAmortizedPayment, calculatePMI, convertCurrency } from "@/lib/finance";

interface MortgageCalculatorWidgetProps {
  initialHomePrice?: number;
  initialDownPaymentPercent?: number;
  title?: string;
  description?: string;
  currency?: 'USD' | 'EUR';
}

export function MortgageCalculatorWidget({
  initialHomePrice = 450000,
  initialDownPaymentPercent = 20,
  title = "Mortgage Calculator",
  description = "Get a detailed breakdown of your monthly mortgage payment, including principal, interest, taxes, and insurance.",
  currency = 'USD'
}: MortgageCalculatorWidgetProps) {
  const [homePrice, setHomePrice] = useState<number>(initialHomePrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(initialDownPaymentPercent);
  const [downPayment, setDownPayment] = useState<number>((initialHomePrice * initialDownPaymentPercent) / 100);
  const [interestRate, setInterestRate] = useState<number>(6.5); // Updated to 2026 average
  const [loanTerm, setLoanTerm] = useState<number>(30); // Standard term
  const [propertyTax, setPropertyTax] = useState<number>(Math.round(initialHomePrice * 0.011)); // 1.1% avg
  const [insurance, setInsurance] = useState<number>(Math.round(initialHomePrice * 0.0035)); // 0.35% avg
  const [hoa, setHoa] = useState<number>(0);
  const [isCalculated, setIsCalculated] = useState(true);

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
    setIsCalculated(true);
    setHomePrice(value);
    const newDown = (value * downPaymentPercent) / 100;
    setDownPayment(newDown);
  };

  const handleDownPaymentChange = (value: number) => {
    setIsCalculated(true);
    setDownPayment(value);
    setDownPaymentPercent((value / homePrice) * 100);
  };

  const handleDownPercentChange = (value: number) => {
    setIsCalculated(true);
    setDownPaymentPercent(value);
    setDownPayment((homePrice * value) / 100);
  };

  return (
    <CalculatorContainer 
      title={title} 
      description={description}
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
              <Input type="number" step="0.1" value={interestRate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIsCalculated(true); setInterestRate(Number(e.target.value)); }} />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-on-surface">Loan Term (Years)</label>
              <select 
                className="w-full h-12 px-4 rounded-xl border border-outline-variant/30 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface"
                value={loanTerm} 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setIsCalculated(true); setLoanTerm(Number(e.target.value)); }}
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
                <Input type="number" value={propertyTax} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIsCalculated(true); setPropertyTax(Number(e.target.value)); }} />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Insurance / yr</label>
                <Input type="number" value={insurance} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIsCalculated(true); setInsurance(Number(e.target.value)); }} />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">HOA / mo</label>
                <Input type="number" value={hoa} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIsCalculated(true); setHoa(Number(e.target.value)); }} />
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
            {isCalculated ? (
              <div className="text-6xl md:text-7xl font-manrope font-extrabold text-primary mb-2 animate-in fade-in duration-700">
                {formatCurrency(results.monthlyPayment, 0, currency)}
                <span className="text-2xl font-medium text-on-surface-variant ml-2">/ mo</span>
              </div>
            ) : (
              <div className="py-10 text-xl font-medium text-on-surface-variant/40 italic">
                Enter your details above to see your results
              </div>
            )}
          </div>

          <div className="bg-surface rounded-3xl p-8 border border-outline-variant/10">
            <h4 className="text-xs font-semibold tracking-widest text-on-surface-variant uppercase mb-6">Monthly Breakdown</h4>
            <div className="space-y-4">
              <ResultCard title="Principal & Interest" value={isCalculated ? formatCurrency(results.principalInterest, 0, currency) : "—"} />
              <ResultCard title="Property Taxes" value={isCalculated ? formatCurrency(results.tax, 0, currency) : "—"} />
              <ResultCard title="Homeowners Insurance" value={isCalculated ? formatCurrency(results.insurance, 0, currency) : "—"} />
              {results.pmi > 0 && <ResultCard title="PMI" value={isCalculated ? formatCurrency(results.pmi, 0, currency) : "—"} />}
              {results.hoa > 0 && <ResultCard title="HOA Fees" value={isCalculated ? formatCurrency(results.hoa, 0, currency) : "—"} />}
              <div className="pt-4 border-t border-outline-variant/10">
                <ResultCard title="Total Loan Amount" value={isCalculated ? formatCurrency(results.loanAmount, 0, currency) : "—"} highlighted={true} />
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-3xl p-8 flex items-center justify-center min-h-[200px] border border-outline-variant/10">
            <div className="text-center text-on-surface-variant">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <p className="font-medium">Detailed breakdown and PITI analysis</p>
            </div>
          </div>
        </div>
      </CalculatorResultsArea>
    </CalculatorContainer>
  );
}
