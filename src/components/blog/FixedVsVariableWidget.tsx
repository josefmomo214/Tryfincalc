import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Calculator, ArrowRightLeft, ShieldCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function FixedVsVariableWidget() {
  const [loanAmount, setLoanAmount] = useState<number>(350000);
  const [fixedRate, setFixedRate] = useState<number>(6.5);
  const [variableRate, setVariableRate] = useState<number>(5.5);
  const [fixedPayment, setFixedPayment] = useState<number>(0);
  const [variablePayment, setVariablePayment] = useState<number>(0);

  const calculateMonthlyPayment = (principal: number, annualRate: number, years: number) => {
    if (!principal || !annualRate) return 0;
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return payment;
  };

  useEffect(() => {
    setFixedPayment(calculateMonthlyPayment(loanAmount, fixedRate, 30));
    setVariablePayment(calculateMonthlyPayment(loanAmount, variableRate, 30));
  }, [loanAmount, fixedRate, variableRate]);

  const savings = fixedPayment - variablePayment;

  return (
    <div className="my-12 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/20 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="bg-primary p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-manrope font-extrabold tracking-tight">Compare Your 2026 Payments</h3>
        </div>
        <p className="text-white/80 max-w-xl">
          Enter your loan amount to see the side-by-side monthly cost difference between fixed and variable rates.
        </p>
      </div>

      <div className="p-8">
        <div className="max-w-md mb-10">
          <label className="block text-sm font-manrope font-bold text-primary uppercase tracking-wider mb-3">
            Loan Amount ($)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
            <Input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="pl-8 h-14 text-lg font-bold border-2 border-outline-variant/30 rounded-2xl focus:border-primary transition-all shadow-inner"
              placeholder="e.g. 350000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Fixed Column */}
          <div className="bg-white dark:bg-surface-container-high p-8 rounded-3xl border border-outline-variant/10 shadow-sm relative group hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span className="text-xs font-manrope font-extrabold text-teal-600 uppercase tracking-widest">Fixed Rate</span>
            </div>
            <div className="mb-4">
              <span className="text-4xl font-manrope font-extrabold text-primary">${Math.round(fixedPayment).toLocaleString()}</span>
              <span className="text-on-surface-variant ml-2 font-medium">/mo</span>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-outline-variant/10">
              <span className="text-sm text-on-surface-variant font-medium">Interest Rate</span>
              <span className="font-bold text-primary">{fixedRate}%</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-on-surface-variant font-medium">Stability</span>
              <span className="text-xs bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 px-2 py-1 rounded-full font-bold">100% Locked</span>
            </div>
          </div>

          {/* VS Divider (Mobile Hidden) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-surface-container rounded-full border border-outline-variant/20 items-center justify-center z-10 shadow-lg">
            <ArrowRightLeft className="w-5 h-5 text-primary" />
          </div>

          {/* Variable Column */}
          <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 shadow-sm relative group hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5 text-primary" />
              <span className="text-xs font-manrope font-extrabold text-primary uppercase tracking-widest">Variable (ARM)</span>
            </div>
            <div className="mb-4">
              <span className="text-4xl font-manrope font-extrabold text-primary">${Math.round(variablePayment).toLocaleString()}</span>
              <span className="text-on-surface-variant ml-2 font-medium">/mo</span>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-primary/10">
              <span className="text-sm text-on-surface-variant font-medium">Initial Rate</span>
              <span className="font-bold text-primary">{variableRate}%</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-on-surface-variant font-medium">Monthly Savings</span>
              <span className="font-extrabold text-teal-600">+${Math.round(savings).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Savings Insight */}
        {savings > 0 && (
          <div className="mt-8 p-6 bg-teal-50 dark:bg-teal-950/20 rounded-2xl border border-teal-100 dark:border-teal-900/40 flex items-center gap-4">
            <div className="w-12 h-12 shrink-0 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">
              !
            </div>
            <p className="text-teal-900 dark:text-teal-100 font-medium">
              By choosing a variable rate in 2026, you could save <span className="font-extrabold">${Math.round(savings * 12).toLocaleString()} every year</span> during the initial period.
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-outline-variant/10">
          <div className="text-sm text-on-surface-variant italic">
            *Based on standard 30-year amortization. Taxes and insurance not included.
          </div>
          <Link href="/mortgage-calculator" className="w-full sm:w-auto">
            <Button variant="outline" className="rounded-full w-full">
              Full Calculator →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
