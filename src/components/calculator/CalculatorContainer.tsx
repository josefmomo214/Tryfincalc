import React from "react";
import { cn } from "@/lib/utils";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { ChevronRight, LucideIcon } from "lucide-react";
import Link from "next/link";

interface CalculatorContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function CalculatorContainer({ title, description, children, className }: CalculatorContainerProps) {
  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", className)}>
      <div className="mb-10 max-w-3xl">
        <h2 className="text-display-lg font-manrope font-bold text-primary tracking-tight mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-xl text-on-surface-variant leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {children}
      </div>
    </div>
  );
}

// Wrapper for the Form Input side
export function CalculatorInputArea({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("w-full lg:w-[45%] bg-surface-container-highest rounded-2xl p-6 sm:p-8 shadow-sm", className)}>
      {children}
    </div>
  );
}

export interface NextStep {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

// Wrapper for the Results side
export function CalculatorResultsArea({ 
  children, 
  className, 
  nextSteps = [] 
}: { 
  children: React.ReactNode; 
  className?: string; 
  nextSteps?: NextStep[];
}) {
  return (
    <div className={cn("w-full lg:w-[55%] flex flex-col gap-10", className)}>
      {children}

      {/* Next Steps Section */}
      {nextSteps.length > 0 && (
        <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-[11px] font-manrope font-extrabold text-primary/40 uppercase tracking-[0.25em] mb-6 text-center px-4">
            What to do next
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {nextSteps.map((step, idx) => (
              <Link 
                key={idx} 
                href={step.href}
                className="group flex flex-col p-5 bg-surface-container-low/50 backdrop-blur-sm rounded-2xl border border-outline-variant/10 hover:border-primary/20 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <step.icon className="w-5 h-5 text-primary group-hover:text-white" />
                </div>
                <h4 className="text-sm font-bold text-primary mb-1 group-hover:text-primary transition-colors">
                  {step.title}
                </h4>
                <p className="text-[12px] text-on-surface-variant leading-tight mb-2">
                  {step.description}
                </p>
                <div className="mt-auto flex items-center gap-1 text-[11px] font-extrabold text-primary uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  Go <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* AdSense Placement: Directly Below Results */}
      <div className="pt-12 border-t border-outline-variant/10">
        <div className="flex flex-col items-center">
          <AdPlaceholder format="horizontal" className="w-full mb-8" label="Exclusive Offers" />
          
          <Link href="/contact" className="group flex items-center gap-3 text-primary font-manrope font-extrabold hover:text-secondary transition-all text-base underline-offset-8 hover:underline">
            Compare options / Learn more 
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
