import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  iconOnly?: boolean;
}

export function Logo({ className, showText = true, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      {/* Icon Mark: Minimal Geometric Calculator/Finance Grid */}
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <rect width="32" height="32" rx="6" className="fill-on-surface" />
        <path d="M10 10H14V14H10V10Z" fill="#0D9488" />
        <path d="M18 10H22V14H18V10Z" fill="white" fillOpacity="0.4" />
        <path d="M10 18H14V22H10V18Z" fill="white" fillOpacity="0.4" />
        <path d="M18 18H22V22H18V18Z" fill="#0D9488" />
        {/* Subtle '+' and '-' symbols hinted by the grid */}
        <path d="M20 12H20.01M12 20H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
      
      {!iconOnly && showText && (
        <span className="font-manrope text-xl font-bold tracking-tight text-primary">
          Try<span className="text-on-surface-variant">FinCalc</span>
        </span>
      )}
    </div>
  );
}
