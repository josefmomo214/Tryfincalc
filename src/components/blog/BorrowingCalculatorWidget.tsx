import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Calculator, Wallet, Receipt, CreditCard, Info, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/finance";

export function BorrowingCalculatorWidget() {
  const [income, setIncome] = useState<number>(75000);
  const [debts, setDebts] = useState<number>(400);
  const [rate, setRate] = useState<number>(6.5);
  const [term, setTerm] = useState<number>(30);
  
  const [frontEndLimit, setFrontEndLimit] = useState<number>(0);
  const [backEndLimit, setBackEndLimit] = useState<number>(0);
  const [maxLoanAmount, setMaxLoanAmount] = useState<number>(0);
  const [limitingFactor, setLimitingFactor] = useState<"front" | "back">("front");

  const calculateMaxLoan = (monthlyBudget: number, annualRate: number, years: number) => {
    // Estimating $250 for property taxes and insurance (PITI - PI = TI)
    const estimatedTI = 250; 
    const availablePI = Math.max(0, monthlyBudget - estimatedTI);
    
    if (availablePI <= 0) return 0;
    
    const r = annualRate / 100 / 12;
    const n = years * 12;
    
    if (r === 0) return availablePI * n;
    return availablePI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
  };

  useEffect(() => {
    const monthlyGross = income / 12;
    
    // 28/36 Rule
    const front = monthlyGross * 0.28;
    const back = (monthlyGross * 0.36) - debts;
    
    setFrontEndLimit(front);
    setBackEndLimit(back);
    
    const finalBudget = Math.min(front, back);
    setLimitingFactor(front < back ? "front" : "back");
    
    setMaxLoanAmount(calculateMaxLoan(finalBudget, rate, term));
  }, [income, debts, rate, term]);

  return (
    <div className="my-12 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/20 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="bg-primary p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-manrope font-extrabold tracking-tight">2026 Borrowing Power Estimator</h3>
        </div>
        <p className="text-white/80 max-w-xl">
          Apply the 28/36 rule to see how much lenders might qualify you for based on your current income and debts.
        </p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-manrope font-bold text-primary uppercase tracking-wider">
                <Wallet className="w-4 h-4" /> Annual Gross Income ($)
              </label>
              <Input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="h-12 border-2 border-outline-variant/30 rounded-xl focus:border-primary"
              />
              <p className="text-xs text-on-surface-variant italic">Your total income before taxes.</p>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-manrope font-bold text-primary uppercase tracking-wider">
                <CreditCard className="w-4 h-4" /> Monthly Debts ($)
              </label>
              <Input
                type="number"
                value={debts}
                onChange={(e) => setDebts(Number(e.target.value))}
                className="h-12 border-2 border-outline-variant/30 rounded-xl focus:border-primary"
              />
              <p className="text-xs text-on-surface-variant italic">Auto loans, student loans, credit card minimums.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-manrope font-bold text-primary uppercase tracking-wider">
                <Receipt className="w-4 h-4" /> Estimated Interest Rate (%)
              </label>
              <Input
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="h-12 border-2 border-outline-variant/30 rounded-xl focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-manrope font-bold text-primary uppercase tracking-wider block">
                Loan Term (Years)
              </label>
              <div className="flex gap-2">
                {[15, 20, 30].map((t) => (
                  <Button
                    key={t}
                    variant={term === t ? "primary" : "outline"}
                    className="flex-1 rounded-xl"
                    onClick={() => setTerm(t)}
                  >
                    {t}yr
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Main Result */}
          <div className="lg:col-span-2 bg-primary/5 rounded-[2rem] p-8 border border-primary/20 flex flex-col justify-center">
            <h4 className="text-sm font-manrope font-black text-primary uppercase tracking-[0.2em] mb-4">Estimated Borrowing Capacity</h4>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-6">
              <span className="text-5xl md:text-6xl font-manrope font-black text-primary">
                {formatCurrency(maxLoanAmount, 0, "USD")}
              </span>
              <span className="text-on-surface-variant font-medium text-lg">Potential Mortgage</span>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              Based on the {limitingFactor === "front" ? "28% Front-End" : "36% Back-End"} rule, this is the maximum loan amount you may qualify for given current market assumptions.
            </p>
          </div>

          {/* DTI Breakdown */}
          <div className="bg-white dark:bg-surface-container-high rounded-[2rem] p-8 border border-outline-variant/10 shadow-sm space-y-6">
             <div>
               <div className="flex justify-between items-center mb-1">
                 <span className="text-xs font-bold text-on-surface-variant uppercase">Front-End (28%)</span>
                 <span className="text-sm font-black text-primary">{formatCurrency(frontEndLimit, 0, "USD")}/mo</span>
               </div>
               <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                 <div className="h-full bg-primary" style={{ width: '100%' }}></div>
               </div>
               <p className="text-[10px] text-on-surface-variant mt-1 italic">Housing costs only.</p>
             </div>

             <div>
               <div className="flex justify-between items-center mb-1">
                 <span className="text-xs font-bold text-on-surface-variant uppercase">Back-End (36%)</span>
                 <span className="text-sm font-black text-secondary">{formatCurrency(backEndLimit, 0, "USD")}/mo</span>
               </div>
               <div className="w-full h-2 bg-secondary/10 rounded-full overflow-hidden">
                 <div className="h-full bg-secondary" style={{ width: `${Math.min(100, (backEndLimit / frontEndLimit) * 100)}%` }}></div>
               </div>
               <p className="text-[10px] text-on-surface-variant mt-1 italic">Housing + other monthly debts.</p>
             </div>
             
             <div className="pt-4 border-t border-outline-variant/10">
                <div className="flex items-start gap-2 text-xs text-on-surface-variant">
                  <Info className="w-4 h-4 shrink-0 text-primary" />
                  <p>Lenders use the <strong>lower</strong> of these two figures to determine your final eligibility.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Disclaimer/Warning */}
        <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/40 flex gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 dark:text-amber-100">
            <p className="font-bold mb-1">Important Consideration</p>
            <p className="opacity-90 leading-relaxed">
              This estimate assumes approximately $250/month for taxes and insurance. Real-world costs vary significantly by zip code and down payment amount. Always consult a licensed professional before making financial commitments.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-outline-variant/10">
          <Link href="/affordability-calculator" className="w-full sm:w-auto">
            <Button variant="outline" className="rounded-full w-full">
              Detailed Affordability App →
            </Button>
          </Link>
          <p className="text-[10px] text-on-surface-variant">© 2026 TryFinCalc Borrowing Logic v2.4</p>
        </div>
      </div>
    </div>
  );
}
