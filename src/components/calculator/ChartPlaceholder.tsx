import React from "react";
import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

interface ChartPlaceholderProps {
  title?: string;
  height?: string;
  className?: string;
}

export function ChartPlaceholder({ title = "Data Visualization", height = "h-[300px]", className }: ChartPlaceholderProps) {
  return (
    <div className={cn("w-full bg-surface-container-lowest rounded-2xl p-6 shadow-ambient flex flex-col", className)}>
      <h3 className="text-lg font-manrope font-semibold text-primary mb-4">{title}</h3>
      <div className={cn("w-full rounded-xl bg-surface-container flex flex-col items-center justify-center text-on-surface-variant", height)}>
        <BarChart3 className="w-12 h-12 mb-3 opacity-20" />
        <span className="text-sm font-medium opacity-60 px-6 text-center">Your payment breakdown will appear here once calculated</span>
      </div>
    </div>
  );
}
