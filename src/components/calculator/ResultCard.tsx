import React from "react";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  value: string;
  subtitle?: string;
  highlighted?: boolean;
  className?: string;
}

export function ResultCard({ title, value, subtitle, highlighted = false, className }: ResultCardProps) {
  return (
    <div 
      className={cn(
        "rounded-3xl p-8 flex flex-col items-start justify-center transition-all duration-300 shadow-sm border border-outline-variant/10",
        highlighted ? "bg-primary-fixed text-on-primary-fixed border-transparent" : "bg-surface-container-low text-on-surface",
        className
      )}
    >
      <h3 className={cn(
        "text-sm font-semibold tracking-wider uppercase mb-2",
        highlighted ? "opacity-70" : "text-on-surface-variant"
      )}>
        {title}
      </h3>
      <div className="flex items-baseline gap-2">
        <span className={cn(
          "text-6xl md:text-7xl font-manrope font-extrabold tracking-tight",
          highlighted ? "text-on-primary-fixed" : "text-primary"
        )}>
          {value}
        </span>
        {subtitle && (
          <span className={cn(
            "text-lg font-medium",
            highlighted ? "opacity-80" : "text-on-surface-variant"
          )}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
