import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <span className={cn("font-display font-bold text-xl tracking-tight select-none text-on-surface", className)}>
      Try<span className="text-primary">FinCalc</span>
    </span>
  );
}
